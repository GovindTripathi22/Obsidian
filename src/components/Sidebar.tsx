"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Sparkles,
  Zap,
  LogOut,
  Crown,
  CreditCard,
  Palette,
  ShoppingBag,
  Hexagon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (pathname === "/" || pathname?.startsWith("/editor")) {
    return null;
  }

  const isShopify = pathname === "/builder";

  const navItems = [
    { name: "Website Builder", href: "/", icon: Hexagon, isSpecial: false },
    { name: "Shopify Studio", href: "/builder", icon: ShoppingBag, isSpecial: false },
    { name: "Projects Workspace", href: isShopify ? "/projects?tab=shopify" : "/projects?tab=website", icon: FolderKanban },
    { name: "Inspiration Gallery", href: "/inspiration", icon: Sparkles },
    { name: "Billing & Plans", href: "/billing", icon: CreditCard },
    { name: "Design System", href: "/design-system", icon: Palette },
  ];

  const projectCount = user?.projectCount || 1;
  const maxProjects = user?.plan === "pro" ? "∞" : "2";
  const usagePercentage = user?.plan === "pro" ? 20 : (projectCount / 2) * 100;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800/80 z-40 flex flex-col justify-between p-5 font-sans">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/30">
            <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-white text-lg tracking-tight">
              Obsidian <span className="text-zinc-500 font-normal">AI</span>
            </span>
            <p className="text-[10px] font-mono text-zinc-500">Dual-Engine Studio</p>
          </div>
        </Link>

        {/* Quick Switch Banner */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>Active Engine</span>
            <span className={`w-2 h-2 rounded-full ${isShopify ? "bg-emerald-400 animate-pulse" : "bg-white animate-pulse"}`} />
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isShopify ? (
                <ShopifyIcon className="w-4 h-4 fill-emerald-400" />
              ) : (
                <Hexagon className="w-4 h-4 fill-white text-white" />
              )}
              <span className="text-xs font-bold text-white">
                {isShopify ? "Shopify Theme Studio" : "Website Builder"}
              </span>
            </div>
          </div>
          <Link
            href={isShopify ? "/" : "/builder"}
            className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline pt-1 transition-colors"
          >
            <span>Switch to {isShopify ? "Website Builder" : "Shopify Studio"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.name.includes("Projects") && pathname?.startsWith("/projects"));
            const Icon = item.icon;
            const isShopifyItem = item.name === "Shopify Studio";

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? isShopifyItem
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-950/40"
                      : "bg-zinc-800 text-white border border-zinc-700/60"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isShopifyItem ? (
                    <ShopifyIcon className={`w-4 h-4 ${isActive ? "fill-white" : "fill-zinc-500"}`} />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                  )}
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="space-y-3 pt-4 border-t border-zinc-800/80">
        {/* Usage Quota Card */}
        <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              {user?.plan === "pro" ? "Pro Plan" : "Free Tier"}
            </span>
            <span className="font-mono text-zinc-500">{projectCount}/{maxProjects}</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {user?.plan !== "pro" && (
            <Link href="/billing" className="block text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold text-center pt-0.5">
              Upgrade to Pro →
            </Link>
          )}
        </div>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-bold flex items-center justify-center text-xs border border-zinc-700">
                {(user.name || user.email || "G").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-200 truncate">{user.name || user.email || "User"}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{user.email || ""}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link href="/sign-in" className="block text-center text-xs text-zinc-400 hover:text-white py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
};
