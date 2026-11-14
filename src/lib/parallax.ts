/**
 * 3D Parallax Website Engine, Product-Dedicated Showcases & City Synthesizer
 * Location: src/lib/parallax.ts
 */

export type ParallaxCategory = "product" | "city" | "saas" | "editorial";
export type ParallaxDepthPreset = "subtle" | "cinematic" | "interactive-3d";

export interface ParallaxGenerationOptions {
  category?: ParallaxCategory;
  depthPreset?: ParallaxDepthPreset;
  enableTiltStage?: boolean;
  enableExplodedSpecs?: boolean;
  enableVideoLayer?: boolean;
}

export interface ParallaxThemeProfile {
  id:
    | "obsidian-kinetic"
    | "product-botanical"
    | "product-streetwear"
    | "product-roastery"
    | "tokyo-noir"
    | "alpine-horizon"
    | "manhattan-vertical"
    | "spatial-saas";
  category: ParallaxCategory;
  name: string;
  city: string;
  tagline: string;
  badge: string;
  heroImage: string;
  secondaryImage: string;
  tertiaryImage: string;
  videoSrc: string;
  accentGlow: string;
  horizonGradient: string;
  gridColor: string;
  coordinates: string;
  elevation: string;
  priceLabel?: string;
  variants?: string[];
  defaultPrompt: string;
  landmarks: Array<{
    name: string;
    district: string;
    metric: string;
    description: string;
    depthSpeed: number;
    zDepth: number;
    image: string;
  }>;
}

export const PARALLAX_THEMES: ParallaxThemeProfile[] = [
  {
    id: "obsidian-kinetic",
    category: "product",
    name: "Obsidian Acoustic Reference",
    city: "Hardware • Audio Flagship",
    tagline:
      "3D exploded hardware showcase with CNC titanium planar drivers, interactive finish switcher & 360° cursor tilt.",
    badge: "PRODUCT 3D • AUDIO HARDWARE",
    heroImage: "/images/product-audio.jpg",
    secondaryImage: "/images/product-streetwear.jpg",
    tertiaryImage: "/images/product-audio.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(255, 255, 255, 0.2)",
    horizonGradient: "from-neutral-900/80 via-black to-zinc-950",
    gridColor: "rgba(255, 255, 255, 0.08)",
    coordinates: "DRIVER: 50MM PLANAR",
    elevation: "0.02mm CNC Tolerance",
    priceLabel: "$349.00",
    variants: ["Matte Titanium", "Obsidian Carbon", "Brushed Silver"],
    defaultPrompt:
      "Create a product-dedicated 3D parallax launch website for Obsidian Acoustic Reference headphones. Include an interactive 3D tilt product stage, exploded CNC titanium driver callout layers, finish variant switcher, acoustic frequency specs, and instant reserve CTA.",
    landmarks: [
      {
        name: "50mm Planar Magnetic Driver",
        district: "Layer 01 • Acoustic Core",
        metric: "4Hz – 52kHz",
        description:
          "Ultra-thin 0.8-micron diaphragm suspended in a dual-sided neodymium array for zero harmonic distortion.",
        depthSpeed: 0.22,
        zDepth: 48,
        image: "/images/product-audio.jpg",
      },
      {
        name: "Grade-5 Titanium Yoke",
        district: "Layer 02 • Chassis",
        metric: "268g Total",
        description:
          "Five-axis milled aerospace titanium architecture finished in micro-blasted obsidian PVD.",
        depthSpeed: 0.34,
        zDepth: 28,
        image: "/images/product-audio.jpg",
      },
      {
        name: "Memory Lambskin Chamber",
        district: "Layer 03 • Isolation",
        metric: "-42dB Seal",
        description:
          "Fenestrated acoustic leather cushions engineered for zero clamping fatigue across 12-hour studio sessions.",
        depthSpeed: 0.16,
        zDepth: 62,
        image: "/images/product-streetwear.jpg",
      },
    ],
  },
  {
    id: "product-botanical",
    category: "product",
    name: "Aura Cellular Botanical",
    city: "Skincare • Luxury Formulation",
    tagline:
      "Multi-plane 3D cosmetic product showcase with suspended molecular serum layers, ritual steps & edition selector.",
    badge: "PRODUCT 3D • LUXURY BEAUTY",
    heroImage: "/images/product-skincare.jpg",
    secondaryImage: "/images/parallax-alps.jpg",
    tertiaryImage: "/images/product-coffee.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(244, 244, 245, 0.18)",
    horizonGradient: "from-zinc-900/90 via-black to-zinc-950",
    gridColor: "rgba(255, 255, 255, 0.06)",
    coordinates: "PURITY: 99.4% BIO-ACTIVE",
    elevation: "UV-Violet Glass Monolith",
    priceLabel: "$88.00",
    variants: ["30ml Elixir", "50ml Atelier", "Duo Ritual Set"],
    defaultPrompt:
      "Create a product-dedicated 3D parallax storefront for Aura Cellular Botanical luxury skincare serum. Feature a floating 3D bottle stage, exploded active ingredient layers, volume selector, clinical purity telemetry, and tactile glassmorphism.",
    landmarks: [
      {
        name: "Bio-Peptide Complex 12%",
        district: "Layer 01 • Active Matrix",
        metric: "72h Hydration",
        description:
          "Cold-pressed wild alpine adaptogens encapsulated for deep dermal barrier restoration.",
        depthSpeed: 0.2,
        zDepth: 52,
        image: "/images/product-skincare.jpg",
      },
      {
        name: "Miron UV-Shielded Vessel",
        district: "Layer 02 • Apothecary Glass",
        metric: "Zero Oxidation",
        description:
          "Thick-walled violet-black European glass blocks visible spectrum decay while preserving potency.",
        depthSpeed: 0.3,
        zDepth: 30,
        image: "/images/product-skincare.jpg",
      },
      {
        name: "Swiss Alpine Spring Base",
        district: "Layer 03 • Glacial Purity",
        metric: "pH 5.2 Balanced",
        description:
          "Triple-filtered high-altitude mineral water blended in small sterile studio batches.",
        depthSpeed: 0.14,
        zDepth: 44,
        image: "/images/product-coffee.jpg",
      },
    ],
  },
  {
    id: "product-streetwear",
    category: "product",
    name: "KINETIC 450 GSM Utility",
    city: "Apparel • Technical Capsule",
    tagline:
      "3D garment depth stage featuring Cordura ripstop layers, sizing architecture & limited edition drop controls.",
    badge: "PRODUCT 3D • TECHNICAL APPAREL",
    heroImage: "/images/product-streetwear.jpg",
    secondaryImage: "/images/parallax-nyc.jpg",
    tertiaryImage: "/images/product-audio.jpg",
    videoSrc: "/shopify-bg.mp4",
    accentGlow: "rgba(255, 255, 255, 0.16)",
    horizonGradient: "from-neutral-900 via-zinc-950 to-black",
    gridColor: "rgba(255, 255, 255, 0.08)",
    coordinates: "TEXTILE: 450 GSM TERRY",
    elevation: "Seam-Taped Storm Shell",
    priceLabel: "$195.00",
    variants: ["Onyx Black", "Concrete Slate", "Obsidian Wash"],
    defaultPrompt:
      "Design a product-dedicated 3D parallax fashion drop page for KINETIC 450 GSM technical streetwear. Include a 3D tilting garment showcase, exploded textile construction callouts, colorway switcher, and instant drop reservation.",
    landmarks: [
      {
        name: "450 GSM Heavyweight Loopback",
        district: "Layer 01 • Core Fabric",
        metric: "100% Organic",
        description:
          "Custom-milled dense combed cotton brushed internally for structured architectural drape.",
        depthSpeed: 0.24,
        zDepth: 50,
        image: "/images/product-streetwear.jpg",
      },
      {
        name: "Magnetic Fidlock Hardware",
        district: "Layer 02 • Utility Trim",
        metric: "Quick-Release",
        description:
          "Anodized matte black German magnetic closures paired with AquaGuard storm zippers.",
        depthSpeed: 0.36,
        zDepth: 34,
        image: "/images/product-audio.jpg",
      },
      {
        name: "3-Layer Cordura Gussets",
        district: "Layer 03 • Articulation",
        metric: "20,000mm Proof",
        description:
          "Abrasion-resistant articulated elbows and storm-sealed shoulder panels for urban transit.",
        depthSpeed: 0.18,
        zDepth: 58,
        image: "/images/product-streetwear.jpg",
      },
    ],
  },
  {
    id: "product-roastery",
    category: "product",
    name: "Velvet Precision Pour-Over",
    city: "Artisanal • Espresso & Hardware",
    tagline:
      "3D product launch for hand-blown borosilicate brewer & single-origin micro-lot beans with thermal depth specs.",
    badge: "PRODUCT 3D • ARTISANAL LAB",
    heroImage: "/images/product-coffee.jpg",
    secondaryImage: "/images/parallax-alps.jpg",
    tertiaryImage: "/images/product-skincare.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(228, 228, 231, 0.16)",
    horizonGradient: "from-zinc-900 via-neutral-950 to-black",
    gridColor: "rgba(255, 255, 255, 0.06)",
    coordinates: "ORIGIN: 2,150M YIRGACHEFFE",
    elevation: "Double-Wall Borosilicate",
    priceLabel: "$124.00",
    variants: ["Smoked Glass", "Clear Lab", "Roaster Bundle"],
    defaultPrompt:
      "Create a product-dedicated 3D parallax website for Velvet Precision Pour-Over carafe and single-origin espresso lab. Include interactive 3D product depth, extraction layer breakdown, grind/roast variant selector, and order button.",
    landmarks: [
      {
        name: "Thermal Borosilicate Vessel",
        district: "Layer 01 • Glassware",
        metric: "93°C Retention",
        description:
          "Hand-blown double-walled laboratory glass locks extraction temperature without scalding aromatics.",
        depthSpeed: 0.2,
        zDepth: 46,
        image: "/images/product-coffee.jpg",
      },
      {
        name: "2,150m Volcanic Micro-Lot",
        district: "Layer 02 • Harvest",
        metric: "89.5 SCA Score",
        description:
          "Washed heirloom Ethiopian cherries roasted in 12kg batches and nitrogen-flushed within 4 hours.",
        depthSpeed: 0.3,
        zDepth: 32,
        image: "/images/parallax-alps.jpg",
      },
      {
        name: "Precision Spiral Rib Dripper",
        district: "Layer 03 • Flow Control",
        metric: "2:45 Brew Curve",
        description:
          "Engineered air-channel geometry maintains laminar drawdown for sweet, syrupy clarity.",
        depthSpeed: 0.15,
        zDepth: 54,
        image: "/images/product-skincare.jpg",
      },
    ],
  },
  {
    id: "tokyo-noir",
    category: "city",
    name: "Tokyo Cyber Metropolis",
    city: "Tokyo, Japan",
    tagline:
      "Multi-layered nocturnal architecture across Shibuya, Shinjuku & Minato with 3D perspective skyline strata.",
    badge: "3D CITY • 35.6762° N",
    heroImage: "/images/parallax-tokyo.jpg",
    secondaryImage: "/images/parallax-nyc.jpg",
    tertiaryImage: "/images/parallax-alps.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(255, 255, 255, 0.15)",
    horizonGradient: "from-zinc-900/90 via-zinc-950/95 to-black",
    gridColor: "rgba(255, 255, 255, 0.07)",
    coordinates: "35.6762° N, 139.6503° E",
    elevation: "450m Sky Deck",
    defaultPrompt:
      "Create an immersive 3D parallax city website for Tokyo Metropolis at dusk. Include true perspective skyline depth layers, cursor tilt stage, interactive district explorer (Shibuya, Minato, Hakone), architectural telemetry, and embedded motion video reel.",
    landmarks: [
      {
        name: "Shibuya Sky Nexus",
        district: "Shibuya Ward • Sector 01",
        metric: "229m Altitude",
        description:
          "Open-air rooftop observatory suspended above the world's busiest pedestrian scramble with 360-degree horizon parallax.",
        depthSpeed: 0.2,
        zDepth: 48,
        image: "/images/parallax-tokyo.jpg",
      },
      {
        name: "Toranomon Hills Axis",
        district: "Minato Ward • Sector 02",
        metric: "60 Floors",
        description:
          "Integrated vertical urbanism combining cantilevered glass atriums, skybridges, and seismic damper engineering.",
        depthSpeed: 0.34,
        zDepth: 32,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Hakone Mist Sanctuary",
        district: "Kanagawa Ridge • Sector 03",
        metric: "1,044m Peak",
        description:
          "High-altitude brutalist concrete pavilion overlooking volcanic valleys and drifting cloud inversions.",
        depthSpeed: 0.14,
        zDepth: 60,
        image: "/images/parallax-alps.jpg",
      },
    ],
  },
  {
    id: "alpine-horizon",
    category: "city",
    name: "Alpine Horizon Pavilion",
    city: "Zermatt & Vals, Switzerland",
    tagline:
      "Monolithic concrete and glass architecture suspended in high-altitude mist with 3D ridge separation.",
    badge: "3D EXPEDITION • 46.0207° N",
    heroImage: "/images/parallax-alps.jpg",
    secondaryImage: "/images/parallax-tokyo.jpg",
    tertiaryImage: "/images/parallax-nyc.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(228, 228, 231, 0.16)",
    horizonGradient: "from-neutral-900/90 via-zinc-950 to-black",
    gridColor: "rgba(228, 228, 231, 0.08)",
    coordinates: "46.0207° N, 7.7491° E",
    elevation: "3,135m Gornergrat",
    defaultPrompt:
      "Build a cinematic 3D parallax architectural website for an Alpine cliffside sanctuary in Switzerland. Feature multi-depth mountain ridge layers, cursor perspective tilt, thermal quartzite spa galleries, and elevation telemetry.",
    landmarks: [
      {
        name: "Quartzite Thermal Monolith",
        district: "Vals Valley • 1,250m",
        metric: "60,000 Slabs",
        description:
          "Precision-stacked local gneiss stone chambers with acoustic water reflections and cantilevered mountain views.",
        depthSpeed: 0.18,
        zDepth: 46,
        image: "/images/parallax-alps.jpg",
      },
      {
        name: "Glacier Cantilever Observatory",
        district: "Matterhorn Ridge • 3,100m",
        metric: "-12°C Ambient",
        description:
          "Triple-glazed structural steel refuge anchored directly into granite bedrock above the sea of clouds.",
        depthSpeed: 0.3,
        zDepth: 28,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Nocturnal Valley Transit",
        district: "Andermatt Pass • 2,044m",
        metric: "14.2km Tunnel",
        description:
          "High-speed alpine rail link connecting high-altitude retreats with zero-emission hydroelectric power.",
        depthSpeed: 0.24,
        zDepth: 54,
        image: "/images/parallax-tokyo.jpg",
      },
    ],
  },
  {
    id: "manhattan-vertical",
    category: "city",
    name: "Manhattan Vertical Noir",
    city: "New York City, USA",
    tagline:
      "Supertall glass geometry, billionaire's row canyons, and kinetic street grids in true 3D perspective.",
    badge: "3D METROPOLIS • 40.7580° N",
    heroImage: "/images/parallax-nyc.jpg",
    secondaryImage: "/images/parallax-tokyo.jpg",
    tertiaryImage: "/images/parallax-alps.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(244, 244, 245, 0.15)",
    horizonGradient: "from-zinc-900 via-neutral-950 to-black",
    gridColor: "rgba(255, 255, 255, 0.06)",
    coordinates: "40.7580° N, 73.9855° W",
    elevation: "435m Penthouse",
    defaultPrompt:
      "Design a luxury monochrome noir 3D parallax website for Manhattan supertall real estate and urban architecture. Include 3D perspective layers, floorplate elevation explorer, skyline view simulator, and private viewing booking.",
    landmarks: [
      {
        name: "57th Street Supertall Spire",
        district: "Midtown Axis • 1:24 Ratio",
        metric: "435m Crown",
        description:
          "Terracotta and bronze filigree facade framing unbroken Central Park and Atlantic Ocean vistas.",
        depthSpeed: 0.24,
        zDepth: 48,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Hudson Yards Vessel Grid",
        district: "West Side • Steel Lattice",
        metric: "154 Flights",
        description:
          "Interlocking geometric public plaza and cultural shed with retractable kinetic glass shell.",
        depthSpeed: 0.34,
        zDepth: 30,
        image: "/images/parallax-tokyo.jpg",
      },
      {
        name: "Tribeca Cast-Iron Loft",
        district: "Lower Manhattan • Historic",
        metric: "4.8m Ceilings",
        description:
          "Restored 19th-century industrial warehouse converted into a private collector gallery and sky garden.",
        depthSpeed: 0.16,
        zDepth: 56,
        image: "/images/parallax-alps.jpg",
      },
    ],
  },
  {
    id: "spatial-saas",
    category: "saas",
    name: "Obsidian Spatial OS",
    city: "Platform • 3D UI Stack",
    tagline:
      "Stacked isometric glassmorphic interface planes, live compute telemetry & floating API workflow cards.",
    badge: "3D SPATIAL SAAS • UI STACK",
    heroImage: "/images/parallax-nyc.jpg",
    secondaryImage: "/images/parallax-tokyo.jpg",
    tertiaryImage: "/images/product-audio.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(255, 255, 255, 0.16)",
    horizonGradient: "from-zinc-900 via-zinc-950 to-black",
    gridColor: "rgba(255, 255, 255, 0.08)",
    coordinates: "LATENCY: 4.2ms EDGE",
    elevation: "3-Plane UI Depth",
    defaultPrompt:
      "Build a spatial 3D parallax SaaS platform landing page with floating isometric dashboard layers, interactive cursor perspective stack, developer API telemetry cards, and dark monochrome glassmorphism.",
    landmarks: [
      {
        name: "Edge Inference Router",
        district: "Layer 01 • Compute Plane",
        metric: "4.2ms p99",
        description:
          "Deterministic request routing across 310 global edge nodes with zero cold-start overhead.",
        depthSpeed: 0.22,
        zDepth: 52,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Spatial State Graph",
        district: "Layer 02 • Sync Engine",
        metric: "1.4M Ops/sec",
        description:
          "Conflict-free replicated data streams keeping multi-region workspaces synchronized in real time.",
        depthSpeed: 0.32,
        zDepth: 34,
        image: "/images/parallax-tokyo.jpg",
      },
      {
        name: "Hardware Key Enclave",
        district: "Layer 03 • Zero Trust",
        metric: "SOC2 Type II",
        description:
          "Cryptographic tenant isolation with automated audit logs and hardware-backed session signing.",
        depthSpeed: 0.16,
        zDepth: 46,
        image: "/images/product-audio.jpg",
      },
    ],
  },
];

export function getParallaxThemeById(id?: string): ParallaxThemeProfile {
  if (!id) return PARALLAX_THEMES[0];
  return PARALLAX_THEMES.find((t) => t.id === id) || PARALLAX_THEMES[0];
}

export function detectParallaxIntent(
  prompt: string,
  explicitParallax: boolean = false,
  preferredThemeId?: string
): { isParallax: boolean; theme: ParallaxThemeProfile } {
  const lower = (prompt || "").toLowerCase();
  const hasParallaxKeyword =
    explicitParallax ||
    lower.includes("parallax") ||
    lower.includes("3d") ||
    lower.includes("city website") ||
    lower.includes("skyline") ||
    lower.includes("tokyo") ||
    lower.includes("manhattan") ||
    lower.includes("new york") ||
    lower.includes("alpine") ||
    lower.includes("switzerland") ||
    lower.includes("multi-layer") ||
    lower.includes("scroll depth") ||
    lower.includes("3d scroll");

  if (preferredThemeId) {
    const matched = PARALLAX_THEMES.find((t) => t.id === preferredThemeId);
    if (matched) {
      return { isParallax: hasParallaxKeyword, theme: matched };
    }
  }

  // Product-dedicated detection
  if (lower.includes("skincare") || lower.includes("serum") || lower.includes("botanical") || lower.includes("cosmetic") || lower.includes("perfume")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("product-botanical") };
  }
  if (lower.includes("streetwear") || lower.includes("hoodie") || lower.includes("apparel") || lower.includes("fashion") || lower.includes("sneaker")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("product-streetwear") };
  }
  if (lower.includes("coffee") || lower.includes("espresso") || lower.includes("roast") || lower.includes("carafe")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("product-roastery") };
  }
  if (lower.includes("product") || lower.includes("hardware") || lower.includes("headphone") || lower.includes("audio") || lower.includes("kinetic") || lower.includes("flagship")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("obsidian-kinetic") };
  }

  // Spatial SaaS detection
  if (lower.includes("saas") || lower.includes("platform") || lower.includes("dashboard") || lower.includes("software") || lower.includes("api")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("spatial-saas") };
  }

  // City detection
  if (lower.includes("alpine") || lower.includes("swiss") || lower.includes("mountain") || lower.includes("zermatt") || lower.includes("vals")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("alpine-horizon") };
  }
  if (lower.includes("manhattan") || lower.includes("new york") || lower.includes("nyc") || lower.includes("skyscraper") || lower.includes("real estate")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("manhattan-vertical") };
  }
  if (lower.includes("tokyo") || lower.includes("shibuya") || lower.includes("shinjuku")) {
    return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("tokyo-noir") };
  }

  return { isParallax: hasParallaxKeyword, theme: getParallaxThemeById("tokyo-noir") };
}

export interface GenerateParallaxHtmlOptions {
  prompt: string;
  pageName?: string;
  themeId?: string;
  customHeroImage?: string;
  customVideoUrl?: string;
  parallaxOptions?: ParallaxGenerationOptions;
}

export function generateParallaxWebsiteHtml(options: GenerateParallaxHtmlOptions): string {
  const {
    prompt,
    pageName = "Home Page",
    themeId,
    customHeroImage,
    customVideoUrl,
    parallaxOptions,
  } = options;
  const { theme } = detectParallaxIntent(prompt, true, themeId);

  const depthPreset: ParallaxDepthPreset = parallaxOptions?.depthPreset || "interactive-3d";
  const enableTiltStage = parallaxOptions?.enableTiltStage ?? true;
  const enableExplodedSpecs = parallaxOptions?.enableExplodedSpecs ?? true;
  const enableVideoLayer = parallaxOptions?.enableVideoLayer ?? true;

  const isProduct = (parallaxOptions?.category || theme.category) === "product";
  const heroImg = customHeroImage || theme.heroImage;
  const videoUrl = customVideoUrl || theme.videoSrc;
  const cleanTitle = extractBrandTitle(prompt, theme.name);

  if (pageName.toLowerCase().includes("feature") || pageName.toLowerCase().includes("district") || pageName.toLowerCase().includes("spec")) {
    return generateParallaxDistrictsSubpageHtml(cleanTitle, theme, heroImg, isProduct);
  }

  if (pageName.toLowerCase().includes("pricing") || pageName.toLowerCase().includes("access") || pageName.toLowerCase().includes("pass") || pageName.toLowerCase().includes("reserve")) {
    return generateParallaxAccessSubpageHtml(cleanTitle, theme, isProduct);
  }

  const depthMultiplier = depthPreset === "subtle" ? 0.55 : depthPreset === "cinematic" ? 1.1 : 1.35;
  const maxTiltDeg = enableTiltStage ? (depthPreset === "subtle" ? 6 : 13) : 0;

  return `
<style>
  html, body {
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  .parallax-3d-viewport {
    perspective: 1200px;
    transform-style: preserve-3d;
  }
  .parallax-3d-stage {
    transform-style: preserve-3d;
    will-change: transform;
  }
  .parallax-3d-plane {
    transform-style: preserve-3d;
    will-change: transform;
  }
  .parallax-grid-bg {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .spec-pin-card {
    box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.12);
  }
  @media (prefers-reduced-motion: reduce) {
    .parallax-3d-stage, .parallax-3d-plane { transform: none !important; transition: none !important; }
  }
</style>

<!-- Scroll Depth & Spatial Telemetry Bar -->
<section data-section="announcement-bar" class="bg-zinc-950/95 border-b border-zinc-800/80 text-zinc-300 py-2 px-6 text-xs font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
  <div class="flex items-center gap-3">
    <span class="tracking-widest uppercase text-[10px] text-white font-semibold">${theme.badge}</span>
    <span class="hidden sm:inline text-zinc-600">|</span>
    <span class="hidden sm:inline text-zinc-400 text-[11px]">${theme.coordinates}</span>
  </div>
  <div class="flex items-center gap-3 text-[11px]">
    <span class="text-zinc-400">${isProduct ? "DEPTH Z:" : "ELEVATION:"} <strong class="text-white" id="parallax-altitude-readout">${theme.elevation}</strong></span>
    <span class="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 uppercase">${depthPreset} 3D</span>
  </div>
</section>

<!-- Sticky Glass Header -->
<header data-section="header" class="sticky top-[33px] z-40 bg-zinc-950/85 backdrop-blur-2xl border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-xs tracking-tighter shadow-lg">
      ${isProduct ? "3D" : "PX"}
    </div>
    <div>
      <span class="font-bold text-base tracking-tight text-white block leading-none">${cleanTitle}</span>
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">${theme.city}</span>
    </div>
  </div>
  <nav class="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-300">
    <a href="#hero" class="hover:text-white transition-colors">${isProduct ? "3D Showcase" : "Skyline"}</a>
    <a href="#districts" class="hover:text-white transition-colors">${isProduct ? "Exploded Specs" : "Districts"}</a>
    <a href="#vista" class="hover:text-white transition-colors">${isProduct ? "Editions" : "Depth Vista"}</a>
    <a href="#media-reel" class="hover:text-white transition-colors">Motion Reel</a>
  </nav>
  <div class="flex items-center gap-2.5">
    ${
      isProduct && theme.priceLabel
        ? `<button type="button" id="obsidian-quick-reserve-btn" class="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer">Reserve • ${theme.priceLabel}</button>`
        : `<a href="#vista" class="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">Explore Depth ↓</a>`
    }
  </div>
</header>

<!-- True 3D Perspective Parallax Hero & Interactive Stage -->
<section data-section="hero" id="hero" data-parallax-stage class="relative min-h-[76vh] flex items-center justify-center px-6 py-12 overflow-hidden border-b border-zinc-800 bg-zinc-950 parallax-3d-viewport">
  <!-- Layer 0: Deep Horizon Background Plate (translateZ -60px) -->
  <div class="absolute inset-0 z-0 parallax-3d-plane" data-parallax-speed="0.18" data-parallax-z="-60" data-parallax-tilt="0.35">
    <img src="${heroImg}" alt="${theme.name}" class="w-full h-full object-cover object-center opacity-35 scale-110 filter contrast-125" />
    <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/60 to-zinc-950"></div>
  </div>

  <!-- Layer 1: 3D Perspective Architectural Floor/Backdrop Grid -->
  <div class="absolute inset-0 z-0 parallax-grid-bg opacity-35 pointer-events-none parallax-3d-plane" data-parallax-speed="0.1" data-parallax-z="-30" data-parallax-tilt="0.5"></div>

  <!-- Layer 2: Interactive 3D Centerpiece Split Layout -->
  <div class="relative z-20 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
    <div class="md:col-span-6 space-y-5 parallax-3d-plane" data-parallax-speed="-0.08" data-parallax-z="24" data-parallax-tilt="0.3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 text-[10px] font-mono backdrop-blur-xl">
        <span>${isProduct ? "PRODUCT DEDICATED 3D MONOLITH" : "INTERACTIVE 3D DEPTH ENGINE"}</span>
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.06] font-heading">
        ${cleanTitle}
      </h1>

      <p class="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
        ${theme.tagline}
      </p>

      ${
        isProduct && theme.variants?.length
          ? `<div class="space-y-2 pt-1">
              <p class="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Select Edition / Material Finish</p>
              <div class="flex flex-wrap gap-2" id="obsidian-variant-selector">
                ${theme.variants
                  .map(
                    (variant, vIdx) => `
                  <button type="button" data-variant-btn data-variant-name="${variant}" class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      vIdx === 0
                        ? "bg-white text-zinc-950 border-white shadow-md"
                        : "bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white"
                    }">${variant}</button>`
                  )
                  .join("")}
              </div>
              <p class="text-xs font-mono text-zinc-400" id="obsidian-selected-variant-readout">Active Finish: <span class="text-white">${theme.variants[0]}</span> • ${theme.priceLabel || "$249.00"}</p>
            </div>`
          : ""
      }

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <a href="#districts" class="px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs transition-all shadow-2xl shadow-white/10">
          ${isProduct ? "Inspect 3D Exploded Layers →" : "Enter Interactive Cityscape →"}
        </a>
        <a href="#media-reel" class="px-5 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-xs backdrop-blur-xl transition-all">
          ${isProduct ? "Studio Motion Reel" : "Watch Aerial Reel"}
        </a>
      </div>

      <!-- Compact Telemetry Strip -->
      <div class="grid grid-cols-3 gap-2.5 pt-2">
        <div class="p-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 backdrop-blur-xl">
          <p class="text-[9px] font-mono uppercase text-zinc-400">${isProduct ? "Spec" : "Coordinates"}</p>
          <p class="text-[11px] font-bold text-white font-mono mt-1 truncate">${theme.coordinates}</p>
        </div>
        <div class="p-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 backdrop-blur-xl">
          <p class="text-[9px] font-mono uppercase text-zinc-400">Depth Engine</p>
          <p class="text-[11px] font-bold text-white font-mono mt-1 truncate">3D Z-Axis + Tilt</p>
        </div>
        <div class="p-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 backdrop-blur-xl">
          <p class="text-[9px] font-mono uppercase text-zinc-400">${isProduct ? "Precision" : "Elevation"}</p>
          <p class="text-[11px] font-bold text-white font-mono mt-1 truncate">${theme.elevation}</p>
        </div>
      </div>
    </div>

    <!-- Interactive 3D Floating Monolith Stage (Rotates in 3D space with pointer & scroll) -->
    <div class="md:col-span-6 parallax-3d-viewport">
      <div id="obsidian-hero-3d-card" class="parallax-3d-stage relative rounded-3xl border border-zinc-700/80 bg-zinc-900/80 p-3 shadow-[0_35px_90px_-15px_rgba(0,0,0,0.95)]" data-tilt-stage>
        <!-- Back Glow Plane (Z: -20px) -->
        <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800" style="transform: translateZ(12px);">
          <img src="${heroImg}" alt="${cleanTitle} 3D Stage" class="w-full h-full object-cover scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

          <!-- Top HUD Chip (Z: 40px) -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none" style="transform: translateZ(36px);">
            <span class="px-2.5 py-1 rounded-lg bg-zinc-950/90 border border-zinc-700 text-[9px] font-mono text-white backdrop-blur-md">
              3D TILT ACTIVE • MOVE CURSOR
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-white text-zinc-950 text-[10px] font-mono font-bold">
              ${isProduct && theme.priceLabel ? theme.priceLabel : "Z-DEPTH 1200PX"}
            </span>
          </div>

          ${
            enableExplodedSpecs
              ? `
          <!-- Floating Exploded Layer Pin 1 (Z: 55px) -->
          <div class="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2" style="transform: translateZ(54px);">
            ${theme.landmarks
              .slice(0, 2)
              .map(
                (lm, idx) => `
              <div class="spec-pin-card p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-xl">
                <p class="text-[9px] font-mono uppercase text-zinc-400">PLANE 0${idx + 1} • +${lm.zDepth}px Z</p>
                <p class="text-[11px] font-bold text-white truncate mt-0.5">${lm.name}</p>
                <p class="text-[10px] font-mono text-zinc-300 mt-0.5">${lm.metric}</p>
              </div>`
              )
              .join("")}
          </div>`
              : ""
          }
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Multi-Plane 3D Exploded Depth Cards -->
<section data-section="products" id="districts" data-parallax-stage class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800 relative parallax-3d-viewport">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
    <div>
      <p class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">01 / ${isProduct ? "EXPLODED ARCHITECTURE & MATERIALS" : "SPATIAL DISTRICTS & SECTORS"}</p>
      <h2 class="text-2xl sm:text-4xl font-bold text-white tracking-normal font-heading">${isProduct ? "Multi-Layer Hardware & Form" : "Layered Architectural Zones"}</h2>
    </div>
    <p class="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
      ${isProduct ? "Inspect every engineered material plane independently. Cards tilt and shift along the Z-axis relative to viewport scroll center." : "Each sector shifts along a viewport-centered 3D vector, preserving crisp readability while delivering genuine spatial depth."}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 parallax-3d-viewport">
    ${theme.landmarks
      .map(
        (landmark, idx) => `
    <div class="group rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden hover:border-zinc-500 transition-colors duration-300 flex flex-col justify-between parallax-3d-plane shadow-2xl" data-parallax-speed="${landmark.depthSpeed}" data-parallax-z="0" data-parallax-tilt="0.35">
      <div>
        <div class="aspect-[16/10] bg-zinc-950 relative overflow-hidden border-b border-zinc-800 parallax-3d-viewport">
          <img src="${landmark.image}" alt="${landmark.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/90 border border-zinc-700 text-white font-mono text-[10px] font-semibold parallax-3d-plane" data-parallax-speed="${landmark.depthSpeed}" data-parallax-z="${landmark.zDepth}" data-parallax-tilt="0.5">
            Z +${landmark.zDepth}PX • ${landmark.metric}
          </span>
        </div>
        <div class="p-5 space-y-2">
          <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">${landmark.district}</p>
          <h3 class="text-lg font-bold text-white">${landmark.name}</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">${landmark.description}</p>
        </div>
      </div>
      <div class="px-5 pb-4 pt-3 flex items-center justify-between border-t border-zinc-800/60 text-xs font-mono text-zinc-300">
        <span>Plane 0${idx + 1} (${landmark.depthSpeed}x)</span>
        <span class="text-white font-semibold group-hover:translate-x-1 transition-transform">Inspect Layer →</span>
      </div>
    </div>`
      )
      .join("\n")}
  </div>
</section>

<!-- Full-Bleed Split 3D Depth Vista / Edition Configurator -->
<section data-section="features" id="vista" data-parallax-stage class="relative py-20 px-6 border-b border-zinc-800 overflow-hidden bg-zinc-950 parallax-3d-viewport">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
    <div class="md:col-span-5 space-y-5 parallax-3d-plane" data-parallax-speed="-0.08" data-parallax-z="20">
      <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-mono text-zinc-300">
        02 / ${isProduct ? "EDITION & SPECIFICATION MATRIX" : "HORIZON 3D PARALLAX WINDOW"}
      </span>
      <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
        ${isProduct ? "Calibrated for Tactile Precision & Zero-Latency Commerce." : "Engineered for Optical Depth & Zero-Drift Precision."}
      </h2>
      <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
        Viewport-centered <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">translate3d + perspective</code> physics keep every element cleanly aligned when focused while projecting authentic 3D depth across scroll and cursor tilt.
      </p>
      <div class="space-y-2.5 pt-1">
        <div class="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Foreground Spec Plane</span>
          <span class="text-xs font-mono text-zinc-300">+54px Z • Interactive Tilt</span>
        </div>
        <div class="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Midground Subject Stage</span>
          <span class="text-xs font-mono text-zinc-300">+12px Z • 1200px Perspective</span>
        </div>
        <div class="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Deep Atmospheric Backdrop</span>
          <span class="text-xs font-mono text-zinc-300">-60px Z • Damped Scroll Lerp</span>
        </div>
      </div>
    </div>

    <div class="md:col-span-7 relative parallax-3d-viewport">
      <div class="rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 shadow-2xl relative aspect-[16/10] parallax-3d-plane" data-parallax-speed="0.16" data-parallax-z="30" data-parallax-tilt="0.45">
        <img src="${theme.secondaryImage}" alt="3D Depth Perspective" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-tr from-zinc-950/85 via-transparent to-transparent"></div>
        <div class="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p class="text-[10px] font-mono text-zinc-400 uppercase">${theme.city}</p>
            <p class="text-sm font-bold text-white">${isProduct ? "Studio Secondary Angle & Material Study" : "Panoramic Nocturnal Elevation"}</p>
          </div>
          <span class="px-3 py-1 rounded-lg bg-white text-zinc-950 font-mono text-[11px] font-bold">3D PLANE ACTIVE</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Embedded AI Video & Motion Showcase -->
${
  enableVideoLayer
    ? `
<section data-section="reviews" id="media-reel" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <p class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">03 / CINEMATIC MOTION & STUDIO IMAGERY</p>
      <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">${isProduct ? "360° Product Motion & Material Stills" : "Atmospheric Video & Generated Stills"}</h2>
    </div>
    <span class="text-xs font-mono text-zinc-400">AUTOPLAY LOOP • 60FPS STREAM</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-8 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative aspect-video shadow-2xl">
      <video autoplay loop muted playsinline preload="metadata" class="w-full h-full object-cover opacity-85">
        <source src="${videoUrl}" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30 pointer-events-none"></div>
      <div class="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <div>
          <span class="px-2.5 py-1 rounded-md bg-white text-zinc-950 font-mono text-[10px] font-bold uppercase">Motion Reel</span>
          <h3 class="text-lg font-bold text-white mt-2">${cleanTitle} — ${isProduct ? "Studio Product Sequence" : "Aerial Horizon Sequence"}</h3>
        </div>
        <span class="text-xs font-mono text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">60 FPS</span>
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="flex-1 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative group">
        <img src="${theme.tertiaryImage}" alt="Secondary Perspective" class="w-full h-48 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4">
          <p class="text-[10px] font-mono text-zinc-400 uppercase">Detail Frame 01</p>
          <p class="text-sm font-bold text-white">${isProduct ? "Macro Finish & Texture Study" : "Twilight Horizon Study"}</p>
        </div>
      </div>
      <div class="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 space-y-3" id="architecture-specs">
        <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">3D Physics Architecture</p>
        <h4 class="text-base font-bold text-white">Viewport-Centered Lerp Engine</h4>
        <p class="text-xs text-zinc-400 leading-relaxed">
          Zero layout drift: damped <code class="text-zinc-200">requestAnimationFrame</code> interpolation drives both Z-depth scroll shifts and pointer tilt.
        </p>
      </div>
    </div>
  </div>
</section>`
    : ""
}

<footer data-section="footer" id="footer" class="py-14 px-6 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <p class="text-white font-bold text-sm">${cleanTitle}</p>
      <p class="text-zinc-500 mt-0.5">${theme.city} • Synthesized with Obsidian 3D Parallax Engine</p>
    </div>
    <div class="flex items-center gap-6 font-medium text-zinc-400">
      <a href="#hero" class="hover:text-white transition-colors">Back to Top ↑</a>
      <a href="#districts" class="hover:text-white transition-colors">${isProduct ? "Specs" : "Sectors"}</a>
      <a href="#vista" class="hover:text-white transition-colors">3D Stage</a>
      ${enableVideoLayer ? '<a href="#media-reel" class="hover:text-white transition-colors">Motion</a>' : ""}
    </div>
  </div>
</footer>

<script>
  (function() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var planes = document.querySelectorAll('[data-parallax-speed], [data-parallax-z]');
    var tiltStage = document.querySelector('[data-tilt-stage]');
    var readout = document.getElementById('parallax-altitude-readout');

    var depthMult = ${depthMultiplier};
    var maxTilt = ${maxTiltDeg};

    var targetMx = 0, targetMy = 0;
    var curMx = 0, curMy = 0;
    var targetScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    var curScroll = targetScroll;

    window.addEventListener('pointermove', function(e) {
      var w = window.innerWidth || 1280;
      var h = window.innerHeight || 720;
      targetMx = ((e.clientX / w) - 0.5) * 2;
      targetMy = ((e.clientY / h) - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', function() {
      targetScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    }, { passive: true });

    // Variant selector interactivity for Product Dedicated pages
    var variantButtons = document.querySelectorAll('[data-variant-btn]');
    var variantReadout = document.getElementById('obsidian-selected-variant-readout');
    for (var b = 0; b < variantButtons.length; b++) {
      variantButtons[b].addEventListener('click', function() {
        var chosen = this.getAttribute('data-variant-name');
        for (var j = 0; j < variantButtons.length; j++) {
          variantButtons[j].className = 'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white';
        }
        this.className = 'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-white text-zinc-950 border-white shadow-md';
        if (variantReadout) {
          variantReadout.innerHTML = 'Active Finish: <span class="text-white">' + chosen + '</span> • ${theme.priceLabel || "$249.00"}';
        }
      });
    }

    var reserveBtn = document.getElementById('obsidian-quick-reserve-btn');
    if (reserveBtn) {
      reserveBtn.addEventListener('click', function() {
        this.textContent = '✓ Reserved in Bag';
        var btn = this;
        setTimeout(function() { btn.textContent = 'Reserve • ${theme.priceLabel || "$249.00"}'; }, 2400);
      });
    }

    function frame() {
      curMx += (targetMx - curMx) * 0.1;
      curMy += (targetMy - curMy) * 0.1;
      curScroll += (targetScroll - curScroll) * 0.14;

      var vh = window.innerHeight || 720;

      if (tiltStage && maxTilt > 0) {
        var rx = (-curMy * maxTilt).toFixed(2);
        var ry = (curMx * maxTilt).toFixed(2);
        tiltStage.style.transform = 'perspective(1200px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      }

      for (var i = 0; i < planes.length; i++) {
        var el = planes[i];
        var speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.15');
        var z = parseFloat(el.getAttribute('data-parallax-z') || '0');
        var tiltFactor = parseFloat(el.getAttribute('data-parallax-tilt') || '0.25');

        var rect = el.getBoundingClientRect();
        var centerDelta = (rect.top + rect.height * 0.5) - (vh * 0.5);
        var normProgress = Math.max(-1.25, Math.min(1.25, centerDelta / vh));

        var translateY = Math.round(normProgress * speed * -90 * depthMult);
        var translateX = Math.round(curMx * (z * 0.28) * tiltFactor);
        var planeRotY = (curMx * 3.5 * tiltFactor).toFixed(2);
        var planeRotX = (-curMy * 3.5 * tiltFactor).toFixed(2);

        el.style.transform =
          'perspective(1200px) rotateX(' + planeRotX + 'deg) rotateY(' + planeRotY + 'deg) translate3d(' +
          translateX + 'px, ' + translateY + 'px, ' + z + 'px)';
      }

      if (readout) {
        var scrollRatio = Math.min(1, curScroll / 1600);
        if (${isProduct ? "true" : "false"}) {
          readout.textContent = (1200 - Math.round(scrollRatio * 340)) + 'mm Z-Focus';
        } else {
          readout.textContent = Math.max(45, 450 - Math.round(scrollRatio * 320)) + 'm Sky Deck';
        }
      }

      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  })();
</script>
`;
}

function generateParallaxDistrictsSubpageHtml(
  brandTitle: string,
  theme: ParallaxThemeProfile,
  heroImg: string,
  isProduct: boolean
): string {
  return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-bold text-white text-base">${brandTitle} — ${isProduct ? "Exploded Spec Breakdown" : "Districts & Architecture"}</span>
  <span class="text-xs font-mono text-zinc-400">${theme.coordinates}</span>
</header>
<section data-section="hero" id="hero" class="py-24 px-6 max-w-6xl mx-auto space-y-8 border-b border-zinc-800">
  <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200">${isProduct ? "3D COMPONENT ARCHITECTURE" : "SPATIAL SECTOR DIRECTORY"}</span>
  <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight">${isProduct ? "Engineered Material Stack" : "Urban Sectors & Elevation Profiles"}</h1>
  <p class="text-zinc-400 max-w-2xl text-base leading-relaxed">${theme.tagline}</p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
    ${theme.landmarks
      .map(
        (l) => `
      <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 hover:border-zinc-500 transition-colors">
        <img src="${l.image || heroImg}" alt="${l.name}" class="w-full h-44 object-cover rounded-xl border border-zinc-800" />
        <p class="text-[11px] font-mono text-zinc-400">${l.district}</p>
        <h3 class="text-lg font-bold text-white">${l.name}</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">${l.description}</p>
      </div>`
      )
      .join("")}
  </div>
</section>
`;
}

function generateParallaxAccessSubpageHtml(
  brandTitle: string,
  theme: ParallaxThemeProfile,
  isProduct: boolean
): string {
  return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-bold text-white text-base">${brandTitle} — ${isProduct ? "Editions & Allocation" : "Sky Deck Reservations & Passes"}</span>
  <span class="text-xs font-mono text-zinc-400">${theme.city}</span>
</header>
<section data-section="pricing" id="pricing" class="py-24 px-6 max-w-6xl mx-auto space-y-10">
  <div class="text-center max-w-2xl mx-auto space-y-3">
    <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200">${isProduct ? "STUDIO RELEASE TIERS" : "OBSERVATORY & PRIVATE ACCESS"}</span>
    <h1 class="text-4xl sm:text-5xl font-black text-white">${isProduct ? "Select Your Edition" : "Reserve Your Elevation"}</h1>
    <p class="text-sm text-zinc-400">${isProduct ? `Limited studio batch allocation for ${brandTitle}.` : `Select an architectural viewing tier for ${theme.city}.`}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
      <p class="text-xs font-mono text-zinc-400 uppercase">${isProduct ? "Core Studio Edition" : "Horizon Pass"}</p>
      <p class="text-3xl font-black text-white">${isProduct ? theme.priceLabel || "$149" : "$45"}</p>
      <p class="text-xs text-zinc-400">${isProduct ? "Standard studio packaging, serialized unit plate, and 2-year hardware warranty." : "Daylight & twilight access to main observation gallery and interactive parallax exhibits."}</p>
      <button class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-bold transition-colors">${isProduct ? "Select Core" : "Select Horizon"}</button>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900 border border-white space-y-4 shadow-2xl">
      <p class="text-xs font-mono text-white uppercase">${isProduct ? "Collector Noir Bundle" : "Nocturnal Private Lounge"}</p>
      <p class="text-3xl font-black text-white">${isProduct ? "$295" : "$140"}</p>
      <p class="text-xs text-zinc-300">${isProduct ? "Complete travel flight case, alternate finish kit, and priority studio concierge shipping." : "Priority sunset entry, private glass cantilever lounge, and curated architectural audio guide."}</p>
      <button class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black transition-colors">${isProduct ? "Reserve Collector Kit" : "Reserve VIP Pass"}</button>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
      <p class="text-xs font-mono text-zinc-400 uppercase">${isProduct ? "Atelier Bespoke Commission" : "Private Helicopter Charter"}</p>
      <p class="text-3xl font-black text-white">${isProduct ? "$580" : "$680"}</p>
      <p class="text-xs text-zinc-400">${isProduct ? "Custom laser engraving, white-glove courier delivery, and direct studio engineering calibration." : `25-minute nocturnal aerial flight over ${theme.city} with private rooftop landing.`}</p>
      <button class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-bold transition-colors">${isProduct ? "Request Commission" : "Book Charter"}</button>
    </div>
  </div>
</section>
`;
}

function extractBrandTitle(prompt: string, fallback: string): string {
  const quoted = prompt.match(/"([^"]{3,40})"/);
  if (quoted && quoted[1]) return quoted[1];
  const forMatch = prompt.match(/(?:for|called|named)\s+([A-Z][A-Za-z0-9\s&]{2,30})/);
  if (forMatch && forMatch[1]) return forMatch[1].trim();
  return fallback;
}
