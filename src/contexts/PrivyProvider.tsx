"use client";

import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { useEffect, useMemo, useState } from "react";

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const [solanaConnectors, setSolanaConnectors] = useState<any>(null);

  // Create Solana connectors using Privy's built-in helper function
  // Must be done client-side only to avoid SSR issues
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import to avoid SSR issues
    import("@privy-io/react-auth/solana")
      .then((module) => {
        const { toSolanaWalletConnectors } = module;
        const connectors = toSolanaWalletConnectors({ shouldAutoConnect: false });
        setSolanaConnectors(connectors);
      })
      .catch((error) => {
        console.error("Error creating Solana connectors:", error);
        // Fallback: create a minimal compatible object
        setSolanaConnectors({
          onMount: () => {},
          onUnmount: () => {},
          get: () => [],
        });
      });
  }, []);

  // Ensure Solana wallets are detected and properly exposed for Privy
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Function to ensure window.solana is properly set and Privy can detect it
    const ensureSolanaWallets = () => {
      try {
        const solana = (window as any).solana;
        
        // Check for Phantom and ensure it's properly exposed
        if (solana && solana.isPhantom) {
          console.log("Phantom wallet detected, isPhantom:", solana.isPhantom);
          
          // Ensure window.solana is accessible (it should already be, but double-check)
          // Privy reads from window.solana to detect wallets
          if (!(window as any).solana) {
            console.warn("window.solana is not set, this should not happen");
          } else {
            console.log("window.solana is properly set for Privy");
          }
        }
        
        // Check for other Solana wallets
        if ((window as any).solflare) {
          console.log("Solflare wallet detected");
        }
        
        // Trigger events to notify Privy that wallets are ready
        // Privy listens for these events to refresh wallet detection
        if (window.dispatchEvent) {
          // Standard Solana wallet detection event
          window.dispatchEvent(new Event("solana#initialized"));
          // Custom event for our app
          window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
        }
      } catch (error) {
        console.warn("Error detecting wallets:", error);
      }
    };

    // Check immediately
    ensureSolanaWallets();

    // Also check periodically in case wallets load late
    // Keep checking longer to ensure Privy detects wallets
    const interval = setInterval(ensureSolanaWallets, 500);
    
    // Clean up after 10 seconds (longer to ensure detection)
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // If no appId, return children without Privy (graceful degradation)
  if (!appId) {
    console.warn("NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy will not work.");
    return <>{children}</>;
  }

  // Wait for connectors to be ready before rendering PrivyProvider
  // This ensures connectors are properly initialized client-side
  if (!solanaConnectors) {
    return <>{children}</>;
  }

  try {
    return (
      <PrivyProviderBase
        appId={appId}
        config={{
          loginMethods: ["wallet", "email"],
          appearance: {
            theme: "dark",
            accentColor: "#00ffff",
            walletChainType: "solana-only" as const,
            showWalletLoginFirst: true,
          },
          // Configure Solana connectors using Privy's helper function
          // This properly detects wallets from window.solana
          externalWallets: {
            solana: {
              connectors: solanaConnectors,
            },
          },
          embeddedWallets: {
            solana: {
              createOnLogin: "off",
            },
          },
        }}
      >
        {children}
      </PrivyProviderBase>
    );
  } catch (error) {
    console.error("Error initializing Privy:", error);
    // Return children without Privy if initialization fails
    return <>{children}</>;
  }
}

