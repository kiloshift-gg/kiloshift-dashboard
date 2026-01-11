/**
 * Compatibility hook to provide Solana Connection
 * Uses the RPC endpoint from environment variables
 */
import { useMemo } from "react";
import { Connection } from "@solana/web3.js";

const rpcEndpoint = process.env.NEXT_PUBLIC_MAINNET_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";

export function useSolanaConnection() {
  const connection = useMemo(() => {
    return new Connection(rpcEndpoint, {
      commitment: "processed",
    });
  }, []);

  return { connection };
}

