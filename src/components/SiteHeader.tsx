"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Hexagon, LogIn, UserPlus, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";

export const SiteHeader: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  const isShopify = pathname === "/builder" || pathname === "/shopify";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-2xl transition-colors duration-300">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-white text-lg tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Hexagon className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="font-heading font-black">Obsidian <span className="text-zinc-500 font-normal">AI</span></span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v2.5
          </span>
        </div>

        {/* Center: Interactive Mode Switcher Pill */}
        <div className="flex items-center">
          <BuilderSwitcher active={isShopify ? "shopify" : "website"} size="md" />
        </div>

        {/* Right Navigation & Auth */}
        <nav className="flex items-center gap-3">
          <Link
            href={isShopify ? "/projects?tab=shopify" : "/projects?tab=website"}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden md:block"
          >
            My Projects
          </Link>
          <Link href="/billing" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden md:block">
            Pricing
          </Link>
          <Link href="/design-system" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 hidden lg:block">
            Design System
          </Link>

          {loading ? (
            <div className="h-8 w-20 bg-zinc-800 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3 ml-1 border-l border-zinc-800 pl-3">
              <span className="text-xs font-semibold text-zinc-300 hidden xl:block">
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
            <div className="flex items-center gap-2 ml-1">
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
