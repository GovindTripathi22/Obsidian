"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import { UserButton } from "@/components/auth/UserButton";

export const Header: React.FC = () => {
  const pathname = usePathname();

  // Home page uses its own SiteHeader
  if (pathname === "/") return null;

  const isShopifyStudio = pathname === "/builder" || pathname === "/shopify";

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 z-30 flex items-center justify-between px-6 transition-all duration-200">
      {/* Left: Mode Switcher */}
      <div className="flex items-center gap-4">
        <BuilderSwitcher active={isShopifyStudio ? "shopify" : "website"} size="sm" />
        
        <span className="hidden xl:inline-flex items-center gap-2 text-[11px] font-mono text-zinc-400 border-l border-zinc-800 pl-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>Gemini 2.5 Flash • Streaming</span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/design-system"
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors mr-2 hidden sm:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          <span>Design Tokens</span>
        </Link>

        <UserButton showDetails />
      </div>
    </header>
  );
};

