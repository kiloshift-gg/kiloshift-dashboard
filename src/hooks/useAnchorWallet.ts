/**
 * Hook to provide Anchor-compatible wallet from Solana Wallet Adapter
 */
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

export interface AnchorWallet {
  publicKey: import("@solana/web3.js").PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T,
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[],
  ): Promise<T[]>;
}

export function useAnchorWallet(): AnchorWallet | undefined {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  return useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      return undefined;
    }

    return {
      publicKey,
      signTransaction,
      signAllTransactions,
    };
  }, [publicKey, signTransaction, signAllTransactions]);
}
