"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  Crown,
  CreditCard,
  FolderKanban,
  Check,
  LogOut,
  Shield,
  Zap,
} from "lucide-react";

export const AuthModals: React.FC = () => {
  const {
    user,
    activeModal,
    closeModals,
    openSignIn,
    openSignUp,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserPlan,
    getProjectStats,
  } = useAuth();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeModal) return null;

  const stats = getProjectStats();
  const isPro = user?.plan === "pro";

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) return;
    setIsSubmitting(true);
    await signIn(signInEmail, signInPassword);
    setIsSubmitting(false);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail) return;
    setIsSubmitting(true);
    await signUp(signUpEmail, signUpPassword, signUpName);
    setIsSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  };

  const handleQuickSignIn = async (email: string, isProPlan: boolean) => {
    setIsSubmitting(true);
    await signIn(email);
    if (isProPlan) {
      updateUserPlan("pro");
    } else {
      updateUserPlan("free");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      {/* ── Sign In Modal ── */}
      {activeModal === "sign-in" && (
        <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative text-zinc-100">
          <button
            onClick={closeModals}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-2 shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black font-heading text-zinc-100 tracking-tight">
              Sign In to Obsidian
            </h2>
            <p className="text-xs text-zinc-400">
              Access your saved Shopify Liquid themes & Obsidian websites.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="secondary"
              className="w-full justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 font-semibold"
              onClick={handleGoogleAuth}
              isLoading={isSubmitting}
            >
              <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
              </svg>
              Continue with Google
            </Button>

            {/* Quick-fill demo account pills */}
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Instant Demo Profiles:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSignIn("developer@obsidian.ai", false)}
                  className="flex-1 py-1 px-2 rounded-xl text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  Free Creator (1/3)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSignIn("architect@obsidian.ai", true)}
                  className="flex-1 py-1 px-2 rounded-xl text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Crown className="w-3 h-3 text-white" /> Pro Studio
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 font-mono uppercase absolute">
                Or Email Credentials
              </span>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-3">
              <Input
                label="Email"
                type="email"
                placeholder="name@company.com"
                leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-lg"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400 pt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={openSignUp}
                className="text-white font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ── Sign Up Modal ── */}
      {activeModal === "sign-up" && (
        <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative text-zinc-100">
          <button
            onClick={closeModals}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-2 shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black font-heading text-zinc-100 tracking-tight">
              Create Obsidian Account
            </h2>
            <p className="text-xs text-zinc-400">
              Start building AI-powered Shopify stores & modern websites.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="secondary"
              className="w-full justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 font-semibold"
              onClick={handleGoogleAuth}
              isLoading={isSubmitting}
            >
              <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
              </svg>
              Sign Up with Google
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 font-mono uppercase absolute">
                Or Register with Email
              </span>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <Input
                label="Full Name"
                placeholder="Alex Morgan"
                leftIcon={<User className="w-4 h-4 text-zinc-400" />}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="name@company.com"
                leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-lg"
                isLoading={isSubmitting}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400 pt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={openSignIn}
                className="text-white font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ── User Profile & Plan Modal ── */}
      {activeModal === "user-profile" && (
        <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative text-zinc-100">
          <button
            onClick={closeModals}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 border-b border-zinc-800 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-xl font-bold font-heading overflow-hidden shadow-inner">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.name || user?.email || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-heading text-white">
                  {user?.name || "Obsidian Creator"}
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isPro
                      ? "bg-zinc-800 text-white border-zinc-600"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  {isPro ? "PRO UNLIMITED" : "FREE STARTER"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{user?.email || "No email"}</p>
            </div>
          </div>

          {/* Quota Status Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-white" />
                Workspace Quota
              </span>
              <span className="font-mono text-zinc-400">
                {isPro ? "Unlimited Projects" : `${stats.totalCount} / 3 Free Projects Used`}
              </span>
            </div>

            {!isPro && (
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalCount / 3) * 100)}%` }}
                />
              </div>
            )}

            {/* Instant Plan Switcher for Testing/Preview */}
            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
              <span className="text-[11px] text-zinc-400">Instant Plan Switcher:</span>
              <button
                type="button"
                onClick={() => updateUserPlan(isPro ? "free" : "pro")}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-white" />
                Switch to {isPro ? "Free (3 Projects)" : "Pro ($9.99/mo)"}
              </button>
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/projects"
              onClick={closeModals}
              className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <FolderKanban className="w-4 h-4 text-white" />
              <span>Workspace</span>
            </Link>
            <Link
              href="/billing"
              onClick={closeModals}
              className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-white" />
              <span>Billing & Plans</span>
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={async () => {
                await signOut();
                closeModals();
              }}
              className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <Button
              size="sm"
              variant="outline"
              onClick={closeModals}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
