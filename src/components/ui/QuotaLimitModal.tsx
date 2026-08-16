"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, CreditCard, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuotaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount?: number;
  maxCount?: number;
  manageProjectsHref?: string;
}

export const QuotaLimitModal: React.FC<QuotaLimitModalProps> = ({
  isOpen,
  onClose,
  currentCount = 3,
  maxCount = 3,
  manageProjectsHref = "/projects",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Free Quota Limit Reached</h3>
            <p className="text-xs font-mono text-zinc-400">
              {currentCount}/{maxCount} Free projects currently used
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          You have reached the maximum limit of <strong className="text-white">3 free projects</strong> on your current tier.
          Upgrade to <strong className="text-white">Obsidian Pro ($9.99/mo)</strong> for unlimited Shopify Liquid & Website generations, or delete old projects in your workspace.
        </p>

        {/* Pro Benefits Box */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-[11px] text-zinc-300">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Obsidian Pro includes:
          </p>
          <ul className="space-y-1 list-disc list-inside text-zinc-400 pl-1">
            <li>Unlimited Website & Shopify Theme projects</li>
            <li>Full Shopify Liquid 2.0 ZIP package compiler</li>
            <li>Priority Gemini 2.5 Flash streaming pipeline</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <Link href="/billing" className="block w-full" onClick={onClose}>
            <Button
              size="md"
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs shadow-lg"
            >
              Upgrade to Pro ($9.99/mo) →
            </Button>
          </Link>

          <div className="flex gap-2">
            <Link href={manageProjectsHref} className="flex-1" onClick={onClose}>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs"
              >
                Manage Projects
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
