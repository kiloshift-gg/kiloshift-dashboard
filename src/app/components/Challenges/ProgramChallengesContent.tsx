"use client";

import { ReactNode } from "react";
import { ChallengeMetadata } from "@/app/utils/challenges";
import ChallengeRequirements from "./ProgramChallengeRequirements";

interface ChallengeContentProps {
  currentChallenge: ChallengeMetadata;
  content: ReactNode;
}

/**
 * Simplified version - Just displays challenge content
 * No verification, no code execution, no authentication
 */
export default function ProgramChallengesContent({
  currentChallenge,
  content,
}: ChallengeContentProps) {
  // Simplified: Just show content, no wallet check needed
  return (
    <div className="relative w-full h-full">
      <div className="px-4 py-14 relative max-w-app md:px-8 lg:px-14 mx-auto w-full min-h-[calc(100dvh-250px)]">
        <ChallengeRequirements content={content} />
      </div>
    </div>
  );
}
