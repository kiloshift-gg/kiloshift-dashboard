"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { useEffect, useState, useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

const rpcEndpoint = process.env.NEXT_PUBLIC_MAINNET_RPC_ENDPOINT;

// Clear localStorage before Wallet Adapter initializes to prevent JSON parse errors
if (typeof window !== "undefined") {
  try {
    // Clear all wallet-related localStorage entries
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.includes("wallet") ||
        key.startsWith("@") ||
        key === "walletName" ||
        key === "walletAdapter"
      ) {
        try {
          const value = localStorage.getItem(key);
          if (value === "undefined" || value === null || value === "") {
            localStorage.removeItem(key);
          } else {
            // Try to parse - if fails, remove
            try {
              JSON.parse(value);
            } catch {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn("Error cleaning localStorage:", error);
  }
}

export default function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create wallets inside component to avoid SSR issues
  const wallets = useMemo<WalletAdapter[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      return [new PhantomWalletAdapter()];
    } catch (error) {
      console.error("Error creating PhantomWalletAdapter:", error);
      return [];
    }
  }, []);

  // Use a default endpoint if not set to avoid throwing error
  const endpoint = rpcEndpoint || "https://api.mainnet-beta.solana.com";

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "processed" }}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
