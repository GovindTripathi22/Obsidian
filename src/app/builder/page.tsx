"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ShoppingBag,
  Sparkles,
  Wand2,
  Code2,
  Crown,
  ArrowRight,
  Plus,
  ExternalLink,
  Layers,
  Zap,
  CheckCircle2,
  FolderKanban,
  Flame,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

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

const OBSIDIAN_MODULES = [
  {
    icon: Code2,
    title: "Shopify Liquid 2.0 Engine",
    description: "Compiles layout/theme.liquid, templates/index.json, sections, and snippets into standard theme packages.",
    gradient: "from-slate-900 via-slate-800 to-indigo-950",
  },
  {
    icon: Wand2,
    title: "ImageKit AI Customizer",
    description: "Perform real-time background removal, upscaling, and prompt-based asset replacement inside the editor.",
    gradient: "from-pink-500 via-rose-500 to-pink-600",
  },
  {
    icon: Layers,
    title: "Obsidian Workspace Sync",
    description: "Seamlessly map generated store sections to project tree records with multi-page tabs and code sync.",
    gradient: "from-indigo-600 via-indigo-700 to-blue-700",
  },
  {
    icon: ShieldCheck,
    title: "Tier Quota & Export Gate",
    description: "Preserves user plan restrictions with 2-project Free limits and instant Stripe checkout integration.",
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
      } catch (e) {
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

    // Check project quota
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
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <ShoppingBag className="w-3.5 h-3.5 text-rose-500" />
              <span>SHOPIFY STORE BUILDER • OBSIDIAN MODULE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Shopify Theme Builder Studio
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Create, customize, and export production-ready Shopify Liquid 2.0 themes styled with White Stitch design system tokens.
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
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Store Prompt Generator</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Gemini 2.5 Flash Engine</span>
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
                  placeholder="Describe your Shopify theme concept in detail: colors, typography, section order (hero banner, featured products grid, newsletter callout, reviews)..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 font-mono">
                  Generates Liquid 2.0 sections & Tailwind CSS
                </p>
                <Button
                  type="submit"
                  variant="pink"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!promptText.trim()}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch Shopify Store Workspace
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
              <span className="text-xs font-mono text-slate-400">Click to apply</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.prompt, tmpl.title)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${tmpl.badge}`}>
                      {tmpl.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center justify-between">
                    <span>{tmpl.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tmpl.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Subsystem Overview & Recent Stores */}
        <div className="space-y-6">
          {/* Obsidian Integration Info Box */}
          <div className="rounded-3xl border border-slate-200 glass-panel-white p-5 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Obsidian Builder Integration</h3>
                <p className="text-[11px] text-slate-500 font-mono">Unified Module Subsystems</p>
              </div>
            </div>

            <div className="space-y-3">
              {OBSIDIAN_MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div key={mod.title} className="flex gap-3 text-xs">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${mod.gradient} text-white shrink-0 flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{mod.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{mod.description}</p>
                    </div>
                  </div>
                );
              })}
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
              <p className="text-xs text-slate-400 text-center py-4 font-mono">
                No recent stores. Create your first store workspace above.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/editor/${proj.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 transition-colors group text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                        {proj.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        ID: {proj.id}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
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
