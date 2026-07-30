"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ShopifyThemeProvider, useShopifyTheme } from "@/components/providers/ShopifyThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Sparkles,
  Wand2,
  Code2,
  Crown,
  ArrowRight,
  ExternalLink,
  Layers,
  Zap,
  FolderKanban,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Palette,
  Download,
  CheckCircle2,
  Sliders,
  Smartphone,
  Monitor,
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
    title: "Luxury Skincare & Cosmetics",
    prompt: "Create an ultra-luxurious skincare storefront with rose pink accents, sticky cart preview, product grid, customer reviews slider, and Shopify Liquid 2.0 theme compatibility.",
    tag: "Luxury Beauty",
    icon: "💄",
    badgeLight: "bg-rose-50 text-rose-700 border-rose-200",
    badgeDark: "bg-rose-950/80 text-rose-300 border-rose-800/80",
  },
  {
    id: "streetwear-booth",
    title: "Minimalist Apparel & Streetwear",
    prompt: "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, dark slate buttons, and Shopify theme sections.",
    tag: "Streetwear",
    icon: "👕",
    badgeLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    badgeDark: "bg-indigo-950/80 text-indigo-300 border-indigo-800/80",
  },
  {
    id: "tech-hardware",
    title: "Cybernetic Tech & Hardware",
    prompt: "Build an industrial tech store for custom hardware, spec comparison tables, instant quote request popover, and Liquid theme templates.",
    tag: "Technology",
    icon: "⚡",
    badgeLight: "bg-slate-100 text-slate-700 border-slate-200",
    badgeDark: "bg-slate-800/80 text-slate-300 border-slate-700/80",
  },
  {
    id: "artisanal-coffee",
    title: "Artisanal Coffee & Roasters",
    prompt: "Create a warm artisanal lifestyle roastery store with recurring subscription plans, customer reviews slider, and full Shopify theme export.",
    tag: "Lifestyle",
    icon: "☕",
    badgeLight: "bg-amber-50 text-amber-700 border-amber-200",
    badgeDark: "bg-amber-950/80 text-amber-300 border-amber-800/80",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Eye,
    title: "Real-Time Streaming Canvas",
    description: "Watch your Shopify store built token-by-token in live streaming iframe preview.",
    accent: "from-emerald-500 to-green-600",
  },
  {
    icon: Code2,
    title: "Liquid 2.0 Engine",
    description: "Generates layout/theme.liquid, templates/index.json, sections, and snippets.",
    accent: "from-indigo-500 to-slate-700",
  },
  {
    icon: Wand2,
    title: "ImageKit AI Transformations",
    description: "Real-time background removal, upscaling, and prompt-based asset replacement.",
    accent: "from-pink-500 to-rose-600",
  },
  {
    icon: Sliders,
    title: "Inline Section Inspector",
    description: "Click sections to reorder, duplicate, edit text, or trigger targeted AI refinements.",
    accent: "from-purple-500 to-indigo-600",
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
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [recentProjects, setRecentProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("insforge_projects");
    if (saved) {
      try {
        setRecentProjects(JSON.parse(saved).slice(0, 3));
      } catch {
        setRecentProjects([]);
      }
    }
  }, []);

  const handleSelectTemplate = (prompt: string, name: string) => {
    setPromptText(prompt);
    setStoreName(name);
  };

  const handleLaunchBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const existingProjects = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
    const currentCount = Math.max(existingProjects.length, user?.projectCount || 0);

    if (user?.plan !== "pro" && currentCount >= 2) {
      setShowQuotaModal(true);
      return;
    }

    setIsSubmitting(true);
    const newProjectId = `proj-shopify-${Date.now()}`;
    const projectTitle = storeName.trim() || promptText.slice(0, 30) + "...";

    const newProject: ProjectRecord = {
      id: newProjectId,
      user_id: user?.id || "guest-builder",
      title: projectTitle,
      prompt: promptText,
      thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };

    const updatedProjects = [newProject, ...existingProjects];
    localStorage.setItem("insforge_projects", JSON.stringify(updatedProjects));
    refreshProjectCount();

    setTimeout(() => {
      router.push(`/editor/${newProjectId}?type=shopify&initialPrompt=${encodeURIComponent(promptText)}`);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10 min-h-screen transition-colors duration-500">
      {/* ── Studio Top Navigation & Theme Toggle Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-6">
        <div className="space-y-2">
          {/* Official Shopify Brand Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShopifyIcon className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
            <span className="font-bold tracking-wide">SHOPIFY THEME STUDIO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] opacity-80">Liquid 2.0 Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            Shopify AI Theme Studio
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
            Generate, preview, and export high-converting Shopify Liquid themes with real-time AI streaming, interactive section editing, and ImageKit asset rendering.
          </p>
        </div>

        {/* Action Controls & Dark/Light Animated Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">Theme:</span>
            <ThemeToggle />
          </div>

          {/* User Quota Status Badge */}
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Crown className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold">{user?.plan === "pro" ? "Pro Plan" : "Free Plan"}</p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {user?.plan === "pro" ? "Unlimited Exports" : `${user?.projectCount ?? 0}/2 Stores`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Studio Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Prompt Studio Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                <ShopifyIcon className="w-4 h-4 fill-current" />
                <span>Store Prompt Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Gemini 2.5 Flash • Streaming</span>
              </div>
            </div>

            <form onSubmit={handleLaunchBuilder} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Store Title / Brand Name (Optional)
                </label>
                <Input
                  placeholder="e.g. LuxeAura Cosmetics, Velvet & Vow Apparel..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  Store Concept & Design Prompt
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your Shopify store concept: colors, typography, hero section, product grid layout, customer reviews, newsletter popup..."
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-medium leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-400">
                  <span>{promptText.length} characters</span>
                  <span>HTML + Tailwind + Shopify Liquid 2.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Outputs valid ZIP with Liquid sections & CSS
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="pink"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-lg shadow-emerald-700/20"
                >
                  Generate Shopify Store
                </Button>
              </div>
            </form>
          </div>

          {/* ── Preset Templates Grid ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Flame className="w-4 h-4 text-rose-500" />
                Curated Shopify Store Presets
              </h2>
              <span className="text-xs font-mono text-slate-400">Click to load prompt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.prompt, tmpl.title)}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${isDark ? tmpl.badgeDark : tmpl.badgeLight}`}>
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

        {/* Right Column: Live Mockup Canvas & Tech Specs */}
        <div className="space-y-6">
          {/* Live Shopify Preview Mockup Widget */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Shopify Live Canvas Simulation</span>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-slate-950 to-indigo-950/40" />
              
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-emerald-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShopifyIcon className="w-3.5 h-3.5 fill-current" />
                  theme.liquid
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-[9px] border border-emerald-700/40">LIQUID 2.0</span>
              </div>

              <div className="relative z-10 space-y-2 text-center my-auto">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Section: hero.liquid</p>
                <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  {storeName || "Luxury E-Commerce Theme"}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold">
                  <span>Shop Collection →</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2">
                <span>layout/theme.liquid</span>
                <span className="text-emerald-400">✓ Ready for Export</span>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500" />
              Engine Features
            </h3>
            <div className="space-y-3">
              {PLATFORM_FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${feat.accent} text-white flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{feat.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quota Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-rose-200 dark:border-rose-900 p-6 space-y-6 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Project Quota Limit Reached</h3>
                <p className="text-xs text-slate-500">Free Tier Limit: 2/2 Projects</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Upgrade to Pro for unlimited Shopify store creation and theme ZIP exports.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowQuotaModal(false)}>
                Cancel
              </Button>
              <Button
                variant="pink"
                onClick={() => {
                  setShowQuotaModal(false);
                  router.push("/billing");
                }}
                leftIcon={<Crown className="w-4 h-4" />}
              >
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        </div>
      )}
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
