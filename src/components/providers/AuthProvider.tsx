"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/lib/insforge";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProjectCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "user-demo-123456",
  email: "developer@insforge.io",
  name: "Alex Dev",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
  plan: "free",
  projectCount: 1,
};

const getProjectCountFromStorage = (fallback?: number): number => {
  try {
    const savedProjects = localStorage.getItem("insforge_projects");
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      if (Array.isArray(parsed)) {
        return parsed.length;
      }
    }
  } catch {
    // Ignore JSON error
  }
  return fallback ?? 0;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjectCount = () => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const count = getProjectCountFromStorage(prevUser.projectCount);
      const updatedUser = { ...prevUser, projectCount: count };
      localStorage.setItem("insforge_session", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    // Check saved session in localStorage
    const savedUser = localStorage.getItem("insforge_session");
    let initialUser: UserProfile;
    if (savedUser) {
      try {
        initialUser = JSON.parse(savedUser);
      } catch {
        initialUser = DEMO_USER;
      }
    } else {
      initialUser = DEMO_USER;
    }

    const actualCount = getProjectCountFromStorage(initialUser.projectCount);
    const syncedUser = { ...initialUser, projectCount: actualCount };

    setUser(syncedUser);
    localStorage.setItem("insforge_session", JSON.stringify(syncedUser));
    setLoading(false);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "insforge_projects" || e.key === "insforge_session") {
        refreshProjectCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    const count = getProjectCountFromStorage(DEMO_USER.projectCount);
    const newUser: UserProfile = {
      ...DEMO_USER,
      email,
      name: email.split("@")[0],
      projectCount: count,
    };
    setUser(newUser);
    localStorage.setItem("insforge_session", JSON.stringify(newUser));
    setLoading(false);
  };

  const signUp = async (email: string, _pass: string, name: string) => {
    setLoading(true);
    const count = getProjectCountFromStorage(0);
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: count,
    };
    setUser(newUser);
    localStorage.setItem("insforge_session", JSON.stringify(newUser));
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const count = getProjectCountFromStorage(3);
    const googleUser: UserProfile = {
      id: `google-${Date.now()}`,
      email: "google.user@insforge.com",
      name: "Google Member",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      plan: "pro",
      projectCount: count,
    };
    setUser(googleUser);
    localStorage.setItem("insforge_session", JSON.stringify(googleUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("insforge_session");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, refreshProjectCount }}>
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
