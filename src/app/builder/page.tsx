"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
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
  CheckCircle2,
  Code2,
  ShieldCheck,
  Check,
  ArrowLeftRight,
  Sliders,
  Trash2,
  Image as ImageIcon,
  CreditCard,
  Truck,
  Eye,
} from "lucide-react";
import { VideoBackground } from "@/components/ui/VideoBackground";
import {
  loadBuilderDraftTransaction,
  saveBuilderDraftTransaction,
  suggestShopifyPresetFromPrompt,
  convertShopifyToWebsitePrompt,
} from "@/lib/builder-bridge";

/* ── Official Shopify SVG Brand Icon ── */
const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

export interface BuilderProduct {
  id: string;
  title: string;
  price: number;
  tag: string;
  image: string;
  description?: string;
}

const PRESET_STORES = [
  {
    id: "luxe-skincare",
    tag: "Beauty & Cosmetics",
    icon: "💄",
    name: "Aura Botanicals Skincare",
    fontPairing: "Cormorant & Instrument Serif (Editorial Luxury)",
    headingFontClass: "font-editorial italic",
    bodyFontClass: "font-sans",
    prompt:
      "Create an ultra-luxurious clean beauty storefront with rose water mist, peptide glow serums, sticky cart preview, customer reviews, and Shopify Liquid 2.0 theme compatibility.",
    heroTitle: "Pure Botanical Science for Radiant Skin",
    heroSubtitle:
      "Wild-harvested adaptogens, cold-pressed seed oils, and clinically-proven bio-peptides.",
    products: [
      {
        id: "p1",
        title: "Celestial Glow Peptide Serum",
        price: 68,
        tag: "BEST SELLER",
        image: "/images/product-skincare.jpg",
        description: "Bio-active tri-peptide serum in cold-pressed botanical squalane for cellular luminosity.",
      },
      {
        id: "p2",
        title: "Rose Damascena Hydration Mist",
        price: 42,
        tag: "ORGANIC",
        image: "/images/product-skincare.jpg",
        description: "Micro-distilled organic Bulgarian rose hydrosol with hyaluronic acid complex.",
      },
      {
        id: "p3",
        title: "Bakuchiol Overnight Repair Oil",
        price: 74,
        tag: "RETINOL ALT",
        image: "/images/product-skincare.jpg",
        description: "Gentle plant-derived retinol alternative blended with obsidian mineral ferment.",
      },
      {
        id: "p4",
        title: "Velvet Cloud Ceramide Crème",
        price: 58,
        tag: "HYDRATING",
        image: "/images/product-skincare.jpg",
        description: "Deep barrier-restoring moisturizer with 5 essential bio-identical ceramides.",
      },
    ],
  },
  {
    id: "streetwear-lab",
    tag: "Apparel & Streetwear",
    icon: "👕",
    name: "KINETIC Supply Streetwear",
    fontPairing: "Clash Display & Cabinet Grotesk (Brutalist Streetwear)",
    headingFontClass: "font-brutalist uppercase tracking-tighter",
    bodyFontClass: "font-display",
    prompt:
      "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, 450 GSM French terry hoodies, and Liquid theme sections.",
    heroTitle: "Engineered for Movement. Built for Culture.",
    heroSubtitle:
      "450 GSM organic French terry cotton, waterproof taped zippers, and modular utility silhouettes.",
    products: [
      {
        id: "p5",
        title: "Heavyweight Boxy Graphic Hoodie",
        price: 130,
        tag: "450 GSM",
        image: "/images/product-streetwear.jpg",
        description: "Architectural drop-shoulder silhouette cut from custom-milled 450 GSM Japanese terry.",
      },
      {
        id: "p6",
        title: "Tactical Ripstop Parachute Pant",
        price: 145,
        tag: "WATERPROOF",
        image: "/images/product-streetwear.jpg",
        description: "Articulated knee pleats, Fidlock magnetic belt hardware, and DWR storm coating.",
      },
      {
        id: "p7",
        title: "Raw Edge Minimal Oversized Tee",
        price: 55,
        tag: "ESSENTIAL",
        image: "/images/product-streetwear.jpg",
        description: "Garment-dyed carbon black jersey with reinforced mock-neck rib collar.",
      },
      {
        id: "p8",
        title: "Modular Crossbody Utility Rig",
        price: 88,
        tag: "CORDURA",
        image: "/images/product-streetwear.jpg",
        description: "1000D Ballistic Cordura chest and shoulder pack with weatherproof YKK AquaGuard zips.",
      },
    ],
  },
  {
    id: "cyber-audio",
    tag: "Tech & Peripherals",
    icon: "⚡",
    name: "Apex Cybernetics Audio",
    fontPairing: "Syne & Space Grotesk (Industrial Precision)",
    headingFontClass: "font-cyber uppercase tracking-tight",
    bodyFontClass: "font-sans",
    prompt:
      "Build an industrial tech store for planar magnetic headphones, mechanical keyboard spec tables, fast charging hubs, and Liquid theme templates.",
    heroTitle: "Acoustic Perfection. Titanium Engineering.",
    heroSubtitle:
      "Precision planar magnetic drivers, lossless LDAC streaming, and CNC machined aerospace titanium.",
    products: [
      {
        id: "p9",
        title: "Apex Horizon Pro ANC Headphones",
        price: 349,
        tag: "FLAGSHIP",
        image: "/images/product-audio.jpg",
        description: "50mm beryllium planar drivers with 48dB adaptive hybrid ANC and 60-hour battery.",
      },
      {
        id: "p10",
        title: "Cybernetic 75% Gasket Keyboard",
        price: 210,
        tag: "ALUMINUM",
        image: "/images/product-audio.jpg",
        description: "6063 CNC anodized aluminum chassis with hot-swap linear switches and OLED telemetry.",
      },
      {
        id: "p11",
        title: "140W GaN Fast Dual Charger",
        price: 89,
        tag: "FAST GAN",
        image: "/images/product-audio.jpg",
        description: "Next-gen Gallium Nitride power architecture with real-time wattage display.",
      },
      {
        id: "p12",
        title: "Titanium Precision Haptic Stylus",
        price: 119,
        tag: "PRECISION",
        image: "/images/product-audio.jpg",
        description: "Grade-5 brushed titanium barrel with micro-solenoid tactile feedback.",
      },
    ],
  },
  {
    id: "artisanal-roast",
    tag: "Specialty Coffee",
    icon: "☕",
    name: "Velvet & Vine Roastery",
    fontPairing: "Playfair Display & Jakarta (Artisanal Warmth)",
    headingFontClass: "font-editorial font-serif",
    bodyFontClass: "font-jakarta",
    prompt:
      "Create a warm artisanal lifestyle roastery store with recurring coffee subscriptions, pour-over glass drippers, customer review sliders, and Shopify theme export.",
    heroTitle: "Single-Origin Specialty Beans Roasted Fresh.",
    heroSubtitle:
      "Direct trade beans harvested from high-altitude volcanic soils in Yirgacheffe and Huila.",
    products: [
      {
        id: "p13",
        title: "Yirgacheffe Ethiopian Whole Bean (12oz)",
        price: 24,
        tag: "DIRECT TRADE",
        image: "/images/product-coffee.jpg",
        description: "Washed heirloom varietal with bergamot blossom, jasmine, and dark cocoa notes.",
      },
      {
        id: "p14",
        title: "Precision Borosilicate Pour-Over Dripper",
        price: 48,
        tag: "HAND BLOWN",
        image: "/images/product-coffee.jpg",
        description: "Double-walled thermal borosilicate glass carafe with laser-etched stainless filter.",
      },
      {
        id: "p15",
        title: "Ceramic Matte Black French Press",
        price: 65,
        tag: "DOUBLE WALL",
        image: "/images/product-coffee.jpg",
        description: "Hand-thrown stoneware body with walnut lid and dual-mesh micro-filtration.",
      },
      {
        id: "p16",
        title: "Monthly Roaster Tasting Subscription",
        price: 38,
        tag: "FREE SHIPPING",
        image: "/images/product-coffee.jpg",
        description: "Two curated micro-lot bags roasted to order and shipped within 24 hours.",
      },
    ],
  },
];

const emptySubscribe = () => () => {};

export default function BuilderPage() {
  const router = useRouter();
  const { user, getProjectStats } = useAuth();
  const stats = getProjectStats();

  const [activePreset, setActivePreset] = useState(PRESET_STORES[0]);
  const [promptText, setPromptText] = useState(PRESET_STORES[0].prompt);
  const [storeName, setStoreName] = useState(PRESET_STORES[0].name);
  const [heroTitle, setHeroTitle] = useState(PRESET_STORES[0].heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(PRESET_STORES[0].heroSubtitle);
  const [announcementText, setAnnouncementText] = useState(
    "FREE GLOBAL EXPRESS SHIPPING ON ORDERS OVER $100 — USE CODE: OBSIDIAN25"
  );
  const [products, setProducts] = useState<BuilderProduct[]>(PRESET_STORES[0].products);
  const [selectedProduct, setSelectedProduct] = useState<BuilderProduct>(PRESET_STORES[0].products[0]);

  const [storefrontTab, setStorefrontTab] = useState<"home" | "product" | "customize" | "liquid">("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [syncedFromWebsite, setSyncedFromWebsite] = useState<string | null>(null);

  // Add Product Form State inside Customizer
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("85");
  const [newProdTag, setNewProdTag] = useState("NEW DROP");
  const [newProdImage, setNewProdImage] = useState("/images/product-skincare.jpg");
  const [isGeneratingProdImage, setIsGeneratingProdImage] = useState(false);

  // Live Cart Drawer & Multi-Step Checkout State
  const [cart, setCart] = useState<Array<{ id: string; title: string; price: number; image: string; quantity: number }>>([
    {
      id: PRESET_STORES[0].products[0].id,
      title: PRESET_STORES[0].products[0].title,
      price: PRESET_STORES[0].products[0].price,
      image: PRESET_STORES[0].products[0].image,
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "complete">("cart");
  const [customerEmail, setCustomerEmail] = useState("vip@obsidian.studio");
  const [shippingAddress, setShippingAddress] = useState("742 Mercer St, SoHo, New York, NY 10013");
  const [paymentMethod, setPaymentMethod] = useState<"shop_pay" | "apple_pay" | "card">("shop_pay");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [orderNumber, setOrderNumber] = useState("OBS-9042");

  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Check for incoming Website -> Shopify transaction on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromSource = params.get("from");
    const urlPrompt = params.get("prompt");
    const urlBrand = params.get("brand");

    const timer = window.setTimeout(() => {
      const draft = loadBuilderDraftTransaction();
      const effectivePrompt = urlPrompt || draft?.prompt || "";
      const effectiveBrand = urlBrand || draft?.brandName || "";

      if ((fromSource === "website" || draft?.source === "website") && effectivePrompt) {
        const suggestedId = suggestShopifyPresetFromPrompt(effectivePrompt);
        const matchedPreset = PRESET_STORES.find((p) => p.id === suggestedId) || PRESET_STORES[0];

        setActivePreset(matchedPreset);
        setPromptText(effectivePrompt);
        const resolvedBrand = effectiveBrand || matchedPreset.name;
        setStoreName(resolvedBrand);
        setHeroTitle(`${resolvedBrand} — Official Flagship Collection`);
        setHeroSubtitle(effectivePrompt.slice(0, 140));
        setProducts(matchedPreset.products);
        setSelectedProduct(matchedPreset.products[0]);
        setSyncedFromWebsite(resolvedBrand);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const syncDraftToBridge = (nextPrompt: string, nextBrand: string) => {
    saveBuilderDraftTransaction({
      source: "shopify",
      prompt: nextPrompt,
      brandName: nextBrand,
      presetId: activePreset.id,
    });
  };

  const handleSelectPreset = (preset: (typeof PRESET_STORES)[0]) => {
    setActivePreset(preset);
    setPromptText(preset.prompt);
    setStoreName(preset.name);
    setHeroTitle(preset.heroTitle);
    setHeroSubtitle(preset.heroSubtitle);
    setProducts(preset.products);
    setSelectedProduct(preset.products[0]);
    setCart([
      {
        id: preset.products[0].id,
        title: preset.products[0].title,
        price: preset.products[0].price,
        image: preset.products[0].image,
        quantity: 1,
      },
    ]);
    syncDraftToBridge(preset.prompt, preset.name);
  };

  const handleAddToCart = (product: BuilderProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 },
      ];
    });
    setCheckoutStep("cart");
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "OBSIDIAN25") {
      setDiscountPercent(25);
    } else if (promoCode.trim()) {
      setDiscountPercent(10);
    }
  };

  const handleSynthesizeProductImage = async () => {
    if (isGeneratingProdImage) return;
    setIsGeneratingProdImage(true);
    try {
      const res = await fetch("/api/media/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newProdTitle || storeName || activePreset.name }),
      });
      if (res.ok) {
        const data = (await res.json()) as { imageUrl?: string };
        if (data.imageUrl) setNewProdImage(data.imageUrl);
      }
    } finally {
      setIsGeneratingProdImage(false);
    }
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle.trim()) return;
    const priceNum = Math.max(1, Number(newProdPrice) || 65);
    const created: BuilderProduct = {
      id: `custom-${Date.now()}`,
      title: newProdTitle.trim(),
      price: priceNum,
      tag: newProdTag.trim().toUpperCase() || "LIMITED",
      image: newProdImage,
      description: `Custom flagship release crafted exclusively for ${storeName || activePreset.name}.`,
    };
    setProducts((prev) => [created, ...prev]);
    setSelectedProduct(created);
    setNewProdTitle("");
    setStorefrontTab("home");
  };

  const handleDeleteProduct = (id: string) => {
    if (products.length <= 1) return;
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    if (selectedProduct.id === id) {
      setSelectedProduct(next[0]);
    }
  };

  const handleTransitionToWebsite = (enableParallax: boolean) => {
    const brand = storeName.trim() || activePreset.name;
    const converted = convertShopifyToWebsitePrompt(promptText || heroSubtitle, brand, enableParallax);
    saveBuilderDraftTransaction({
      source: "shopify",
      prompt: converted.websitePrompt,
      brandName: converted.brandName,
      parallaxMode: enableParallax,
      parallaxThemeId: "tokyo-noir",
    });
    router.push(
      `/?from=shopify&parallax=${enableParallax ? "true" : "false"}&prompt=${encodeURIComponent(
        converted.websitePrompt
      )}`
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
      thumbnail: products[0]?.image || "/images/product-skincare.jpg",
      data: {
        prompt: promptText,
      },
    });

    setTimeout(() => {
      router.push(
        `/editor/${newProjectId}?type=shopify&initialPrompt=${encodeURIComponent(
          `${storeName ? `[Brand: ${storeName}] ` : ""}${promptText}`
        )}`
      );
    }, 200);
  };

  const handleEnhancePrompt = async () => {
    if (!promptText.trim() || isEnhancing) return;
    const original = promptText;
    setIsEnhancing(true);
    setPromptText("Enhancing Liquid theme architecture with AI...");
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
      const effectiveStoreName = storeName.trim() || activePreset.name;
      const { zipBlob, fileName } = await compileShopifyLiquidTheme(
        activePreset.id,
        `<!-- ${effectiveStoreName} OS 2.0 Theme -->`,
        `/* ${effectiveStoreName} Custom CSS */`,
        {
          storeName: effectiveStoreName,
          heroHeading: heroTitle,
          heroSubheading: heroSubtitle,
          announcementText,
          products: products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            tag: p.tag,
            image: p.image,
          })),
        }
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

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotal = Math.max(0, Math.round(cartSubtotal * (1 - discountPercent / 100)));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-900 selection:text-white relative overflow-x-hidden font-sans">
      {/* ── Background Video ── */}
      <VideoBackground src="/shopify-bg.mp4" opacity={0.75} />

      <div className="relative z-10">
        <SiteHeader />

        <main className="flex flex-col items-center justify-center px-4 pt-12 md:pt-16 pb-20 max-w-7xl mx-auto w-full">
          {/* Hero Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-xs font-semibold text-emerald-400 backdrop-blur-xl shadow-lg shadow-emerald-950/40">
              <ShopifyIcon className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Shopify Liquid 2.0 Studio & Live Commerce Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-tight">
              Architect Luxury Shopify Stores.
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Customize live products, test multi-step Shopify Pay checkout, sync seamlessly with the 3D Parallax Website Builder, and export production OS 2.0 Liquid ZIP bundles.
            </p>

            {/* Plan Quota Indicator */}
            <div className="inline-flex items-center gap-2 text-xs bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full shadow-md">
              <span className="text-neutral-400">Quota:</span>
              <span
                suppressHydrationWarning
                className={
                  mounted && stats.isLimitReached
                    ? "text-red-400 font-semibold"
                    : "text-emerald-400 font-semibold"
                }
              >
                {mounted
                  ? stats.isPro
                    ? "Pro (Unlimited)"
                    : `${stats.totalCount}/3 Free Projects`
                  : "0/3 Free Projects"}
              </span>
              {mounted && !stats.isPro && (
                <Link
                  href="/billing"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold ml-1 border-l border-neutral-700 pl-2"
                >
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>

          {/* Incoming Website -> Shopify Transaction Banner */}
          {syncedFromWebsite && (
            <div
              data-testid="website-to-shopify-banner"
              className="w-full max-w-3xl mt-6 px-5 py-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-white font-semibold">
                    Website → Shopify Transaction Complete: <span className="text-emerald-400">{syncedFromWebsite}</span>
                  </p>
                  <p className="text-neutral-300 text-[11px]">
                    Your website prompt and brand have been mapped into a live Shopify Liquid 2.0 storefront below.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSyncedFromWebsite(null)}
                className="text-neutral-400 hover:text-white text-[11px] shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main Prompt & Cross-Builder Bridge Card */}
          <div className="w-full max-w-3xl mt-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-green-700/30 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative rounded-3xl border border-neutral-800 bg-[#0a0a0a]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-4">
              {/* Top Bridge Bar inside Shopify Writing Box */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                  <ShopifyIcon className="w-4 h-4 fill-emerald-400" />
                  <span>OS 2.0 Storefront Architect</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="bridge-to-parallax-btn"
                    onClick={() => handleTransitionToWebsite(true)}
                    className="px-3 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[11px] font-medium text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3 h-3 text-emerald-400" />
                    <span>Convert to 3D Parallax Website →</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLaunchBuilder} className="space-y-4">
                <div>
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => {
                      setPromptText(e.target.value);
                      syncDraftToBridge(e.target.value, storeName);
                    }}
                    placeholder="Describe your Shopify store concept: brand style, color palette, hero headline, featured collection, reviews slider, and checkout experience..."
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500/50 focus:outline-none resize-none font-normal leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="w-full sm:w-72">
                    <Input
                      placeholder="Brand / Store Name"
                      value={storeName}
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        syncDraftToBridge(promptText, e.target.value);
                      }}
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
                      Generate in Full Studio
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Curated Preset Chips */}
          <div className="mt-8 w-full max-w-5xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 text-center">
              Curated Shopify OS 2.0 Flagship Presets
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

          {/* ── Live Interactive Storefront Workbench ── */}
          <div className="mt-12 w-full max-w-6xl space-y-4">
            {/* Workbench Control Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setStorefrontTab("home")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    storefrontTab === "home"
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Storefront Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStorefrontTab("product")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    storefrontTab === "product"
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Product Detail Page</span>
                </button>
                <button
                  type="button"
                  data-testid="shopify-customize-tab"
                  onClick={() => setStorefrontTab("customize")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    storefrontTab === "customize"
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize & Add Products ({products.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStorefrontTab("liquid")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    storefrontTab === "liquid"
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>OS 2.0 Liquid Architecture</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadThemeZip}
                  isLoading={isExporting}
                  leftIcon={
                    exportDone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )
                  }
                  className="text-xs border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-100"
                >
                  {exportDone ? "OS 2.0 ZIP Downloaded!" : "Export Shopify ZIP"}
                </Button>

                <button
                  type="button"
                  data-testid="open-cart-drawer-btn"
                  onClick={() => {
                    setCheckoutStep("cart");
                    setIsCartOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})</span>
                </button>
              </div>
            </div>

            {/* Showcase Card */}
            <div
              className={`rounded-3xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden shadow-2xl ${
                activePreset.bodyFontClass || "font-sans"
              }`}
            >
              {/* Announcement Ticker */}
              <div className="bg-neutral-950 border-b border-neutral-800 py-2 px-4 text-center text-[11px] font-mono text-emerald-400 tracking-wider uppercase">
                ⚡ {announcementText}
              </div>

              {/* Store Header */}
              <div className="p-4 sm:p-5 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-xs text-white font-bold">
                    {(storeName || activePreset.name).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <span
                      className={`text-base font-bold text-white ${
                        activePreset.headingFontClass || "font-heading"
                      }`}
                    >
                      {storeName || activePreset.name}
                    </span>
                    <span className="block text-[10px] text-neutral-400 font-mono">
                      {(storeName || activePreset.id).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.myshopify.com
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs text-neutral-300 font-medium">
                  <button
                    type="button"
                    onClick={() => setStorefrontTab("home")}
                    className={storefrontTab === "home" ? "text-emerald-400 font-semibold" : "hover:text-white"}
                  >
                    Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorefrontTab("product")}
                    className={storefrontTab === "product" ? "text-emerald-400 font-semibold" : "hover:text-white"}
                  >
                    Flagship Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorefrontTab("customize")}
                    className={storefrontTab === "customize" ? "text-emerald-400 font-semibold" : "hover:text-white"}
                  >
                    Catalog Manager
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 hidden sm:inline-block">
                    {activePreset.fontPairing}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    OS 2.0 Ready
                  </span>
                </div>
              </div>

              {/* TAB 1: STOREFRONT HOME */}
              {storefrontTab === "home" && (
                <div>
                  {/* Store Hero */}
                  <div className="py-12 px-6 text-center bg-gradient-to-b from-neutral-900/40 to-[#0a0a0a] border-b border-neutral-800/80 space-y-4">
                    <h2
                      className={`text-2xl sm:text-4xl font-semibold text-white tracking-tight max-w-2xl mx-auto ${
                        activePreset.headingFontClass || "font-heading"
                      }`}
                    >
                      {heroTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
                      {heroSubtitle}
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(products[0])}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Quick Buy {products[0]?.title} — ${products[0]?.price}.00
                      </button>
                      <button
                        type="button"
                        onClick={() => setStorefrontTab("customize")}
                        className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Customize Store & Catalog
                      </button>
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-3 group hover:border-emerald-500/40 transition-all"
                      >
                        <div>
                          <div
                            onClick={() => {
                              setSelectedProduct(p);
                              setStorefrontTab("product");
                            }}
                            className="aspect-square rounded-xl overflow-hidden mb-2.5 relative border border-neutral-800 bg-black cursor-pointer"
                          >
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-semibold">
                              {p.tag}
                            </span>
                          </div>
                          <h4
                            onClick={() => {
                              setSelectedProduct(p);
                              setStorefrontTab("product");
                            }}
                            className="text-xs font-semibold text-white line-clamp-1 cursor-pointer hover:text-emerald-400"
                          >
                            {p.title}
                          </h4>
                          <p className="text-xs text-emerald-400 font-semibold mt-1">${p.price}.00 USD</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCT DETAIL PAGE */}
              {storefrontTab === "product" && selectedProduct && (
                <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-800 bg-black relative">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      {selectedProduct.tag}
                    </span>
                  </div>
                  <div className="space-y-5">
                    <button
                      type="button"
                      onClick={() => setStorefrontTab("home")}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      ← Back to Collection
                    </button>
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-emerald-400 uppercase">
                        {storeName || activePreset.name} • Verified OS 2.0 Template
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedProduct.title}</h2>
                      <p className="text-2xl font-mono font-bold text-emerald-400">
                        ${selectedProduct.price}.00 USD
                      </p>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {selectedProduct.description ||
                        "Crafted to archival specification with immediate global dispatch and Shopify Pay 1-click protection."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Add to Cart — ${selectedProduct.price}.00
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setCheckoutStep("shipping");
                        }}
                        className="flex-1 py-3 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Buy with Shop Pay
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
                      <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                        ✓ Instant ZIP Schema
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                        ✓ Dawn 15.0 Compatible
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                        ✓ Live Cart Drawer
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STORE CUSTOMIZER & PRODUCT MANAGER */}
              {storefrontTab === "customize" && (
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Brand & Hero Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
                      1. Live Storefront Copy & Branding
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Store / Brand Name</label>
                        <Input
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="bg-neutral-900 border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Hero Headline</label>
                        <Input
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="bg-neutral-900 border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Hero Subheading</label>
                        <Input
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          className="bg-neutral-900 border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Announcement Bar Text</label>
                        <Input
                          value={announcementText}
                          onChange={(e) => setAnnouncementText(e.target.value)}
                          className="bg-neutral-900 border-neutral-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800">
                      <p className="text-xs font-semibold text-neutral-300 mb-2">
                        Active Products ({products.length})
                      </p>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {products.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-9 h-9 rounded-lg object-cover border border-neutral-700"
                              />
                              <div className="truncate">
                                <p className="font-semibold text-white truncate">{prod.title}</p>
                                <p className="text-[11px] text-emerald-400">${prod.price}.00 • {prod.tag}</p>
                              </div>
                            </div>
                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Add Custom Product with AI Image Synthesis */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
                      2. Add Custom Product to Catalog & ZIP
                    </h3>
                    <form onSubmit={handleAddCustomProduct} className="space-y-3 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Product Title</label>
                        <Input
                          placeholder="e.g. Obsidian Carbon Espresso Grinder"
                          value={newProdTitle}
                          onChange={(e) => setNewProdTitle(e.target.value)}
                          className="bg-neutral-950 border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Price (USD)</label>
                          <Input
                            type="number"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            className="bg-neutral-950 border-neutral-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Badge Tag</label>
                          <Input
                            value={newProdTag}
                            onChange={(e) => setNewProdTag(e.target.value)}
                            className="bg-neutral-950 border-neutral-800 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs text-neutral-400">Product Photography Asset</label>
                        <div className="flex items-center gap-3">
                          <img
                            src={newProdImage}
                            alt="Product preview"
                            className="w-14 h-14 rounded-xl object-cover border border-neutral-700"
                          />
                          <div className="flex-1 space-y-1.5">
                            <button
                              type="button"
                              onClick={handleSynthesizeProductImage}
                              disabled={isGeneratingProdImage}
                              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>
                                {isGeneratingProdImage
                                  ? "Synthesizing Product Photo..."
                                  : "Synthesize Studio Product Photo"}
                              </span>
                            </button>
                            <div className="flex gap-1.5">
                              {[
                                "/images/product-skincare.jpg",
                                "/images/product-streetwear.jpg",
                                "/images/product-audio.jpg",
                                "/images/product-coffee.jpg",
                              ].map((imgUrl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setNewProdImage(imgUrl)}
                                  className={`text-[10px] px-2 py-0.5 rounded bg-neutral-950 border ${
                                    newProdImage === imgUrl ? "border-emerald-400 text-emerald-400" : "border-neutral-800 text-neutral-400"
                                  }`}
                                >
                                  Studio #{idx + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!newProdTitle.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add Product to Live Storefront
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: LIQUID 2.0 SCHEMA & FILES */}
              {storefrontTab === "liquid" && (
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Compiled Shopify Online Store 2.0 Bundle Structure
                      </h3>
                      <p className="text-xs text-neutral-400">
                        All customizations and products above are compiled directly into these Liquid files upon ZIP export.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleDownloadThemeZip}
                      isLoading={isExporting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Download OS 2.0 ZIP
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    {[
                      { path: "layout/theme.liquid", desc: "Master OS 2.0 layout with Tailwind & CSS variables" },
                      { path: "templates/index.json", desc: `Dynamic section order for ${storeName || activePreset.name}` },
                      { path: "sections/hero.liquid", desc: `Headline: "${heroTitle.slice(0, 38)}..."` },
                      { path: "sections/featured-products.liquid", desc: `${products.length} products bound to schema` },
                      { path: "sections/main-cart.liquid", desc: "Slide-out cart & Shop Pay checkout form" },
                      { path: "config/settings_data.json", desc: "Brand colors, typography, and store settings" },
                    ].map((file) => (
                      <div
                        key={file.path}
                        className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-emerald-400 font-semibold">{file.path}</p>
                          <p className="text-neutral-400 text-[11px] font-sans mt-0.5">{file.desc}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Slide-Out Cart & Multi-Step Shopify Checkout Drawer (No window.alert!) ── */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end">
              <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-fade-in-up overflow-y-auto">
                <div className="space-y-4">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-base text-white">
                        {checkoutStep === "cart" && "Live Store Cart"}
                        {checkoutStep === "shipping" && "Shopify Express Checkout • Step 1/2"}
                        {checkoutStep === "payment" && "Shopify Pay Authorization • Step 2/2"}
                        {checkoutStep === "complete" && `Order Confirmed #${orderNumber}`}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* STEP 1: CART ITEMS */}
                  {checkoutStep === "cart" && (
                    <>
                      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                        {cart.length === 0 ? (
                          <p className="text-xs text-neutral-500 py-8 text-center">
                            Your cart is empty. Click any product card to add items.
                          </p>
                        ) : (
                          cart.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-[#0a0a0a] border border-neutral-800 flex items-center justify-between gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 rounded-lg object-cover border border-neutral-800"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                                <p className="text-xs text-emerald-400 font-semibold mt-0.5">${item.price}.00</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="text-neutral-400 hover:text-white p-0.5"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-semibold text-white px-1">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="text-neutral-400 hover:text-white p-0.5"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Promo Code */}
                      <form onSubmit={handleApplyPromoCode} className="flex gap-2 pt-2">
                        <Input
                          placeholder="Promo code (try OBSIDIAN25)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-[#0a0a0a] border-neutral-800 text-xs text-white"
                        />
                        <Button type="submit" size="sm" variant="outline" className="text-xs">
                          Apply
                        </Button>
                      </form>
                      {discountPercent > 0 && (
                        <p className="text-[11px] font-mono text-emerald-400">
                          ✓ {discountPercent}% VIP Discount Applied
                        </p>
                      )}
                    </>
                  )}

                  {/* STEP 2: SHIPPING DETAILS */}
                  {checkoutStep === "shipping" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0a0a0a] border border-neutral-800 flex items-center gap-2 text-emerald-400">
                        <Truck className="w-4 h-4 shrink-0" />
                        <span>Free Global Express Courier Unlocked</span>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Contact Email</label>
                        <Input
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="bg-[#0a0a0a] border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Shipping Destination</label>
                        <Input
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="bg-[#0a0a0a] border-neutral-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PAYMENT AUTHORIZATION */}
                  {checkoutStep === "payment" && (
                    <div className="space-y-3 text-xs">
                      <p className="text-neutral-400">Select Simulated Shopify Payment Gateway:</p>
                      {(
                        [
                          { id: "shop_pay", label: "Shop Pay (1-Click Instant)", badge: "RECOMMENDED" },
                          { id: "apple_pay", label: "Apple Pay / Passkey", badge: "BIOMETRIC" },
                          { id: "card", label: "Visa / Mastercard •••• 4242", badge: "256-BIT SSL" },
                        ] as const
                      ).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                            paymentMethod === pm.id
                              ? "bg-emerald-950/40 border-emerald-500 text-white"
                              : "bg-[#0a0a0a] border-neutral-800 text-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold">{pm.label}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-emerald-400">
                            {pm.badge}
                          </span>
                        </button>
                      ))}
                      <div className="p-3 rounded-xl bg-[#0a0a0a] border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                        <p>Delivering to: <span className="text-white">{shippingAddress}</span></p>
                        <p>Receipt email: <span className="text-white">{customerEmail}</span></p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: ORDER CONFIRMATION RECEIPT */}
                  {checkoutStep === "complete" && (
                    <div
                      data-testid="checkout-confirmation"
                      className="p-5 rounded-2xl bg-[#0a0a0a] border border-emerald-500/40 space-y-4 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                          Shopify OS 2.0 Transaction Verified
                        </span>
                        <h4 className="text-lg font-bold text-white">
                          Thank You! Order #{orderNumber}
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Confirmation dispatched to {customerEmail} for ${cartTotal}.00 USD.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-left text-xs space-y-1">
                        <p className="text-neutral-400">Storefront: <strong className="text-white">{storeName || activePreset.name}</strong></p>
                        <p className="text-neutral-400">Items: <strong className="text-white">{cart.reduce((a, i) => a + i.quantity, 0)} products</strong></p>
                        <p className="text-neutral-400">Total Charged: <strong className="text-emerald-400">${cartTotal}.00 USD</strong></p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drawer Footer Actions */}
                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <div className="flex justify-between text-sm font-semibold text-white">
                    <span>Estimated Total:</span>
                    <span className="text-emerald-400 font-semibold">${cartTotal}.00 USD</span>
                  </div>

                  {checkoutStep === "cart" && (
                    <Button
                      size="md"
                      data-testid="proceed-to-checkout-btn"
                      disabled={cart.length === 0}
                      onClick={() => setCheckoutStep("shipping")}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      Proceed to Checkout →
                    </Button>
                  )}

                  {checkoutStep === "shipping" && (
                    <div className="flex gap-2">
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => setCheckoutStep("cart")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        data-testid="continue-to-payment-btn"
                        onClick={() => setCheckoutStep("payment")}
                        className="flex-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        Continue to Payment →
                      </Button>
                    </div>
                  )}

                  {checkoutStep === "payment" && (
                    <div className="flex gap-2">
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => setCheckoutStep("shipping")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        data-testid="complete-order-btn"
                        onClick={() => {
                          setOrderNumber(`OBS-${Math.floor(1000 + Math.random() * 9000)}`);
                          setCheckoutStep("complete");
                        }}
                        className="flex-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        Authorize ${cartTotal}.00 Now →
                      </Button>
                    </div>
                  )}

                  {checkoutStep === "complete" && (
                    <div className="space-y-2">
                      <Button
                        size="md"
                        onClick={handleDownloadThemeZip}
                        isLoading={isExporting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        Download This Store&apos;s Liquid ZIP
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCheckoutStep("cart");
                          setIsCartOpen(false);
                        }}
                        className="w-full"
                      >
                        Return to Storefront Preview
                      </Button>
                    </div>
                  )}
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
