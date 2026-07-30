"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  Sparkles,
  Zap,
  LogOut,
  Crown,
  CreditCard,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Hide sidebar on home page (uses its own dark SiteHeader) and editor pages
  if (pathname === "/" || pathname?.startsWith("/editor")) {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shopify Theme Builder", href: "/builder", icon: ShoppingBag },
    { name: "Projects", href: "/projects?tab=shopify", icon: FolderKanban },
    { name: "Inspiration", href: "/inspiration", icon: Sparkles },
    { name: "Billing & Plans", href: "/billing", icon: CreditCard },
    { name: "Design System", href: "/design-system", icon: Palette },
  ];

  const projectCount = user?.projectCount || 1;
  const maxProjects = user?.plan === "pro" ? "Unlimited" : 2;
  const usagePercentage = user?.plan === "pro" ? 20 : (projectCount / 2) * 100;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200/90 z-40 flex flex-col justify-between p-5 shadow-sm">
      {/* Brand Header */}
      <div className="space-y-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white p-0.5 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
          </div>
          <div>
            <span className="font-black tracking-tight text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
              StitchStore <span className="text-pink-600">AI</span>
            </span>
            <p className="text-[10px] font-mono text-slate-400">White Edition v2.5</p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isShopify = item.name === 'Shopify Theme Builder';

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? isShopify ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? (isShopify ? "text-emerald-300" : "text-pink-400") : "text-slate-400"}`} />
                  <span>
                    {item.name}
                    {isShopify && isActive && <span className="ml-1.5 text-sm">🛍️</span>}
                  </span>
                </div>
                {isShopify && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        {/* Usage Quota Card */}
        <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              {user?.plan === "pro" ? "Pro Subscription" : "Free Plan"}
            </span>
            <span className="font-mono text-slate-500">{projectCount}/{maxProjects}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                user?.plan === "pro" ? "bg-emerald-500" : "bg-slate-900"
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {user?.plan !== "pro" && (
            <Link
              href="/billing"
              className="block text-[11px] text-pink-600 hover:text-pink-700 font-bold text-center pt-1"
            >
              Upgrade for Unlimited Exports →
            </Link>
          )}
        </div>

        {/* User Profile Section */}
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name || "Active User"}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
            <p className="text-xs text-slate-500">Sign in to save your Shopify stores.</p>
            <Link href="/sign-in" className="block">
              <Button size="sm" variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
