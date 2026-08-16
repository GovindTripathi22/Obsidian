"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/lib/insforge";
import {
  getProjectStats,
  getProjectCount,
  PROJECTS_UPDATED_EVENT,
  MAX_FREE_PROJECTS,
  ProjectStats,
} from "@/lib/projects";

export interface AuthUser extends UserProfile {
  plan: "free" | "pro";
  projectCount: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  mode: "clerk" | "offline-mock";
  activeModal: "sign-in" | "sign-up" | "user-profile" | null;
  signIn: (email: string, pass?: string) => Promise<void>;
  signUp: (email: string, pass?: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPlan: (plan: "free" | "pro") => void;
  openSignIn: () => void;
  openSignUp: () => void;
  openUserProfile: () => void;
  closeModals: () => void;
  refreshProjectCount: () => void;
  getProjectStats: () => ProjectStats;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: AuthUser = {
  id: "user-obsidian-prime",
  email: "developer@obsidian.ai",
  name: "Obsidian Creator",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
  plan: "free",
  projectCount: 1,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"sign-in" | "sign-up" | "user-profile" | null>(null);

  // Check if Clerk publishable key is present in environment
  const hasClerkKey = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const mode: "clerk" | "offline-mock" = hasClerkKey ? "clerk" : "offline-mock";

  const refreshProjectCount = useCallback(() => {
    const { totalCount } = getProjectCount();
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated: AuthUser = { ...prevUser, projectCount: totalCount };
      try {
        localStorage.setItem("insforge_session", JSON.stringify(updated));
        localStorage.setItem("obsidian_auth_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const getStats = useCallback((): ProjectStats => {
    const isPro = user?.plan === "pro";
    const stats = getProjectStats(isPro);
    const isLimitReached = stats.isLimitReached;
    return { ...stats, isLimitReached };
  }, [user?.plan]);

  useEffect(() => {
    let activeUser: AuthUser = DEFAULT_USER;
    try {
      const savedUser =
        localStorage.getItem("obsidian_auth_user") || localStorage.getItem("insforge_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        activeUser = {
          ...DEFAULT_USER,
          ...parsed,
          plan: parsed.plan === "pro" ? "pro" : "free",
        };
      }
    } catch {
      activeUser = DEFAULT_USER;
    }

    const { totalCount } = getProjectCount();
    const synced: AuthUser = { ...activeUser, projectCount: totalCount };
    setUser(synced);
    try {
      localStorage.setItem("insforge_session", JSON.stringify(synced));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(synced));
    } catch {}
    setLoading(false);

    const handleProjectEvent = () => {
      refreshProjectCount();
    };

    window.addEventListener(PROJECTS_UPDATED_EVENT, handleProjectEvent);
    window.addEventListener("storage", handleProjectEvent);

    return () => {
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleProjectEvent);
      window.removeEventListener("storage", handleProjectEvent);
    };
  }, [refreshProjectCount]);

  const signIn = async (email: string, _pass?: string) => {
    setLoading(true);
    const { totalCount } = getProjectCount();
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(newUser);
    try {
      localStorage.setItem("insforge_session", JSON.stringify(newUser));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    } catch {}
    setLoading(false);
    setActiveModal(null);
  };

  const signUp = async (email: string, _pass?: string, name?: string) => {
    setLoading(true);
    const { totalCount } = getProjectCount();
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
    };
    setUser(newUser);
    try {
      localStorage.setItem("insforge_session", JSON.stringify(newUser));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    } catch {}
    setLoading(false);
    setActiveModal(null);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { totalCount } = getProjectCount();
    const googleUser: AuthUser = {
      id: `google-${Date.now()}`,
      email: "google.creator@obsidian.ai",
      name: "Google Creator",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      plan: "pro",
      projectCount: totalCount,
    };
    setUser(googleUser);
    try {
      localStorage.setItem("insforge_session", JSON.stringify(googleUser));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(googleUser));
    } catch {}
    setLoading(false);
    setActiveModal(null);
  };

  const signOut = async () => {
    setUser(null);
    try {
      localStorage.removeItem("insforge_session");
      localStorage.removeItem("obsidian_auth_user");
    } catch {}
  };

  const updateUserPlan = (plan: "free" | "pro") => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: AuthUser = { ...prev, plan };
      try {
        localStorage.setItem("insforge_session", JSON.stringify(updated));
        localStorage.setItem("obsidian_auth_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const openSignIn = () => setActiveModal("sign-in");
  const openSignUp = () => setActiveModal("sign-up");
  const openUserProfile = () => setActiveModal("user-profile");
  const closeModals = () => setActiveModal(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoaded: !loading,
        isSignedIn: Boolean(user),
        mode,
        activeModal,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateUserPlan,
        openSignIn,
        openSignUp,
        openUserProfile,
        closeModals,
        refreshProjectCount,
        getProjectStats: getStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Clerk-compatible hook alias
export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useAuth();
  return {
    isLoaded,
    isSignedIn,
    user: user
      ? {
          id: user.id,
          fullName: user.name,
          primaryEmailAddress: { emailAddress: user.email },
          imageUrl: user.avatar_url,
          publicMetadata: { plan: user.plan },
        }
      : null,
  };
};
