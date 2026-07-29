"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  Plus,
  ArrowRight,
  ShoppingBag,
  Paperclip,
  Crown,
  Zap,
  CheckCircle2,
  Wand2,
  Code2,
  Bot,
  Flame,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const SUGGESTIONS = [
  {
    id: "cosmetics",
    title: "Cosmetics & Beauty Store",
    prompt: "Create a luxurious cosmetics and skincare e-commerce store with pastel pink accents, soft glow backgrounds, product grids, and customer reviews.",
    tag: "Fashion & Beauty",
    icon: "💄",
    badgeColor: "border-pink-200 text-pink-700 bg-pink-50",
  },
  {
    id: "apparel",
    title: "Minimalist Streetwear Shop",
    prompt: "Design a sleek minimalist apparel and streetwear boutique with dark monochrome aesthetics, high-res lookbooks, and sticky cart preview.",
    tag: "Apparel",
    icon: "👕",
    badgeColor: "border-indigo-200 text-indigo-700 bg-indigo-50",
  },
  {
    id: "tech3d",
    title: "3D Printing & Filament Hub",
    prompt: "Build an industrial tech store for 3D printers, custom filament materials, interactive spec tables, and instant quote generator.",
    tag: "Technology",
    icon: "🖨️",
    badgeColor: "border-slate-200 text-slate-700 bg-slate-100",
  },
];

const FEATURES_3D = [
  {
    icon: Code2,
    title: "Liquid 2.0 Theme Compiler",
    description: "Converts flat HTML into layout/theme.liquid, templates, sections, and snippets automatically.",
    color: "from-slate-900 to-indigo-900",
  },
  {
    icon: Wand2,
    title: "ImageKit AI Transformations",
    description: "Real-time bg removal, upscaling, drop shadows, and prompt-to-image placeholders.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Stripe Tier Quotas",
    description: "Enforces project-level quotas and gated exports with instant checkout billing portal.",
    color: "from-emerald-600 to-teal-600",
  },
  {
    icon: Bot,
    title: "Gemini 2.5 Streaming Engine",
    description: "Streams full responsive Tailwind CSS layouts and code chunks to the live iframe canvas.",
    color: "from-indigo-600 to-blue-600",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();
  const [promptText, setPromptText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockAttachment, setMockAttachment] = useState<string | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Parallax 3D tilt calculations
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate bounds: max 6 deg
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleSuggestionClick = (prompt: string) => {
    setPromptText(prompt);
  };

  const handleMockAttachment = () => {
    setMockAttachment("reference-design-mockup.png");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const existingProjects = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
    const currentCount = Math.max(existingProjects.length, user?.projectCount || 0);

    if (user?.plan !== "pro" && currentCount >= 2) {
      setShowQuotaModal(true);
      return;
    }

    setIsSubmitting(true);
    const newProjectId = `proj-${Date.now()}`;
    
    const newProject = {
      id: newProjectId,
      user_id: user?.id || "guest",
      title: promptText.slice(0, 35) + "...",
      prompt: promptText,
      created_at: new Date().toISOString(),
    };
    
    const updatedProjects = [newProject, ...existingProjects];
    localStorage.setItem("insforge_projects", JSON.stringify(updatedProjects));
    refreshProjectCount();

    setTimeout(() => {
      router.push(`/editor/${newProjectId}?initialPrompt=${encodeURIComponent(promptText)}`);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 max-w-6xl mx-auto w-full relative overflow-hidden bg-slate-50">
      {/* Subtle Pastel Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-100/50 rounded-full blur-[120px] pointer-events-none animate-float-reverse" />

      <div className="space-y-12 my-auto relative z-10">
        {/* Title Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill-white text-xs font-semibold text-slate-700 shadow-sm border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>STITCHSTORE AI • WHITE EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Build Modern <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent underline decoration-pink-500 decoration-wavy decoration-2">Shopify Stores</span> in Seconds
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Enter your store instructions below. StitchStore AI streams Liquid themes, Tailwind CSS styling, and ImageKit assets into a live preview canvas.
          </p>
        </div>

        {/* Central 3D Interactive Parallax Prompt Input Card (White Theme) */}
        <div className="perspective-1000">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="rounded-3xl border border-slate-200/90 glass-panel-white p-4 sm:p-5 shadow-soft-2xl relative group bg-white/90"
          >
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div className="relative">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. Create a luxury cosmetics store with pastel pink accents, interactive hero slider, product grid, and Shopify cart..."
                  rows={4}
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base resize-none focus:outline-none p-3 font-medium"
                />

                {/* Character Counter */}
                <div className="absolute right-3 top-3 text-[10px] font-mono text-slate-400">
                  {promptText.length} chars
                </div>
              </div>

              {/* Mock attachment indicator */}
              {mockAttachment && (
                <div className="mx-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-mono animate-in fade-in">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{mockAttachment}</span>
                  <button
                    type="button"
                    onClick={() => setMockAttachment(null)}
                    className="text-slate-400 hover:text-slate-900 ml-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 px-2">
                <button
                  type="button"
                  onClick={handleMockAttachment}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 text-pink-500" />
                  <span>Attach Reference Mockup</span>
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Generate Shopify Store
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 3D Template Suggestion Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2 font-semibold">
              <Flame className="w-4 h-4 text-pink-500" /> Pre-Configured Template Prompts
            </p>
            <span className="text-xs font-mono text-slate-500">Click to auto-fill</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUGGESTIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSuggestionClick(item.prompt)}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-slate-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors mb-1.5 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Features Pipeline Grid */}
        <div className="pt-8 border-t border-slate-200/80">
          <div className="text-center mb-8 space-y-1">
            <h2 className="text-2xl font-black text-slate-900">End-to-End E-Commerce Engine</h2>
            <p className="text-xs text-slate-500 font-mono">Four integrated subsystems powering your generated stores</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES_3D.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 shadow-sm`}>
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-slate-900">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quota Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-amber-300 p-6 space-y-6 bg-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Free Project Quota Reached</h3>
                <p className="text-xs text-slate-500">Free tier limit: 2/2 projects created</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              You have reached your free account limit of 2 projects. Upgrade to Pro to unlock unlimited store generation and full Shopify Liquid theme exports.
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
                Upgrade to Pro ($9.99/mo)
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
