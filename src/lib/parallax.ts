/**
 * Parallax Website Engine, Theme Animation Profiles & City Website Synthesizer
 * Location: src/lib/parallax.ts
 */

export interface ParallaxThemeProfile {
  id: "tokyo-noir" | "alpine-horizon" | "manhattan-vertical" | "obsidian-kinetic";
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
  defaultPrompt: string;
  landmarks: Array<{
    name: string;
    district: string;
    metric: string;
    description: string;
    depthSpeed: number;
    image: string;
  }>;
}

export const PARALLAX_THEMES: ParallaxThemeProfile[] = [
  {
    id: "tokyo-noir",
    name: "Tokyo Cyber Metropolis",
    city: "Tokyo, Japan",
    tagline: "Multi-layered nocturnal architecture across Shibuya, Shinjuku & Minato.",
    badge: "PARALLAX CITY • 35.6762° N",
    heroImage: "/images/parallax-tokyo.jpg",
    secondaryImage: "/images/parallax-nyc.jpg",
    tertiaryImage: "/images/parallax-alps.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(255, 255, 255, 0.14)",
    horizonGradient: "from-zinc-900/90 via-zinc-950/95 to-black",
    gridColor: "rgba(255, 255, 255, 0.07)",
    coordinates: "35.6762° N, 139.6503° E",
    elevation: "450m Sky Deck",
    defaultPrompt:
      "Create an immersive multi-layer parallax city website for Tokyo Metropolis at dusk. Include a 3D depth hero skyline with scroll-linked foreground, midground, and horizon layers, interactive district explorer (Shibuya Crossing, Shinjuku Skyscrapers, Minato Bay), architectural telemetry, embedded ambient video reel, and nocturnal monochrome styling.",
    landmarks: [
      {
        name: "Shibuya Sky Nexus",
        district: "Shibuya Ward • Sector 01",
        metric: "229m Altitude",
        description: "Open-air rooftop observatory suspended above the world's busiest pedestrian scramble with 360-degree horizon parallax.",
        depthSpeed: 0.18,
        image: "/images/parallax-tokyo.jpg",
      },
      {
        name: "Toranomon Hills Axis",
        district: "Minato Ward • Sector 02",
        metric: "60 Floors",
        description: "Integrated vertical urbanism combining cantilevered glass atriums, skybridges, and seismic damper engineering.",
        depthSpeed: 0.32,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Hakone Mist Sanctuary",
        district: "Kanagawa Ridge • Sector 03",
        metric: "1,044m Peak",
        description: "High-altitude brutalist concrete pavilion overlooking volcanic valleys and drifting cloud inversions.",
        depthSpeed: 0.12,
        image: "/images/parallax-alps.jpg",
      },
    ],
  },
  {
    id: "alpine-horizon",
    name: "Alpine Horizon Pavilion",
    city: "Zermatt & Vals, Switzerland",
    tagline: "Monolithic concrete and glass architecture suspended in high-altitude mist.",
    badge: "PARALLAX EXPEDITION • 46.0207° N",
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
      "Build a cinematic parallax architectural website for an Alpine cliffside sanctuary in Switzerland. Feature multi-depth mountain ridge layers, drifting valley mist, thermal quartzite spa galleries, elevation telemetry, and scroll-driven spatial storytelling.",
    landmarks: [
      {
        name: "Quartzite Thermal Monolith",
        district: "Vals Valley • 1,250m",
        metric: "60,000 Slabs",
        description: "Precision-stacked local gneiss stone chambers with acoustic water reflections and cantilevered mountain views.",
        depthSpeed: 0.16,
        image: "/images/parallax-alps.jpg",
      },
      {
        name: "Glacier Cantilever Observatory",
        district: "Matterhorn Ridge • 3,100m",
        metric: "-12°C Ambient",
        description: "Triple-glazed structural steel refuge anchored directly into granite bedrock above the sea of clouds.",
        depthSpeed: 0.28,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Nocturnal Valley Transit",
        district: "Andermatt Pass • 2,044m",
        metric: "14.2km Tunnel",
        description: "High-speed alpine rail link connecting high-altitude retreats with zero-emission hydroelectric power.",
        depthSpeed: 0.22,
        image: "/images/parallax-tokyo.jpg",
      },
    ],
  },
  {
    id: "manhattan-vertical",
    name: "Manhattan Vertical Noir",
    city: "New York City, USA",
    tagline: "Supertall glass geometry, billionaire's row canyons, and kinetic street grids.",
    badge: "PARALLAX METROPOLIS • 40.7580° N",
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
      "Design a luxury monochrome noir parallax website for Manhattan supertall real estate and urban architecture. Include vertical scroll depth layers, interactive floorplate elevation explorer, skyline view simulator, and private viewing booking.",
    landmarks: [
      {
        name: "57th Street Supertall Spire",
        district: "Midtown Axis • 1:24 Slenderness",
        metric: "435m Crown",
        description: "Terracotta and bronze filigree facade framing unbroken Central Park and Atlantic Ocean vistas.",
        depthSpeed: 0.24,
        image: "/images/parallax-nyc.jpg",
      },
      {
        name: "Hudson Yards Vessel Grid",
        district: "West Side • Structural Steel",
        metric: "154 Flights",
        description: "Interlocking geometric public plaza and cultural shed with retractable kinetic glass shell.",
        depthSpeed: 0.34,
        image: "/images/parallax-tokyo.jpg",
      },
      {
        name: "Tribeca Cast-Iron Loft",
        district: "Lower Manhattan • Historic",
        metric: "4.8m Ceilings",
        description: "Restored 19th-century industrial warehouse converted into a private collector gallery and sky garden.",
        depthSpeed: 0.14,
        image: "/images/parallax-alps.jpg",
      },
    ],
  },
  {
    id: "obsidian-kinetic",
    name: "Obsidian Kinetic Flagship",
    city: "Global Digital Atelier",
    tagline: "Spatial hardware & luxury product storytelling with scroll-driven depth layers.",
    badge: "PARALLAX PRODUCT • 60FPS GPU",
    heroImage: "/images/product-audio.jpg",
    secondaryImage: "/images/product-skincare.jpg",
    tertiaryImage: "/images/product-streetwear.jpg",
    videoSrc: "/background.mp4",
    accentGlow: "rgba(255, 255, 255, 0.18)",
    horizonGradient: "from-neutral-900/80 via-black to-zinc-950",
    gridColor: "rgba(255, 255, 255, 0.09)",
    coordinates: "00.0000° N, 00.0000° E",
    elevation: "Spatial Layer 04",
    defaultPrompt:
      "Create an Apple-grade kinetic parallax product launch website with multi-plane scroll depth, floating hardware callouts, interactive acoustic & material spec breakdown, generated studio photography, and embedded motion video.",
    landmarks: [
      {
        name: "CNC Aerospace Titanium Chassis",
        district: "Layer 01 • Structural Shell",
        metric: "0.02mm Tolerance",
        description: "Five-axis milled grade-5 titanium enclosure with micro-blasted obsidian PVD finish.",
        depthSpeed: 0.2,
        image: "/images/product-audio.jpg",
      },
      {
        name: "Bio-Active Botanical Molecular Serum",
        district: "Layer 02 • Formulation Lab",
        metric: "99.4% Pure",
        description: "Cold-pressed adaptogenic complexes suspended in UV-shielded violet obsidian glass.",
        depthSpeed: 0.3,
        image: "/images/product-skincare.jpg",
      },
      {
        name: "Ballistic Ripstop Modular System",
        district: "Layer 03 • Technical Textile",
        metric: "450 GSM",
        description: "Weather-sealed seams and magnetic fidlock hardware engineered for extreme urban environments.",
        depthSpeed: 0.15,
        image: "/images/product-streetwear.jpg",
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

  if (lower.includes("alpine") || lower.includes("swiss") || lower.includes("mountain") || lower.includes("zermatt") || lower.includes("vals")) {
    return { isParallax: hasParallaxKeyword, theme: PARALLAX_THEMES[1] };
  }
  if (lower.includes("manhattan") || lower.includes("new york") || lower.includes("nyc") || lower.includes("skyscraper") || lower.includes("real estate")) {
    return { isParallax: hasParallaxKeyword, theme: PARALLAX_THEMES[2] };
  }
  if (lower.includes("product") || lower.includes("hardware") || lower.includes("headphone") || lower.includes("kinetic") || lower.includes("flagship")) {
    return { isParallax: hasParallaxKeyword, theme: PARALLAX_THEMES[3] };
  }

  return { isParallax: hasParallaxKeyword, theme: PARALLAX_THEMES[0] };
}

export interface GenerateParallaxHtmlOptions {
  prompt: string;
  pageName?: string;
  themeId?: string;
  customHeroImage?: string;
  customVideoUrl?: string;
}

export function generateParallaxWebsiteHtml(options: GenerateParallaxHtmlOptions): string {
  const { prompt, pageName = "Home Page", themeId, customHeroImage, customVideoUrl } = options;
  const { theme } = detectParallaxIntent(prompt, true, themeId);

  const heroImg = customHeroImage || theme.heroImage;
  const videoUrl = customVideoUrl || theme.videoSrc;

  // Clean title extraction
  const cleanTitle = extractBrandTitle(prompt, theme.name);

  if (pageName.toLowerCase().includes("feature") || pageName.toLowerCase().includes("district")) {
    return generateParallaxDistrictsSubpageHtml(cleanTitle, theme, heroImg);
  }

  if (pageName.toLowerCase().includes("pricing") || pageName.toLowerCase().includes("access") || pageName.toLowerCase().includes("pass")) {
    return generateParallaxAccessSubpageHtml(cleanTitle, theme);
  }

  return `
<style>
  @keyframes floatSlow {
    0%, 100% { transform: translate3d(0, 0px, 0); }
    50% { transform: translate3d(0, -10px, 0); }
  }
  @keyframes pulseLine {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 0.85; }
  }
  .parallax-layer {
    will-change: transform;
    transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .parallax-grid-bg {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  @media (prefers-reduced-motion: reduce) {
    .parallax-layer { transform: none !important; transition: none !important; }
  }
</style>

<!-- Scroll Progress & Spatial Telemetry Bar -->
<section data-section="announcement-bar" class="bg-zinc-950/95 border-b border-zinc-800/80 text-zinc-300 py-2 px-6 text-xs font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
  <div class="flex items-center gap-3">
    <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
    <span class="tracking-widest uppercase text-[10px] text-white font-semibold">${theme.badge}</span>
    <span class="hidden sm:inline text-zinc-500">|</span>
    <span class="hidden sm:inline text-zinc-400 text-[11px]">${theme.coordinates}</span>
  </div>
  <div class="flex items-center gap-4 text-[11px]">
    <span class="text-zinc-400">ELEVATION: <strong class="text-white" id="parallax-altitude-readout">${theme.elevation}</strong></span>
    <span class="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200">DEPTH ENGINE ACTIVE</span>
  </div>
</section>

<!-- Sticky Glass Header -->
<header data-section="header" class="sticky top-[33px] z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-xs tracking-tighter shadow-lg">
      PX
    </div>
    <div>
      <span class="font-bold text-base tracking-tight text-white block leading-none">${cleanTitle}</span>
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">${theme.city}</span>
    </div>
  </div>
  <nav class="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-300">
    <a href="#hero" class="hover:text-white transition-colors">Skyline</a>
    <a href="#districts" class="hover:text-white transition-colors">Districts</a>
    <a href="#vista" class="hover:text-white transition-colors">Depth Vista</a>
    <a href="#media-reel" class="hover:text-white transition-colors">Motion Reel</a>
    <a href="#architecture-specs" class="hover:text-white transition-colors">Specifications</a>
  </nav>
  <div class="flex items-center gap-2.5">
    <a href="#vista" class="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
      Explore Depth ↓
    </a>
  </div>
</header>

<!-- Multi-Layer Parallax Hero Stage -->
<section data-section="hero" id="hero" class="relative min-h-[88vh] flex items-center justify-center px-6 py-28 overflow-hidden border-b border-zinc-800 bg-zinc-950">
  <!-- Layer 0: Deep Horizon Image with Scroll Parallax -->
  <div class="absolute inset-0 z-0 parallax-layer" data-parallax-speed="0.35">
    <img src="${heroImg}" alt="${theme.name}" class="w-full h-[120%] object-cover object-center opacity-55 scale-105 filter contrast-125" />
    <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/45 to-zinc-950"></div>
  </div>

  <!-- Layer 1: Architectural Perspective Grid -->
  <div class="absolute inset-0 z-10 parallax-grid-bg opacity-40 pointer-events-none parallax-layer" data-parallax-speed="0.18"></div>

  <!-- Layer 2: Floating Horizon Silhouette Vectors -->
  <div class="absolute inset-x-0 bottom-0 h-56 z-10 pointer-events-none parallax-layer" data-parallax-speed="-0.15">
    <div class="w-full h-full bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
  </div>

  <!-- Layer 3: Foreground Hero Content -->
  <div class="relative z-20 max-w-5xl mx-auto text-center space-y-7 parallax-layer" data-parallax-speed="-0.08">
    <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 text-xs font-mono backdrop-blur-xl shadow-2xl">
      <span class="w-2 h-2 rounded-full bg-white"></span>
      <span>SCROLL-DRIVEN SPATIAL PARALLAX EXPERIENCE</span>
    </div>

    <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.98] font-heading">
      ${cleanTitle}
    </h1>

    <p class="text-zinc-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
      ${theme.tagline} Engineered with multi-plane depth layers, real-time scroll physics, and atmospheric imagery.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-3">
      <a href="#districts" class="px-8 py-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm transition-all shadow-2xl shadow-white/10">
        Enter Interactive Cityscape →
      </a>
      <a href="#media-reel" class="px-8 py-4 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-sm backdrop-blur-xl transition-all">
        Watch Aerial Motion Reel
      </a>
    </div>

    <!-- Telemetry Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 max-w-3xl mx-auto">
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl text-left">
        <p class="text-[10px] font-mono uppercase text-zinc-400">Coordinates</p>
        <p class="text-sm font-bold text-white font-mono mt-1">${theme.coordinates}</p>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl text-left">
        <p class="text-[10px] font-mono uppercase text-zinc-400">Parallax Planes</p>
        <p class="text-sm font-bold text-white font-mono mt-1">4 Independent Layers</p>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl text-left">
        <p class="text-[10px] font-mono uppercase text-zinc-400">Elevation</p>
        <p class="text-sm font-bold text-white font-mono mt-1">${theme.elevation}</p>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl text-left">
        <p class="text-[10px] font-mono uppercase text-zinc-400">Render Mode</p>
        <p class="text-sm font-bold text-white font-mono mt-1">60fps GPU Transform</p>
      </div>
    </div>
  </div>
</section>

<!-- Multi-Plane Parallax District Cards -->
<section data-section="products" id="districts" class="py-28 px-6 max-w-7xl mx-auto border-b border-zinc-800 relative">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
    <div>
      <p class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">01 / SPATIAL DISTRICTS & SECTORS</p>
      <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">Layered Architectural Zones</h2>
    </div>
    <p class="text-sm text-zinc-400 max-w-md leading-relaxed">
      Each sector scrolls at an independent velocity vector, creating natural optical depth across foreground structures and distant skylines.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    ${theme.landmarks
      .map(
        (landmark, idx) => `
    <div class="group rounded-3xl border border-zinc-800 bg-zinc-900/75 overflow-hidden hover:border-zinc-500 transition-all duration-500 flex flex-col justify-between parallax-layer shadow-2xl" data-parallax-speed="${landmark.depthSpeed}">
      <div>
        <div class="aspect-[16/10] bg-zinc-950 relative overflow-hidden border-b border-zinc-800">
          <img src="${landmark.image}" alt="${landmark.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/90 border border-zinc-700 text-white font-mono text-[10px] font-semibold">
            PLANE 0${idx + 1} • ${landmark.metric}
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <p class="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">${landmark.district}</p>
          <h3 class="text-xl font-bold text-white">${landmark.name}</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">${landmark.description}</p>
        </div>
      </div>
      <div class="px-6 pb-6 pt-2 flex items-center justify-between border-t border-zinc-800/60 text-xs font-mono text-zinc-300">
        <span>Velocity: ${landmark.depthSpeed}x</span>
        <span class="text-white font-semibold group-hover:translate-x-1 transition-transform">Inspect Sector →</span>
      </div>
    </div>`
      )
      .join("\n")}
  </div>
</section>

<!-- Full-Bleed Split Depth Vista Window -->
<section data-section="features" id="vista" class="relative py-32 px-6 border-b border-zinc-800 overflow-hidden bg-zinc-950">
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
    <div class="lg:col-span-5 space-y-6 parallax-layer" data-parallax-speed="-0.06">
      <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-mono text-zinc-300">
        02 / HORIZON PARALLAX WINDOW
      </span>
      <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
        Engineered for Optical Depth & Precision.
      </h2>
      <p class="text-sm text-zinc-400 leading-relaxed">
        Unlike static layouts, this parallax architecture binds scroll position and cursor telemetry to GPU-composited <code class="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded">translate3d</code> planes.
      </p>
      <div class="space-y-3 pt-2">
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Foreground Architectural Plane</span>
          <span class="text-xs font-mono text-zinc-400">1.25x Scroll Ratio</span>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Midground Atmospheric Mist</span>
          <span class="text-xs font-mono text-zinc-400">0.65x Scroll Ratio</span>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <span class="text-xs font-semibold text-white">Deep Horizon Skyline</span>
          <span class="text-xs font-mono text-zinc-400">0.25x Scroll Ratio</span>
        </div>
      </div>
    </div>

    <div class="lg:col-span-7 relative">
      <div class="rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 shadow-2xl relative aspect-[16/10] parallax-layer" data-parallax-speed="0.14">
        <img src="${theme.secondaryImage}" alt="Architectural Depth Vista" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-tr from-zinc-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-zinc-950/85 border border-zinc-800 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p class="text-xs font-mono text-zinc-400 uppercase">${theme.city}</p>
            <p class="text-sm font-bold text-white">Panoramic Nocturnal Elevation</p>
          </div>
          <span class="px-3 py-1 rounded-lg bg-white text-zinc-950 font-mono text-xs font-bold">LIVE 3D PLANE</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Embedded AI Video & Motion Showcase -->
<section data-section="reviews" id="media-reel" class="py-28 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
    <div>
      <p class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">03 / CINEMATIC MOTION & AI MEDIA SYNTHESIS</p>
      <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Atmospheric Video & Generated Stills</h2>
    </div>
    <span class="text-xs font-mono text-zinc-400">AUTOPLAY LOOP • 4K HDR STREAM</span>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-8 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative aspect-video shadow-2xl">
      <video autoplay loop muted playsinline class="w-full h-full object-cover opacity-85">
        <source src="${videoUrl}" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30 pointer-events-none"></div>
      <div class="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <div>
          <span class="px-2.5 py-1 rounded-md bg-white text-zinc-950 font-mono text-[10px] font-bold uppercase">Motion Reel</span>
          <h3 class="text-lg font-bold text-white mt-2">${cleanTitle} — Aerial Horizon Sequence</h3>
        </div>
        <span class="text-xs font-mono text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">60 FPS</span>
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="flex-1 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative group">
        <img src="${theme.tertiaryImage}" alt="Secondary Perspective" class="w-full h-48 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4">
          <p class="text-[10px] font-mono text-zinc-400 uppercase">Generated Still 01</p>
          <p class="text-sm font-bold text-white">Twilight Horizon Study</p>
        </div>
      </div>
      <div class="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 space-y-3" id="architecture-specs">
        <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Technical Architecture</p>
        <h4 class="text-base font-bold text-white">Zero-Jank Scroll Physics</h4>
        <p class="text-xs text-zinc-400 leading-relaxed">
          Built with passive scroll listeners, <code class="text-zinc-200">requestAnimationFrame</code> interpolation, and hardware-accelerated layers.
        </p>
      </div>
    </div>
  </div>
</section>

<footer data-section="footer" id="footer" class="py-16 px-6 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <p class="text-white font-bold text-sm">${cleanTitle}</p>
      <p class="text-zinc-500 mt-0.5">${theme.city} • Synthesized with Obsidian Parallax Engine</p>
    </div>
    <div class="flex items-center gap-6 font-medium text-zinc-400">
      <a href="#hero" class="hover:text-white transition-colors">Top of Skyline ↑</a>
      <a href="#districts" class="hover:text-white transition-colors">Sectors</a>
      <a href="#vista" class="hover:text-white transition-colors">Vista</a>
      <a href="#media-reel" class="hover:text-white transition-colors">Motion</a>
    </div>
  </div>
</footer>

<script>
  (function() {
    var layers = document.querySelectorAll('[data-parallax-speed]');
    var readout = document.getElementById('parallax-altitude-readout');
    var ticking = false;
    function updateParallax() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      for (var i = 0; i < layers.length; i++) {
        var el = layers[i];
        var speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.15');
        var offset = Math.round(scrollY * speed * 0.45);
        el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
      }
      if (readout) {
        var alt = Math.max(50, 450 - Math.round(scrollY * 0.12));
        readout.textContent = alt + 'm Sky Deck';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  })();
</script>
`;
}

function generateParallaxDistrictsSubpageHtml(
  brandTitle: string,
  theme: ParallaxThemeProfile,
  heroImg: string
): string {
  return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-bold text-white text-base">${brandTitle} — Districts & Architecture</span>
  <span class="text-xs font-mono text-zinc-400">${theme.coordinates}</span>
</header>
<section data-section="hero" id="hero" class="py-24 px-6 max-w-6xl mx-auto space-y-8 border-b border-zinc-800">
  <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200">SPATIAL SECTOR DIRECTORY</span>
  <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight">Urban Sectors & Elevation Profiles</h1>
  <p class="text-zinc-400 max-w-2xl text-base leading-relaxed">${theme.tagline}</p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
    ${theme.landmarks
      .map(
        (l) => `
      <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
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
  theme: ParallaxThemeProfile
): string {
  return `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-bold text-white text-base">${brandTitle} — Sky Deck Reservations & Passes</span>
  <span class="text-xs font-mono text-zinc-400">${theme.city}</span>
</header>
<section data-section="pricing" id="pricing" class="py-24 px-6 max-w-6xl mx-auto space-y-10">
  <div class="text-center max-w-2xl mx-auto space-y-3">
    <span class="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200">OBSERVATORY & PRIVATE ACCESS</span>
    <h1 class="text-4xl sm:text-5xl font-black text-white">Reserve Your Elevation</h1>
    <p class="text-sm text-zinc-400">Select an architectural viewing tier for ${theme.city}.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
      <p class="text-xs font-mono text-zinc-400 uppercase">Horizon Pass</p>
      <p class="text-3xl font-black text-white">$45</p>
      <p class="text-xs text-zinc-400">Daylight & twilight access to main observation gallery and interactive parallax exhibits.</p>
      <button class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-bold transition-colors">Select Horizon</button>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900 border border-white space-y-4 shadow-2xl">
      <p class="text-xs font-mono text-white uppercase">Nocturnal Private Lounge</p>
      <p class="text-3xl font-black text-white">$140</p>
      <p class="text-xs text-zinc-300">Priority sunset entry, private glass cantilever lounge, and curated architectural audio guide.</p>
      <button class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black transition-colors">Reserve VIP Pass</button>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
      <p class="text-xs font-mono text-zinc-400 uppercase">Private Helicopter Charter</p>
      <p class="text-3xl font-black text-white">$680</p>
      <p class="text-xs text-zinc-400">25-minute nocturnal aerial flight over ${theme.city} with private rooftop landing.</p>
      <button class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-bold transition-colors">Book Charter</button>
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
