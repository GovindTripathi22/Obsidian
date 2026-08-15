"use client";

import React from "react";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import { InteractiveShopifyStudio } from "@/components/builder/InteractiveShopifyStudio";
import {
  Sparkles,
  Zap,
  Layers,
  Code2,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

/* ── Official Shopify SVG Brand Icon ── */
const ShopifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

export default function BuilderPage() {
  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 min-h-screen font-sans bg-zinc-950 text-zinc-100 smooth-gpu page-transition-enter">
      {/* ── Studio Header Toolbar: Dual-Engine Switcher ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <ShopifyIcon className="w-6 h-6 fill-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-heading">Shopify AI Theme Studio</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Liquid 2.0 Production Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400">Enterprise AI Theme Synthesis & Live Storefront Compiler</p>
          </div>
        </div>

        {/* Prominent Dual-Engine Switcher */}
        <div className="flex items-center gap-3">
          <BuilderSwitcher active="shopify" size="md" />
        </div>
      </div>

      {/* ── Main Interactive Studio Component ── */}
      <InteractiveShopifyStudio />

      {/* ── Production Features & Architecture Matrix ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/80">
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-heading font-bold text-white">Full Liquid 2.0 Compliance</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Outputs standard Shopify directory structures with modular sections, JSON templates, settings schemas, and theme stylesheets ready for direct theme upload in Shopify Admin.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-heading font-bold text-white">Real-Time Streaming Engine</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Powered by Gemini 2.5 Flash with sub-millisecond token streaming, dynamic layout synthesis, and real-time live iframe compilation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-heading font-bold text-white">100% Deployed & Production Ready</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Zero demo mockups — real working cart calculations, currency switchers, discount promo testers, and instant ZIP downloads.
          </p>
        </div>
      </div>
    </div>
  );
}
