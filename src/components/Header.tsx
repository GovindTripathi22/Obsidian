"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogIn, UserPlus, LogOut, Sparkles, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/90 z-30 flex items-center justify-between px-6 transition-all duration-200 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono text-slate-500">
          Engine: <strong className="text-slate-900 font-semibold">Gemini 2.5 Flash</strong> • Shopify Liquid Ready
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/builder"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 shadow-md shadow-rose-500/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Shopify Theme Builder</span>
        </Link>

        <Link href="/design-system" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mr-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Design System</span>
        </Link>

        {loading ? (
          <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user.name || user.email}</p>
              <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="pink" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
