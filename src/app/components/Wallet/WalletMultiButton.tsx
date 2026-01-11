"use client";

import React, { useCallback, useState, useRef } from "react";
import { breeze, Button, crisp } from "@blueshift-gg/ui-components";
import DecryptedText from "../HeadingReveal/DecryptText";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";
import { Icon } from "@blueshift-gg/ui-components";
import classNames from "classnames";
import WalletDropdown from "./WalletDropdown";

interface WalletButtonProps {
  disabled?: boolean;
  className?: string;
}

export default function WalletMultiButton({
  disabled = false,
  className,
}: WalletButtonProps) {
  const [isHoveringLocal, setIsHoveringLocal] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { status, walletAddress, login, logout, isLoggingIn, isLoggingOut, isLoggedIn } =
    useAuth();
  // Use walletAddress from Solana wallet
  const address = walletAddress;

  const showDisconnectOverlay = isHoveringLocal && isLoggedIn && !isDropdownOpen;

  const getButtonLabel = useCallback(() => {
    if (status === "signing-in") return "Signing In...";
    if (address) {
      // Display shortened address (first 6 and last 6 characters)
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    // If logged in via email but no wallet address, show "Connected" or email indicator
    if (isLoggedIn && !address) {
      return "Connected";
    }

    return "Connect Wallet";
  }, [address, status, isLoggedIn]);

  const buttonLabel = getButtonLabel();

  const handleClick = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // If logged in (via wallet or email), show dropdown
    if (isLoggedIn) {
      // Toggle dropdown instead of login/logout
      setIsDropdownOpen((prev) => !prev);
      return;
    } else if (status === "signed-out") {
      // Open Privy login modal (shows email + Solana wallet options)
      login();
    }
  }, [status, login, isLoggedIn]);

  return (
    <div
      ref={buttonRef}
      onMouseEnter={() => setIsHoveringLocal(true)}
      onMouseLeave={() => setIsHoveringLocal(false)}
      className={classNames("relative z-10", className)}
      style={{ position: "relative" }}
    >
      <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-2">
        <Button
          disabled={disabled || isLoggingIn || isLoggingOut}
          label={buttonLabel}
          icon={{ name: "Wallet", size: 18 }}
          variant={isLoggedIn ? "secondary" : "primary"}
          size="md"
          onClick={handleClick}
          className={
            isLoggedIn ? "font-sans! font-semibold" : "font-mono"
          }
        />
      </div>
      {showDisconnectOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-card-solid/5 backdrop-blur-[8px]">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1, ease: crisp }}
            className="flex items-center gap-x-1.5 font-mono text-[15px] font-medium leading-none text-shade-primary"
          >
            <Icon name="Disconnect" />
            <DecryptedText isHovering={isHoveringLocal} text="Disconnect" />
          </motion.span>
        </div>
      )}
      {isLoggedIn && (
        <WalletDropdown
          isOpen={isDropdownOpen}
          onClose={() => {
            setIsDropdownOpen(false);
          }}
          triggerRef={buttonRef}
        />
      )}
    </div>
  );
}
