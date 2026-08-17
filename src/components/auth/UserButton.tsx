"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  User,
  CreditCard,
  FolderKanban,
  Palette,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserButtonProps {
  showDetails?: boolean;
}

export const UserButton: React.FC<UserButtonProps> = ({ showDetails = false }) => {
  const {
    user,
    loading,
    signOut,
    openSignIn,
    openSignUp,
    openUserProfile,
    updateUserPlan,
    getProjectStats,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const stats = getProjectStats();
  const isPro = user?.plan === "pro";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return <div className="w-7 h-7 rounded-lg bg-neutral-800 animate-pulse border border-neutral-700" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openSignIn}
          className="text-xs font-medium text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-neutral-900 cursor-pointer"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={openSignUp}
          className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-neutral-200 font-medium text-xs transition-colors cursor-pointer shadow-sm"
        >
          Get Started
        </button>
      </div>
    );
  }

  const initialLetter = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{initialLetter}</span>
          )}
        </div>

        {showDetails && (
          <div className="text-left min-w-0 pr-1">
            <p className="text-xs font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
              {user.name || user.email}
            </p>
            <p className="text-[10px] text-neutral-500 truncate">
              {isPro ? "Pro Plan" : "Free Plan"}
            </p>
          </div>
        )}

        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-64 rounded-xl bg-[#0a0a0a] border border-neutral-800 shadow-2xl p-3 z-50 text-neutral-100 animate-fade-in space-y-2.5">
          {/* User Header */}
          <div className="flex items-center gap-2.5 border-b border-neutral-800/80 pb-2.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initialLetter}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate">{user.name || "User"}</p>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.2 rounded-full border ${
                    isPro ? "bg-neutral-800 text-white border-neutral-600" : "bg-neutral-900 text-neutral-400 border-neutral-800"
                  }`}
                >
                  {isPro ? "PRO" : "FREE"}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Quota Progress Bar */}
          <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Projects Quota</span>
              <span className="text-white font-medium">
                {isPro ? "Unlimited" : `${stats.totalCount}/3`}
              </span>
            </div>
            {!isPro && (
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalCount / 3) * 100)}%` }}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => updateUserPlan(isPro ? "free" : "pro")}
                className="text-[10px] text-neutral-500 hover:text-white underline transition-colors cursor-pointer"
              >
                Switch to {isPro ? "Free" : "Pro"}
              </button>
              {!isPro && (
                <Link
                  href="/billing"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-medium text-white hover:text-neutral-300 transition-colors"
                >
                  Upgrade →
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5">
            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>

            <Link
              href="/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Billing</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openUserProfile();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors text-left cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-1.5 border-t border-neutral-800">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-red-400 hover:bg-neutral-900/60 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
