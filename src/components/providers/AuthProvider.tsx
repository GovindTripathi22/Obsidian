"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/lib/insforge";
import {
  getProjectStats,
  getProjectCount,
  PROJECTS_UPDATED_EVENT,
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
  mode: "clerk" | "standard";
  activeModal: "sign-in" | "sign-up" | "user-profile" | null;
  signIn: (email: string, pass?: string) => Promise<void>;
  signUp: (email: string, pass?: string, name?: string) => Promise<void>;
  signInWithGoogle: (customName?: string, customEmail?: string) => Promise<void>;
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

export const MAX_FREE_PROJECTS = 3;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"sign-in" | "sign-up" | "user-profile" | null>(null);

  // Check if Clerk publishable key is present in environment
  const hasClerkKey = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const mode: "clerk" | "standard" = hasClerkKey ? "clerk" : "standard";

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
    try {
      const savedUser =
        localStorage.getItem("obsidian_auth_user") || localStorage.getItem("insforge_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.email || parsed.name)) {
          const { totalCount } = getProjectCount();
          const synced: AuthUser = {
            id: parsed.id || `usr_${Date.now()}`,
            email: parsed.email || "",
            name: parsed.name || parsed.email?.split("@")[0] || "User",
            avatar_url: parsed.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parsed.name || parsed.email || "U")}`,
            created_at: parsed.created_at || new Date().toISOString(),
            plan: parsed.plan === "pro" ? "pro" : "free",
            projectCount: totalCount,
          };
          setUser(synced);
          localStorage.setItem("insforge_session", JSON.stringify(synced));
          localStorage.setItem("obsidian_auth_user", JSON.stringify(synced));
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }

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
    const cleanEmail = email.trim();
    
    // Check if there is a registered user with this email
    let registeredName = "";
    try {
      const regList = JSON.parse(localStorage.getItem("obsidian_registered_users") || "[]");
      if (Array.isArray(regList)) {
        const found = regList.find((u: any) => u && u.email?.toLowerCase() === cleanEmail.toLowerCase());
        if (found && found.name) {
          registeredName = found.name;
        }
      }
    } catch {}

    const displayName = registeredName || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: displayName,
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
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
    const cleanEmail = email.trim();
    const cleanName = name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    };

    // Save to registered users list
    try {
      const regList = JSON.parse(localStorage.getItem("obsidian_registered_users") || "[]");
      const updatedList = Array.isArray(regList) ? [...regList.filter((u: any) => u?.email !== cleanEmail), newUser] : [newUser];
      localStorage.setItem("obsidian_registered_users", JSON.stringify(updatedList));
      localStorage.setItem("insforge_session", JSON.stringify(newUser));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    } catch {}

    setUser(newUser);
    setLoading(false);
    setActiveModal(null);
  };

  const signInWithGoogle = async (customName?: string, customEmail?: string) => {
    setLoading(true);
    const { totalCount } = getProjectCount();
    const email = customEmail?.trim() || "creator@gmail.com";
    const name = customName?.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    const googleUser: AuthUser = {
      id: `google_${Date.now()}`,
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString(),
      plan: "free",
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
