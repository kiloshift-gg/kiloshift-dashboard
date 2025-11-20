"use client";

import { ReactNode } from "react";
import { ChallengeMetadata } from "@/app/utils/challenges";

interface ChallengesContentProps {
  currentChallenge: ChallengeMetadata;
  content: ReactNode;
}

/**
 * Simplified version - Just displays challenge content
 * No code editor, no code execution, no verification
 */
export default function ClientChallengesContent({
  currentChallenge,
  content,
}: ChallengesContentProps) {
  // Simplified: Just show content, no wallet check needed
  return (
    <div className="relative w-full h-full">
      <div className="px-4 py-14 relative max-w-app md:px-8 lg:px-14 mx-auto w-full min-h-[calc(100dvh-250px)]">
        <div className="flex flex-col gap-y-8">
          {content}
        </div>
      </div>
    </div>
  );
}
