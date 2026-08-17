"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import { UserButton } from "@/components/auth/UserButton";

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const isShopify = pathname === "/builder" || pathname === "/shopify";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-[#0a0a0a] text-xs font-bold">O</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Obsidian
          </span>
        </Link>

        {/* Center: Mode Switcher */}
        <BuilderSwitcher active={isShopify ? "shopify" : "website"} size="md" />

        {/* Right */}
        <nav className="flex items-center gap-4">
          <Link
            href={isShopify ? "/projects?tab=shopify" : "/projects?tab=website"}
            className="text-xs text-neutral-500 hover:text-white transition-colors hidden md:block"
          >
            Projects
          </Link>
          <Link href="/billing" className="text-xs text-neutral-500 hover:text-white transition-colors hidden md:block">
            Pricing
          </Link>
          <div className="ml-1 pl-3 border-l border-neutral-800">
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
};
