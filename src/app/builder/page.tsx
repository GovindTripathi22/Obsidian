"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
  Star,
} from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

/* ─── Shopify SVG Brand Icon ─── */
const ShopifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

const STORE_TEMPLATES = [
  {
    id: "luxe-fashion",
    title: "Luxury Fashion & Cosmetics",
    prompt: "Create an ultra-luxurious fashion and skincare storefront with rose pink accents, sticky cart preview, product grid, and Shopify Liquid compatibility.",
    tag: "Fashion & Beauty",
    icon: "💄",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "streetwear-booth",
    title: "Minimalist Apparel & Streetwear",
    prompt: "Design a high-contrast minimalist apparel shop with lookbook gallery, custom product filters, dark slate buttons, and Shopify theme sections.",
    tag: "Apparel",
    icon: "👕",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "tech-gadgets",
    title: "3D Tech & Hardware Hub",
    prompt: "Build an industrial tech store for custom hardware, 3D printers, spec comparison tables, and instant quote requests with Liquid theme templates.",
    tag: "Technology",
    icon: "🖨️",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "artisanal-crafts",
    title: "Artisanal Coffee & Lifestyle",
    prompt: "Create a warm artisanal lifestyle brand store with subscription plans, customer reviews slider, custom product cards, and full Shopify theme export.",
    tag: "Lifestyle",
    icon: "☕",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Eye,
    title: "Live Streaming Preview",
    description: "Watch your Shopify store being built in real-time, token-by-token, inside a live canvas iframe.",
    gradient: "from-emerald-600 via-green-600 to-emerald-700",
  },
  {
    icon: Code2,
    title: "Shopify Liquid 2.0 Engine",
    description: "Generates layout/theme.liquid, templates/index.json, sections, and snippets for production Shopify import.",
    gradient: "from-slate-900 via-slate-800 to-indigo-950",
  },
  {
    icon: Wand2,
    title: "ImageKit AI Customizer",
    description: "Real-time background removal, upscaling, and prompt-based asset replacement inside the editor canvas.",
    gradient: "from-pink-500 via-rose-500 to-pink-600",
  },
  {
    icon: Layers,
    title: "Inline Section Editor",
    description: "Click any section to edit text, reorder blocks, duplicate, delete, or run AI-targeted refinement.",
    gradient: "from-indigo-600 via-indigo-700 to-blue-700",
  },
  {
    icon: ShieldCheck,
    title: "Tier Quota & Export Gate",
    description: "Plan-aware usage limits with 2-project Free tier and instant Stripe Pro upgrade integration.",
    gradient: "from-amber-600 via-amber-700 to-orange-700",
  },
  {
    icon: Download,
    title: "One-Click Shopify Export",
    description: "Export production-ready .zip bundles with valid Liquid sections, snippets, and theme.css assets.",
    gradient: "from-emerald-600 via-teal-600 to-emerald-700",
  },
];

export default function BuilderPage() {
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();

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
    const newProjectId = `proj-builder-${Date.now()}`;
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
      router.push(`/editor/${newProjectId}?initialPrompt=${encodeURIComponent(promptText)}`);
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-10 bg-slate-50 min-h-screen">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-4 border-b border-slate-200/90 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            {/* Shopify Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <ShopifyIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>SHOPIFY THEME BUILDER</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 font-mono">OBSIDIAN MODULE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShopifyIcon className="w-8 h-8 text-emerald-600 hidden sm:block" />
              Shopify Theme Builder Studio
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Create, customize, and export production-ready Shopify Liquid 2.0 themes with real-time AI streaming preview, inline section editing, and ImageKit asset transformations.
            </p>
          </div>

          {/* Quota Badge */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {user?.plan === "pro" ? "Pro Subscription" : "Free Tier Quota"}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                {user?.plan === "pro" ? "Unlimited Exports Active" : `${user?.projectCount ?? 0}/2 Projects Used`}
              </p>
            </div>
            {user?.plan !== "pro" && (
              <Link href="/billing" className="ml-2">
                <Button size="sm" variant="pink" className="text-xs px-2.5 py-1">
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Prompt & Config Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Prompt Studio Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 glass-panel-white p-6 shadow-soft-xl bg-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                <ShopifyIcon className="w-4 h-4 text-emerald-600" />
                <span>Store Prompt Generator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400">Gemini 2.5 Flash • Live Stream Engine</span>
              </div>
            </div>

            <form onSubmit={handleLaunchBuilder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Store Title / Brand Name (Optional)
                </label>
                <Input
                  placeholder="e.g. LuxeAura Cosmetics, Velvet & Vow Apparel..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Store Design Instructions & Prompt
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your Shopify theme concept: colors, typography, section order (hero banner, featured products grid, newsletter callout, reviews)..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 resize-none font-medium leading-relaxed"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-400 font-mono">{promptText.length} characters</p>
                  <p className="text-[10px] text-slate-400 font-mono">HTML + Tailwind CSS + Shopify Liquid 2.0</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <ShopifyIcon className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs text-slate-500 font-mono">
                    Generates Liquid 2.0 sections & Tailwind CSS
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="pink"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  leftIcon={<ShopifyIcon className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch Store Workspace
                </Button>
              </div>
            </form>
          </div>

          {/* Preset Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                Featured Shopify Store Presets
              </h2>
              <span className="text-xs font-mono text-slate-400">Click to apply prompt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.prompt, tmpl.title)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${tmpl.badge}`}>
                      {tmpl.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                    <span>{tmpl.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tmpl.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Feature Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Platform Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.gradient} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Projects & Integration Info */}
        <div className="space-y-6">
          {/* Shopify Integration Info Box */}
          <div className="rounded-3xl border border-emerald-200 glass-panel-white p-5 bg-gradient-to-b from-emerald-50/50 to-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <ShopifyIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Shopify Integration</h3>
                <p className="text-[11px] text-emerald-700 font-mono font-semibold">Liquid 2.0 Compatible</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: "Theme Layout", value: "layout/theme.liquid", status: "✓" },
                { label: "Sections", value: "hero, products, footer", status: "✓" },
                { label: "Snippets", value: "product-card.liquid", status: "✓" },
                { label: "Templates", value: "templates/index.json", status: "✓" },
                { label: "Assets", value: "theme.css + Tailwind", status: "✓" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-100">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-mono text-emerald-700 text-[10px]">{item.status} {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent User Projects */}
          <div className="rounded-3xl border border-slate-200 glass-panel-white p-5 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-rose-500" />
                <span>Recent Workspaces</span>
              </h3>
              <Link href="/projects" className="text-[11px] font-bold text-rose-600 hover:text-rose-700">
                View All →
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <ShopifyIcon className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  No recent stores yet.
                </p>
                <p className="text-[11px] text-slate-500">
                  Create your first Shopify store workspace above.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/editor/${proj.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 transition-colors group text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {proj.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        ID: {proj.id}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Tech Stack Badge Grid */}
          <div className="rounded-3xl border border-slate-200 p-5 bg-white space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>Tech Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js 16", "React 19", "Tailwind v4", "Gemini AI", "InsForge", "ImageKit", "Stripe", "Liquid 2.0"].map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quota Exceeded Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-rose-200 p-6 space-y-6 bg-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Project Quota Limit Reached</h3>
                <p className="text-xs text-slate-500">Free Tier Limit: 2/2 Projects</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              You have reached your Free account limit of 2 project stores. Upgrade to Pro for unlimited store creation and Shopify Liquid theme export downloads.
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
