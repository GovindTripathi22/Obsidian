"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { compileShopifyLiquidTheme } from "@/lib/shopify";
import { createProject, canCreateProject } from "@/lib/projects";
import { QuotaLimitModal } from "@/components/ui/QuotaLimitModal";
import {
  Sparkles,
  ArrowRight,
  Download,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Star,
  CheckCircle2,
  Code2,
  Zap,
  ShieldCheck,
  Check,
} from "lucide-react";
import { VideoBackground } from "@/components/ui/VideoBackground";

/* ── Official Shopify SVG Brand Icon ── */
const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

const PRESET_STORES = [
  {
    id: "luxe-skincare",
    tag: "Beauty & Cosmetics",
    icon: "💄",
    name: "Aura Botanicals Skincare",
    prompt: "Create an ultra-luxurious clean beauty storefront with rose water mist, peptide glow serums, sticky cart preview, customer reviews, and Shopify Liquid 2.0 theme compatibility.",
    heroTitle: "Pure Botanical Science for Radiant Skin",
    heroSubtitle: "Wild-harvested adaptogens, cold-pressed seed oils, and clinically-proven bio-peptides.",
    products: [
      { id: "p1", title: "Celestial Glow Peptide Serum", price: 68, tag: "BEST SELLER", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80" },
      { id: "p2", title: "Rose Damascena Hydration Mist", price: 42, tag: "ORGANIC", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80" },
      { id: "p3", title: "Bakuchiol Overnight Repair Oil", price: 74, tag: "RETINOL ALT", image: "https://images.unsplash.com/photo-1608248597359-0098f98c8c50?w=800&auto=format&fit=crop&q=80" },
      { id: "p4", title: "Velvet Cloud Ceramide Crème", price: 58, tag: "HYDRATING", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "streetwear-lab",
    tag: "Apparel & Streetwear",
    icon: "👕",
    name: "KINETIC Supply Streetwear",
    prompt: "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, 450 GSM French terry hoodies, and Liquid theme sections.",
    heroTitle: "Engineered for Movement. Built for Culture.",
    heroSubtitle: "450 GSM organic French terry cotton, waterproof taped zippers, and modular utility silhouettes.",
    products: [
      { id: "p5", title: "Heavyweight Boxy Graphic Hoodie", price: 130, tag: "450 GSM", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80" },
      { id: "p6", title: "Tactical Ripstop Parachute Pant", price: 145, tag: "WATERPROOF", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80" },
      { id: "p7", title: "Raw Edge Minimal Oversized Tee", price: 55, tag: "ESSENTIAL", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80" },
      { id: "p8", title: "Modular Crossbody Utility Rig", price: 88, tag: "CORDURA", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "cyber-audio",
    tag: "Tech & Peripherals",
    icon: "⚡",
    name: "Apex Cybernetics Audio",
    prompt: "Build an industrial tech store for planar magnetic headphones, mechanical keyboard spec tables, fast charging hubs, and Liquid theme templates.",
    heroTitle: "Acoustic Perfection. Titanium Engineering.",
    heroSubtitle: "Precision planar magnetic drivers, lossless LDAC streaming, and CNC machined aerospace titanium.",
    products: [
      { id: "p9", title: "Apex Horizon Pro ANC Headphones", price: 349, tag: "FLAGSHIP", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
      { id: "p10", title: "Cybernetic 75% Gasket Keyboard", price: 210, tag: "ALUMINUM", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80" },
      { id: "p11", title: "140W GaN Fast Dual Charger", price: 89, tag: "FAST GAIN", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80" },
      { id: "p12", title: "Titanium Precision Haptic Stylus", price: 119, tag: "PRECISION", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "artisanal-roast",
    tag: "Specialty Coffee",
    icon: "☕",
    name: "Velvet & Vine Roastery",
    prompt: "Create a warm artisanal lifestyle roastery store with recurring coffee subscriptions, pour-over glass drippers, customer review sliders, and Shopify theme export.",
    heroTitle: "Single-Origin Specialty Beans Roasted Fresh.",
    heroSubtitle: "Direct trade beans harvested from high-altitude volcanic soils in Yirgacheffe and Huila.",
    products: [
      { id: "p13", title: "Yirgacheffe Ethiopian Whole Bean (12oz)", price: 24, tag: "DIRECT TRADE", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80" },
      { id: "p14", title: "Precision Borosilicate Pour-Over Dripper", price: 48, tag: "HAND BLOWN", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80" },
      { id: "p15", title: "Ceramic Matte Black French Press", price: 65, tag: "DOUBLE WALL", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80" },
      { id: "p16", title: "Monthly Roaster Tasting Subscription", price: 38, tag: "FREE SHIPPING", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80" },
    ],
  },
];

export default function BuilderPage() {
  const router = useRouter();
  const { user, refreshProjectCount, getProjectStats } = useAuth();
  const stats = getProjectStats();

  const [promptText, setPromptText] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activePreset, setActivePreset] = useState(PRESET_STORES[0]);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Live Cart Drawer state
  const [cart, setCart] = useState<Array<{ id: string; title: string; price: number; image: string; quantity: number }>>([
    {
      id: activePreset.products[0].id,
      title: activePreset.products[0].title,
      price: activePreset.products[0].price,
      image: activePreset.products[0].image,
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectPreset = (preset: typeof PRESET_STORES[0]) => {
    setActivePreset(preset);
    setPromptText(preset.prompt);
    setStoreName(preset.name);
    setCart([
      {
        id: preset.products[0].id,
        title: preset.products[0].title,
        price: preset.products[0].price,
        image: preset.products[0].image,
        quantity: 1,
      },
    ]);
  };

  const handleAddToCart = (product: typeof activePreset.products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleLaunchBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    // Enforce 3-project limit on Free Plan
    if (!canCreateProject(stats.isPro)) {
      setShowQuotaModal(true);
      return;
    }

    setIsSubmitting(true);
    const newProjectId = `proj-shopify-${Date.now()}`;
    const projectTitle = storeName.trim() || promptText.slice(0, 30) + "...";

    createProject({
      id: newProjectId,
      userId: user?.id || "guest",
      title: projectTitle,
      prompt: promptText,
      type: "shopify",
      thumbnail: activePreset.products[0].image,
    });

    setTimeout(() => {
      router.push(`/editor/${newProjectId}?type=shopify&initialPrompt=${encodeURIComponent(promptText)}`);
    }, 300);
  };

  const handleEnhancePrompt = async () => {
    if (!promptText.trim() || isEnhancing) return;
    const original = promptText;
    setIsEnhancing(true);
    setPromptText("✨ Enhancing Liquid theme architecture with AI...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Rewrite and enhance this Shopify Liquid theme prompt with detailed sections, product grids, color palettes, and JSON schema requirements: "${original}"`,
          projectId: "enhance-shopify",
          pageName: "shopify-enhance",
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
        setPromptText(enhanced.trim() || original);
      } else {
        setPromptText(original);
      }
    } catch {
      setPromptText(original);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownloadThemeZip = async () => {
    setIsExporting(true);
    try {
      const { zipBlob, fileName } = await compileShopifyLiquidTheme(
        activePreset.id,
        `<!-- ${activePreset.name} Liquid Theme -->`,
        `/* ${activePreset.name} Custom CSS */`
      );
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-900 selection:text-white relative overflow-hidden font-sans smooth-gpu page-transition-enter">
      {/* ── Background Video ── */}
      <VideoBackground src="/shopify-bg.mp4" opacity={0.75} />

      <div className="relative z-10">
        <SiteHeader />

        <main className="flex flex-col items-center justify-center px-4 pt-12 md:pt-20 pb-20 max-w-7xl mx-auto w-full">
          {/* Hero Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-xs font-semibold text-emerald-400 backdrop-blur-xl shadow-lg shadow-emerald-950/40">
              <ShopifyIcon className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Shopify Liquid 2.0 Studio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-tight">
              Architect Luxury Shopify Stores.
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Generate production-ready Shopify Liquid 2.0 themes with customizable sections,
              live cart simulations, clean schemas, and instant 1-click ZIP export.
            </p>

            {/* Plan Quota Indicator */}
            <div className="inline-flex items-center gap-2 text-xs bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full shadow-md">
              <span className="text-neutral-400">Quota:</span>
              <span
                suppressHydrationWarning
                className={mounted && stats.isLimitReached ? "text-red-400 font-semibold" : "text-emerald-400 font-semibold"}
              >
                {mounted
                  ? stats.isPro
                    ? "Pro (Unlimited)"
                    : `${stats.totalCount}/3 Free Projects`
                  : "0/3 Free Projects"}
              </span>
              {mounted && !stats.isPro && (
                <Link href="/billing" className="text-emerald-400 hover:text-emerald-300 font-semibold ml-1 border-l border-neutral-700 pl-2">
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>

          {/* Main Prompt Card */}
          <div className="w-full max-w-3xl mt-10 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-green-700/30 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative rounded-3xl border border-neutral-800 bg-[#0a0a0a]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-4">
              <form onSubmit={handleLaunchBuilder} className="space-y-4">
                <div>
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe your Shopify store concept: brand style, color palette, hero headline, featured collection, reviews slider, and checkout experience..."
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500/50 focus:outline-none resize-none font-normal leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Brand Name (Optional)"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-xs py-2 text-white placeholder-neutral-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      title="Enhance with AI"
                      disabled={!promptText.trim() || isEnhancing}
                      onClick={handleEnhancePrompt}
                      className="h-10 px-3.5 rounded-xl bg-neutral-900 border border-emerald-500/30 text-emerald-400 hover:bg-neutral-800 hover:text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Enhance</span>
                    </button>

                    <Button
                      type="submit"
                      disabled={!promptText.trim()}
                      isLoading={isSubmitting}
                      leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                    >
                      Generate Store
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Curated Preset Chips */}
          <div className="mt-8 w-full max-w-4xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 text-center">
              Store Presets
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_STORES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-1.5 ${
                    activePreset.id === preset.id
                      ? "bg-neutral-900 border-emerald-500/60 shadow-lg shadow-emerald-950/40"
                      : "bg-[#0a0a0a]/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {preset.tag}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white line-clamp-1">{preset.name}</h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{preset.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Live Interactive Storefront Showcase ── */}
          <div className="mt-14 w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-neutral-300">
                  Live Preview: {activePreset.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadThemeZip}
                  isLoading={isExporting}
                  leftIcon={exportDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  className="text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                >
                  {exportDone ? "Downloaded!" : "Export ZIP"}
                </Button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})</span>
                </button>
              </div>
            </div>

            {/* Showcase Card */}
            <div className="rounded-3xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden shadow-2xl space-y-0">
              {/* Store Header */}
              <div className="p-4 sm:p-5 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-xs text-white font-semibold">
                    🛍️
                  </div>
                  <span className="text-sm font-semibold text-white">{activePreset.name}</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Liquid 2.0
                </span>
              </div>

              {/* Store Hero */}
              <div className="py-10 px-6 text-center bg-gradient-to-b from-neutral-900/40 to-[#0a0a0a] border-b border-neutral-800/80 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{activePreset.heroTitle}</h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">{activePreset.heroSubtitle}</p>
              </div>

              {/* Product Grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {activePreset.products.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-3 group hover:border-emerald-500/40 transition-all">
                    <div>
                      <div className="aspect-square rounded-xl overflow-hidden mb-2 relative border border-neutral-800 bg-black">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-semibold">
                          {p.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-emerald-400 font-semibold mt-1">${p.price}.00</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full py-1.5 rounded-xl bg-neutral-800 hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Slide-Out Cart Drawer ── */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end">
              <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-fade-in-up">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-base text-white">Live Store Cart</h3>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#0a0a0a] border border-neutral-800 flex items-center justify-between gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-neutral-800" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                          <p className="text-xs text-emerald-400 font-semibold mt-0.5">${item.price}.00</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                          <button onClick={() => handleUpdateQuantity(item.id, -1)} className="text-neutral-400 hover:text-white p-0.5">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-white px-1">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, 1)} className="text-neutral-400 hover:text-white p-0.5">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <div className="flex justify-between text-sm font-semibold text-white">
                    <span>Estimated Total:</span>
                    <span className="text-emerald-400 font-semibold">${cartTotal}.00</span>
                  </div>
                  <Button
                    size="md"
                    onClick={() => alert(`Shopify Checkout Initialized for $${cartTotal}.00!`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    Proceed to Checkout →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Quota Limit Exceeded Modal (Limit of 3 Enforced) ── */}
          <QuotaLimitModal
            isOpen={showQuotaModal}
            onClose={() => setShowQuotaModal(false)}
            currentCount={stats.totalCount}
            maxCount={3}
            manageProjectsHref="/projects?tab=shopify"
          />
        </main>
      </div>
    </div>
  );
}
