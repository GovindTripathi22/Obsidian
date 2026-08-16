"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { compileShopifyLiquidTheme } from "@/lib/shopify";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Sliders,
  Code2,
  X,
  Plus,
  Minus,
  Trash2,
  Layers,
  Zap,
  ExternalLink,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import { createProject, canCreateProject } from "@/lib/projects";
import { QuotaLimitModal } from "@/components/ui/QuotaLimitModal";

/* ── Official Shopify SVG Brand Icon ── */
const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

export interface StorePreset {
  id: string;
  name: string;
  niche: string;
  tagline: string;
  accentColor: string;
  heroHeading: string;
  heroSubheading: string;
  products: Array<{
    id: string;
    title: string;
    price: number;
    comparePrice?: number;
    image: string;
    tag: string;
    rating: number;
  }>;
  reviews: Array<{
    author: string;
    text: string;
    role: string;
    stars: number;
  }>;
}

export const STORE_PRESETS: StorePreset[] = [
  {
    id: "aura-botanicals",
    name: "Aura Botanicals",
    niche: "Clean Beauty & Skincare",
    tagline: "Organic Botanicals & Bio-Active Peptides",
    accentColor: "#10b981",
    heroHeading: "Pure Botanical Science for Radiant Skin",
    heroSubheading: "Formulated with wild-harvested adaptogens, cold-pressed seed oils, and clinically-proven bio-peptides.",
    products: [
      {
        id: "aura-1",
        title: "Celestial Glow Peptide Serum",
        price: 68,
        comparePrice: 85,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        tag: "BEST SELLER",
        rating: 4.9,
      },
      {
        id: "aura-2",
        title: "Rose Damascena Hydration Mist",
        price: 42,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        tag: "ORGANIC",
        rating: 4.8,
      },
      {
        id: "aura-3",
        title: "Bakuchiol Overnight Repair Oil",
        price: 74,
        comparePrice: 90,
        image: "https://images.unsplash.com/photo-1608248597359-0098f98c8c50?w=800&auto=format&fit=crop&q=80",
        tag: "RETINOL ALT",
        rating: 5.0,
      },
      {
        id: "aura-4",
        title: "Velvet Cloud Ceramide Crème",
        price: 58,
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
        tag: "DEEP HYDRATION",
        rating: 4.9,
      },
    ],
    reviews: [
      {
        author: "Sophia Laurent",
        text: "The Celestial Glow serum transformed my complexion in 10 days. The Shopify checkout was instant and packaging is pure luxury.",
        role: "Verified Buyer • Paris",
        stars: 5,
      },
      {
        author: "Elena Rostova",
        text: "Clean ingredients that actually deliver clinical results. My new daily holy grail skincare routine.",
        role: "Dermatologist & Buyer",
        stars: 5,
      },
    ],
  },
  {
    id: "kinetic-supply",
    name: "KINETIC Supply",
    niche: "Streetwear & Technical Apparel",
    tagline: "Heavyweight Streetwear & Techwear",
    accentColor: "#059669",
    heroHeading: "Engineered for Movement. Built for Culture.",
    heroSubheading: "450 GSM organic French terry cotton, waterproof taped zippers, and modular utility silhouettes.",
    products: [
      {
        id: "kin-1",
        title: "Heavyweight Boxy Graphic Hoodie (450 GSM)",
        price: 130,
        comparePrice: 160,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        tag: "LIMITED DROP",
        rating: 4.9,
      },
      {
        id: "kin-2",
        title: "Tactical Ripstop Parachute Pant",
        price: 145,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
        tag: "WATERPROOF",
        rating: 4.8,
      },
      {
        id: "kin-3",
        title: "Raw Edge Minimal Oversized Tee",
        price: 55,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        tag: "ESSENTIAL",
        rating: 4.7,
      },
      {
        id: "kin-4",
        title: "Modular Crossbody Utility Rig",
        price: 88,
        comparePrice: 110,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        tag: "CORDURA",
        rating: 5.0,
      },
    ],
    reviews: [
      {
        author: "Marcus Vance",
        text: "The weight on the 450 GSM hoodie is unreal. Best drape and structural fit in the game.",
        role: "Fashion Stylist • Tokyo",
        stars: 5,
      },
      {
        author: "Tariq K.",
        text: "Ordered on drop day and arrived in 48 hours. Shopify Liquid layout is super clean on mobile.",
        role: "Verified Purchaser",
        stars: 5,
      },
    ],
  },
  {
    id: "apex-cyber",
    name: "Apex Cybernetics",
    niche: "High-Tech Audio & Hardware",
    tagline: "High-Fidelity Audio & Precision Peripherals",
    accentColor: "#10b981",
    heroHeading: "Acoustic Perfection. Titanium Engineering.",
    heroSubheading: "Precision planar magnetic drivers, lossless LDAC streaming, and CNC machined aerospace titanium.",
    products: [
      {
        id: "apx-1",
        title: "Apex Horizon Pro Planar ANC Headphones",
        price: 349,
        comparePrice: 399,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        tag: "FLAGSHIP",
        rating: 5.0,
      },
      {
        id: "apx-2",
        title: "Cybernetic 75% Gasket Mechanical Keyboard",
        price: 210,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        tag: "CNC ALUMINUM",
        rating: 4.9,
      },
      {
        id: "apx-3",
        title: "140W GaN Fast Dual Magnetic Charger",
        price: 89,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
        tag: "FAST CHARGE",
        rating: 4.8,
      },
      {
        id: "apx-4",
        title: "Titanium Precision Haptic Stylus",
        price: 119,
        comparePrice: 140,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
        tag: "PRECISION",
        rating: 4.9,
      },
    ],
    reviews: [
      {
        author: "David Chen",
        text: "The audio separation on the Horizon Pro is unmatched. Rivals $1000 studio reference monitors.",
        role: "Audio Engineer • San Francisco",
        stars: 5,
      },
      {
        author: "Sarah J.",
        text: "The keyboard sound profile is incredible right out of the box with zero modding required.",
        role: "Software Architect",
        stars: 5,
      },
    ],
  },
];

export function InteractiveShopifyStudio() {
  const router = useRouter();
  const { user, refreshProjectCount } = useAuth();

  const [selectedPreset, setSelectedPreset] = useState<StorePreset>(STORE_PRESETS[0]);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"live" | "sections" | "code" | "ai">("live");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");

  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Cart state for live simulation
  const [cartItems, setCartItems] = useState<Array<{ id: string; title: string; price: number; image: string; quantity: number }>>([
    {
      id: selectedPreset.products[0].id,
      title: selectedPreset.products[0].title,
      price: selectedPreset.products[0].price,
      image: selectedPreset.products[0].image,
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  // Prompt Generator state
  const [promptInput, setPromptInput] = useState("");
  const [storeTitleInput, setStoreTitleInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Active Code file viewer
  const [activeCodeFile, setActiveCodeFile] = useState<"theme" | "index" | "hero" | "product">("theme");

  const currencySymbols = { USD: "$", EUR: "€", GBP: "£" };
  const currencyRate = { USD: 1, EUR: 0.92, GBP: 0.78 };

  const formatPrice = (usd: number) => {
    const symbol = currencySymbols[currency];
    const val = (usd * currencyRate[currency] * (1 - discountPercent / 100)).toFixed(2);
    return `${symbol}${val}`;
  };

  const handleAddToCart = (product: typeof selectedPreset.products[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === "OBSIDIAN25" || promoCode.toUpperCase() === "SHOPIFY25") {
      setDiscountPercent(25);
      setPromoMessage("✓ 25% VIP Discount applied successfully!");
    } else {
      setDiscountPercent(10);
      setPromoMessage("✓ 10% Welcome Promo applied!");
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedSubtotal = cartSubtotal * (1 - discountPercent / 100);
  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100);

  const handleLaunchProject = () => {
    const isPro = user?.plan === "pro";
    if (!canCreateProject(isPro)) {
      setShowQuotaModal(true);
      return;
    }
    const newProjectId = `proj-shopify-${Date.now()}`;
    createProject({
      id: newProjectId,
      userId: user?.id || "guest",
      title: storeTitleInput.trim() || selectedPreset.name,
      prompt: promptInput.trim() || selectedPreset.heroSubheading,
      type: "shopify",
      thumbnail: selectedPreset.products[0].image,
    });
    router.push(`/editor/${newProjectId}?type=shopify&initialPrompt=${encodeURIComponent(promptInput.trim() || selectedPreset.heroHeading)}`);
  };

  const handleDirectExportZip = async () => {
    setIsExporting(true);
    try {
      const dummyHtml = `<!-- Shopify Liquid Generated by Obsidian AI Studio -->`;
      const { zipBlob, fileName } = await compileShopifyLiquidTheme(
        selectedPreset.id,
        dummyHtml,
        `/* ${selectedPreset.name} Theme CSS */`
      );
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const codeSnippets = {
    theme: `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <title>{{ page_title }} - {{ shop.name }}</title>
    {{ content_for_header }}
    <script src="https://cdn.tailwindcss.com"></script>
    {{ 'theme.css' | asset_url | stylesheet_tag }}
  </head>
  <body class="bg-zinc-950 text-zinc-100 font-sans antialiased">
    {% section 'announcement-bar' %}
    {% section 'header' %}
    <main id="MainContent" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>
    {% section 'footer' %}
  </body>
</html>`,
    index: `{
  "sections": {
    "announcement_bar": { "type": "announcement-bar" },
    "header": { "type": "header" },
    "hero": { 
      "type": "hero", 
      "settings": { 
        "heading": "${selectedPreset.heroHeading}",
        "subheading": "${selectedPreset.heroSubheading}"
      } 
    },
    "featured_products": { "type": "featured-products" },
    "reviews": { "type": "reviews" },
    "footer": { "type": "footer" }
  },
  "order": ["announcement_bar", "header", "hero", "featured_products", "reviews", "footer"]
}`,
    hero: `{% comment %} Shopify Hero Section for ${selectedPreset.name} {% endcomment %}
<section class="relative bg-zinc-950 py-24 px-6 text-center border-b border-zinc-800">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
      <span>✨ {{ section.settings.badge | default: 'New 2026 Collection' }}</span>
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
      {{ section.settings.heading }}
    </h1>
    <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
      {{ section.settings.subheading }}
    </p>
    <a href="{{ section.settings.button_link }}" class="inline-flex items-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all">
      {{ section.settings.button_text | default: 'Shop Now →' }}
    </a>
  </div>
</section>`,
    product: `{% comment %} Shopify Product Card Snippet {% endcomment %}
<div class="group rounded-2xl border border-zinc-800 bg-zinc-900 p-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
  <div>
    <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-3 relative">
      <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">IN STOCK</span>
    </div>
    <h3 class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
    <p class="text-xs font-mono text-emerald-400 font-bold mt-1">{{ product.price | money }}</p>
  </div>
  <button class="w-full mt-3 py-2 rounded-xl bg-zinc-800 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors">
    + Quick Add
  </button>
</div>`,
  };

  const handleCopyCode = (text: string, filename: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* ── Top Studio Toolbar & Preset Switcher ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800/90 shadow-2xl backdrop-blur-2xl">
        {/* Preset Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ShopifyIcon className="w-4 h-4 fill-emerald-400" />
            <span>Store Preset:</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {STORE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCartItems([
                    {
                      id: preset.products[0].id,
                      title: preset.products[0].title,
                      price: preset.products[0].price,
                      image: preset.products[0].image,
                      quantity: 1,
                    },
                  ]);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60 font-bold scale-105"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Currency, Export ZIP, Open Editor */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
          {/* Currency Changer */}
          <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800 text-xs font-mono">
            {(["USD", "EUR", "GBP"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  currency === c ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 1-Click ZIP Theme Download */}
          <Button
            size="sm"
            onClick={handleDirectExportZip}
            isLoading={isExporting}
            leftIcon={exportComplete ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-semibold"
          >
            {exportComplete ? "Theme Downloaded!" : "Export Liquid (ZIP)"}
          </Button>

          {/* Open Full Screen Studio Workspace */}
          <Button
            size="sm"
            onClick={handleLaunchProject}
            leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
          >
            Open in Studio Editor
          </Button>
        </div>
      </div>

      {/* ── Studio Navigation Tabs & Viewport Switcher ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        {/* Workspace Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "live"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Interactive Storefront Canvas</span>
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sections"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Liquid 2.0 Sections</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Liquid Code Tree</span>
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>AI Custom Prompt</span>
          </button>
        </div>

        {/* Viewport Width Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-2 rounded-xl transition-colors ${
              viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Desktop 1280px"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-2 rounded-xl transition-colors ${
              viewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-2 rounded-xl transition-colors ${
              viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Mobile 390px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Canvas View Area ── */}
      <div className="flex justify-center w-full">
        {/* Container with dynamic responsive width */}
        <div
          className={`transition-all duration-300 relative rounded-3xl border border-zinc-800 bg-black shadow-2xl overflow-hidden ${
            viewport === "desktop"
              ? "w-full"
              : viewport === "tablet"
              ? "w-[768px]"
              : "w-[390px]"
          }`}
        >
          {/* Browser / Canvas Chrome Header */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 max-w-sm truncate">
              <ShopifyIcon className="w-3 h-3 fill-emerald-400 shrink-0" />
              <span>https://{selectedPreset.id}.myshopify.com</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Liquid 2.0 Live
            </span>
          </div>

          {/* 1. Live Interactive Storefront */}
          {activeTab === "live" && (
            <div className="min-h-[700px] bg-zinc-950 text-zinc-100 font-sans relative">
              {/* Announcement Bar */}
              <div className="bg-emerald-950/90 border-b border-emerald-800/40 text-emerald-300 py-2 px-4 text-center text-xs font-mono flex items-center justify-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>⚡ FREE EXPRESS GLOBAL SHIPPING ON ALL ORDERS OVER $100 — CODE: <strong>OBSIDIAN25</strong></span>
              </div>

              {/* Store Header */}
              <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-600/30">
                    🛍️
                  </div>
                  <span className="font-heading font-black text-lg text-white tracking-tight">
                    {selectedPreset.name}
                  </span>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
                  <span className="text-emerald-400 cursor-pointer">Home</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Catalog</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Lookbook</span>
                  <span className="hover:text-white transition-colors cursor-pointer">About</span>
                </nav>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-semibold text-zinc-200 transition-all cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                </button>
              </header>

              {/* Hero Banner */}
              <section className="relative py-16 sm:py-24 px-6 text-center border-b border-zinc-800/80 overflow-hidden bg-gradient-to-b from-zinc-900/50 to-zinc-950">
                <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                    ✨ {selectedPreset.tagline}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white leading-tight">
                    {selectedPreset.heroHeading}
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                    {selectedPreset.heroSubheading}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleAddToCart(selectedPreset.products[0])}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                    >
                      Shop Hero Product ({formatPrice(selectedPreset.products[0].price)})
                    </button>
                  </div>
                </div>
              </section>

              {/* Product Grid */}
              <section className="py-14 px-6 max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2">
                      <span>Featured Collection</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Click any product to add to cart instantly</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{selectedPreset.products.length} Products Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  {selectedPreset.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div>
                        <div className="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-3 relative border border-zinc-800">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold">
                            {prod.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold text-[11px] text-zinc-300">{prod.rating}</span>
                        </div>
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {prod.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            {formatPrice(prod.price)}
                          </span>
                          {prod.comparePrice && (
                            <span className="text-[10px] font-mono text-zinc-500 line-through">
                              {formatPrice(prod.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="w-full mt-3 py-2 rounded-xl bg-zinc-800 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Customer Reviews Section */}
              <section className="py-12 px-6 border-t border-zinc-800/80 bg-zinc-900/30">
                <div className="max-w-4xl mx-auto space-y-6 text-center">
                  <h3 className="text-lg font-heading font-bold text-white">Verified Customer Reviews</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {selectedPreset.reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex text-amber-400 gap-0.5">
                          {Array.from({ length: rev.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed italic">"{rev.text}"</p>
                        <div className="pt-1 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rev.author} • {rev.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Storefront Footer */}
              <footer className="py-8 px-6 border-t border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500 space-y-3">
                <p>&copy; 2026 {selectedPreset.name}. Shopify Liquid 2.0 Storefront.</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono text-[9px]">VISA</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono text-[9px]">MASTERCARD</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono text-[9px]">APPLE PAY</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 font-mono text-[9px]">SHOPIFY PAY</span>
                </div>
              </footer>

              {/* ── Slide-Out Interactive Cart Drawer Modal ── */}
              {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
                  <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-fade-in-up">
                    {/* Cart Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-emerald-400" />
                          <h3 className="font-heading font-bold text-base text-white">Your Shopping Cart</h3>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Free Shipping Meter */}
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">
                            {discountedSubtotal >= freeShippingThreshold
                              ? "🎉 YOU UNLOCKED FREE EXPRESS SHIPPING!"
                              : `Add $${(freeShippingThreshold - discountedSubtotal).toFixed(2)} more for Free Shipping`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                            style={{ width: `${progressToFreeShipping}%` }}
                          />
                        </div>
                      </div>

                      {/* Cart Items List */}
                      <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                        {cartItems.length === 0 ? (
                          <div className="py-12 text-center text-zinc-500 text-xs">
                            Your cart is empty. Add a product from the collection!
                          </div>
                        ) : (
                          cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                <p className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="text-zinc-400 hover:text-white p-0.5"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold text-white px-1">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="text-zinc-400 hover:text-white p-0.5"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Cart Summary & Checkout */}
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      {/* Promo Code Applicator */}
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <Input
                          placeholder="Promo code (e.g. OBSIDIAN25)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-zinc-950 border-zinc-800 text-xs py-1.5"
                        />
                        <Button type="submit" size="sm" variant="secondary" className="text-xs shrink-0">
                          Apply
                        </Button>
                      </form>
                      {promoMessage && (
                        <p className="text-[11px] font-mono text-emerald-400 font-semibold">{promoMessage}</p>
                      )}

                      <div className="space-y-1.5 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-mono text-white font-semibold">
                            {currencySymbols[currency]}
                            {(cartSubtotal * currencyRate[currency]).toFixed(2)}
                          </span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-emerald-400 font-semibold">
                            <span>Discount ({discountPercent}%):</span>
                            <span className="font-mono">
                              -{currencySymbols[currency]}
                              {(cartSubtotal * currencyRate[currency] * (discountPercent / 100)).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                          <span>Estimated Total:</span>
                          <span className="font-mono text-emerald-400">
                            {formatPrice(cartSubtotal)}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="md"
                        onClick={() => {
                          alert(`Simulated Shopify Checkout Initialized! Total: ${formatPrice(cartSubtotal)}`);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/60"
                      >
                        Proceed to Shopify Checkout →
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Liquid 2.0 Sections Manager */}
          {activeTab === "sections" && (
            <div className="p-6 bg-zinc-950 text-zinc-100 space-y-6 min-h-[600px]">
              <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white">Liquid 2.0 Theme Section Manager</h3>
                <p className="text-xs text-zinc-400">Active Shopify template components configured in templates/index.json</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "announcement-bar.liquid", type: "Header Ticker", desc: "Top promo banner with dynamic discount code trigger" },
                  { name: "header.liquid", type: "Navigation", desc: "Logo, mega-menu catalog links, and live cart drawer trigger" },
                  { name: "hero.liquid", type: "Hero Banner", desc: "Dynamic heading, subtitle, and primary call-to-action button" },
                  { name: "featured-products.liquid", type: "Catalog Grid", desc: "4-column responsive grid with quick add to cart and badges" },
                  { name: "reviews.liquid", type: "Social Proof", desc: "Customer testimonials slider with 5-star ratings" },
                  { name: "footer.liquid", type: "Footer", desc: "Newsletter capture, payment icons, and legal links" },
                ].map((sec, i) => (
                  <div
                    key={sec.name}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{sec.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                            {sec.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{sec.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">✓ Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Liquid Code Explorer */}
          {activeTab === "code" && (
            <div className="bg-zinc-950 text-zinc-100 min-h-[600px] flex flex-col">
              {/* Code File Tabs */}
              <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCodeFile("theme")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      activeCodeFile === "theme" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    layout/theme.liquid
                  </button>
                  <button
                    onClick={() => setActiveCodeFile("index")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      activeCodeFile === "index" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    templates/index.json
                  </button>
                  <button
                    onClick={() => setActiveCodeFile("hero")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      activeCodeFile === "hero" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    sections/hero.liquid
                  </button>
                  <button
                    onClick={() => setActiveCodeFile("product")}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      activeCodeFile === "product" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    snippets/product-card.liquid
                  </button>
                </div>
                <button
                  onClick={() => handleCopyCode(codeSnippets[activeCodeFile], activeCodeFile)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedFile === activeCodeFile ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>

              <pre className="p-6 font-mono text-xs text-emerald-300 bg-zinc-950 overflow-auto flex-1 leading-relaxed">
                <code>{codeSnippets[activeCodeFile]}</code>
              </pre>
            </div>
          )}

          {/* 4. AI Custom Prompt Studio */}
          {activeTab === "ai" && (
            <div className="p-8 bg-zinc-950 text-zinc-100 min-h-[600px] space-y-6">
              <div className="space-y-1 border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-heading font-bold text-white">AI Custom Store Generator</h3>
                <p className="text-xs text-zinc-400">Describe any unique store concept and Gemini AI will synthesize complete Shopify Liquid files.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">Store Concept Prompt</label>
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. Minimalist Tokyo Matcha store with dark stone aesthetic, subscription boxes, customer reviews, and floating cart..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <Button
                  onClick={handleLaunchProject}
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Generate & Open Full Workspace →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <QuotaLimitModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        currentCount={user?.projectCount || 1}
        maxCount={3}
        manageProjectsHref="/projects?tab=shopify"
      />
    </div>
  );
}
