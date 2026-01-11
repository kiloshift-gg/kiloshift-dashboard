"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  createContext,
  ReactNode,
  useReducer,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { waitForPhantom, isPhantomInstalled, isAnySolanaWalletInstalled } from "@/utils/checkPhantomInstalled";
import {
  AuthenticationAPIError,
  NetworkError,
  UserRejectedSignatureError,
  WalletDisconnectError,
} from "@/lib/auth/errors";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { performSignIn, AuthResponse } from "@/lib/auth/api";
import { usePersistentStore } from "@/stores/store";
import {
  isTokenExpired as isTokenExpiredUtil,
  getPublicKeyFromToken,
} from "@/lib/auth/utils";
import { AuthError } from "@/lib/auth/errors";
import { PublicKey } from "@solana/web3.js";

export type AuthStatus =
  | "signed-out"
  | "signing-in"
  | "signed-in"
  | "signing-out";

interface AuthContextType {
  login: () => void;
  logout: () => void;
  publicKey: PublicKey | null;
  walletAddress: string | null;
  authToken: string | null;
  isTokenExpired: () => boolean;
  status: AuthStatus;
  error: AuthError | null;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  privyAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// --- Reducer-based State Management ---

interface AuthState {
  status: AuthStatus;
  error: AuthError | null;
}

type AuthAction =
  | { type: "SIGN_IN_STARTED" }
  | { type: "SIGN_IN_SUCCESS" }
  | { type: "SIGN_OUT_STARTED" }
  | { type: "SIGN_OUT_SUCCESS" }
  | { type: "SESSION_RESTORED" }
  | { type: "SET_ERROR"; payload: AuthError }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  status: "signed-out",
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SIGN_IN_STARTED":
      return { ...state, status: "signing-in", error: null };
    case "SIGN_IN_SUCCESS":
    case "SESSION_RESTORED":
      return { ...initialState, status: "signed-in" };
    case "SIGN_OUT_STARTED":
      return { ...state, status: "signing-out", error: null };
    case "SIGN_OUT_SUCCESS":
      return initialState;
    case "SET_ERROR":
      return { ...state, status: "signed-out", error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// --- AuthProvider Component ---

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting, disconnecting, disconnect, select, wallet } = useWallet();
  const { authenticated: privyAuthenticated, ready: privyReady, user: privyUser, login: privyLogin, logout: privyLogout } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  const { authToken, setAuthToken, clearAuthToken } = usePersistentStore();
  const t = useTranslations();

  const [state, dispatch] = useReducer(authReducer, initialState);
  const { status, error } = state;

  // Get wallet address from either Privy (email login) or Solana wallet
  const walletAddress = useMemo(() => {
    // First check Solana wallet
    if (publicKey && connected) {
      return publicKey.toBase58();
    }
    
    // Then check Privy user (email login with Solana wallet linked)
    if (privyUser) {
      const linkedAccounts = (privyUser as any)?.linkedAccounts || [];
      const solanaWallet = linkedAccounts.find(
        (acct: any) => 
          (acct.walletClientType === "solana" || acct.chainType === "solana") && 
          acct.address
      );
      if (solanaWallet?.address) {
        return solanaWallet.address;
      }
    }
    
    return null;
  }, [publicKey, connected, privyUser]);

  const isTokenExpired = useCallback(
    () => isTokenExpiredUtil(authToken),
    [authToken],
  );

  const tokenPublicKey = useMemo(
    () => getPublicKeyFromToken(authToken),
    [authToken],
  );

  const sessionState = useMemo(() => {
    if (!publicKey || !tokenPublicKey) {
      return null;
    }
    if (publicKey.toBase58() !== tokenPublicKey) {
      return "WALLET_MISMATCH";
    }
    return "MATCH";
  }, [publicKey, tokenPublicKey]);

  const isWalletMismatched = sessionState === "WALLET_MISMATCH";
  const isAuthenticated = useMemo(
    () => connected && !!publicKey && (sessionState === "MATCH" || !tokenPublicKey) && !isTokenExpired(),
    [connected, publicKey, sessionState, tokenPublicKey, isTokenExpired],
  );

  // --- Mutations ---

  const handleSignInError = useCallback(
    (error: unknown) => {
      const authError =
        error instanceof AuthError
          ? error
          : new AuthError("An unknown error occurred during sign-in.");

      dispatch({ type: "SET_ERROR", payload: authError });

      if (authError instanceof UserRejectedSignatureError) {
        toast.error(t("notifications.errors.user_rejected_signature"));
      } else if (authError instanceof NetworkError) {
        toast.error(t("notifications.errors.network_error"));
      } else if (authError instanceof AuthenticationAPIError) {
        toast.error(t("notifications.errors.auth_unauthorized"));
      } else {
        toast.error(t("notifications.errors.auth_generic"));
      }

      if (connected) {
        disconnect().catch(() => {
          toast.error(t("notifications.errors.auth_generic"));
        });
      }
    },
    [t, connected, disconnect, dispatch],
  );

  const signInMutation = useMutation<AuthResponse, Error>({
    mutationFn: async () => {
      if (!publicKey || !connected || !wallet?.adapter) {
        throw new WalletDisconnectError();
      }
      const adapter = wallet.adapter;
      const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
        if (!('signMessage' in adapter) || typeof (adapter as any).signMessage !== 'function') {
          throw new Error("Wallet does not support signMessage");
        }
        return (adapter as any).signMessage(message);
      };
      return performSignIn(publicKey.toBase58(), signMessage);
    },
    onMutate: () => dispatch({ type: "SIGN_IN_STARTED" }),
    onSuccess: (data) => {
      setAuthToken(data.token);
      dispatch({ type: "SIGN_IN_SUCCESS" });
    },
    onError: handleSignInError,
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      clearAuthToken();
      await disconnect();
    },
    onMutate: () => dispatch({ type: "SIGN_OUT_STARTED" }),
    onSuccess: () => {
      dispatch({ type: "SIGN_OUT_SUCCESS" });
    },
    onError: (error: unknown) => {
      const authError =
        error instanceof AuthError
          ? error
          : new AuthError("An unknown error occurred during sign-out.");
      dispatch({ type: "SET_ERROR", payload: authError });
      toast.error(t("notifications.errors.auth_generic"));
    },
  });

  const { mutate: doSignIn } = signInMutation;
  const { mutate: doSignOut } = signOutMutation;

  // Monitor Privy wallet detection and connection
  useEffect(() => {
    if (!privyReady) return;

    // Log all Privy wallets for debugging
    console.log("Privy ready, wallets:", privyWallets);
    console.log("Privy authenticated:", privyAuthenticated);
    console.log("Privy user:", privyUser);
    
    // Check if window.solana is available for Privy
    if (typeof window !== "undefined") {
      const solana = (window as any).solana;
      console.log("window.solana available:", !!solana);
      console.log("window.solana.isPhantom:", solana?.isPhantom);
      
      // If Phantom is available but Privy doesn't see it, trigger refresh
      if (solana && solana.isPhantom && privyWallets && privyWallets.length === 0) {
        console.log("Phantom available but Privy doesn't detect it, triggering refresh...");
        // Trigger events to help Privy detect
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event("solana#initialized"));
          window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
        }
      }
    }
    
    // Check if Privy has connected a wallet via user object
    if (privyUser && privyAuthenticated) {
      const linkedAccounts = (privyUser as any)?.linkedAccounts || [];
      const solanaWallet = linkedAccounts.find(
        (acct: any) => (acct.walletClientType === "solana" || acct.chainType === "solana") && acct.address
      );
      
      if (solanaWallet && solanaWallet.address) {
        console.log("Privy user has Solana wallet:", solanaWallet.address);
        // Privy has connected a wallet, ensure we sync with adapter
        if (!connected && status === "signed-out") {
          console.log("Privy wallet connected but adapter not connected, syncing...");
          // Trigger adapter connection
          const solana = (window as any).solana;
          if (solana && solana.isPhantom) {
            select("Phantom" as any);
          }
        }
      }
    }
  }, [privyReady, privyWallets, privyAuthenticated, privyUser, connected, status, select]);

  // Sync Privy Solana wallets with Solana wallet adapter
  useEffect(() => {
    if (!privyReady || !privyWallets) return;

    // Find Privy's connected Solana wallet
    const privySolanaWallet = privyWallets.find(
      (w: any) => (w.walletClientType === "solana" || w.chainType === "solana") && w.address
    );

    console.log("Privy wallets:", privyWallets);
    console.log("Privy Solana wallet:", privySolanaWallet);
    console.log("Solana adapter connected:", connected);
    console.log("Public key:", publicKey?.toBase58());

    // If Privy has connected a Solana wallet, sync with Solana wallet adapter
    if (privySolanaWallet && privySolanaWallet.address && !connected) {
      console.log("Privy connected wallet, syncing with Solana adapter...");
      
      // Privy connected a wallet, now connect via Solana adapter
      // This is critical - we need Solana adapter connected to use wallet features
      const connectViaAdapter = async () => {
        try {
          // Check if Phantom is available
          const solana = (window as any).solana;
          if (solana && solana.isPhantom) {
            console.log("Phantom available, selecting wallet...");
            // Select Phantom wallet in adapter - this should trigger connection
            select("Phantom" as any);
            
            // Wait for adapter to connect (check every 200ms, max 5 seconds)
            let attempts = 0;
            const maxAttempts = 25;
            const checkConnection = setInterval(() => {
              attempts++;
              console.log(`Checking connection attempt ${attempts}/${maxAttempts}...`);
              
              if (connected && publicKey) {
                console.log("Wallet connected via adapter!");
                clearInterval(checkConnection);
                // Wallet connected, trigger sign in
                if (status === "signed-out") {
                  dispatch({ type: "SIGN_IN_STARTED" });
                  if (!authToken) {
                    console.log("Starting sign in...");
                    doSignIn();
                  }
                }
              } else if (attempts >= maxAttempts) {
                console.log("Max attempts reached, trying direct connection...");
                clearInterval(checkConnection);
                // Try direct connection as fallback
                if (wallet?.adapter && !connected) {
                  console.log("Attempting direct adapter connection...");
                  wallet.adapter.connect().catch((err: any) => {
                    console.error("Direct connection failed:", err);
                  });
                }
              }
            }, 200);
          } else {
            console.warn("Phantom not available for adapter connection");
          }
        } catch (error) {
          console.error("Error connecting wallet via adapter:", error);
        }
      };
      
      connectViaAdapter();
    }
    
    // If wallet is connected via both Privy and adapter, ensure we're signed in
    if (privySolanaWallet && privySolanaWallet.address && connected && publicKey && status === "signed-out") {
      console.log("Wallet connected via both Privy and adapter, starting sign in...");
      dispatch({ type: "SIGN_IN_STARTED" });
      if (!authToken) {
        doSignIn();
      }
    }
  }, [privyWallets, privyReady, connected, publicKey, status, dispatch, select, wallet, authToken, doSignIn]);

  // Sync Privy authentication state changes (e.g., when user logs out from Privy)
  useEffect(() => {
    // If Privy authentication is lost and we have an auth token, clear it
    if (!privyAuthenticated && privyReady && authToken) {
      console.log("Privy authentication lost, clearing auth token...");
      clearAuthToken();
      // Only dispatch sign out if we're in a signed-in state
      if (status === "signed-in" || status === "signing-in") {
        dispatch({ type: "SIGN_OUT_SUCCESS" });
      }
    }
  }, [privyAuthenticated, privyReady, authToken, status, clearAuthToken, dispatch]);

  // Sync Solana wallet state and handle Privy fallback
  useEffect(() => {
    if (status === "signing-in" || status === "signing-out") {
      return;
    }

    // When Solana wallet connects via adapter, ensure we're signed in
    if (connected && publicKey) {
      console.log("Solana wallet connected:", publicKey.toBase58());
      console.log("Current status:", status);
      
      if (status === "signed-out") {
        // Wallet just connected, start sign in process
        console.log("Status is signed-out, starting sign in process...");
        dispatch({ type: "SIGN_IN_STARTED" });
        if (!authToken) {
          console.log("No auth token, calling doSignIn...");
          doSignIn();
        }
      }
    }

    // Do not auto-restore or auto-sign-in sessions when the app loads.
    // This ensures the user must explicitly click "Connect Wallet" / login.
    if (status === "signed-out") {
      return;
    }

    if (isWalletMismatched) {
      clearAuthToken();
      if (connected && publicKey) {
        doSignIn();
      }
      return;
    }

    // When the user is signed in, keep React state in sync with wallet state.
    if (status === "signed-in") {
      // If wallet disconnected, sign out locally.
      if (!connected || !publicKey) {
        dispatch({ type: "SIGN_OUT_SUCCESS" });
      }
    }
  }, [
    status,
    connected,
    publicKey,
    isAuthenticated,
    isWalletMismatched,
    tokenPublicKey,
    isTokenExpired,
    error,
    doSignIn,
    clearAuthToken,
    dispatch,
    privyReady,
    privyAuthenticated,
    select,
  ]);

  // --- User-Facing Callbacks ---

    const login = useCallback(async () => {
      // Don't attempt login if already signed in
      if (status === "signed-in" || privyAuthenticated) {
        console.log("Already signed in, skipping login");
        return;
      }
      
      if (status === "signed-out") {
        dispatch({ type: "CLEAR_ERROR" });
        
        if (typeof window === "undefined") {
          return;
        }

        // Step 1: Wait for Phantom to be injected
        console.log("Step 1: Waiting for Phantom wallet...");
        const phantomAvailable = await waitForPhantom(5000);
        console.log("Phantom available:", phantomAvailable);
        
        if (!phantomAvailable) {
          console.warn("Phantom not detected after waiting");
          // Still try to open Privy modal - maybe Privy can detect it
        }

        // Step 2: Ensure window.solana is properly exposed
        const solana = (window as any).solana;
        if (solana && solana.isPhantom) {
          console.log("Step 2: Phantom is available, isPhantom:", solana.isPhantom);
          
          // Trigger events to notify Privy
          if (window.dispatchEvent) {
            window.dispatchEvent(new Event("solana#initialized"));
            window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
          }
        }

        // Step 3: Wait for Privy to be ready
        if (!privyReady) {
          console.log("Step 3: Waiting for Privy to be ready...");
          let attempts = 0;
          while (!privyReady && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }
          if (!privyReady) {
            console.warn("Privy not ready after waiting");
            return;
          }
        }
        console.log("Step 3: Privy is ready");

        // Step 4: Give Privy time to detect wallets and trigger events
        console.log("Step 4: Triggering wallet detection events for Privy...");
        
        // Trigger multiple events to ensure Privy detects wallets
        if (window.dispatchEvent && solana) {
          // Trigger events multiple times to ensure Privy picks them up
          for (let i = 0; i < 5; i++) {
            window.dispatchEvent(new Event("solana#initialized"));
            window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Wait a bit more for Privy to process the events
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 5: Open Privy modal
        console.log("Step 5: Opening Privy login modal...");
        console.log("Window.solana:", solana);
        console.log("Privy ready:", privyReady);
        
        // Final trigger right before opening modal
        if (window.dispatchEvent && solana) {
          window.dispatchEvent(new Event("solana#initialized"));
          window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
        }
        
        // Small delay before opening modal
        await new Promise(resolve => setTimeout(resolve, 300));
        
        privyLogin();
        
        console.log("Privy login modal opened");
      }
    }, [status, privyReady, privyLogin, privyWallets, dispatch]);

  const logout = useCallback(async () => {
    if (status === "signing-out") return;
    
    dispatch({ type: "SIGN_OUT_STARTED" });
    
    try {
      // Logout from Privy first (if authenticated)
      if (privyAuthenticated) {
        try {
          await privyLogout();
        } catch (error) {
          console.error("Error during Privy logout:", error);
          // Continue with local logout even if Privy logout fails
        }
      }
      
      // Logout from Solana wallet if connected
      if (connected) {
        doSignOut(); // mutate doesn't return a promise, it handles state internally
      } else {
        // If only Privy login (email), just clear token and sign out
        clearAuthToken();
        dispatch({ type: "SIGN_OUT_SUCCESS" });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear local state even if logout fails
      clearAuthToken();
      dispatch({ type: "SIGN_OUT_SUCCESS" });
    }
  }, [status, privyAuthenticated, privyLogout, connected, doSignOut, clearAuthToken, dispatch]);

  // --- State Synchronization Effect ---

  useEffect(() => {
    if (status === "signing-in" || status === "signing-out") {
      return;
    }

    // Do not auto-restore or auto-sign-in sessions when the app loads.
    // This ensures the user must explicitly click "Connect Wallet" / login.
    if (status === "signed-out") {
      return;
    }

    if (isWalletMismatched) {
      clearAuthToken();
      if (connected && publicKey) {
        doSignIn();
      }
      return;
    }

    // When the user is signed in, keep React state in sync with wallet state.
    if (status === "signed-in") {
      // If wallet disconnected, sign out locally.
      if (!connected || !publicKey) {
        dispatch({ type: "SIGN_OUT_SUCCESS" });
      }
    }
  }, [
    status,
    connected,
    publicKey,
    isAuthenticated,
    isWalletMismatched,
    tokenPublicKey,
    isTokenExpired,
    error,
    doSignIn,
    clearAuthToken,
    dispatch,
  ]);

  const value = {
    login,
    logout,
    publicKey,
    walletAddress: publicKey?.toBase58() || walletAddress || null,
    authToken,
    isTokenExpired,
    status,
    error,
    isLoggingIn: connecting || status === "signing-in",
    isLoggingOut: disconnecting || status === "signing-out",
    privyAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
