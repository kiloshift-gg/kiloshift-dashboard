"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    // Consider user logged in if either signed in via wallet OR authenticated via Privy (email login)
    isLoggedIn: context.status === "signed-in" || context.privyAuthenticated === true,
    isLoggingIn: context.status === "signing-in",
    isLoggingOut: context.status === "signing-out",
  };
}
