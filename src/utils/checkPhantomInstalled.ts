/**
 * Check if Phantom wallet extension is installed
 * Phantom injects itself as window.solana with isPhantom property
 */
export function isPhantomInstalled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Check for Phantom Solana wallet - Phantom injects as window.solana with isPhantom flag
  const solana = (window as any).solana;
  if (!solana || typeof solana === "undefined") {
    return false;
  }
  return solana.isPhantom === true || Boolean(solana.isPhantom);
}

/**
 * Check if any Solana wallet extension is installed
 */
export function isAnySolanaWalletInstalled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Check for Phantom
  if (isPhantomInstalled()) {
    return true;
  }

  // Check for Solflare
  if (typeof (window as any).solflare !== "undefined") {
    return true;
  }

  // Check for other common Solana wallets
  if (typeof (window as any).solana !== "undefined") {
    return true;
  }

  return false;
}

/**
 * Wait for Phantom wallet to be injected (useful if wallet loads after page)
 * Returns true if Phantom is detected within timeout, false otherwise
 * Also ensures window.solana is fully initialized for Privy detection
 */
export async function waitForPhantom(timeout: number = 3000): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  // If already available, return immediately
  if (isPhantomInstalled()) {
    // Ensure window.solana is properly set for Privy
    const solana = (window as any).solana;
    if (solana && solana.isPhantom) {
      return true;
    }
  }

  // Wait for Phantom to be injected and fully initialized
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const solana = (window as any).solana;
      // Check if Phantom is available and properly initialized
      if (solana && (solana.isPhantom === true || Boolean(solana.isPhantom))) {
        clearInterval(checkInterval);
        // Trigger a custom event to notify Privy that wallet is available
        // window.solana is already set by the wallet extension, we don't need to set it
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new Event("solana#initialized"));
          window.dispatchEvent(new CustomEvent("solana-wallets-ready"));
        }
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100); // Check every 100ms
  });
}

