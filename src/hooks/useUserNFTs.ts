"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey, Connection } from "@solana/web3.js";
import { useSolanaConnection } from "./useSolanaConnection";
import { useAuth } from "./useAuth";

interface NFTMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  uri?: string;
}

interface UserNFT {
  mint: string;
  address: string;
  metadata?: NFTMetadata;
}

/**
 * Derive Metaplex Token Metadata PDA
 */
function deriveMetadataPDA(mint: PublicKey): PublicKey {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  );
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  return metadataPDA;
}

/**
 * Fetch NFT metadata from URI
 */
async function fetchMetadataFromURI(uri: string): Promise<NFTMetadata | null> {
  try {
    // Handle IPFS URIs
    const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
    const httpUri = uri.startsWith("ipfs://")
      ? uri.replace("ipfs://", ipfsGateway)
      : uri;

    const response = await fetch(httpUri);
    if (!response.ok) return null;

    const data = await response.json() as any;
    return {
      name: data.name || "",
      symbol: data.symbol || "",
      description: data.description,
      image: data.image || data.image_url,
      uri: uri,
    };
  } catch (error) {
    console.error("Error fetching metadata from URI:", error);
    return null;
  }
}

/**
 * Fetch all NFTs owned by the connected wallet
 */
async function fetchUserNFTs(
  publicKey: PublicKey,
  connection: Connection,
): Promise<UserNFT[]> {
  try {
    // Get all token accounts owned by the user
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program
      },
    );

    const nfts: UserNFT[] = [];
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    );

    // Filter for NFTs (tokens with supply = 1 and decimals = 0)
    for (const accountInfo of tokenAccounts.value) {
      const parsedInfo = accountInfo.account.data.parsed?.info;

      if (
        parsedInfo &&
        parsedInfo.tokenAmount?.decimals === 0 &&
        parsedInfo.tokenAmount?.uiAmount === 1
      ) {
        const mint = new PublicKey(parsedInfo.mint);

        try {
          // Derive metadata PDA
          const metadataPDA = deriveMetadataPDA(mint);

          // Fetch metadata account
          const metadataAccount = await connection.getAccountInfo(metadataPDA);

          if (metadataAccount) {
            // Parse metadata (simplified - full parsing would require @metaplex-foundation/mpl-token-metadata)
            // For now, we'll try to fetch from a public API or use a simpler approach
            const nft: UserNFT = {
              mint: mint.toBase58(),
              address: accountInfo.pubkey.toBase58(),
            };

            // Try to fetch metadata using Helius or other RPC providers that support getAsset
            // For now, we'll use a basic structure
            // You can enhance this by:
            // 1. Installing @metaplex-foundation/js and using it to parse metadata
            // 2. Using Helius API if available
            // 3. Using other NFT indexing services

            nfts.push(nft);
          }
        } catch (error) {
          // If metadata account doesn't exist or parsing fails, still add the NFT
          // (it might be a non-Metaplex NFT or the metadata account is missing)
          nfts.push({
            mint: mint.toBase58(),
            address: accountInfo.pubkey.toBase58(),
          });
        }
      }
    }

    // Try to fetch metadata for each NFT in parallel
    // Note: This is a simplified version. For production, consider using:
    // - @metaplex-foundation/js for proper metadata parsing
    // - Helius API for faster NFT fetching
    // - Or other NFT indexing services

    return nfts;
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return [];
  }
}

export function useUserNFTs() {
  const { publicKey } = useAuth();
  const { connection } = useSolanaConnection();

  const {
    data: nfts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userNFTs", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) {
        return [];
      }
      return fetchUserNFTs(publicKey, connection);
    },
    enabled: !!publicKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    nfts,
    isLoading,
    error,
    refetch,
  };
}

