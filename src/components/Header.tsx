"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import { UserButton } from "@/components/auth/UserButton";

export const Header: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const isShopifyStudio = pathname === "/builder" || pathname === "/shopify";

  return (
    <header className="fixed top-0 right-0 left-64 h-14 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-neutral-800/50 z-30 flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <BuilderSwitcher active={isShopifyStudio ? "shopify" : "website"} size="sm" />

        <span className="hidden xl:inline-flex items-center gap-2 text-[11px] text-neutral-600 border-l border-neutral-800 pl-4">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
          Gemini 2.5 Flash
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Link
          href="/design-system"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors hidden sm:block"
        >
          Design Tokens
        </Link>
        <UserButton showDetails />
      </div>
    </header>
  );
};
