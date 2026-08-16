"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/lib/insforge";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass?: string) => Promise<void>;
  signUp: (email: string, pass?: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProjectCount: () => void;
  getProjectStats: () => {
    shopifyCount: number;
    websiteCount: number;
    totalCount: number;
    maxFreeProjects: number;
    isLimitReached: boolean;
    isPro: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: "user-obsidian-prime",
  email: "developer@obsidian.ai",
  name: "Obsidian Creator",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
  plan: "free",
  projectCount: 1,
};

const MAX_FREE_PROJECTS = 3;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getCounts = () => {
    let shopifyCount = 0;
    let websiteCount = 0;

    if (typeof window !== "undefined") {
      try {
        const shopify = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
        shopifyCount = Array.isArray(shopify) ? shopify.length : 0;
      } catch {
        shopifyCount = 0;
      }
      try {
        const website = JSON.parse(localStorage.getItem("obsidian_website_projects") || "[]");
        websiteCount = Array.isArray(website) ? website.length : 0;
      } catch {
        websiteCount = 0;
      }
    }
    return { shopifyCount, websiteCount, totalCount: shopifyCount + websiteCount };
  };

  const refreshProjectCount = () => {
    const { totalCount } = getCounts();
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, projectCount: totalCount };
      localStorage.setItem("insforge_session", JSON.stringify(updated));
      localStorage.setItem("obsidian_auth_user", JSON.stringify(updated));
      return updated;
    });
  };

  const getProjectStats = () => {
    const { shopifyCount, websiteCount, totalCount } = getCounts();
    const isPro = user?.plan === "pro";
    const isLimitReached = !isPro && totalCount >= MAX_FREE_PROJECTS;
    return {
      shopifyCount,
      websiteCount,
      totalCount,
      maxFreeProjects: MAX_FREE_PROJECTS,
      isLimitReached,
      isPro,
    };
  };

  useEffect(() => {
    const savedUser =
      localStorage.getItem("obsidian_auth_user") || localStorage.getItem("insforge_session");
    let activeUser: UserProfile;

    if (savedUser) {
      try {
        activeUser = JSON.parse(savedUser);
      } catch {
        activeUser = DEFAULT_USER;
      }
    } else {
      activeUser = DEFAULT_USER;
    }

    const { totalCount } = getCounts();
    const synced = { ...activeUser, projectCount: totalCount };
    setUser(synced);
    localStorage.setItem("insforge_session", JSON.stringify(synced));
    localStorage.setItem("obsidian_auth_user", JSON.stringify(synced));
    setLoading(false);

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "insforge_projects" ||
        e.key === "obsidian_website_projects" ||
        e.key === "obsidian_auth_user" ||
        e.key === "insforge_session"
      ) {
        refreshProjectCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    const { totalCount } = getCounts();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
    };
    setUser(newUser);
    localStorage.setItem("insforge_session", JSON.stringify(newUser));
    localStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    setLoading(false);
  };

  const signUp = async (email: string, _pass?: string, name?: string) => {
    setLoading(true);
    const { totalCount } = getCounts();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
    };
    setUser(newUser);
    localStorage.setItem("insforge_session", JSON.stringify(newUser));
    localStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { totalCount } = getCounts();
    const googleUser: UserProfile = {
      id: `google-${Date.now()}`,
      email: "google.creator@obsidian.ai",
      name: "Google Creator",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      plan: "pro",
      projectCount: totalCount,
    };
    setUser(googleUser);
    localStorage.setItem("insforge_session", JSON.stringify(googleUser));
    localStorage.setItem("obsidian_auth_user", JSON.stringify(googleUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("insforge_session");
    localStorage.removeItem("obsidian_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProjectCount,
        getProjectStats,
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
