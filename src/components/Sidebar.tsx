"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Sparkles,
  CreditCard,
  Palette,
  ShoppingBag,
  Hexagon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserButton } from "@/components/auth/UserButton";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, getProjectStats } = useAuth();

  if (pathname === "/" || pathname?.startsWith("/editor")) {
    return null;
  }

  const isShopify = pathname === "/builder" || pathname === "/shopify";

  const navItems = [
    { name: "Website Builder", href: "/", icon: Hexagon },
    { name: "Shopify Studio", href: "/builder", icon: ShoppingBag },
    { name: "Projects", href: isShopify ? "/projects?tab=shopify" : "/projects?tab=website", icon: FolderKanban },
    { name: "Inspiration", href: "/inspiration", icon: Sparkles },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Design System", href: "/design-system", icon: Palette },
  ];

  const stats = getProjectStats();
  const isPro = user?.plan === "pro";
  const projectCount = stats.totalCount;
  const maxProjects = isPro ? "∞" : "3";
  const usagePercentage = isPro ? 20 : (projectCount / 3) * 100;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-neutral-800/50 z-40 flex flex-col justify-between p-5">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-[#0a0a0a] text-xs font-bold">O</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            Obsidian
          </span>
        </Link>

        {/* Active Engine */}
        <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 space-y-2.5">
          <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-medium">
            Active Engine
          </p>
          <div className="flex items-center gap-2">
            {isShopify ? (
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <Hexagon className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="text-xs font-medium text-white">
              {isShopify ? "Shopify Themes" : "Website Builder"}
            </span>
          </div>
          <Link
            href={isShopify ? "/" : "/builder"}
            className="flex items-center justify-between text-[11px] text-neutral-500 hover:text-white pt-1 transition-colors"
          >
            <span>Switch to {isShopify ? "Websites" : "Shopify"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.name === "Projects" && pathname?.startsWith("/projects"));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  isActive
                    ? "bg-neutral-800/80 text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-3 pt-4 border-t border-neutral-800/50">
        {/* Usage */}
        <div className="p-3 rounded-xl border border-neutral-800/50 bg-neutral-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              {isPro ? "Pro Plan" : "Free Plan"}
            </span>
            <span className="text-neutral-600 tabular-nums">
              {projectCount}/{maxProjects}
            </span>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-400 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {!isPro && (
            <Link
              href="/billing"
              className="block text-[11px] text-neutral-600 hover:text-white text-center pt-0.5 transition-colors"
            >
              Upgrade to Pro →
            </Link>
          )}
        </div>

        {/* User */}
        <div className="p-1.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
          <UserButton showDetails />
        </div>
      </div>
    </aside>
  );
};
