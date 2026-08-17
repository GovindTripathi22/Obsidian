"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { createProject, canCreateProject } from "@/lib/projects";
import { QuotaLimitModal } from "@/components/ui/QuotaLimitModal";

const SUGGESTIONS = [
  {
    label: "SaaS Landing",
    prompt: "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern luxury monochrome noir theme with high-contrast typography, pure white accents, and deep dark surfaces.",
  },
  {
    label: "Design Portfolio",
    prompt: "Design a minimalist portfolio for a Product Designer. The hero section should have a large, bold introduction. Below that, create a masonry grid gallery of project case studies with hover effects. Include an 'About Me' section with a photo placeholder and a skills list. End with a clean contact form. Use plenty of whitespace and large typography.",
  },
  {
    label: "Coffee Shop",
    prompt: "Build a cozy, inviting website for an artisanal coffee shop. Use a warm color palette (rich dark tones, warm espresso, creams, and silver highlights). Include a hero section with a video background placeholder, a menu section with prices, an 'Our Story' section with image placeholders, and a footer with location and hours. Use a serif font for headings to give it a classic feel.",
  },
  {
    label: "Waitlist Page",
    prompt: "Create a viral waitlist page for a stealth startup. The design should be hype-driven and futuristic. Center the email capture form and make it the focal point. Add a countdown timer placeholder. Include a 'Why Join?' section with exclusive benefits. Use a dark background with subtle glow effects.",
  },
];

export function LandingPageClient() {
  const [inputValue, setInputValue] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { user, getProjectStats } = useAuth();
  const stats = getProjectStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!canCreateProject(stats.isPro)) {
      setShowQuotaModal(true);
      return;
    }

    const projectId = `proj-obsidian-${Date.now()}`;
    createProject({
      id: projectId,
      userId: user?.id || "guest",
      title: inputValue.slice(0, 40) + "...",
      prompt: inputValue,
      type: "website",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    });

    router.push(`/editor/${projectId}?type=website&initialPrompt=${encodeURIComponent(inputValue)}`);
  };

  const handleEnhance = async () => {
    if (!inputValue.trim() || isEnhancing) return;
    const original = inputValue;
    setIsEnhancing(true);
    setInputValue("Enhancing your prompt...");
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
    <main className="flex flex-col items-center justify-center px-4 pt-20 md:pt-32 pb-24 smooth-gpu page-transition-enter">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <p className="text-sm text-neutral-500 tracking-wide">
          AI-powered website generation
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          Build websites{" "}
          <span className="font-serif italic text-neutral-300">beautifully</span>
        </h1>

        <p className="text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Describe what you want. Watch it come to life in real-time.
          Export production-ready code.
        </p>

        {/* Quota */}
        {mounted && (
          <div className="inline-flex items-center gap-2 text-xs text-neutral-500">
            <span>
              {stats.isPro
                ? "Pro — Unlimited"
                : `${stats.totalCount} of 3 projects used`}
            </span>
            {!stats.isPro && (
              <Link href="/billing" className="text-white hover:underline underline-offset-4">
                Upgrade
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="w-full max-w-xl mt-10 relative">
        <form onSubmit={handleSubmit}>
          <textarea
            name="prompt"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your website..."
            className="w-full min-h-[120px] resize-none rounded-2xl border border-neutral-800 bg-neutral-900/50 px-5 pt-5 pb-14 text-[15px] text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-0 focus:outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim()) handleSubmit(e as any);
              }
            }}
          />

          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              title="Enhance with AI"
              disabled={!inputValue.trim() || isEnhancing}
              onClick={handleEnhance}
              className="h-9 w-9 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="h-9 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-colors flex items-center gap-1.5 text-sm font-medium disabled:opacity-30 cursor-pointer"
            >
              Generate
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => setInputValue(s.prompt)}
            className="px-3 py-1.5 rounded-full border border-neutral-800 text-xs text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Shopify Studio Link */}
      <div className="mt-16 w-full max-w-xl">
        <Link
          href="/builder"
          className="group flex items-center justify-between p-5 rounded-2xl border border-neutral-800/60 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">Shopify Theme Studio</p>
            <p className="text-xs text-neutral-500">
              Generate Liquid 2.0 themes with live preview and ZIP export
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px max-w-3xl mx-auto w-full border border-neutral-800/60 rounded-2xl overflow-hidden">
        {[
          {
            title: "Real-time streaming",
            desc: "Watch your site generate live, token by token. Powered by Gemini 2.5 Flash.",
          },
          {
            title: "Visual editing",
            desc: "Click any element to edit text, colors, and layout directly on the canvas.",
          },
          {
            title: "Clean export",
            desc: "Download production HTML + CSS. No vendor lock-in, no bloat.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 bg-neutral-900/30 hover:bg-neutral-900/60 transition-colors"
          >
            <h3 className="text-sm font-medium text-white mb-2">{f.title}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <QuotaLimitModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        currentCount={stats.totalCount}
        maxCount={3}
        manageProjectsHref="/projects?tab=website"
      />
    </main>
  );
}
