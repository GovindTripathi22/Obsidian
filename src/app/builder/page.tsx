"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BuilderSwitcher } from "@/components/ui/BuilderSwitcher";
import {
  ArrowRight,
  Flame,
  ArrowUpRight,
  Hexagon,
  Sparkles,
  Zap,
  Layers,
  Code2,
  Sliders,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

/* ── Official Shopify SVG Brand Icon ── */
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
    tag: "Beauty & Cosmetics",
    icon: "💄",
  },
  {
    id: "streetwear-booth",
    title: "Minimalist Apparel & Streetwear",
    prompt: "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, dark slate buttons, and Shopify theme sections.",
    tag: "Apparel & Streetwear",
    icon: "👕",
  },
  {
    id: "tech-hardware",
    title: "Cybernetic Tech & Hardware",
    prompt: "Build an industrial tech store for custom hardware, spec comparison tables, instant quote request popover, and Liquid theme templates.",
    tag: "Electronics & Tech",
    icon: "⚡",
  },
  {
    id: "artisanal-coffee",
    title: "Artisanal Coffee & Roasters",
    prompt: "Create a warm artisanal lifestyle roastery store with recurring subscription plans, customer reviews slider, and full Shopify theme export.",
    tag: "Lifestyle & Food",
    icon: "☕",
  },
];

export default function BuilderPage() {
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();

  const [promptText, setPromptText] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Fashion & Beauty");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Fashion & Beauty",
    "Streetwear",
    "Electronics",
    "Artisanal & Coffee",
    "Jewelry & Watches",
  ];

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
    }, 350);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10 min-h-screen font-sans bg-zinc-950 text-zinc-100">
      {/* ── Studio Top Toolbar: Dual-Mode Switcher ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <ShopifyIcon className="w-6 h-6 fill-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Shopify Theme Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Liquid 2.0
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">Specialized E-Commerce AI Architecture</p>
          </div>
        </div>

        {/* Prominent Builder Switcher */}
        <div className="flex items-center gap-3">
          <BuilderSwitcher active="shopify" size="md" />
        </div>
      </div>

      {/* ── Studio Hero Banner ── */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Shopify Liquid Theme Generator</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight flex items-center gap-3 text-white">
          Architect High-Converting Shopify Stores.
        </h1>
        <p className="text-sm max-w-2xl leading-relaxed text-zinc-400">
          Generate complete Shopify Liquid 2.0 themes with real-time streaming preview, customizable sections, schema settings, and one-click production ZIP export.
        </p>
      </div>

      {/* ── Main Studio Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Prompt Studio Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-emerald-400 uppercase">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Shopify Liquid Prompt Engine</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Gemini 2.5 Flash • Streaming
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Store Niche / Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60"
                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700/60 border border-zinc-700/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLaunchBuilder} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 text-zinc-300">
                  Store Title / Brand Name (Optional)
                </label>
                <Input
                  placeholder="e.g. LuxeAura Cosmetics, Velvet & Vow Apparel..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 text-zinc-300">
                  Store Design Prompt & Liquid Requirements
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your Shopify store concept: layout, color theme, typography, hero banner, featured collection grid, customer reviews slider, sticky cart..."
                  rows={5}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none font-medium leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-500">
                  <span>{promptText.length} characters</span>
                  <span>Compiles Liquid 2.0 sections + JSON Schema + CSS</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ready for 1-Click Shopify ZIP Export</span>
                </div>
                <Button
                  type="submit"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 font-bold"
                >
                  Generate Shopify Store
                </Button>
              </div>
            </form>
          </div>

          {/* Curated Preset Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-heading font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-zinc-400">
              <Flame className="w-4 h-4 text-rose-500" />
              Curated Shopify Theme Presets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.prompt, tmpl.title)}
                  className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/90 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-800 text-zinc-300 font-semibold">
                      {tmpl.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold group-hover:text-emerald-400 transition-colors flex items-center justify-between text-zinc-100">
                    <span>{tmpl.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {tmpl.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Canvas Simulation */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Liquid 2.0 Live Simulation</span>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-slate-950 p-4 border border-zinc-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 border-b border-zinc-800/50 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShopifyIcon className="w-3.5 h-3.5 fill-current" />
                  theme.liquid
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-[9px] border border-emerald-700/40">LIQUID 2.0</span>
              </div>

              <div className="space-y-2 text-center my-auto">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Section: hero.liquid</p>
                <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  {storeName || "Luxury E-Commerce Theme"}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold">
                  <span>Shop Collection →</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-800/50 pt-2">
                <span>layout/theme.liquid</span>
                <span className="text-emerald-400">✓ Ready for Export</span>
              </div>
            </div>
          </div>

          {/* Engine Architecture Details */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Shopify Liquid Architecture
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-mono text-[11px]">layout/theme.liquid</span>
                <span className="text-[10px] text-emerald-400 font-bold">Main Shell</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-mono text-[11px]">templates/index.json</span>
                <span className="text-[10px] text-emerald-400 font-bold">Sections Map</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-mono text-[11px]">sections/*.liquid</span>
                <span className="text-[10px] text-emerald-400 font-bold">Modular Blocks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
