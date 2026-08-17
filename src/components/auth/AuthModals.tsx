"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { GoogleAuthModal } from "@/components/auth/GoogleAuthModal";
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
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);

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

  const handleSelectGoogleAccount = async (name: string, email: string) => {
    setIsSubmitting(true);
    await signInWithGoogle(name, email);
    setIsSubmitting(false);
  };

  return (
    <>
      <GoogleAuthModal
        isOpen={showGoogleDialog}
        onClose={() => setShowGoogleDialog(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />

      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
        {/* ── Sign In Modal ── */}
        {activeModal === "sign-in" && (
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl relative text-neutral-100">
            <button
              onClick={closeModals}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="mx-auto w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
                <span className="text-[#0a0a0a] text-sm font-bold">O</span>
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Sign In to Obsidian
              </h2>
              <p className="text-xs text-neutral-400">
                Access your saved Shopify themes and website projects.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="secondary"
                className="w-full justify-center bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 font-medium"
                onClick={() => setShowGoogleDialog(true)}
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

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-neutral-800 w-full" />
                <span className="bg-[#0a0a0a] px-3 text-[10px] text-neutral-500 uppercase tracking-wider absolute">
                  Or Email
                </span>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-3">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-medium"
                  isLoading={isSubmitting}
                >
                  Sign In
                </Button>
              </form>

              <p className="text-center text-xs text-neutral-400 pt-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={openSignUp}
                  className="text-white font-medium hover:underline underline-offset-4 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── Sign Up Modal ── */}
        {activeModal === "sign-up" && (
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl relative text-neutral-100">
            <button
              onClick={closeModals}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="mx-auto w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
                <span className="text-[#0a0a0a] text-sm font-bold">O</span>
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Create Obsidian Account
              </h2>
              <p className="text-xs text-neutral-400">
                Start building AI-powered websites & Shopify themes.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="secondary"
                className="w-full justify-center bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 font-medium"
                onClick={() => setShowGoogleDialog(true)}
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
                <div className="border-t border-neutral-800 w-full" />
                <span className="bg-[#0a0a0a] px-3 text-[10px] text-neutral-500 uppercase tracking-wider absolute">
                  Or Register with Email
                </span>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-medium"
                  isLoading={isSubmitting}
                >
                  Create Account
                </Button>
              </form>

              <p className="text-center text-xs text-neutral-400 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={openSignIn}
                  className="text-white font-medium hover:underline underline-offset-4 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── User Profile & Plan Modal ── */}
        {activeModal === "user-profile" && (
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6 sm:p-8 space-y-6 shadow-2xl relative text-neutral-100">
            <button
              onClick={closeModals}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-neutral-800 pb-5">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white text-lg font-bold overflow-hidden shadow-inner">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.name || user?.email || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-white">
                    {user?.name || "Account"}
                  </h3>
                  <span
                    className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                      isPro
                        ? "bg-neutral-800 text-white border-neutral-600"
                        : "bg-neutral-900 text-neutral-400 border-neutral-800"
                    }`}
                  >
                    {isPro ? "PRO" : "FREE"}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{user?.email || "No email"}</p>
              </div>
            </div>

            {/* Quota Status Card */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  Workspace Quota
                </span>
                <span className="text-neutral-400">
                  {isPro ? "Unlimited Projects" : `${stats.totalCount} / 3 Free Projects Used`}
                </span>
              </div>

              {!isPro && (
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (stats.totalCount / 3) * 100)}%` }}
                  />
                </div>
              )}

              {/* Plan Switcher */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">Current Plan:</span>
                <button
                  type="button"
                  onClick={() => updateUserPlan(isPro ? "free" : "pro")}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-white" />
                  Switch to {isPro ? "Free" : "Pro"}
                </button>
              </div>
            </div>

            {/* Navigation Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/projects"
                onClick={closeModals}
                className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <FolderKanban className="w-4 h-4 text-white" />
                <span>Projects</span>
              </Link>
              <Link
                href="/billing"
                onClick={closeModals}
                className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>Billing</span>
              </Link>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={async () => {
                  await signOut();
                  closeModals();
                }}
                className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <Button
                size="sm"
                variant="outline"
                onClick={closeModals}
                className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
