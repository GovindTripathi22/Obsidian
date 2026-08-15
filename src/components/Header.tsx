"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  // Home page uses its own SiteHeader
  if (pathname === "/") return null;

  const isShopifyStudio = pathname === "/builder";

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 z-30 flex items-center justify-between px-6 transition-all duration-200">
      {/* Left: Mode Switcher */}
      <div className="flex items-center gap-4">
        <BuilderSwitcher active={isShopifyStudio ? "shopify" : "shopify"} size="sm" />
        
        <span className="hidden xl:inline-flex items-center gap-2 text-[11px] font-mono text-zinc-500 border-l border-zinc-800 pl-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 2.5 Flash • Streaming</span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/design-system"
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors mr-2 hidden sm:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Design Tokens</span>
        </Link>

        {loading ? (
          <div className="h-8 w-20 bg-zinc-800 rounded-lg animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-200">{user.name || user.email || "User"}</p>
              <p className="text-[10px] font-mono text-zinc-500">{user.email || ""}</p>
            </div>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <button className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-3.5 py-1.5 text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-sm">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
