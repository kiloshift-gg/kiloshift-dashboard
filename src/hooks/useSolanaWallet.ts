/**
 * Hook to use Solana Wallet Adapter
 */
import { useWallet } from "@solana/wallet-adapter-react";

export function useSolanaWallet() {
  const { publicKey, connected, disconnect, signMessage } = useWallet();

  return {
    publicKey,
    connected,
    signMessage,
    disconnect,
  };
}
