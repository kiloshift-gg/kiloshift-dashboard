"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, Link } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@blueshift-gg/ui-components";
import { useOnClickOutside } from "usehooks-ts";
import classNames from "classnames";

interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

export default function WalletDropdown({
  isOpen,
  onClose,
  triggerRef,
}: WalletDropdownProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(200);

  // Get button width to match dropdown width
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        // Find the actual button element inside the wrapper
        const buttonElement = triggerRef.current?.querySelector('button') as HTMLButtonElement;
        if (buttonElement) {
          setButtonWidth(buttonElement.offsetWidth);
        } else {
          // Fallback to wrapper width if button not found
          const wrapperWidth = triggerRef.current?.offsetWidth;
          if (wrapperWidth) {
            setButtonWidth(wrapperWidth);
          }
        }
      });
    }
  }, [isOpen, triggerRef]);

  useOnClickOutside([dropdownRef as React.RefObject<HTMLElement>, triggerRef as React.RefObject<HTMLElement>], () => {
    if (isOpen) {
      onClose();
    }
  });

  const handleDashboard = () => {
    console.log("Dashboard clicked, navigating to /dashboard");
    onClose();
    // Navigate immediately
    router.push("/dashboard");
  };

  const handleLaunches = () => {
    onClose();
    // TODO: Navigate to launches page if exists
    // router.push("/launches");
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  if (!isOpen) {
    return null;
  }

  console.log("WalletDropdown rendering - isOpen:", isOpen);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 z-[9999]"
      style={{ 
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: "8px",
        width: `${buttonWidth}px`,
      }}
    >
          {/* Notch connector - rounded top */}
          <div className="absolute -top-1 right-6 w-3 h-3 bg-card-solid border-l border-t border-border-light transform rotate-45 rounded-tl" />
          
          <div className="bg-card-solid border border-border-light rounded-lg p-1.5 shadow-lg mt-1 w-full">
            <Link
              href="/dashboard"
              onClick={(e) => {
                console.log("Dashboard link clicked");
                onClose();
              }}
              className={classNames(
                "w-full flex items-center gap-x-3 px-3 py-2.5 text-left rounded-md",
                "hover:bg-shade-secondary/10 transition-colors",
                "text-shade-primary text-sm font-medium",
                "block"
              )}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Icon name="Path" size={16} className="text-shade-primary" />
              </div>
              <span>Dashboard</span>
            </Link>
            
            <div className="h-px bg-border-light my-1" />
            
            <button
              onClick={handleLogout}
              className={classNames(
                "w-full flex items-center gap-x-3 px-3 py-2.5 text-left rounded-md",
                "hover:bg-shade-secondary/10 transition-colors",
                "text-shade-primary text-sm font-medium"
              )}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Icon name="Disconnect" size={16} className="text-shade-primary" />
              </div>
              <span>Log out</span>
            </button>
          </div>
    </div>
  );
}

