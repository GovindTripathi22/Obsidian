"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  User,
  Crown,
  CreditCard,
  FolderKanban,
  Palette,
  LogOut,
  Zap,
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
    return <div className="w-8 h-8 rounded-xl bg-zinc-800 animate-pulse border border-zinc-700" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={openSignIn}
          className="text-zinc-400 hover:text-white text-xs hover:bg-zinc-900"
        >
          Sign In
        </Button>
        <Button
          size="sm"
          onClick={openSignIn}
          className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs shadow-sm"
        >
          Get Started
        </Button>
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
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all duration-200 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center text-white text-xs font-bold font-heading overflow-hidden shadow-inner transition-colors">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{initialLetter}</span>
          )}
        </div>

        {showDetails && (
          <div className="text-left min-w-0 pr-1">
            <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
              {user.name || user.email}
            </p>
            <p className="text-[10px] font-mono text-zinc-500 truncate">
              {isPro ? "Pro Plan" : "Free Plan"}
            </p>
          </div>
        )}

        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-72 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-4 z-50 text-zinc-100 animate-fade-in space-y-3">
          {/* User Header */}
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-sm font-bold font-heading overflow-hidden shadow-inner">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initialLetter}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">{user.name || "Obsidian User"}</p>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                    isPro ? "bg-zinc-800 text-white border-zinc-600" : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  {isPro ? "PRO" : "FREE"}
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Quota Progress Bar */}
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-medium">Free Projects Quota</span>
              <span className="font-mono text-white font-bold">
                {isPro ? "Unlimited" : `${stats.totalCount}/3`}
              </span>
            </div>
            {!isPro && (
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalCount / 3) * 100)}%` }}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => updateUserPlan(isPro ? "free" : "pro")}
                className="text-[10px] font-mono text-zinc-400 hover:text-white underline transition-colors"
              >
                Switch to {isPro ? "Free" : "Pro"}
              </button>
              {!isPro && (
                <Link
                  href="/billing"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-bold text-white hover:text-zinc-300 transition-colors"
                >
                  Upgrade ($9.99/mo) →
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-zinc-400" />
              <span>Workspace Projects</span>
            </Link>

            <Link
              href="/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-zinc-400" />
              <span>Subscription & Billing</span>
            </Link>

            <Link
              href="/design-system"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Palette className="w-4 h-4 text-zinc-400" />
              <span>Design System Tokens</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openUserProfile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors text-left"
            >
              <User className="w-4 h-4 text-zinc-400" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
