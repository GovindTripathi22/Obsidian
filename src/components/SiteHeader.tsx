"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Hexagon, Sparkles, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

export const SiteHeader: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-white text-lg tracking-tight hover:opacity-90 transition-opacity">
            <Hexagon className="h-6 w-6 fill-white text-white" />
            <span>Obsidian <span className="text-zinc-500 font-normal">Builder</span></span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            v1.0 Beta
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {/* Direct Launcher Button for Shopify Theme Builder */}
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-emerald-500/30"
          >
            <ShopifyIcon className="w-4 h-4 fill-white text-white shrink-0" />
            <span>Shopify Theme Builder</span>
          </Link>

          <Link href="/projects?tab=website" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden md:block">
            My Projects
          </Link>
          <Link href="/billing" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden md:block">
            Pricing
          </Link>
          <Link href="/design-system" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden md:block">
            Design System
          </Link>

          {loading ? (
            <div className="h-8 w-20 bg-zinc-800 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3 ml-2 border-l border-zinc-800 pl-3">
              <span className="text-xs font-semibold text-zinc-300 hidden lg:block">
                {user.name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
