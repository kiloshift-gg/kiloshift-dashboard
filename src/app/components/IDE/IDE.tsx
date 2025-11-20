"use client";

import { ReactNode } from "react";

/**
 * Simplified IDE component - Just displays children as code block
 * Original IDE component with code execution has been removed
 */
interface IDEProps {
  children?: ReactNode;
  [key: string]: any; // Allow any other props for compatibility
}

export default function IDE({ children, ...props }: IDEProps) {
  // Simplified: Just render children as-is, no code execution
  // This is a placeholder component for MDX compatibility
  return (
    <div className="w-full">
      {children}
    </div>
  );
}

