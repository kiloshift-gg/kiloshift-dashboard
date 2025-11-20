"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

// Use public RPC endpoint as default - no environment variable needed
const DEFAULT_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || DEFAULT_RPC_ENDPOINT;

export default function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint} config={{ commitment: "processed", httpAgent: false }}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
