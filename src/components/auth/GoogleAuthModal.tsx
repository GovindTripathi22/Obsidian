"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, UserPlus, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface GoogleSavedAccount {
  name: string;
  email: string;
  avatar_url?: string;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (name: string, email: string) => void;
}

const STORAGE_KEY = "obsidian_saved_google_accounts";

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [savedAccounts, setSavedAccounts] = useState<GoogleSavedAccount[]>([]);
  const [mode, setMode] = useState<"choose" | "new">("choose");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [rememberAccount, setRememberAccount] = useState(true);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAccounts(parsed);
            setMode("choose");
            return;
          }
        }
      } catch {}
      setSavedAccounts([]);
      setMode("new");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const email = customEmail.trim();
    const name = customName.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    if (rememberAccount) {
      try {
        const updated = [...savedAccounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase()), { name, email, avatar_url: avatar }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    onSelectAccount(name, email);
    onClose();
  };

  const handleSelectExisting = (account: GoogleSavedAccount) => {
    onSelectAccount(account.name, account.email);
    onClose();
  };

  const handleRemoveAccount = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation();
    const updated = savedAccounts.filter((a) => a.email !== emailToRemove);
    setSavedAccounts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    if (updated.length === 0) {
      setMode("new");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="max-w-sm w-full rounded-2xl border border-neutral-800 bg-[#0f0f0f] shadow-2xl p-6 relative text-neutral-100 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
            </svg>
            <span className="text-sm font-semibold text-white">Sign in with Google</span>
          </div>
          <p className="text-xs text-neutral-400">
            to continue to <span className="text-white font-medium">Obsidian AI</span>
          </p>
        </div>

        {/* Mode: Choose from saved accounts */}
        {mode === "choose" && savedAccounts.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-neutral-300">Choose an account:</p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {savedAccounts.map((account) => (
                <div
                  key={account.email}
                  onClick={() => handleSelectExisting(account)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-white shrink-0 overflow-hidden">
                      {account.avatar_url ? (
                        <img src={account.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{account.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-medium text-white truncate group-hover:text-white">
                        {account.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{account.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveAccount(e, account.email)}
                    title="Remove from device"
                    className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setMode("new")}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-neutral-800 hover:border-neutral-600 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Use another Google account</span>
            </button>
          </div>
        )}

        {/* Mode: Enter real Google account */}
        {(mode === "new" || savedAccounts.length === 0) && (
          <form onSubmit={handleCreateGoogleAccount} className="space-y-3.5">
            <Input
              label="Google Account Full Name"
              placeholder="e.g. Govind Tripathi"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
              required
            />
            <Input
              label="Google Email Address"
              type="email"
              placeholder="you@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500"
              required
            />

            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberAccount}
                onChange={(e) => setRememberAccount(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
              />
              <span>Remember this Google account for quick login</span>
            </label>

            <div className="flex gap-2 pt-1">
              {savedAccounts.length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setMode("choose")}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-medium"
              >
                Sign In with Google
              </Button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-neutral-800/80 text-center">
          <p className="text-[10px] text-neutral-500">
            Obsidian stores sessions securely on your local device.
          </p>
        </div>
      </div>
    </div>
  );
};
