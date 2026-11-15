import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  buildBackgroundParallaxPrompt,
  buildUniversalParallaxRuntimeScript,
  detectParallaxIntent,
  generateParallaxWebsiteHtml,
  ParallaxGenerationOptions,
  synthesizeCustomParallaxTheme,
} from "@/lib/parallax";
import {
  buildWebsiteCustomizationPrompt,
  buildWebsiteEndToEndSupplementalSections,
  buildWebsiteThemeStyleBlock,
  generateStandardCustomWebsiteHtml,
  mergeWebsiteConfig,
  WebsiteCustomConfig,
} from "@/lib/customization";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL_NAME || "gemini-4-hydrogen";

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || "";
    const projectId: string = body?.projectId || "";
    const pageName: string = body?.pageName || "Home Page";
    const parallaxMode: boolean = Boolean(body?.parallaxMode);
    const parallaxThemeId: string | undefined =
      typeof body?.parallaxThemeId === "string" && body.parallaxThemeId.trim().length > 0
        ? body.parallaxThemeId.trim()
        : undefined;
    const parallaxOptions: ParallaxGenerationOptions | undefined =
      body?.parallaxOptions && typeof body.parallaxOptions === "object"
        ? (body.parallaxOptions as ParallaxGenerationOptions)
        : undefined;
    const websiteConfig: WebsiteCustomConfig | undefined =
      body?.websiteConfig && typeof body.websiteConfig === "object"
        ? mergeWebsiteConfig(body.websiteConfig as Partial<WebsiteCustomConfig>)
        : undefined;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const isEnhanceRequest =
      pageName === "shopify-enhance" ||
      pageName === "prompt-enhance" ||
      pageName === "refine" ||
      prompt.startsWith("Rewrite and enhance") ||
      prompt.startsWith("Expand this design");

    // ── 1. Prompt Enhancement Mode ──
    if (isEnhanceRequest) {
      const cleanPrompt = extractSubjectFromPrompt(prompt);
      const isShopifyEnhance = pageName.includes("shopify") || projectId.includes("shopify");
      const enhancedText = generateEnhancedPromptText(cleanPrompt, isShopifyEnhance, parallaxMode);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = enhancedText.split(" ");
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(" ") + " ";
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 18));
          }
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // ── 2. Full Page / Parallax / Liquid HTML Generation Mode ──
    const isShopify =
      projectId.includes("shopify") ||
      pageName.toLowerCase().includes("store") ||
      prompt.toLowerCase().includes("shopify") ||
      prompt.toLowerCase().includes("liquid");

    const { isParallax, theme: detectedParallaxTheme } = detectParallaxIntent(
      prompt,
      parallaxMode || projectId.includes("parallax"),
      parallaxThemeId
    );

    const systemInstruction = `You are an expert AI front-end engineer, spatial 3D parallax architect, and Shopify Liquid Theme designer.
Generate a complete, modern, responsive HTML page styled with Tailwind CSS utility classes using Obsidian's dark luxury aesthetic customized with the user's selected color accents, typography, and modular sections.

DESIGN SPECIFICATIONS:
1. Palette: Deep dark background (bg-zinc-950), crisp card surfaces (bg-zinc-900/90 border border-zinc-800), high-contrast pure white headings, and tasteful colorful accent highlights matching the user's customization tokens.
2. Typography: Clean modern typography with proper letter-spacing (font-heading, font-sans).
3. Local Assets Only: Use local high-resolution assets (/images/parallax-tokyo.jpg, /images/parallax-alps.jpg, /images/parallax-nyc.jpg, /images/product-skincare.jpg, /images/product-streetwear.jpg, /images/product-audio.jpg, /images/product-coffee.jpg, /background.mp4, /shopify-bg.mp4). Never use external Unsplash URLs.
4. Section Annotations: Annotate each section with data-section attributes:
   - <section data-section="announcement-bar">
   - <header data-section="header">
   - <section data-section="hero" id="hero">
   - <section data-section="products" id="products">
   - <section data-section="features" id="features">
   - <section data-section="pricing" id="pricing">
   - <section data-section="testimonials" id="testimonials">
   - <section data-section="faq" id="faq">
   - <footer data-section="footer" id="footer">
${isParallax ? "5. 3D Parallax Architecture: Include perspective(1200px), preserve-3d, [data-tilt-stage], [data-glare-layer], an Apple-style [data-sticky-runway] (min-h-[185vh]) containing a sticky [data-sticky-stage] + [data-explode-left]/[data-explode-right] layers, opposing [data-parallax-x] motion rails, and [data-parallax-speed]/[data-parallax-z] depth planes. Make the content 100% bespoke to the user's concept." : ""}
Output: Return ONLY pure, valid HTML markup. Zero markdown wrappers, zero meta preambles, and never print prompt-brief labels.`;

    const backgroundParallaxBrief = isParallax
      ? buildBackgroundParallaxPrompt(prompt, parallaxOptions, parallaxThemeId)
      : "";
    const customizedPrompt = websiteConfig
      ? buildWebsiteCustomizationPrompt(prompt, websiteConfig)
      : prompt;

    try {
      if (!ai) {
        throw new Error("GEMINI_API_KEY not configured");
      }

      const result = await ai.models.generateContentStream({
        model: modelName,
        contents: isParallax
          ? `${backgroundParallaxBrief}\n\n${customizedPrompt}\n\nTarget Page: ${pageName}. Render ONLY pure Tailwind dark-mode HTML tailored 100% to the USER CONCEPT.`
          : `User Prompt: ${customizedPrompt} for page: ${pageName}. Mode: ${
              isShopify ? "Shopify Storefront" : "Website"
            }. Generate obsidian dark theme HTML.`,
        config: {
          systemInstruction,
        },
      });

      const encoder = new TextEncoder();
      const customThemeProfile = isParallax
        ? synthesizeCustomParallaxTheme(prompt, parallaxOptions, parallaxThemeId)
        : detectedParallaxTheme;
      const depthPreset = parallaxOptions?.depthPreset || "interactive-3d";
      const depthMult = depthPreset === "subtle" ? 0.65 : depthPreset === "cinematic" ? 1.25 : 1.55;
      const maxTiltDeg = (parallaxOptions?.enableTiltStage ?? true) ? (depthPreset === "subtle" ? 7 : 15) : 0;

      const stream = new ReadableStream({
        async start(controller) {
          try {
            let accumulatedHtml = "";
            if (websiteConfig) {
              const tokenStyles = buildWebsiteThemeStyleBlock(websiteConfig);
              accumulatedHtml += tokenStyles;
              controller.enqueue(encoder.encode(tokenStyles));
            }
            for await (const chunk of result) {
              const text = chunk.text ?? "";
              if (text) {
                accumulatedHtml += text;
                controller.enqueue(encoder.encode(text));
              }
            }
            if (isParallax && !accumulatedHtml.includes("data-obsidian-parallax-runtime")) {
              const runtimeScript = buildUniversalParallaxRuntimeScript({
                depthMultiplier: depthMult,
                maxTiltDeg,
                isProduct: customThemeProfile.category === "product",
                priceLabel: customThemeProfile.priceLabel,
              });
              controller.enqueue(encoder.encode(`\n${runtimeScript}`));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch {
      let fullHtml = "";
      if (isParallax) {
        const parallaxBase = generateParallaxWebsiteHtml({
          prompt,
          pageName,
          themeId: parallaxThemeId,
          parallaxOptions,
        });
        if (websiteConfig && pageName === "Home Page") {
          const styleBlock = buildWebsiteThemeStyleBlock(websiteConfig);
          const brandLabel = extractSubjectFromPrompt(prompt) || detectedParallaxTheme.name;
          const extraSections = buildWebsiteEndToEndSupplementalSections(brandLabel, websiteConfig);
          fullHtml = `${styleBlock}\n${parallaxBase.replace(
            '<footer data-section="footer"',
            `${extraSections}\n<footer data-section="footer"`
          )}`;
        } else if (websiteConfig) {
          fullHtml = `${buildWebsiteThemeStyleBlock(websiteConfig)}\n${parallaxBase}`;
        } else {
          fullHtml = parallaxBase;
        }
      } else if (websiteConfig) {
        fullHtml = generateStandardCustomWebsiteHtml(prompt, pageName, isShopify, websiteConfig);
      } else {
        fullHtml = generateObsidianDarkEcommerceHtml(prompt, pageName, isShopify);
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunkSize = 1200;
          for (let i = 0; i < fullHtml.length; i += chunkSize) {
            const chunk = fullHtml.slice(i, i + chunkSize);
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 12));
          }
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractSubjectFromPrompt(prompt: string): string {
  const match = prompt.match(/"([^"]+)"/);
  if (match && match[1]) return match[1];
  return prompt
    .replace(/^Rewrite and enhance[^:]*:\s*/i, "")
    .replace(/^Expand this design[^:]*:\s*/i, "");
}

function generateEnhancedPromptText(subject: string, isShopify: boolean, isParallax: boolean): string {
  const clean = subject.replace(/["']/g, "").trim();
  if (isShopify) {
    return `Create an ultra-luxurious high-converting Shopify storefront for "${clean || "a luxury lifestyle boutique"}". Include a top announcement ticker with discount promo codes, sticky glassmorphic navigation header with live cart drawer, dark cinematic hero section with high-contrast pure white call-to-action buttons, 4-product featured collection grid with instant quick-add cards, customer reviews slider with 5-star ratings, trust badges strip with 256-bit SSL and express worldwide shipping, and complete Liquid 2.0 section schema compatibility.`;
  }
  if (isParallax || clean.toLowerCase().includes("parallax") || clean.toLowerCase().includes("3d")) {
    return `Architect a kinetic, scroll-choreographed 3D parallax website tailored specifically for "${clean || "Obsidian Spatial Showcase"}". Feature a perspective(1200px) cursor-tilting centerpiece with specular light glare, an Apple-style pinned sticky scroll runway that zooms and separates exploded specification layers, counter-scrolling horizontal depth rails, studio motion video reel, and strict luxury monochrome noir styling.`;
  }
  return `Design a state-of-the-art, high-converting digital platform for "${clean || "a modern SaaS product"}". Include a sticky glass navbar with glowing white CTA, a dynamic hero banner with value proposition and video modal, interactive 3-column feature grid with hover states, social proof testimonial cards with client avatars, 3-tier pricing matrix with monthly/annual toggle, expandable FAQ accordion, and strict dark luxury monochrome noir aesthetic with pure white and silver highlights.`;
}

function generateObsidianDarkEcommerceHtml(prompt: string, pageName: string, isShopify: boolean): string {
  const cleanSubject = extractSubjectFromPrompt(prompt);
  const lower = prompt.toLowerCase();
  const isStreetwear = lower.includes("streetwear") || lower.includes("hoodie") || lower.includes("kinetic");
  const isAudio = lower.includes("audio") || lower.includes("headphone") || lower.includes("apex") || lower.includes("cyber");
  const isCoffee = lower.includes("coffee") || lower.includes("roast") || lower.includes("cafe") || lower.includes("velvet");

  const brandName =
    cleanSubject.length > 0 && cleanSubject.length < 36
      ? cleanSubject
      : isStreetwear
      ? "KINETIC Supply"
      : isAudio
      ? "Apex Cybernetics"
      : isCoffee
      ? "Velvet & Vine Roastery"
      : "Aura Botanicals";

  const heroTitle = isStreetwear
    ? "Engineered for Movement. Built for Culture."
    : isAudio
    ? "Acoustic Perfection. Titanium Engineering."
    : isCoffee
    ? "Single-Origin Specialty Beans Roasted Fresh."
    : "Pure Botanical Science for Radiant Skin.";

  const heroDesc = isStreetwear
    ? "450 GSM organic French terry cotton, waterproof taped zippers, and modular utility silhouettes."
    : isAudio
    ? "Precision planar magnetic drivers, lossless LDAC streaming, and CNC machined aerospace titanium."
    : isCoffee
    ? "Direct trade beans harvested from high-altitude volcanic soils in Yirgacheffe and Huila."
    : "Wild-harvested adaptogens, cold-pressed seed oils, and clinically-proven bio-peptides engineered for radiant results.";

  const productImg = isStreetwear
    ? "/images/product-streetwear.jpg"
    : isAudio
    ? "/images/product-audio.jpg"
    : isCoffee
    ? "/images/product-coffee.jpg"
    : "/images/product-skincare.jpg";

  if (pageName.toLowerCase().includes("product")) {
    return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-extrabold text-lg text-white font-heading">${brandName}</span>
  <span class="text-xs font-mono text-zinc-400">PRODUCT SPECIFICATION • LIQUID 2.0</span>
</header>
<section data-section="hero" id="hero" class="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-zinc-800">
  <div class="aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
    <img src="${productImg}" alt="${brandName} Flagship" class="w-full h-full object-cover" />
  </div>
  <div class="space-y-6">
    <span class="px-3 py-1 rounded-full bg-white text-zinc-950 font-mono text-xs font-bold">FLAGSHIP EDITION</span>
    <h1 class="text-4xl font-black text-white tracking-tight">${heroTitle}</h1>
    <p class="text-zinc-400 text-sm leading-relaxed">${heroDesc}</p>
    <div class="text-3xl font-black text-white font-mono">$148.00</div>
    <button class="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm transition-all">Add to Bag — Instant Checkout</button>
  </div>
</section>`;
  }

  if (pageName.toLowerCase().includes("cart")) {
    return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-extrabold text-lg text-white font-heading">${brandName} — Bag & Checkout</span>
  <span class="text-xs font-mono text-zinc-400">256-BIT SSL ENCRYPTED</span>
</header>
<section data-section="products" id="products" class="py-20 px-6 max-w-4xl mx-auto space-y-8">
  <h1 class="text-3xl font-black text-white">Your Shopping Bag (2 Items)</h1>
  <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <img src="${productImg}" alt="Item" class="w-20 h-20 rounded-xl object-cover border border-zinc-700" />
      <div>
        <h3 class="text-base font-bold text-white">${brandName} Signature Edition</h3>
        <p class="text-xs text-zinc-400 mt-1">In Stock • Express Global Delivery</p>
      </div>
    </div>
    <span class="text-lg font-bold text-white font-mono">$136.00</span>
  </div>
  <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
    <span class="text-sm text-zinc-300 font-semibold">Estimated Total (Free Express Shipping)</span>
    <span class="text-2xl font-black text-white font-mono">$136.00</span>
  </div>
</section>`;
  }

  return `
<section data-section="announcement-bar" class="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 py-2.5 px-4 text-center text-xs font-mono font-medium flex items-center justify-center gap-2">
  <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-glow-white"></span>
  <span>⚡ SPRING PROMO ACTIVE: GET 20% OFF ALL PRODUCTS WITH CODE <strong class="text-white font-bold underline">OBSIDIAN25</strong> — FREE EXPRESS GLOBAL SHIPPING</span>
</section>

<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-sm shadow-lg shadow-white/10">
      ${isShopify ? "🛍️" : "O"}
    </div>
    <span class="font-extrabold text-lg tracking-tight text-white font-heading">${brandName}</span>
  </div>
  <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
    <a href="#hero" class="hover:text-white transition-colors">Home</a>
    <a href="#products" class="hover:text-white transition-colors">Catalog</a>
    <a href="#features" class="hover:text-white transition-colors">Experience</a>
    <a href="#reviews" class="hover:text-white transition-colors">Reviews</a>
  </nav>
  <div class="flex items-center gap-3">
    <button class="relative px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-500 text-xs font-semibold flex items-center gap-1.5 transition-colors">
      <span>Cart</span>
      <span class="px-1.5 py-0.2 rounded-full bg-white text-zinc-950 text-[10px] font-bold">2</span>
    </button>
  </div>
</header>

<section data-section="hero" id="hero" class="relative py-24 sm:py-32 px-6 text-center border-b border-zinc-800 overflow-hidden bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950">
  <div class="absolute inset-0 bg-gradient-radial from-zinc-800/30 via-transparent to-transparent blur-3xl pointer-events-none"></div>
  <div class="max-w-4xl mx-auto space-y-6 relative z-10">
    <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold">
      ✨ ${isShopify ? "Next-Gen Liquid 2.0 Collection" : "Obsidian Digital Architecture"}
    </span>
    <h1 class="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight font-heading">
      ${heroTitle}
    </h1>
    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
      ${heroDesc}
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <a href="#products" class="px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 shadow-lg shadow-white/5 text-zinc-950 font-black transition-all transform hover:-translate-y-0.5 cursor-pointer">
        Shop Featured Catalog →
      </a>
      <a href="#features" class="px-8 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold transition-all shadow-sm cursor-pointer">
        View Lookbook
      </a>
    </div>
  </div>
</section>

<section data-section="products" id="products" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="flex items-center justify-between mb-10">
    <div>
      <h2 class="text-2xl sm:text-3xl font-black text-white font-heading">Featured Collection</h2>
      <p class="text-xs text-zinc-400 mt-1 font-medium">Curated selections available with instant worldwide express shipping</p>
    </div>
    <span class="text-xs font-mono font-bold text-zinc-400">4 Products In Stock</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="${productImg}" alt="Celestial Glow Serum" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white text-zinc-950 font-mono text-[9px] font-bold">BEST SELLER</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Celestial Glow Peptide Serum</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$68.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="/images/product-streetwear.jpg" alt="Technical Utility Silhouette" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[9px] font-bold">LIMITED</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Atelier Heavyweight Edition</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$130.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="/images/product-audio.jpg" alt="Titanium Acoustic Reference" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[9px] font-bold">FLAGSHIP</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Horizon Planar Reference</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$349.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="/images/product-coffee.jpg" alt="Borosilicate Pour-Over" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[9px] font-bold">ARTISANAL</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Precision Borosilicate Carafe</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$58.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>
  </div>
</section>

<section data-section="features" id="features" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="text-xs font-mono text-zinc-400">01 / ARCHITECTURE</p>
      <h3 class="text-lg font-bold text-white">Zero-Latency Global Edge</h3>
      <p class="text-xs text-zinc-400 leading-relaxed">Sub-second storefront rendering with Shopify OS 2.0 JSON templates and modular Liquid sections.</p>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="text-xs font-mono text-zinc-400">02 / CRAFTSMANSHIP</p>
      <h3 class="text-lg font-bold text-white">Clinical & Artisanal Grade</h3>
      <p class="text-xs text-zinc-400 leading-relaxed">Small-batch production with full material traceability and sustainable packaging.</p>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="text-xs font-mono text-zinc-400">03 / CONCIERGE</p>
      <h3 class="text-lg font-bold text-white">Express Worldwide Dispatch</h3>
      <p class="text-xs text-zinc-400 leading-relaxed">Complimentary insured air courier delivery on orders over $100 with instant returns.</p>
    </div>
  </div>
</section>

<footer data-section="footer" id="footer" class="py-16 px-6 bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-xs">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p>&copy; ${new Date().getFullYear()} ${brandName}. Powered by Obsidian AI Liquid Studio.</p>
    <div class="flex items-center gap-6 font-semibold text-zinc-400">
      <a href="#hero" class="hover:text-white transition-colors">Shipping & Returns</a>
      <a href="#products" class="hover:text-white transition-colors">Liquid 2.0 Spec</a>
      <a href="#features" class="hover:text-white transition-colors">Privacy Policy</a>
      <a href="#footer" class="hover:text-white transition-colors">Support</a>
    </div>
  </div>
</footer>
`;
}
