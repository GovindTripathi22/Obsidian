/**
 * Unified Authentication Bridge & Re-exports
 * Supports both Clerk hooks and Offline Luxury Mock Provider
 * Location: src/lib/auth.tsx
 */

export { AuthProvider, useAuth, useUser } from "@/components/providers/AuthProvider";
export type { AuthUser, AuthContextType } from "@/components/providers/AuthProvider";
export { UserButton } from "@/components/auth/UserButton";
export { AuthModals } from "@/components/auth/AuthModals";
export { GoogleOneTap } from "@/components/auth/GoogleOneTap";
