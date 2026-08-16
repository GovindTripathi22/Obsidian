"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Zap, Hexagon, AlertTriangle, CreditCard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

const ShopifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

const SUGGESTIONS = [
  {
    label: "Landing Page for SaaS",
    prompt: "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern dark theme with emerald accents and Inter typography.",
  },
  {
    label: "Portfolio for Designer",
    prompt: "Design a minimalist portfolio for a Product Designer. The hero section should have a large, bold introduction. Below that, create a masonry grid gallery of project case studies with hover effects. Include an 'About Me' section with a photo placeholder and a skills list. End with a clean contact form. Use plenty of whitespace and large typography.",
  },
  {
    label: "Coffee Shop Website",
    prompt: "Build a cozy, inviting website for an artisanal coffee shop. Use a warm color palette (browns, creams, earthly greens). Include a hero section with a video background placeholder, a menu section with prices, an 'Our Story' section with image placeholders, and a footer with location and hours. Use a serif font for headings to give it a classic feel.",
  },
  {
    label: "Viral Waitlist Page",
    prompt: "Create a viral waitlist page for a stealth startup. The design should be hype-driven and futuristic. Center the email capture form and make it the focal point. Add a countdown timer placeholder. Include a 'Why Join?' section with exclusive benefits. Use a dark background with neon gradients and glow effects.",
  },
];

const QUALITY_TIERS = [
  { value: "low", label: "Low (Lite, Fast)" },
  { value: "medium", label: "Medium (Balanced)" },
  { value: "high", label: "High (Pro, Reasoning)" },
];

export function LandingPageClient() {
  const [inputValue, setInputValue] = useState("");
  const [qualityTier, setQualityTier] = useState<"low" | "medium" | "high">("medium");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const router = useRouter();
  const { user, refreshProjectCount, getProjectStats } = useAuth();
  const stats = getProjectStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Enforce 3-project limit on Free Plan
    if (stats.isLimitReached) {
      setShowQuotaModal(true);
      return;
    }

    const projectId = `proj-obsidian-${Date.now()}`;
    const newProject = {
      id: projectId,
      user_id: user?.id || "guest",
      title: inputValue.slice(0, 40) + "...",
      prompt: inputValue,
      thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("obsidian_website_projects") || "[]");
    localStorage.setItem("obsidian_website_projects", JSON.stringify([newProject, ...existing]));
    refreshProjectCount();
    router.push(`/editor/${projectId}?type=website&initialPrompt=${encodeURIComponent(inputValue)}`);
  };

  const handleEnhance = async () => {
    if (!inputValue.trim() || isEnhancing) return;
    const original = inputValue;
    setIsEnhancing(true);
    setInputValue("✨ Enhancing your prompt with AI architecture...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Rewrite and enhance this website prompt to be more detailed, structured, and precise for an AI website builder: "${original}"`,
          projectId: "enhance",
          pageName: "prompt-enhance",
        }),
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let enhanced = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          enhanced += decoder.decode(value, { stream: true });
        }
        setInputValue(enhanced.trim() || original);
      } else {
        setInputValue(original);
      }
    } catch {
      setInputValue(original);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 pt-16 md:pt-28 pb-20 smooth-gpu page-transition-enter">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-xl shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          <span className="font-mono">Obsidian AI Engine v2.5 Active</span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
          Craft Code from Chaos.
        </h1>

        <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Generate production-ready websites and landing pages with a single prompt.
          Edit visually with real-time streaming. Export clean code.
        </p>

        {/* Plan Quota Indicator */}
        <div className="inline-flex items-center gap-2 text-xs font-mono bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full shadow-md">
          <span className="text-zinc-400">Quota:</span>
          <span className={stats.isLimitReached ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
            {stats.isPro ? "Pro (Unlimited)" : `${stats.totalCount}/3 Free Projects`}
          </span>
          {!stats.isPro && (
            <Link href="/billing" className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 border-l border-zinc-700 pl-2">
              Upgrade to Pro →
            </Link>
          )}
        </div>
      </div>

      {/* Main Prompt Input */}
      <div className="w-full max-w-2xl mt-10 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-zinc-700/40 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className="relative">
          <form onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your dream website or SaaS product... (e.g. 'A high-converting B2B SaaS landing page with dark theme, pricing table, and feature cards')"
              className="min-h-[140px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950/90 pt-6 px-6 pb-16 text-base text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none shadow-2xl backdrop-blur-2xl transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim()) handleSubmit(e as any);
                }
              }}
            />

            {/* Bottom bar: Tier selector left, action buttons right */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider pl-1.5">Tier:</span>
              <select
                value={qualityTier}
                onChange={(e) => {
                  const val = e.target.value as "low" | "medium" | "high";
                  setQualityTier(val);
                  localStorage.setItem("obsidian_model_tier", val);
                }}
                className="bg-transparent border-0 text-zinc-300 text-[10px] font-mono focus:outline-none cursor-pointer pr-4 py-0.5"
              >
                {QUALITY_TIERS.map((t) => (
                  <option key={t.value} value={t.value} className="bg-zinc-950 text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              {/* Enhance prompt button */}
              <button
                type="button"
                title="Enhance Prompt with AI"
                disabled={!inputValue.trim() || isEnhancing}
                onClick={handleEnhance}
                className="h-10 w-10 rounded-xl bg-zinc-900 text-emerald-400 hover:bg-zinc-800 hover:text-emerald-300 transition-all border border-emerald-500/30 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className={`h-4 w-4 ${isEnhancing ? "animate-spin" : ""}`} />
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="h-10 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center font-bold text-xs gap-1.5 disabled:opacity-40 cursor-pointer shadow-lg"
              >
                <span>Generate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2.5 max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => setInputValue(s.prompt)}
            className="px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Seamless Switch to Shopify Studio Callout Card ── */}
      <div className="mt-14 w-full max-w-2xl">
        <Link
          href="/builder"
          className="group block p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-zinc-950/90 to-emerald-950/70 hover:from-emerald-950/90 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/60"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/40 group-hover:scale-105 transition-all shrink-0 shadow-lg shadow-emerald-950/50">
                <ShopifyIcon className="w-6 h-6 fill-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold text-white font-heading">Shopify AI Theme Studio</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    DEDICATED STUDIO
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Switch to the dedicated Shopify Liquid 2.0 Theme Generator with live cart drawer simulation, section schema inspector, and 1-click ZIP export.
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 group-hover:translate-x-1 transition-all shrink-0">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        {[
          {
            title: "Streaming AI Synthesis",
            desc: "Powered by Gemini 2.5 Flash for sub-second token streaming and real-time live preview rendering.",
            icon: "✦",
          },
          {
            title: "Live Visual Inspection",
            desc: "Click and edit any section directly on the live canvas with instant CSS styling and text editing.",
            icon: "⬡",
          },
          {
            title: "Clean Production Export",
            desc: "Download complete production HTML + Tailwind CSS zip bundles or publish live in seconds.",
            icon: "↓",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 group"
          >
            <p className="text-2xl font-black text-emerald-400 mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</p>
            <h3 className="text-base font-bold text-white mb-2 font-heading">{f.title}</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Quota Limit Exceeded Modal (Limit of 3 Enforced) ── */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Free Quota Limit Reached</h3>
                <p className="text-xs text-zinc-400">3/3 Free projects currently used</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              You have reached the maximum limit of <strong>3 free projects</strong> on your current tier.
              Upgrade to <strong>Obsidian Pro</strong> for unlimited Shopify & Website generations, or delete old projects in your workspace.
            </p>

            <div className="space-y-2 pt-2">
              <Link href="/billing" className="block w-full">
                <Button
                  size="md"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Upgrade to Pro ($19/mo) →
                </Button>
              </Link>

              <div className="flex gap-2">
                <Link href="/projects?tab=website" className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs"
                  >
                    Manage Projects
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowQuotaModal(false)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
