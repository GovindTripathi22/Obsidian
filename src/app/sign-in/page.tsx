"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Mail, Lock, LogIn } from "lucide-react";

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
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
      <Card glass={false} className="max-w-sm w-full bg-neutral-900/50 border-neutral-800/50 rounded-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
            <span className="text-[#0a0a0a] text-sm font-bold">O</span>
          </div>
          <CardTitle className="text-xl font-semibold text-white">Welcome back</CardTitle>
          <CardDescription className="text-neutral-500 text-sm">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-center bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border-neutral-700/50 font-medium"
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

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-neutral-900 px-3 text-[11px] text-neutral-600 absolute">or</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4 text-neutral-500" />}
              className="bg-neutral-900/50 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600 focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-neutral-500" />}
              className="bg-neutral-900/50 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600 focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-medium border-0"
              isLoading={isSubmitting || loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center text-xs text-neutral-600 border-neutral-800/50">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-white hover:underline underline-offset-4 ml-1">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
