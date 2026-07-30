"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
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
    label: "Waitlist Page",
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
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const projectId = `proj-obsidian-${Date.now()}`;
    const newProject = {
      id: projectId,
      user_id: user?.id || "guest",
      title: inputValue.slice(0, 40) + "...",
      prompt: inputValue,
      thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
    localStorage.setItem("insforge_projects", JSON.stringify([newProject, ...existing]));
    refreshProjectCount();
    router.push(`/editor/${projectId}?initialPrompt=${encodeURIComponent(inputValue)}`);
  };

  const handleEnhance = async () => {
    if (!inputValue.trim() || isEnhancing) return;
    const original = inputValue;
    setIsEnhancing(true);
    setInputValue("✨ Enhancing your prompt with AI...");
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
    <main className="flex flex-col items-center justify-center px-4 pt-20 md:pt-32 pb-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          v1.0 Public Beta
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
          Craft Code from Chaos.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Generate production-ready websites with a single prompt.
          Edit visually. Export clean code.
        </p>
      </div>

      {/* Main Prompt Input */}
      <div className="w-full max-w-2xl mt-12 relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative">
          <form onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your dream website... (e.g., 'A minimalist portfolio for a photographer with a dark theme')"
              className="min-h-[140px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/80 pt-6 px-6 pb-16 text-base text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none shadow-2xl backdrop-blur-xl transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim()) handleSubmit(e as any);
                }
              }}
            />

            {/* Bottom bar: Tier selector left, action buttons right */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
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
                className="h-10 w-10 rounded-lg bg-zinc-800 text-emerald-400 hover:bg-zinc-700 hover:text-emerald-300 transition-all border border-emerald-500/20 flex items-center justify-center disabled:opacity-40"
              >
                <Sparkles className={`h-5 w-5 ${isEnhancing ? "animate-spin" : ""}`} />
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="h-10 w-10 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center disabled:opacity-40"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => setInputValue(s.prompt)}
            className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Shopify Theme Builder Callout Card ── */}
      <div className="mt-16 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
        <Link
          href="/builder"
          className="group block p-6 rounded-2xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/60 via-zinc-950/80 to-emerald-950/60 hover:from-emerald-950/80 hover:border-emerald-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-700/30 border border-emerald-600/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-700/50 transition-colors shrink-0">
                <ShopifyIcon className="w-6 h-6 fill-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-white">Shopify Theme Builder Studio</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-700/30">
                    NEW MODULE
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Generate Liquid 2.0 themes with real-time AI streaming, inline editing, ImageKit transforms & one-click Shopify ZIP export.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        {[
          {
            title: "AI Generation",
            desc: "Powered by Gemini 2.5 Flash for intelligent code synthesis from any text prompt.",
            icon: "✦",
          },
          {
            title: "Live Visual Editing",
            desc: "Click and edit any section directly on the live canvas with real-time streaming preview.",
            icon: "⬡",
          },
          {
            title: "Clean Code Export",
            desc: "Get production-ready HTML + Tailwind or full Shopify Liquid 2.0 theme ZIP packages.",
            icon: "↓",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors group"
          >
            <p className="text-3xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">{f.icon}</p>
            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
