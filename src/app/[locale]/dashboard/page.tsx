"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { useNftOwnership } from "@/hooks/useNftOwnership";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { Icon } from "@blueshift-gg/ui-components";
import { useTranslations } from "next-intl";
import { challenges } from "@/app/content/challenges/challenges";
import classNames from "classnames";

export default function DashboardPage() {
  const { status, publicKey, walletAddress } = useAuth();
  const { nfts, isLoading, error } = useUserNFTs();
  const router = useRouter();
  const t = useTranslations();
  const address = walletAddress || publicKey?.toBase58();

  // Check NFT ownership for all challenges
  const { ownership } = useNftOwnership(challenges);

  // Redirect to home if not authenticated
  // Check wallet address first - if address exists, user is connected even if status hasn't updated yet
  useEffect(() => {
    // Only redirect if no wallet address at all
    // Give some time for status to update after wallet connection
    const timer = setTimeout(() => {
      if (!address) {
        console.log("Dashboard: No wallet address, redirecting to home", {
          status,
          address,
        });
        router.push("/");
      } else {
        console.log("Dashboard: Wallet connected", { status, address });
      }
    }, 1000); // Wait 1 second for status to update after wallet connection

    return () => clearTimeout(timer);
  }, [status, address, router]);

  // Show loading if no address yet (might be connecting)
  if (!address) {
    return (
      <div className="min-h-screen bg-black text-shade-primary flex items-center justify-center">
        <div className="text-shade-secondary">{t("dashboard.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-shade-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
          <p className="text-shade-secondary">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* Wallet Info */}
        <div className="bg-card-solid border border-border-light p-6 mb-8">
          <div className="flex items-center gap-x-3 mb-4">
            <Icon name="Wallet" size={24} className="text-shade-primary" />
            <h2 className="text-xl font-semibold">{t("dashboard.your_wallet")}</h2>
          </div>
          <div className="font-mono text-sm text-shade-secondary break-all">
            {address}
          </div>
        </div>

        {/* NFT Storage Section */}
        <div className="bg-card-solid border border-border-light p-6">
          <div className="flex items-center gap-x-3 mb-6">
            <Icon name="Wallet" size={24} className="text-shade-primary" />
            <h2 className="text-xl font-semibold">{t("dashboard.nft_storage")}</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-shade-secondary">{t("dashboard.loading_nfts")}</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-error">
                {t("dashboard.error_loading", { error: String(error) })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {challenges.map((challenge) => {
                const isOwned = ownership[challenge.slug] || false;
                const nftImage = `/graphics/nft-${challenge.slug}.png`;
                
                return (
                  <div
                    key={challenge.slug}
                    className={classNames(
                      "bg-shade-secondary/5 border border-border-light",
                      "p-3 rounded-none",
                      "hover:bg-shade-secondary/10 transition-all"
                    )}
                  >
                    <div className="aspect-square bg-shade-secondary/10 mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className="w-[95%] h-[95%] relative">
                        <img
                          src={nftImage}
                          alt={challenge.slug}
                          className={classNames(
                            "w-full h-full object-contain transition-all",
                            !isOwned && "opacity-60 brightness-90"
                          )}
                          onError={(e) => {
                            // Fallback to stage image if NFT image doesn't exist
                            (e.target as HTMLImageElement).src = "/graphics/nft-stage.png";
                          }}
                        />
                        {!isOwned && (
                          <div className="absolute top-1 right-1">
                            <Icon name="Locked" size={14} className="text-shade-secondary opacity-80" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold text-sm mb-1">
                      {challenge.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                    <div className="text-xs text-shade-secondary">
                      {isOwned ? t("ChallengeCenter.claimed") : t("ChallengeCenter.locked")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

