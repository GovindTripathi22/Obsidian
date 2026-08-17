"use client";

/**
 * Unified Authentication Bridge & Re-exports
 * Supports Clerk components/hooks, unified AuthProvider, and luxury auth modals
 * Location: src/lib/auth.tsx
 */

export {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  ClerkProvider,
} from "@clerk/nextjs";

export { AuthProvider, useAuth, useUser } from "@/components/providers/AuthProvider";
export type { AuthUser, AuthContextType } from "@/components/providers/AuthProvider";
export { UserButton } from "@/components/auth/UserButton";
export { AuthModals } from "@/components/auth/AuthModals";
export { GoogleOneTap } from "@/components/auth/GoogleOneTap";
