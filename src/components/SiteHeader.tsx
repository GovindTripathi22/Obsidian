"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon } from "lucide-react";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import { UserButton } from "@/components/auth/UserButton";

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const isShopify = pathname === "/builder" || pathname === "/shopify";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-2xl transition-colors duration-300">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-white text-lg tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
              <Hexagon className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="font-heading font-black">Obsidian <span className="text-zinc-500 font-normal">AI</span></span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
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

          <div className="ml-1 pl-2 border-l border-zinc-800">
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

