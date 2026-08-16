"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { X, Sparkles } from "lucide-react";

export const GoogleOneTap: React.FC = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after 2 seconds if user is guest and hasn't dismissed it
    const timer = setTimeout(() => {
      if (!user && !dismissed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, dismissed]);

  if (loading || user || !isVisible || dismissed) {
    return null;
  }

  const handleSignIn = async () => {
    setIsVisible(false);
    await signInWithGoogle();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-zinc-950/95 border border-zinc-800 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl animate-fade-in text-zinc-100 font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Continue with Google</h4>
            <p className="text-[11px] text-zinc-400">Instant access to Obsidian Studio</p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleSignIn}
          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-colors text-center"
        >
          Sign In as Google Creator
        </button>
        <button
          onClick={handleDismiss}
          className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs border border-zinc-800 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
};
