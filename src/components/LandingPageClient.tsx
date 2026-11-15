"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  Film,
  Image as ImageIcon,
  ArrowLeftRight,
  Check,
  Eye,
  Box,
  Building2,
  Cpu,
  SlidersHorizontal,
  Palette,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { createProject, canCreateProject } from "@/lib/projects";
import { QuotaLimitModal } from "@/components/ui/QuotaLimitModal";
import {
  PARALLAX_THEMES,
  ParallaxCategory,
  ParallaxDepthPreset,
  ParallaxThemeProfile,
  detectParallaxIntent,
  synthesizeCustomParallaxTheme,
} from "@/lib/parallax";
import {
  extractBrandFromPrompt,
  convertWebsitePromptToShopifyPrompt,
  convertShopifyToWebsitePrompt,
  saveBuilderDraftTransaction,
  loadBuilderDraftTransaction,
} from "@/lib/builder-bridge";
import {
  WebsiteCustomConfig,
  WebsiteHeaderStyle,
  WebsiteHeroLayout,
  WebsiteSectionsConfig,
  WebsiteColorfulElementsConfig,
  DEFAULT_WEBSITE_CUSTOM_CONFIG,
  WEBSITE_ACCENT_PALETTES,
  WEBSITE_SURFACE_THEMES,
  WEBSITE_TYPOGRAPHY_OPTIONS,
  getWebsiteAccent,
  mapWebsiteAccentToShopifyTheme,
} from "@/lib/customization";

const STANDARD_SUGGESTIONS = [
  {
    label: "SaaS Landing",
    prompt:
      "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern luxury monochrome noir theme with high-contrast typography, pure white accents, and deep dark surfaces.",
  },
  {
    label: "Design Portfolio",
    prompt:
      "Design a minimalist portfolio for a Product Designer. The hero section should have a large, bold introduction. Below that, create a masonry grid gallery of project case studies with hover effects. Include an 'About Me' section with a photo placeholder and a skills list. End with a clean contact form. Use plenty of whitespace and large typography.",
  },
  {
    label: "Coffee Shop",
    prompt:
      "Build a cozy, inviting website for an artisanal coffee shop. Use a warm color palette (rich dark tones, warm espresso, creams, and silver highlights). Include a hero section with a video background placeholder, a menu section with prices, an 'Our Story' section with image placeholders, and a footer with location and hours. Use a serif font for headings to give it a classic feel.",
  },
  {
    label: "Waitlist Page",
    prompt:
      "Create a viral waitlist page for a stealth startup. The design should be hype-driven and futuristic. Center the email capture form and make it the focal point. Add a countdown timer placeholder. Include a 'Why Join?' section with exclusive benefits. Use a dark background with subtle glow effects.",
  },
];

const PARALLAX_CITY_SUGGESTIONS = [
  {
    label: "Audio Flagship (3D Product)",
    themeId: "obsidian-kinetic",
    category: "product" as const,
    prompt:
      "Create a product-dedicated 3D parallax launch website for Obsidian Acoustic Reference headphones. Include a 3D cursor-tilting monolith stage, exploded CNC titanium driver layers, finish variant switcher, and instant reserve CTA.",
  },
  {
    label: "Botanical Serum (3D Product)",
    themeId: "product-botanical",
    category: "product" as const,
    prompt:
      "Create a product-dedicated 3D parallax website for Aura Cellular Botanical luxury serum. Feature a floating 3D bottle showcase, exploded active bio-peptide spec layers, volume selector, and tactile noir glassmorphism.",
  },
  {
    label: "Tokyo Skyline (3D City)",
    themeId: "tokyo-noir",
    category: "city" as const,
    prompt:
      "Create a multi-layer 3D parallax city website for Tokyo Cyber Metropolis (Shinjuku & Shibuya Sector). Include deep perspective skyline layers, floating glassmorphic district cards, live transit telemetry, high-resolution nocturnal photography, and ambient motion video.",
  },
  {
    label: "Spatial SaaS OS (3D Stack)",
    themeId: "spatial-saas",
    category: "saas" as const,
    prompt:
      "Build a spatial 3D parallax SaaS platform landing page with floating isometric dashboard layers, interactive cursor perspective stack, developer API telemetry cards, and dark monochrome glassmorphism.",
  },
];

const PARALLAX_FOCUS_TABS: Array<{ id: "all" | ParallaxCategory; label: string }> = [
  { id: "product", label: "Product Dedicated 3D" },
  { id: "city", label: "City & Skyline 3D" },
  { id: "saas", label: "Spatial SaaS 3D" },
  { id: "all", label: "All 3D Themes" },
];

const DEPTH_PRESETS: Array<{ id: ParallaxDepthPreset; label: string }> = [
  { id: "interactive-3d", label: "Interactive 3D Tilt" },
  { id: "cinematic", label: "Cinematic Deep" },
  { id: "subtle", label: "Subtle Depth" },
];

const emptySubscribe = () => () => {};

export function LandingPageClient() {
  const [inputValue, setInputValue] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Parallax / 3D Mode State inside Writing Box
  const [parallaxMode, setParallaxMode] = useState(false);
  const [parallaxCategoryFilter, setParallaxCategoryFilter] = useState<"all" | ParallaxCategory>("product");
  const [explicitThemeId, setExplicitThemeId] = useState<string | null>(null);
  const [selectedParallaxTheme, setSelectedParallaxTheme] = useState<ParallaxThemeProfile>(
    PARALLAX_THEMES.find((t) => t.id === "obsidian-kinetic") || PARALLAX_THEMES[0]
  );
  const [depthPreset, setDepthPreset] = useState<ParallaxDepthPreset>("interactive-3d");
  const [enableTiltStage, setEnableTiltStage] = useState(true);
  const [enableExplodedSpecs, setEnableExplodedSpecs] = useState(true);
  const [autoMediaEnabled, setAutoMediaEnabled] = useState(true);
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [synthesizedPreview, setSynthesizedPreview] = useState<{
    imageUrl: string;
    videoUrl: string;
    status: string;
  } | null>(null);
  const [isSynthesizingMedia, setIsSynthesizingMedia] = useState(false);
  const [syncedFromShopify, setSyncedFromShopify] = useState<string | null>(null);

  // End-to-End Website Customization State (Accent Palettes, Colorful Micro-Elements, Fonts, Sections)
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteCustomConfig>(DEFAULT_WEBSITE_CUSTOM_CONFIG);
  const [showWebsiteCustomizer, setShowWebsiteCustomizer] = useState(false);

  const activeAccent = useMemo(() => getWebsiteAccent(websiteConfig.accentId), [websiteConfig.accentId]);

  const activeDisplayTheme = useMemo(() => {
    if (explicitThemeId) {
      return PARALLAX_THEMES.find((t) => t.id === explicitThemeId) || selectedParallaxTheme;
    }
    if (inputValue.trim()) {
      return synthesizeCustomParallaxTheme(inputValue, {
        category: parallaxCategoryFilter === "all" ? undefined : parallaxCategoryFilter,
        depthPreset,
        enableTiltStage,
        enableExplodedSpecs,
        enableVideoLayer: autoMediaEnabled,
      });
    }
    return selectedParallaxTheme;
  }, [
    explicitThemeId,
    inputValue,
    parallaxCategoryFilter,
    depthPreset,
    enableTiltStage,
    enableExplodedSpecs,
    autoMediaEnabled,
    selectedParallaxTheme,
  ]);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const router = useRouter();
  const { user, getProjectStats } = useAuth();
  const stats = getProjectStats();

  // Check URL params or cross-builder draft transaction on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlPrompt = params.get("prompt");
    const urlParallax = params.get("parallax");
    const urlTheme = params.get("theme");
    const fromSource = params.get("from");

    const timer = window.setTimeout(() => {
      if (urlPrompt) {
        setInputValue(urlPrompt);
        const detected = detectParallaxIntent(urlPrompt);
        if (urlParallax === "true" || detected.isParallax) {
          setParallaxMode(true);
          if (urlTheme) {
            const matchedTheme = PARALLAX_THEMES.find((t) => t.id === urlTheme);
            if (matchedTheme) {
              setSelectedParallaxTheme(matchedTheme);
              setExplicitThemeId(matchedTheme.id);
            }
          }
        }
        return;
      }

      const draft = loadBuilderDraftTransaction();
      if (draft) {
        if (draft.websiteAccentId && WEBSITE_ACCENT_PALETTES.some((p) => p.id === draft.websiteAccentId)) {
          const restoredAccent = draft.websiteAccentId as WebsiteCustomConfig["accentId"];
          setWebsiteConfig((prev) => ({ ...prev, accentId: restoredAccent }));
        }
        if (draft.prompt) {
          if (fromSource === "shopify" && draft.source === "shopify") {
            const converted = convertShopifyToWebsitePrompt(
              draft.prompt,
              draft.brandName || "Obsidian Flagship",
              draft.parallaxMode ?? true
            );
            setInputValue(converted.websitePrompt);
            setSyncedFromShopify(converted.brandName);
            if (draft.parallaxMode) {
              setParallaxMode(true);
            }
          } else if (draft.source === "website") {
            setInputValue(draft.prompt);
            if (draft.parallaxMode) {
              setParallaxMode(true);
              const matched = PARALLAX_THEMES.find((t) => t.id === draft.parallaxThemeId);
              if (matched) {
                setSelectedParallaxTheme(matched);
                setExplicitThemeId(matched.id);
              }
            }
          }
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Sync active writing box state to BuilderBridge for seamless Website <-> Shopify transitions
  const handlePromptChange = (nextVal: string) => {
    setInputValue(nextVal);
    const matchesPresetPrompt =
      PARALLAX_CITY_SUGGESTIONS.some((s) => s.prompt === nextVal) ||
      PARALLAX_THEMES.some((t) => t.defaultPrompt === nextVal);
    if (!matchesPresetPrompt) {
      setExplicitThemeId(null);
    }

    const detected = detectParallaxIntent(nextVal);
    if (detected.isParallax && !parallaxMode) {
      setParallaxMode(true);
    }
    saveBuilderDraftTransaction({
      source: "website",
      prompt: nextVal,
      brandName: extractBrandFromPrompt(nextVal),
      parallaxMode,
      parallaxThemeId: matchesPresetPrompt ? explicitThemeId || undefined : undefined,
      websiteAccentId: websiteConfig.accentId,
      shopifyThemeId: mapWebsiteAccentToShopifyTheme(websiteConfig.accentId),
    });
  };

  const handleToggleParallaxMode = () => {
    const nextMode = !parallaxMode;
    setParallaxMode(nextMode);
    // Never overwrite or auto-fill the prompt when toggling Parallax Mode; wait for user prompt or suggestion click
    saveBuilderDraftTransaction({
      source: "website",
      prompt: inputValue,
      brandName: extractBrandFromPrompt(inputValue) || activeDisplayTheme.name,
      parallaxMode: nextMode,
      parallaxThemeId: explicitThemeId || undefined,
      websiteAccentId: websiteConfig.accentId,
      shopifyThemeId: mapWebsiteAccentToShopifyTheme(websiteConfig.accentId),
    });
  };

  const updateWebsiteAccent = (accentId: WebsiteCustomConfig["accentId"]) => {
    setWebsiteConfig((prev) => ({ ...prev, accentId }));
    saveBuilderDraftTransaction({
      source: "website",
      prompt: inputValue,
      brandName: extractBrandFromPrompt(inputValue) || activeDisplayTheme.name,
      parallaxMode,
      parallaxThemeId: explicitThemeId || undefined,
      websiteAccentId: accentId,
      shopifyThemeId: mapWebsiteAccentToShopifyTheme(accentId),
    });
  };

  const toggleWebsiteSection = (key: keyof WebsiteSectionsConfig) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] },
    }));
  };

  const toggleWebsiteElement = (key: keyof WebsiteColorfulElementsConfig) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      elements: { ...prev.elements, [key]: !prev.elements[key] },
    }));
  };

  const handleSelectParallaxCategory = (cat: "all" | ParallaxCategory) => {
    setParallaxCategoryFilter(cat);
    if (cat !== "all" && selectedParallaxTheme.category !== cat) {
      const firstMatch = PARALLAX_THEMES.find((t) => t.category === cat);
      if (firstMatch) {
        setSelectedParallaxTheme(firstMatch);
      }
    }
  };

  const handleSelectParallaxTheme = (theme: ParallaxThemeProfile, customPrompt?: string) => {
    setSelectedParallaxTheme(theme);
    setExplicitThemeId(theme.id);
    const matchingSuggestion = PARALLAX_CITY_SUGGESTIONS.find((s) => s.themeId === theme.id);
    const nextPrompt = customPrompt || matchingSuggestion?.prompt || theme.defaultPrompt;
    setInputValue(nextPrompt);
    saveBuilderDraftTransaction({
      source: "website",
      prompt: nextPrompt,
      brandName: theme.city,
      parallaxMode: true,
      parallaxThemeId: theme.id,
    });
  };

  const handleSynthesizeMediaPreview = async () => {
    if (isSynthesizingMedia) return;
    setIsSynthesizingMedia(true);
    try {
      const promptToUse = inputValue.trim() || `${activeDisplayTheme.name} ${activeDisplayTheme.city}`;
      const [imgRes, vidRes] = await Promise.all([
        fetch("/api/media/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptToUse, themeId: explicitThemeId || activeDisplayTheme.id }),
        }),
        fetch("/api/media/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptToUse, themeId: explicitThemeId || activeDisplayTheme.id }),
        }),
      ]);
      const imgData = (await imgRes.json()) as { imageUrl?: string };
      const vidData = (await vidRes.json()) as { videoUrl?: string };
      setSynthesizedPreview({
        imageUrl: imgData.imageUrl || activeDisplayTheme.heroImage,
        videoUrl: vidData.videoUrl || activeDisplayTheme.videoSrc,
        status: `Synthesized 4K Layer Image + 60fps Motion Reel for ${activeDisplayTheme.name}`,
      });
    } catch {
      setSynthesizedPreview({
        imageUrl: activeDisplayTheme.heroImage,
        videoUrl: activeDisplayTheme.videoSrc,
        status: `Ready: ${activeDisplayTheme.name} 3D Assets Loaded`,
      });
    } finally {
      setIsSynthesizingMedia(false);
    }
  };

  const launchGeneration = () => {
    const finalPrompt = inputValue.trim();
    if (!finalPrompt) return;

    if (!canCreateProject(stats.isPro)) {
      setShowQuotaModal(true);
      return;
    }

    const projectId = `proj-obsidian-${Date.now()}`;
    const thumbnail = parallaxMode ? activeDisplayTheme.heroImage : "/images/parallax-tokyo.jpg";

    createProject({
      id: projectId,
      userId: user?.id || "guest",
      title: parallaxMode
        ? `${activeDisplayTheme.name} 3D — ${finalPrompt.slice(0, 24)}`
        : finalPrompt.slice(0, 40) + "...",
      prompt: finalPrompt,
      type: "website",
      thumbnail,
      data: {
        prompt: finalPrompt,
        parallaxMode,
        parallaxThemeId: explicitThemeId || undefined,
        parallaxCategory: parallaxCategoryFilter === "all" ? undefined : parallaxCategoryFilter,
        depthPreset,
        enableTiltStage,
        enableExplodedSpecs,
        enableVideoLayer: autoMediaEnabled,
        websiteConfig,
      },
    });

    const enabledSectionKeys = Object.entries(websiteConfig.sections)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    const enabledElementKeys = Object.entries(websiteConfig.elements)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");

    const query = new URLSearchParams({
      type: "website",
      initialPrompt: finalPrompt,
      accent: websiteConfig.accentId,
      surface: websiteConfig.surfaceId,
      font: websiteConfig.typographyId,
      headerStyle: websiteConfig.headerStyle,
      heroLayout: websiteConfig.heroLayout,
      sections: enabledSectionKeys,
      elements: enabledElementKeys,
    });
    if (parallaxMode) {
      query.set("parallax", "true");
      if (explicitThemeId) {
        query.set("parallaxTheme", explicitThemeId);
      }
      if (parallaxCategoryFilter !== "all") {
        query.set("parallaxCategory", parallaxCategoryFilter);
      }
      query.set("depthPreset", depthPreset);
      query.set("tiltStage", String(enableTiltStage));
      query.set("explodedSpecs", String(enableExplodedSpecs));
      query.set("videoLayer", String(autoMediaEnabled));
    }

    router.push(`/editor/${projectId}?${query.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    launchGeneration();
  };

  const handleTransitionToShopify = () => {
    const basePrompt =
      inputValue.trim() ||
      (parallaxMode
        ? `${activeDisplayTheme.name} flagship concept store with architectural luxury products`
        : "Modern luxury monochrome brand flagship");
    const converted = convertWebsitePromptToShopifyPrompt(basePrompt);
    const mappedShopifyTheme = mapWebsiteAccentToShopifyTheme(websiteConfig.accentId);

    saveBuilderDraftTransaction({
      source: "website",
      prompt: converted.shopifyPrompt,
      brandName: converted.storeName,
      parallaxMode,
      parallaxThemeId: explicitThemeId || undefined,
      presetId: converted.suggestedPresetId,
      websiteAccentId: websiteConfig.accentId,
      shopifyThemeId: mappedShopifyTheme,
    });

    router.push(
      `/builder?from=website&prompt=${encodeURIComponent(converted.shopifyPrompt)}&brand=${encodeURIComponent(
        converted.storeName
      )}&accent=${encodeURIComponent(websiteConfig.accentId)}`
    );
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
          prompt: parallaxMode
            ? `Rewrite and enhance this 3D Parallax & City Website prompt with multi-plane depth layers, architectural atmosphere, image synthesis, and video reel details: "${original}"`
            : `Rewrite and enhance this website prompt to be more detailed, structured, and precise for an AI website builder: "${original}"`,
          projectId: "enhance",
          pageName: "prompt-enhance",
          parallaxMode,
          websiteConfig,
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
    <main
      onMouseMove={(e) => {
        if (!parallaxMode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setPointerOffset({ x: normX, y: normY });
      }}
      className="relative flex flex-col items-center justify-center px-4 pt-16 md:pt-24 pb-24 overflow-hidden"
    >
      {/* ── Theme-Driven Parallax Ambient Stage (Active when Parallax Mode is ON) ── */}
      {parallaxMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden z-0 transition-opacity duration-700"
        >
          {/* Far Horizon Radial Glow */}
          <div
            style={{
              transform: `translate3d(${pointerOffset.x * -18}px, ${pointerOffset.y * -14}px, 0)`,
              background: `radial-gradient(circle at 50% 28%, ${activeDisplayTheme.accentGlow}, transparent 68%)`,
            }}
            className="absolute -inset-20 transition-transform duration-300 ease-out"
          />

          {/* Perspective Architectural Grid Layer */}
          <div
            style={{
              transform: `translate3d(${pointerOffset.x * 14}px, ${pointerOffset.y * 10}px, 0)`,
              backgroundImage: `linear-gradient(to right, ${activeDisplayTheme.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${activeDisplayTheme.gridColor} 1px, transparent 1px)`,
              backgroundSize: "56px 56px",
            }}
            className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] transition-transform duration-200 ease-out"
          />

          {/* Theme-Specific Animated Silhouette / Geometry */}
          {activeDisplayTheme.id === "tokyo-noir" && (
            <div
              style={{
                transform: `translate3d(${pointerOffset.x * -28}px, ${pointerOffset.y * -12}px, 0)`,
              }}
              className="absolute bottom-0 inset-x-0 h-64 flex items-end justify-center gap-2 opacity-25 transition-transform duration-300"
            >
              {[42, 68, 54, 88, 62, 95, 74, 58, 82, 48, 76, 64, 90, 52, 40].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${h}%` }}
                  className="w-6 sm:w-10 bg-gradient-to-t from-neutral-700 via-neutral-800/60 to-transparent border-t border-x border-white/20 rounded-t-sm animate-pulse"
                />
              ))}
            </div>
          )}

          {activeDisplayTheme.id === "alpine-horizon" && (
            <div
              style={{
                transform: `translate3d(${pointerOffset.x * -24}px, ${pointerOffset.y * -10}px, 0)`,
              }}
              className="absolute bottom-0 inset-x-0 h-60 flex items-end justify-center opacity-25 transition-transform duration-300"
            >
              <div className="w-full max-w-5xl h-48 border-t border-white/25 bg-gradient-to-t from-neutral-800/50 to-transparent rounded-t-[100%] scale-x-125" />
            </div>
          )}

          {activeDisplayTheme.id === "manhattan-vertical" && (
            <div
              style={{
                transform: `translate3d(${pointerOffset.x * -32}px, ${pointerOffset.y * -16}px, 0)`,
              }}
              className="absolute inset-y-0 inset-x-12 flex justify-between opacity-20 transition-transform duration-300"
            >
              {[1, 2, 3, 4, 5, 6].map((col) => (
                <div key={col} className="w-px h-full bg-gradient-to-b from-transparent via-white/40 to-transparent" />
              ))}
            </div>
          )}

          {(activeDisplayTheme.category === "product" || activeDisplayTheme.id === "spatial-saas" || activeDisplayTheme.category === "city") &&
            activeDisplayTheme.id !== "tokyo-noir" &&
            activeDisplayTheme.id !== "alpine-horizon" &&
            activeDisplayTheme.id !== "manhattan-vertical" && (
            <div
              style={{
                transform: `translate3d(${pointerOffset.x * 22}px, ${pointerOffset.y * 22}px, 0)`,
              }}
              className="absolute top-24 left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full border border-white/10 flex items-center justify-center opacity-35 transition-transform duration-300"
            >
              <div className="w-[380px] h-[380px] rounded-full border border-white/15" />
            </div>
          )}
        </div>
      )}

      {/* ── Hero Section ── */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5">
        <div
          style={{ borderColor: websiteConfig.elements.tintedBadges ? activeAccent.borderTint : undefined }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/80 text-xs text-neutral-300"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: activeAccent.primary,
              boxShadow: `0 0 10px ${activeAccent.primary}`,
            }}
          />
          <Layers className="w-3 h-3 text-white" />
          <span>
            {parallaxMode
              ? `3D Parallax Engine Active • ${inputValue.trim() ? activeDisplayTheme.name : "Type any prompt or click a suggestion"} (${activeDisplayTheme.coordinates})`
              : `AI Website Studio • ${activeAccent.name} Edition`}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          {parallaxMode ? (
            inputValue.trim() ? (
              <>
                Launch{" "}
                <span className="font-serif italic text-neutral-200">
                  {activeDisplayTheme.name}
                </span>{" "}
                in 3D
              </>
            ) : (
              <>
                Build any concept{" "}
                <span className="font-serif italic text-neutral-200">in 3D Parallax</span>
              </>
            )
          ) : (
            <>
              Build websites{" "}
              <span className="font-serif italic text-neutral-300">beautifully</span>
            </>
          )}
        </h1>

        <p className="text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
          {parallaxMode
            ? "Type even a short idea below — Obsidian expands your prompt in the background with pinned sticky 3D scroll choreography, specular cursor tilt, and motion video."
            : "Describe what you want. Watch it come to life in real-time. Export production-ready code."}
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

      {/* Synced from Shopify Notification Banner */}
      {syncedFromShopify && (
        <div className="relative z-10 w-full max-w-2xl mt-6 px-4 py-2.5 rounded-2xl border border-neutral-700 bg-neutral-900/90 flex items-center justify-between gap-3 text-xs text-neutral-200">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-white shrink-0" />
            <span>
              Synced from Shopify Studio: <strong className="text-white">{syncedFromShopify}</strong> converted for Website / Parallax generation.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSyncedFromShopify(null)}
            className="text-neutral-400 hover:text-white text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Writing Box with Built-In Parallax Mode & Theme Animation ── */}
      <div className="relative z-10 w-full max-w-2xl mt-8">
        <div
          className={`relative rounded-3xl border transition-all duration-500 ${
            parallaxMode
              ? "border-white/40 bg-neutral-950/90 shadow-[0_0_70px_-15px_rgba(255,255,255,0.22)] ring-1 ring-white/15"
              : "border-neutral-800 bg-neutral-900/60 shadow-2xl"
          } backdrop-blur-2xl overflow-hidden`}
        >
          {/* Top Writing Box Mode Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 border-b border-neutral-800/80 bg-neutral-900/70">
            <div className="flex items-center gap-2">
              {/* Parallax / 3D Mode Toggle inside Writing Box */}
              <button
                type="button"
                data-testid="parallax-mode-toggle"
                onClick={handleToggleParallaxMode}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  parallaxMode
                    ? "bg-white text-neutral-950 border-white shadow-md shadow-white/10"
                    : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Parallax / 3D Mode</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                    parallaxMode ? "bg-neutral-950 text-white" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {parallaxMode ? "ON" : "OFF"}
                </span>
              </button>

              {/* Auto Image + Video Pipeline Toggle */}
              <button
                type="button"
                onClick={() => setAutoMediaEnabled((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                  autoMediaEnabled
                    ? "bg-neutral-800/90 text-neutral-200 border-neutral-700"
                    : "bg-neutral-900/40 text-neutral-500 border-neutral-800"
                }`}
                title="Automatically synthesize 4K imagery & 60fps motion video layers"
              >
                <Film className="w-3 h-3 text-white" />
                <ImageIcon className="w-3 h-3 text-white" />
                <span className="hidden sm:inline">Auto Image + Video</span>
                {autoMediaEnabled && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>

              {/* Direct Website -> Shopify Transaction Bridge Button */}
            <button
              type="button"
              data-testid="bridge-to-shopify-btn"
              onClick={handleTransitionToShopify}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[11px] font-medium transition-colors cursor-pointer"
              title="Convert this website concept into a Shopify Liquid 2.0 store"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>Send to Shopify Studio →</span>
            </button>
          </div>

          {/* ── Quick Accent Swatches & End-to-End Customizer Toggle Bar ── */}
          <div className="px-4 py-2 border-b border-neutral-800/70 bg-neutral-950/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Palette:
              </span>
              <div className="flex items-center gap-1.5">
                {WEBSITE_ACCENT_PALETTES.map((pal) => {
                  const selected = websiteConfig.accentId === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      data-testid={`website-accent-${pal.id}`}
                      onClick={() => updateWebsiteAccent(pal.id)}
                      title={pal.name}
                      aria-label={`Select ${pal.name} palette`}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer flex items-center justify-center border ${
                        selected
                          ? "scale-110 border-white ring-2 ring-white/30"
                          : "border-zinc-700 hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${pal.primary}, ${pal.secondary})`,
                      }}
                    >
                      {selected && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: pal.onPrimary }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                style={{
                  backgroundColor: activeAccent.softBg,
                  borderColor: activeAccent.borderTint,
                  color: activeAccent.secondary,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: activeAccent.primary }}
                />
                {activeAccent.name}
              </span>
            </div>

            <button
              type="button"
              data-testid="toggle-website-customizer"
              onClick={() => setShowWebsiteCustomizer((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                showWebsiteCustomizer
                  ? "bg-white text-zinc-950 border-white"
                  : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Customize Elements & Sections</span>
              {showWebsiteCustomizer ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* ── Expandable End-to-End Website Customization Drawer ── */}
          {showWebsiteCustomizer && (
            <div
              data-testid="website-customizer-panel"
              className="px-4 py-3.5 bg-zinc-950/95 border-b border-zinc-800 space-y-3.5 text-left"
            >
              {/* Surface Canvas + Header + Hero Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-zinc-400">Surface Canvas</p>
                  <div className="flex flex-wrap gap-1">
                    {WEBSITE_SURFACE_THEMES.map((surf) => (
                      <button
                        key={surf.id}
                        type="button"
                        onClick={() =>
                          setWebsiteConfig((prev) => ({ ...prev, surfaceId: surf.id }))
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium border flex items-center gap-1.5 cursor-pointer ${
                          websiteConfig.surfaceId === surf.id
                            ? "bg-zinc-800 border-white text-white"
                            : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-zinc-600"
                          style={{ backgroundColor: surf.bg }}
                        />
                        <span>{surf.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-zinc-400">Navbar Pattern</p>
                  <div className="flex flex-wrap gap-1">
                    {(
                      [
                        { id: "sticky-glass", label: "Sticky Glass" },
                        { id: "minimal-split", label: "Minimal Split" },
                        { id: "centered-editorial", label: "Centered" },
                      ] as Array<{ id: WebsiteHeaderStyle; label: string }>
                    ).map((hs) => (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() =>
                          setWebsiteConfig((prev) => ({ ...prev, headerStyle: hs.id }))
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium border cursor-pointer ${
                          websiteConfig.headerStyle === hs.id
                            ? "bg-zinc-800 border-white text-white"
                            : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {hs.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-zinc-400">Hero Architecture</p>
                  <div className="flex flex-wrap gap-1">
                    {(
                      [
                        { id: "centered", label: "Centered" },
                        { id: "split", label: "Split Media" },
                        { id: "bento", label: "Bento Stage" },
                      ] as Array<{ id: WebsiteHeroLayout; label: string }>
                    ).map((hl) => (
                      <button
                        key={hl.id}
                        type="button"
                        onClick={() =>
                          setWebsiteConfig((prev) => ({ ...prev, heroLayout: hl.id }))
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium border cursor-pointer ${
                          websiteConfig.heroLayout === hl.id
                            ? "bg-zinc-800 border-white text-white"
                            : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {hl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typography Pairings */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <p className="text-[10px] font-mono uppercase text-zinc-400">Typography Pairing</p>
                <div className="flex flex-wrap gap-1.5">
                  {WEBSITE_TYPOGRAPHY_OPTIONS.map((typo) => (
                    <button
                      key={typo.id}
                      type="button"
                      onClick={() =>
                        setWebsiteConfig((prev) => ({ ...prev, typographyId: typo.id }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer flex items-center gap-1.5 ${
                        websiteConfig.typographyId === typo.id
                          ? "bg-white text-zinc-950 border-white"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <span>{typo.name}</span>
                      <span className="text-[9px] opacity-70">{typo.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorful UI Micro-Elements */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <p className="text-[10px] font-mono uppercase text-zinc-400">
                  Small Colorful UI Elements
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { key: "gradientGlowCta", label: "Gradient Glow CTA", dot: "#8b5cf6" },
                      { key: "colorfulStatusDots", label: "Live Status Dots", dot: "#10b981" },
                      { key: "tintedBadges", label: "Tinted Pill Badges", dot: "#06b6d4" },
                      { key: "ratingStars", label: "5★ Amber Ratings", dot: "#f59e0b" },
                      { key: "accentBorders", label: "Accent Card Borders", dot: "#f43f5e" },
                    ] as Array<{
                      key: keyof WebsiteColorfulElementsConfig;
                      label: string;
                      dot: string;
                    }>
                  ).map((el) => {
                    const active = websiteConfig.elements[el.key];
                    return (
                      <button
                        key={el.key}
                        type="button"
                        data-testid={`element-toggle-${el.key}`}
                        onClick={() => toggleWebsiteElement(el.key)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                          active
                            ? "bg-zinc-900 text-white border-zinc-600"
                            : "bg-zinc-950 text-zinc-500 border-zinc-800"
                        }`}
                      >
                        {el.key === "ratingStars" ? (
                          <Star
                            className="w-3 h-3"
                            style={{ color: active ? el.dot : "#52525b", fill: active ? el.dot : "none" }}
                          />
                        ) : (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: active ? el.dot : "#52525b",
                              boxShadow: active ? `0 0 8px ${el.dot}` : "none",
                            }}
                          />
                        )}
                        <span>{el.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* End-to-End Architecture Sections */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <p className="text-[10px] font-mono uppercase text-zinc-400">
                  End-to-End Website Sections & SEO
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      { key: "announcementBar", label: "Promo Ticker" },
                      { key: "trustMetrics", label: "Trust Metrics" },
                      { key: "featuresBento", label: "Bento Features" },
                      { key: "pricingMatrix", label: "Pricing Matrix" },
                      { key: "testimonials", label: "Testimonials" },
                      { key: "faqAccordion", label: "FAQ Accordion" },
                      { key: "leadCapture", label: "Lead Capture" },
                      { key: "seoSchema", label: "SEO & JSON-LD" },
                    ] as Array<{ key: keyof WebsiteSectionsConfig; label: string }>
                  ).map((sec) => {
                    const active = websiteConfig.sections[sec.key];
                    return (
                      <button
                        key={sec.key}
                        type="button"
                        data-testid={`section-toggle-${sec.key}`}
                        onClick={() => toggleWebsiteSection(sec.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border flex items-center justify-between cursor-pointer transition-colors ${
                          active
                            ? "bg-zinc-900 border-zinc-600 text-white"
                            : "bg-zinc-950 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0 ml-1"
                          style={{ backgroundColor: active ? activeAccent.primary : "#3f3f46" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Dedicated 3D Parallax Focus Categories, Presets & Depth Controls */}
          {parallaxMode && (
            <div className="px-4 py-3 bg-neutral-950/95 border-b border-neutral-800/80 space-y-3 animate-fade-in-up">
              {/* Focus Category Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PARALLAX_FOCUS_TABS.map((tab) => {
                    const active = parallaxCategoryFilter === tab.id;
                    const Icon =
                      tab.id === "product"
                        ? Box
                        : tab.id === "city"
                        ? Building2
                        : tab.id === "saas"
                        ? Cpu
                        : Compass;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        data-testid={`parallax-category-${tab.id}`}
                        onClick={() => handleSelectParallaxCategory(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                          active
                            ? "bg-white text-neutral-950 border-white shadow-sm"
                            : "bg-neutral-900/70 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  {explicitThemeId ? activeDisplayTheme.coordinates : "CUSTOM OR SUGGESTION"}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>
                  Suggested 3D Themes (click a suggestion card to insert its prompt, or type your own below)
                </span>
              </div>

              {/* Filtered Suggestion Cards (Product Dedicated, City, or Spatial SaaS) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PARALLAX_THEMES.filter(
                  (t) => parallaxCategoryFilter === "all" || t.category === parallaxCategoryFilter
                ).map((theme) => {
                  const isSelected = explicitThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      data-testid={`parallax-theme-${theme.id}`}
                      onClick={() => handleSelectParallaxTheme(theme)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-neutral-800/95 border-white text-white shadow-sm"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-300 font-semibold truncate">
                          {theme.city}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{theme.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {theme.priceLabel ? `${theme.priceLabel} • Suggest` : "Click to suggest"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 3D Depth & Dedicated Stage Modules Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/70">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1 mr-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Depth:</span>
                  </span>
                  {DEPTH_PRESETS.map((dp) => (
                    <button
                      key={dp.id}
                      type="button"
                      onClick={() => setDepthPreset(dp.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                        depthPreset === dp.id
                          ? "bg-neutral-800 border-white/60 text-white"
                          : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {dp.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setEnableTiltStage((v) => !v)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                      enableTiltStage
                        ? "bg-neutral-800 border-neutral-600 text-white"
                        : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                    }`}
                  >
                    3D Tilt Stage {enableTiltStage ? "✓" : "○"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnableExplodedSpecs((v) => !v)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                      enableExplodedSpecs
                        ? "bg-neutral-800 border-neutral-600 text-white"
                        : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                    }`}
                  >
                    Exploded Specs {enableExplodedSpecs ? "✓" : "○"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Prompt Form */}
          <form onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              value={inputValue}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder={
                parallaxMode
                  ? "Describe ANY 3D product, city, or site (even 3 words like 'luxury titanium watch') — or click a suggestion above..."
                  : "Describe your website..."
              }
              className="w-full min-h-[126px] resize-none bg-transparent px-5 pt-4 pb-16 text-[15px] text-white placeholder:text-neutral-600 focus:ring-0 focus:outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  launchGeneration();
                }
              }}
            />

            <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {parallaxMode && (
                  <button
                    type="button"
                    onClick={handleSynthesizeMediaPreview}
                    disabled={isSynthesizingMedia}
                    className="h-9 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Eye className="w-3.5 h-3.5 text-white" />
                    <span>{isSynthesizingMedia ? "Synthesizing Assets..." : "Preview 3D Assets"}</span>
                  </button>
                )}
                {inputValue.trim().length > 0 && (
                  <button
                    type="button"
                    data-testid="clear-prompt-btn"
                    onClick={() => {
                      setInputValue("");
                      setExplicitThemeId(null);
                    }}
                    className="h-9 px-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
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
                  data-testid="generate-website-btn"
                  disabled={!inputValue.trim()}
                  style={
                    websiteConfig.elements.gradientGlowCta && websiteConfig.accentId !== "pure-white"
                      ? {
                          background: `linear-gradient(135deg, ${activeAccent.primary}, ${activeAccent.secondary})`,
                          color: activeAccent.onPrimary,
                          boxShadow: `0 10px 26px -8px ${activeAccent.glow}`,
                        }
                      : undefined
                  }
                  className="h-9 px-4 rounded-xl bg-white text-neutral-950 hover:opacity-90 transition-all flex items-center gap-1.5 text-sm font-semibold disabled:opacity-30 cursor-pointer shadow-lg"
                >
                  <span>
                    {parallaxMode
                      ? explicitThemeId
                        ? `Launch ${activeDisplayTheme.name.split(" ")[0]} 3D`
                        : inputValue.trim()
                        ? "Launch Custom 3D"
                        : "Enter Prompt or Pick Suggestion"
                      : "Generate"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Live Interactive 3D Perspective Stage Preview (Visible in Parallax / 3D Mode) ── */}
      {parallaxMode && (
        <div
          className="relative z-10 w-full max-w-2xl mt-6 rounded-3xl border border-neutral-800 bg-neutral-950/95 overflow-visible shadow-2xl animate-fade-in-up"
          style={{ perspective: "1200px" }}
        >
          <div className="px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs rounded-t-3xl bg-neutral-950">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                Interactive 3D Stage: {activeDisplayTheme.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-neutral-400">
              {depthPreset.toUpperCase()} • Move Cursor to Tilt 3D Planes
            </span>
          </div>

          <div
            className="relative h-64 sm:h-72 overflow-hidden bg-black rounded-b-3xl"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Tilting Stage Wrapper */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: enableTiltStage
                  ? `rotateX(${(-pointerOffset.y * (depthPreset === "subtle" ? 5 : 11)).toFixed(2)}deg) rotateY(${(pointerOffset.x * (depthPreset === "subtle" ? 5 : 11)).toFixed(2)}deg)`
                  : "none",
              }}
              className="relative w-full h-full transition-transform duration-150 ease-out"
            >
              {/* Plane Z-0 (-35px): Deep Horizon / Studio Plate */}
              <img
                src={synthesizedPreview?.imageUrl || activeDisplayTheme.heroImage}
                alt={activeDisplayTheme.name}
                style={{
                  transform: `translate3d(${pointerOffset.x * -16}px, ${pointerOffset.y * -12}px, -35px) scale(1.12)`,
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-55 transition-transform duration-150 ease-out"
              />

              {/* Plane Z-1 (-15px): Ambient 60fps Motion Video */}
              {autoMediaEnabled && (
                <video
                  key={synthesizedPreview?.videoUrl || activeDisplayTheme.videoSrc}
                  src={synthesizedPreview?.videoUrl || activeDisplayTheme.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    transform: `translate3d(${pointerOffset.x * -8}px, ${pointerOffset.y * -6}px, -15px) scale(1.06)`,
                  }}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen pointer-events-none"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

              {/* Plane Z-2 (+38px): Floating 3D HUD & Exploded Spec Layers */}
              <div
                style={{
                  transform: `translate3d(${pointerOffset.x * 16}px, ${pointerOffset.y * 12}px, 38px)`,
                  transformStyle: "preserve-3d",
                }}
                className="relative z-10 h-full p-5 flex flex-col justify-between transition-transform duration-150 ease-out"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/20 backdrop-blur-md text-[10px] font-mono text-white">
                    {activeDisplayTheme.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-mono font-bold">
                    {activeDisplayTheme.priceLabel || "3D Z-STAGE"}
                  </span>
                </div>

                {enableExplodedSpecs ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {activeDisplayTheme.landmarks.slice(0, 3).map((lm, i) => (
                      <div
                        key={i}
                        style={{
                          transform: `translateZ(${18 + i * 8}px)`,
                        }}
                        className="p-2.5 rounded-xl bg-black/85 border border-white/20 backdrop-blur-md shadow-xl"
                      >
                        <p className="text-[9px] font-mono uppercase text-neutral-400 truncate">
                          +{lm.zDepth}PX • {lm.district.split("•")[0]}
                        </p>
                        <p className="text-xs font-bold text-white mt-0.5 truncate">{lm.name}</p>
                        <p className="text-[10px] font-mono text-neutral-300">{lm.metric}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{activeDisplayTheme.name}</p>
                      <p className="text-[10px] text-neutral-400">{activeDisplayTheme.coordinates}</p>
                    </div>
                    <span className="text-xs font-mono text-white">{activeDisplayTheme.elevation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {synthesizedPreview && (
            <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-300 rounded-b-3xl">
              <span>✓ {synthesizedPreview.status}</span>
              <button
                type="button"
                onClick={launchGeneration}
                className="text-white font-semibold hover:underline cursor-pointer"
              >
                Open Full 3D Website in Studio →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Suggestions (Switches between Standard & Parallax City Presets) ── */}
      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
        {(parallaxMode ? PARALLAX_CITY_SUGGESTIONS : STANDARD_SUGGESTIONS).map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              if ("themeId" in s && typeof s.themeId === "string") {
                const found = PARALLAX_THEMES.find((t) => t.id === s.themeId);
                if (found) {
                  handleSelectParallaxTheme(found, s.prompt);
                  return;
                }
              }
              handlePromptChange(s.prompt);
            }}
            className="px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/70 text-xs text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Upgraded Website <-> Shopify Studio Transaction Card ── */}
      <div className="relative z-10 mt-14 w-full max-w-2xl">
        <div className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Shopify Liquid 2.0 Studio & Storefront Bridge</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                1-Click Sync
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Convert your current website or parallax city concept directly into a usable Shopify OS 2.0 store with live checkout and ZIP export.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTransitionToShopify}
              className="px-3.5 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Convert & Open Shopify</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-px max-w-3xl mx-auto w-full border border-neutral-800/60 rounded-2xl overflow-hidden">
        {[
          {
            title: "Multi-layer 3D Parallax",
            desc: "Build spatial city websites and architectural flagships with kinetic scroll depth planes.",
            dot: "#8b5cf6",
          },
          {
            title: "End-to-End Color & UI Elements",
            desc: "Customize accent palettes, typography pairings, pricing tables, FAQs, and Schema.org SEO.",
            dot: "#06b6d4",
          },
          {
            title: "Website ↔ Shopify Bridge",
            desc: "Seamlessly transition any website concept into a production Shopify Liquid 2.0 storefront.",
            dot: "#10b981",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 bg-neutral-900/30 hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: f.dot, boxShadow: `0 0 8px ${f.dot}` }}
              />
              <h3 className="text-sm font-medium text-white">{f.title}</h3>
            </div>
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
