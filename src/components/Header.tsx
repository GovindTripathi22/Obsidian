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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          <svg viewBox="0 0 109.5 124.5" className="w-4 h-4 shrink-0" fill="white">
            <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z"/>
          </svg>
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
