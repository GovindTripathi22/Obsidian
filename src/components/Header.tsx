"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, LogOut, Hexagon } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z"/>
  </svg>
);

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 z-30 flex items-center justify-between px-6 transition-all duration-200">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Hexagon className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Website Builder</span>
        </Link>

        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ShopifyIcon className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Shopify Studio</span>
        </Link>

        <span className="hidden lg:inline-flex items-center gap-2 text-[11px] font-mono text-zinc-600 border-l border-zinc-800 pl-4">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Gemini 2.5 Flash
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
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
              className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
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
              <button className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
