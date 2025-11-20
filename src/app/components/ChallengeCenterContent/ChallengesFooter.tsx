import Button, { ButtonVariant } from "../Button/Button";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { usePersistentStore } from "@/stores/store";
import { ChallengeMetadata } from "@/app/utils/challenges";
import { Link } from "@/i18n/navigation";

type ChallengesFooterProps = {
  challenge: ChallengeMetadata;
  setIsNFTViewerOpen: (isOpen: boolean) => void;
  setSelectedChallenge: (challenge: ChallengeMetadata) => void;
};

/**
 * Simplified version - Just shows challenge link
 * No NFT minting, no authentication checks
 */
export default function ChallengesFooter({
  challenge,
  setIsNFTViewerOpen,
  setSelectedChallenge,
}: ChallengesFooterProps) {
  const t = useTranslations();
  const { challengeStatuses } = usePersistentStore();
  const status = challengeStatuses[challenge.slug];
  const { view } = usePersistentStore();

  return (
    <div
      className={classNames(
        "relative z-10 flex",
        view === "list" &&
          "ml-auto flex-col items-end gap-y-2.5 justify-center",
        view === "grid" && "w-full justify-between items-end",
      )}
    >
      {/* Simplified: Always show challenge link */}
      <Link
        href={`/challenges/${challenge.slug}`}
        className="text-brand-secondary hover:text-brand-primary transition font-medium !w-full !min-w-[150px]"
      >
        <Button
          variant={challenge.language.toLowerCase() as ButtonVariant}
          size="md"
          label={t("lessons.take_challenge")}
          icon="Challenge"
          className="!w-full"
          iconSide="left"
        />
      </Link>
    </div>
  );
}
