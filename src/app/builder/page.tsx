"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShopifyThemeProvider, useShopifyTheme } from "@/components/providers/ShopifyThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Wand2,
  Code2,
  Crown,
  ArrowRight,
  Layers,
  Zap,
  Flame,
  ArrowUpRight,
  Eye,
  Sliders,
  Hexagon,
  Sparkles,
} from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

/* ─── Official Shopify SVG Brand Icon ─── */
const ShopifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

const STORE_TEMPLATES = [
  {
    id: "luxe-fashion",
    title: "Luxury Cosmetics & Skincare",
    prompt: "Create an ultra-luxurious skincare storefront with rose pink accents, sticky cart preview, product grid, customer reviews slider, and Shopify Liquid 2.0 theme compatibility.",
    tag: "Beauty",
    icon: "💄",
  },
  {
    id: "streetwear-booth",
    title: "Minimalist Apparel & Streetwear",
    prompt: "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, dark slate buttons, and Shopify theme sections.",
    tag: "Apparel",
    icon: "👕",
  },
  {
    id: "tech-hardware",
    title: "Cybernetic Tech & Hardware",
    prompt: "Build an industrial tech store for custom hardware, spec comparison tables, instant quote request popover, and Liquid theme templates.",
    tag: "Tech",
    icon: "⚡",
  },
  {
    id: "artisanal-coffee",
    title: "Artisanal Coffee & Roasters",
    prompt: "Create a warm artisanal lifestyle roastery store with recurring subscription plans, customer reviews slider, and full Shopify theme export.",
    tag: "Lifestyle",
    icon: "☕",
  },
];

function BuilderContent() {
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();
  const { theme } = useShopifyTheme();
  const isDark = theme === "dark";

  const [promptText, setPromptText] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTemplate = (prompt: string, name: string) => {
    setPromptText(prompt);
    setStoreName(name);
  };

  const handleLaunchBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsSubmitting(true);
    const newProjectId = `proj-shopify-${Date.now()}`;
    const projectTitle = storeName.trim() || promptText.slice(0, 30) + "...";

    const newProject: ProjectRecord = {
      id: newProjectId,
      user_id: user?.id || "user-architect",
      title: projectTitle,
      prompt: promptText,
      thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };

    const existingProjects = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
    localStorage.setItem("insforge_projects", JSON.stringify([newProject, ...existingProjects]));
    refreshProjectCount();

    setTimeout(() => {
      router.push(`/editor/${newProjectId}?type=shopify&initialPrompt=${encodeURIComponent(promptText)}`);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10 min-h-screen transition-colors duration-500 font-sans">
      {/* ── Studio Top Bar: Obsidian Return Button & Dark Mode Toggle ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          {/* Direct Return Button to Obsidian Website Builder */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Hexagon className="w-4 h-4 fill-slate-900 dark:fill-white text-slate-900 dark:text-white" />
            <span>← Obsidian Website Builder</span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShopifyIcon className="w-3.5 h-3.5 fill-current" />
            <span>Shopify Liquid 2.0 Studio</span>
          </span>
        </div>

        {/* Animated Dark Mode SVG Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">Theme Mode:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── Title Banner ── */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
          <ShopifyIcon className="w-10 h-10 fill-emerald-600 dark:fill-emerald-400 shrink-0" />
          Shopify AI Theme Studio
        </h1>
        <p className="text-sm max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
          Generate production-ready Liquid 2.0 themes with real-time AI streaming, interactive section editing, and instant ZIP export.
        </p>
      </div>

      {/* ── Main Prompt Studio ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Prompt Studio Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Store Prompt Generator</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Gemini 2.5 Flash
              </span>
            </div>

            <form onSubmit={handleLaunchBuilder} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Store Title / Brand Name (Optional)
                </label>
                <Input
                  placeholder="e.g. LuxeAura Cosmetics, Velvet & Vow Apparel..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Store Design Prompt & Concept
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your store vision: layout, color theme, typography, hero banner, featured collection grid, reviews, sticky footer..."
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-medium leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-400">
                  <span>{promptText.length} characters</span>
                  <span>HTML + Tailwind CSS + Liquid 2.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Compiles valid Liquid sections & snippets
                </span>
                <Button
                  type="submit"
                  variant="pink"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Generate Shopify Store
                </Button>
              </div>
            </form>
          </div>

          {/* Preset Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Flame className="w-4 h-4 text-rose-500" />
              Featured Shopify Presets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.prompt, tmpl.title)}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {tmpl.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                    <span>{tmpl.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tmpl.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Canvas Simulation */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Preview Simulation</span>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShopifyIcon className="w-3.5 h-3.5 fill-current" />
                  theme.liquid
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-[9px] border border-emerald-700/40">LIQUID 2.0</span>
              </div>

              <div className="space-y-2 text-center my-auto">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Section: hero.liquid</p>
                <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  {storeName || "Luxury E-Commerce Theme"}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold">
                  <span>Shop Collection →</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2">
                <span>layout/theme.liquid</span>
                <span className="text-emerald-400">✓ Ready for Export</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ShopifyThemeProvider>
      <BuilderContent />
    </ShopifyThemeProvider>
  );
}
