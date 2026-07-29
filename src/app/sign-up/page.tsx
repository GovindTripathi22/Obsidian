"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Mail, Lock, User, UserPlus, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    await signUp(email, password, name);
    router.push("/");
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    router.push("/");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)] bg-slate-50">
      <Card className="max-w-md w-full bg-white border-slate-200 shadow-xl space-y-6">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">Create Your Account</CardTitle>
          <CardDescription>Join StitchStore AI to build, edit, and export Shopify Liquid themes.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={handleGoogle}
            isLoading={isSubmitting || loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
            Sign Up with Google
          </Button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-mono absolute">OR EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              leftIcon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="pink"
              className="w-full"
              isLoading={isSubmitting || loading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center justify-center text-xs text-slate-500 border-slate-100">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-pink-600 font-bold hover:underline ml-1">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
