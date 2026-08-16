"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await signIn(email, password);
    router.push("/");
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    router.push("/");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 font-sans">
      <Card glass={false} className="max-w-md w-full bg-zinc-900 border-zinc-800 shadow-2xl space-y-6 rounded-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-2 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black font-heading text-zinc-100">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Sign in to access your saved Shopify projects & Obsidian websites.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="secondary"
            className="w-full justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 font-semibold"
            onClick={handleGoogle}
            isLoading={isSubmitting || loading}
          >
            <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-zinc-900 px-3 text-xs text-zinc-500 font-mono absolute">OR EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg border-0"
              isLoading={isSubmitting || loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center text-xs text-zinc-400 border-zinc-800">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-white font-bold hover:underline ml-1">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
