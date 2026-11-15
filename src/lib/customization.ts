/**
 * End-to-End Website & Shopify Storefront Customization Engine
 * Location: src/lib/customization.ts
 */

export type WebsiteAccentId =
  | "pure-white"
  | "electric-violet"
  | "cyber-cyan"
  | "solar-amber"
  | "crimson-rose"
  | "emerald-mint"
  | "cobalt-indigo";

export type WebsiteSurfaceId = "obsidian" | "midnight" | "carbon";

export type WebsiteTypographyId =
  | "modern-minimal"
  | "editorial-luxury"
  | "swiss-brutalist"
  | "cyber-tech"
  | "artisanal-warmth";

export type WebsiteHeaderStyle = "sticky-glass" | "minimal-split" | "centered-editorial";
export type WebsiteHeroLayout = "centered" | "split" | "bento";

export interface WebsiteAccentPalette {
  id: WebsiteAccentId;
  name: string;
  primary: string;
  secondary: string;
  onPrimary: string;
  glow: string;
  softBg: string;
  borderTint: string;
}

export interface WebsiteSurfaceTheme {
  id: WebsiteSurfaceId;
  name: string;
  bg: string;
  cardBg: string;
  border: string;
}

export interface WebsiteTypographyOption {
  id: WebsiteTypographyId;
  name: string;
  tag: string;
  headingCss: string;
  bodyCss: string;
}

export interface WebsiteSectionsConfig {
  announcementBar: boolean;
  trustMetrics: boolean;
  featuresBento: boolean;
  pricingMatrix: boolean;
  testimonials: boolean;
  faqAccordion: boolean;
  leadCapture: boolean;
  seoSchema: boolean;
}

export interface WebsiteColorfulElementsConfig {
  gradientGlowCta: boolean;
  colorfulStatusDots: boolean;
  tintedBadges: boolean;
  ratingStars: boolean;
  accentBorders: boolean;
}

export interface WebsiteCustomConfig {
  accentId: WebsiteAccentId;
  surfaceId: WebsiteSurfaceId;
  typographyId: WebsiteTypographyId;
  headerStyle: WebsiteHeaderStyle;
  heroLayout: WebsiteHeroLayout;
  sections: WebsiteSectionsConfig;
  elements: WebsiteColorfulElementsConfig;
}

export const WEBSITE_ACCENT_PALETTES: WebsiteAccentPalette[] = [
  {
    id: "pure-white",
    name: "Pure White Noir",
    primary: "#ffffff",
    secondary: "#d4d4d8",
    onPrimary: "#09090b",
    glow: "rgba(255, 255, 255, 0.22)",
    softBg: "rgba(255, 255, 255, 0.1)",
    borderTint: "rgba(255, 255, 255, 0.25)",
  },
  {
    id: "electric-violet",
    name: "Electric Violet",
    primary: "#8b5cf6",
    secondary: "#c084fc",
    onPrimary: "#ffffff",
    glow: "rgba(139, 92, 246, 0.34)",
    softBg: "rgba(139, 92, 246, 0.14)",
    borderTint: "rgba(139, 92, 246, 0.42)",
  },
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    primary: "#06b6d4",
    secondary: "#38bdf8",
    onPrimary: "#042f2e",
    glow: "rgba(6, 182, 212, 0.34)",
    softBg: "rgba(6, 182, 212, 0.14)",
    borderTint: "rgba(6, 182, 212, 0.42)",
  },
  {
    id: "solar-amber",
    name: "Solar Amber",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    onPrimary: "#09090b",
    glow: "rgba(245, 158, 11, 0.32)",
    softBg: "rgba(245, 158, 11, 0.14)",
    borderTint: "rgba(245, 158, 11, 0.42)",
  },
  {
    id: "crimson-rose",
    name: "Crimson Rose",
    primary: "#f43f5e",
    secondary: "#fb7185",
    onPrimary: "#ffffff",
    glow: "rgba(244, 63, 94, 0.32)",
    softBg: "rgba(244, 63, 94, 0.14)",
    borderTint: "rgba(244, 63, 94, 0.42)",
  },
  {
    id: "emerald-mint",
    name: "Emerald Mint",
    primary: "#10b981",
    secondary: "#34d399",
    onPrimary: "#022c22",
    glow: "rgba(16, 185, 129, 0.32)",
    softBg: "rgba(16, 185, 129, 0.14)",
    borderTint: "rgba(16, 185, 129, 0.42)",
  },
  {
    id: "cobalt-indigo",
    name: "Cobalt Indigo",
    primary: "#6366f1",
    secondary: "#818cf8",
    onPrimary: "#ffffff",
    glow: "rgba(99, 102, 241, 0.34)",
    softBg: "rgba(99, 102, 241, 0.14)",
    borderTint: "rgba(99, 102, 241, 0.42)",
  },
];

export const WEBSITE_SURFACE_THEMES: WebsiteSurfaceTheme[] = [
  { id: "obsidian", name: "Deep Obsidian", bg: "#09090b", cardBg: "#18181b", border: "#27272a" },
  { id: "midnight", name: "Midnight Slate", bg: "#060a14", cardBg: "#0f172a", border: "#1e293b" },
  { id: "carbon", name: "Warm Carbon", bg: "#111113", cardBg: "#1c1c20", border: "#2e2e34" },
];

export const WEBSITE_TYPOGRAPHY_OPTIONS: WebsiteTypographyOption[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    tag: "SaaS & Tech",
    headingCss: "'Clash Display', 'Satoshi', sans-serif",
    bodyCss: "'General Sans', 'Inter', sans-serif",
  },
  {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    tag: "Vogue & Serif",
    headingCss: "'Cormorant Garamond', 'Instrument Serif', Georgia, serif",
    bodyCss: "'General Sans', 'Inter', sans-serif",
  },
  {
    id: "swiss-brutalist",
    name: "Swiss Brutalist",
    tag: "Bold Impact",
    headingCss: "'Cabinet Grotesk', sans-serif",
    bodyCss: "'Inter', sans-serif",
  },
  {
    id: "cyber-tech",
    name: "Cybernetic Mono",
    tag: "AI & Hardware",
    headingCss: "'Syne', 'Space Grotesk', sans-serif",
    bodyCss: "'IBM Plex Mono', 'Inter', sans-serif",
  },
  {
    id: "artisanal-warmth",
    name: "Artisanal Classic",
    tag: "Studio & Cafe",
    headingCss: "'Playfair Display', Georgia, serif",
    bodyCss: "'Plus Jakarta Sans', sans-serif",
  },
];

export const DEFAULT_WEBSITE_CUSTOM_CONFIG: WebsiteCustomConfig = {
  accentId: "electric-violet",
  surfaceId: "obsidian",
  typographyId: "modern-minimal",
  headerStyle: "sticky-glass",
  heroLayout: "centered",
  sections: {
    announcementBar: true,
    trustMetrics: true,
    featuresBento: true,
    pricingMatrix: true,
    testimonials: true,
    faqAccordion: true,
    leadCapture: true,
    seoSchema: true,
  },
  elements: {
    gradientGlowCta: true,
    colorfulStatusDots: true,
    tintedBadges: true,
    ratingStars: true,
    accentBorders: true,
  },
};

export function getWebsiteAccent(id?: string): WebsiteAccentPalette {
  return WEBSITE_ACCENT_PALETTES.find((p) => p.id === id) || WEBSITE_ACCENT_PALETTES[1];
}

export function getWebsiteSurface(id?: string): WebsiteSurfaceTheme {
  return WEBSITE_SURFACE_THEMES.find((s) => s.id === id) || WEBSITE_SURFACE_THEMES[0];
}

export function getWebsiteTypography(id?: string): WebsiteTypographyOption {
  return WEBSITE_TYPOGRAPHY_OPTIONS.find((t) => t.id === id) || WEBSITE_TYPOGRAPHY_OPTIONS[0];
}

/* ── Shopify OS 2.0 Storefront Customization Model ── */

export type ShopifyThemeId =
  | "emerald-conversion"
  | "indigo-luxe"
  | "rose-atelier"
  | "amber-roastery"
  | "cyan-hardware"
  | "noir-minimal";

export type ShopifyCurrencyCode = "USD" | "EUR" | "GBP" | "CAD";
export type ShopifyCardRadiusStyle = "glass-rounded" | "sharp-editorial" | "soft-boutique";
export type ShopifySectionKey = "hero" | "trust-bar" | "featured-products" | "reviews" | "newsletter";

export interface ShopifyColorTheme {
  id: ShopifyThemeId;
  name: string;
  primary: string;
  secondary: string;
  onPrimary: string;
  softBg: string;
  borderTint: string;
  glow: string;
}

export interface ShopifySectionMeta {
  id: ShopifySectionKey;
  label: string;
  liquidFile: string;
  description: string;
}

export interface ShopifyCustomConfig {
  themeId: ShopifyThemeId;
  currency: ShopifyCurrencyCode;
  cardRadius: ShopifyCardRadiusStyle;
  gridColumns: 3 | 4;
  freeShippingThreshold: number;
  showAnnouncement: boolean;
  showSearchBar: boolean;
  showSaleBadges: boolean;
  showColorSwatches: boolean;
  showStarRatings: boolean;
  showQuickAdd: boolean;
  showExpressPay: boolean;
  sectionOrder: ShopifySectionKey[];
  enabledSections: Record<ShopifySectionKey, boolean>;
}

export const SHOPIFY_COLOR_THEMES: ShopifyColorTheme[] = [
  {
    id: "emerald-conversion",
    name: "Shopify Emerald",
    primary: "#10b981",
    secondary: "#34d399",
    onPrimary: "#ffffff",
    softBg: "rgba(16, 185, 129, 0.14)",
    borderTint: "rgba(16, 185, 129, 0.42)",
    glow: "rgba(16, 185, 129, 0.28)",
  },
  {
    id: "indigo-luxe",
    name: "Indigo Luxe",
    primary: "#6366f1",
    secondary: "#818cf8",
    onPrimary: "#ffffff",
    softBg: "rgba(99, 102, 241, 0.15)",
    borderTint: "rgba(99, 102, 241, 0.45)",
    glow: "rgba(99, 102, 241, 0.28)",
  },
  {
    id: "rose-atelier",
    name: "Rose Atelier",
    primary: "#f43f5e",
    secondary: "#fb7185",
    onPrimary: "#ffffff",
    softBg: "rgba(244, 63, 94, 0.15)",
    borderTint: "rgba(244, 63, 94, 0.42)",
    glow: "rgba(244, 63, 94, 0.26)",
  },
  {
    id: "amber-roastery",
    name: "Amber Boutique",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    onPrimary: "#09090b",
    softBg: "rgba(245, 158, 11, 0.14)",
    borderTint: "rgba(245, 158, 11, 0.42)",
    glow: "rgba(245, 158, 11, 0.26)",
  },
  {
    id: "cyan-hardware",
    name: "Cyan Cyber",
    primary: "#06b6d4",
    secondary: "#22d3ee",
    onPrimary: "#042f2e",
    softBg: "rgba(6, 182, 212, 0.14)",
    borderTint: "rgba(6, 182, 212, 0.42)",
    glow: "rgba(6, 182, 212, 0.26)",
  },
  {
    id: "noir-minimal",
    name: "Noir Monochrome",
    primary: "#f4f4f5",
    secondary: "#a1a1aa",
    onPrimary: "#09090b",
    softBg: "rgba(244, 244, 245, 0.1)",
    borderTint: "rgba(244, 244, 245, 0.3)",
    glow: "rgba(255, 255, 255, 0.18)",
  },
];

export const SHOPIFY_SECTION_DEFS: ShopifySectionMeta[] = [
  {
    id: "hero",
    label: "Hero Campaign Banner",
    liquidFile: "sections/hero.liquid",
    description: "Full-width flagship hero with dynamic headline & direct CTA",
  },
  {
    id: "trust-bar",
    label: "Merchant Trust & Shipping Strip",
    liquidFile: "sections/trust-bar.liquid",
    description: "Express courier, 30-day returns, SSL & verified batch guarantees",
  },
  {
    id: "featured-products",
    label: "Featured Collection Grid",
    liquidFile: "sections/featured-products.liquid",
    description: "Responsive catalog cards with swatches, compare-at pricing & quick add",
  },
  {
    id: "reviews",
    label: "Verified Customer Reviews",
    liquidFile: "sections/reviews.liquid",
    description: "5-star social proof cards with buyer locations & verified badges",
  },
  {
    id: "newsletter",
    label: "VIP Drop Newsletter Capture",
    liquidFile: "sections/newsletter.liquid",
    description: "Subscriber email capture with instant discount incentive",
  },
];

export const DEFAULT_SHOPIFY_CUSTOM_CONFIG: ShopifyCustomConfig = {
  themeId: "emerald-conversion",
  currency: "USD",
  cardRadius: "glass-rounded",
  gridColumns: 4,
  freeShippingThreshold: 100,
  showAnnouncement: true,
  showSearchBar: true,
  showSaleBadges: true,
  showColorSwatches: true,
  showStarRatings: true,
  showQuickAdd: true,
  showExpressPay: true,
  sectionOrder: ["hero", "trust-bar", "featured-products", "reviews", "newsletter"],
  enabledSections: {
    hero: true,
    "trust-bar": true,
    "featured-products": true,
    reviews: true,
    newsletter: true,
  },
};

export function getShopifyTheme(id?: string): ShopifyColorTheme {
  return SHOPIFY_COLOR_THEMES.find((t) => t.id === id) || SHOPIFY_COLOR_THEMES[0];
}

export function mapWebsiteAccentToShopifyTheme(accentId?: string): ShopifyThemeId {
  switch (accentId) {
    case "cobalt-indigo":
    case "electric-violet":
      return "indigo-luxe";
    case "crimson-rose":
      return "rose-atelier";
    case "solar-amber":
      return "amber-roastery";
    case "cyber-cyan":
      return "cyan-hardware";
    case "pure-white":
      return "noir-minimal";
    default:
      return "emerald-conversion";
  }
}

export function reorderShopifySection(
  order: ShopifySectionKey[],
  sectionId: ShopifySectionKey,
  direction: "up" | "down"
): ShopifySectionKey[] {
  const index = order.indexOf(sectionId);
  if (index === -1) return order;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= order.length) return order;
  const next = [...order];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

export const CURRENCY_CONFIG: Record<ShopifyCurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.78 },
  CAD: { symbol: "CA$", rate: 1.36 },
};

/* ── Prompt & HTML Compilation Helpers for End-to-End Websites ── */

export function buildWebsiteCustomizationPrompt(prompt: string, config?: Partial<WebsiteCustomConfig>): string {
  const merged = mergeWebsiteConfig(config);
  const accent = getWebsiteAccent(merged.accentId);
  const surface = getWebsiteSurface(merged.surfaceId);
  const typo = getWebsiteTypography(merged.typographyId);

  const enabledSections = Object.entries(merged.sections)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ");

  const enabledElements = Object.entries(merged.elements)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ");

  return `${prompt}

END-TO-END CUSTOMIZATION SPECIFICATION:
- Accent Palette: ${accent.name} (Primary: ${accent.primary}, Secondary: ${accent.secondary}, Soft tint: ${accent.softBg})
- Surface Canvas: ${surface.name} (Background: ${surface.bg}, Card: ${surface.cardBg})
- Typography Pairing: ${typo.name} (Headings: ${typo.headingCss}, Body: ${typo.bodyCss})
- Header Style: ${merged.headerStyle} | Hero Pattern: ${merged.heroLayout}
- Included Sections: ${enabledSections}
- Micro-Elements & Colorful Details: ${enabledElements}`;
}

export function mergeWebsiteConfig(partial?: Partial<WebsiteCustomConfig>): WebsiteCustomConfig {
  return {
    accentId: partial?.accentId || DEFAULT_WEBSITE_CUSTOM_CONFIG.accentId,
    surfaceId: partial?.surfaceId || DEFAULT_WEBSITE_CUSTOM_CONFIG.surfaceId,
    typographyId: partial?.typographyId || DEFAULT_WEBSITE_CUSTOM_CONFIG.typographyId,
    headerStyle: partial?.headerStyle || DEFAULT_WEBSITE_CUSTOM_CONFIG.headerStyle,
    heroLayout: partial?.heroLayout || DEFAULT_WEBSITE_CUSTOM_CONFIG.heroLayout,
    sections: {
      ...DEFAULT_WEBSITE_CUSTOM_CONFIG.sections,
      ...(partial?.sections || {}),
    },
    elements: {
      ...DEFAULT_WEBSITE_CUSTOM_CONFIG.elements,
      ...(partial?.elements || {}),
    },
  };
}

export function buildWebsiteThemeStyleBlock(config?: Partial<WebsiteCustomConfig>): string {
  const merged = mergeWebsiteConfig(config);
  const accent = getWebsiteAccent(merged.accentId);
  const surface = getWebsiteSurface(merged.surfaceId);
  const typo = getWebsiteTypography(merged.typographyId);

  return `<style id="obsidian-custom-design-tokens">
  :root {
    --obs-accent: ${accent.primary};
    --obs-accent-secondary: ${accent.secondary};
    --obs-on-accent: ${accent.onPrimary};
    --obs-glow: ${accent.glow};
    --obs-soft-bg: ${accent.softBg};
    --obs-border-tint: ${accent.borderTint};
    --obs-bg: ${surface.bg};
    --obs-card: ${surface.cardBg};
    --obs-border: ${surface.border};
    --obs-font-heading: ${typo.headingCss};
    --obs-font-body: ${typo.bodyCss};
  }
  html, body {
    background-color: var(--obs-bg) !important;
    font-family: var(--obs-font-body);
    overflow-x: clip;
  }
  h1, h2, h3, h4 {
    font-family: var(--obs-font-heading);
  }
  .obs-accent-btn {
    background: ${
      merged.elements.gradientGlowCta
        ? `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`
        : accent.primary
    };
    color: ${accent.onPrimary};
    box-shadow: ${merged.elements.gradientGlowCta ? `0 12px 32px -8px ${accent.glow}` : "none"};
  }
  .obs-accent-badge {
    background: ${merged.elements.tintedBadges ? accent.softBg : "rgba(255,255,255,0.06)"};
    border: 1px solid ${merged.elements.tintedBadges ? accent.borderTint : "rgba(255,255,255,0.16)"};
    color: ${merged.elements.tintedBadges ? accent.secondary : "#e4e4e7"};
  }
  .obs-accent-card {
    background-color: var(--obs-card);
    border-color: ${merged.elements.accentBorders ? accent.borderTint : surface.border};
  }
</style>`;
}

export function buildWebsiteEndToEndSupplementalSections(
  brandName: string,
  config?: Partial<WebsiteCustomConfig>
): string {
  const merged = mergeWebsiteConfig(config);
  const accent = getWebsiteAccent(merged.accentId);
  const safeBrand = escapeHtml(brandName || "Obsidian Studio");
  const blocks: string[] = [];

  if (merged.sections.trustMetrics) {
    blocks.push(`
<section data-section="trust-metrics" id="metrics" class="py-12 px-6 border-b border-zinc-800/80">
  <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
    ${[
      { label: "Performance Score", value: "99/100", tag: "CORE WEB VITALS", dot: "#10b981" },
      { label: "Global Edge CDN", value: "42ms", tag: "ZERO-LATENCY", dot: "#06b6d4" },
      { label: "Active Teams", value: "14,800+", tag: "VERIFIED SCALE", dot: "#8b5cf6" },
      { label: "Uptime SLA", value: "99.99%", tag: "ENTERPRISE", dot: "#f59e0b" },
    ]
      .map(
        (m) => `
    <div class="obs-accent-card p-5 rounded-2xl border space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">${m.tag}</span>
        ${
          merged.elements.colorfulStatusDots
            ? `<span class="w-2 h-2 rounded-full" style="background:${m.dot}; box-shadow:0 0 10px ${m.dot};"></span>`
            : ""
        }
      </div>
      <p class="text-2xl sm:text-3xl font-black text-white">${m.value}</p>
      <p class="text-xs text-zinc-400">${m.label}</p>
    </div>`
      )
      .join("")}
  </div>
</section>`);
  }

  if (merged.sections.pricingMatrix) {
    blocks.push(`
<section data-section="pricing" id="pricing" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800/80">
  <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
    <span class="obs-accent-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase">Transparent Plans</span>
    <h2 class="text-3xl sm:text-4xl font-bold text-white">Flexible Architecture for Every Stage</h2>
    <p class="text-sm text-zinc-400">Designed for ${safeBrand} with instant deployment, SSL, and custom domain routing.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    ${[
      {
        tier: "Starter",
        price: "$29",
        desc: "Essential launch stack for creators & solo studios.",
        featured: false,
        items: ["Responsive edge hosting", "SEO & OpenGraph tags", "Custom brand typography"],
      },
      {
        tier: "Studio Pro",
        price: "$79",
        desc: "Complete multi-page system with analytics & animations.",
        featured: true,
        items: ["Unlimited custom sections", "3D parallax & motion layers", "Lead capture & schema JSON-LD"],
      },
      {
        tier: "Enterprise",
        price: "$199",
        desc: "Dedicated multi-region SLA and headless API integration.",
        featured: false,
        items: ["Global multi-currency routing", "Dedicated edge security", "Priority design engineering"],
      },
    ]
      .map(
        (plan) => `
    <div class="p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${
      plan.featured ? "obs-accent-card shadow-2xl" : "bg-zinc-900/70 border-zinc-800"
    }" style="${plan.featured ? `border-color:${accent.primary}; box-shadow:0 24px 60px -18px ${accent.glow};` : ""}">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono uppercase text-zinc-300">${plan.tier}</span>
          ${
            plan.featured
              ? `<span class="obs-accent-badge px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">RECOMMENDED</span>`
              : ""
          }
        </div>
        <p class="text-4xl font-black text-white">${plan.price}<span class="text-xs font-normal text-zinc-400">/mo</span></p>
        <p class="text-xs text-zinc-400">${plan.desc}</p>
        <ul class="space-y-2 pt-3 border-t border-zinc-800 text-xs text-zinc-300">
          ${plan.items.map((item) => `<li class="flex items-center gap-2"><span style="color:${accent.secondary};">✓</span><span>${item}</span></li>`).join("")}
        </ul>
      </div>
      <a href="#contact" class="${
        plan.featured ? "obs-accent-btn" : "bg-zinc-800 hover:bg-zinc-700 text-white"
      } w-full py-3 rounded-xl text-center text-xs font-bold transition-all block">Choose ${plan.tier} →</a>
    </div>`
      )
      .join("")}
  </div>
</section>`);
  }

  if (merged.sections.testimonials) {
    blocks.push(`
<section data-section="testimonials" id="testimonials" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800/80">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <span class="obs-accent-badge inline-flex px-3 py-1 rounded-full text-[11px] font-mono uppercase mb-3">Verified Social Proof</span>
      <h2 class="text-3xl font-bold text-white">Trusted by Design-Led Teams</h2>
    </div>
    ${
      merged.elements.ratingStars
        ? `<div class="flex items-center gap-2 text-xs font-mono text-amber-400"><span>★★★★★</span><span class="text-zinc-300">4.95 / 5.0 Average Rating</span></div>`
        : ""
    }
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    ${[
      {
        name: "Maya Lin",
        role: "VP of Design • Studio Mono",
        quote: `Switching to ${safeBrand} cut our page launch time in half while lifting inbound conversions by 38%.`,
        dot: "#8b5cf6",
      },
      {
        name: "Julian Mercer",
        role: "Founder • Apex Labs",
        quote: "Every section—from hero pacing to mobile FAQ accessibility—feels crafted rather than templated.",
        dot: "#06b6d4",
      },
      {
        name: "Claire Moreau",
        role: "Creative Director • Atelier N°4",
        quote: "Subtle color accents against crisp dark surfaces make our photography and metrics stand out immediately.",
        dot: "#f59e0b",
      },
    ]
      .map(
        (t) => `
    <div class="obs-accent-card p-6 rounded-2xl border space-y-4">
      <div class="flex items-center justify-between">
        ${
          merged.elements.ratingStars
            ? `<span class="text-amber-400 text-xs tracking-widest">★★★★★</span>`
            : `<span class="text-xs font-mono text-zinc-400">VERIFIED</span>`
        }
        ${
          merged.elements.colorfulStatusDots
            ? `<span class="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400"><span class="w-1.5 h-1.5 rounded-full" style="background:${t.dot}"></span>Verified</span>`
            : ""
        }
      </div>
      <p class="text-sm text-zinc-200 leading-relaxed">"${t.quote}"</p>
      <div class="pt-3 border-t border-zinc-800/80">
        <p class="text-xs font-bold text-white">${t.name}</p>
        <p class="text-[11px] text-zinc-400">${t.role}</p>
      </div>
    </div>`
      )
      .join("")}
  </div>
</section>`);
  }

  if (merged.sections.faqAccordion) {
    blocks.push(`
<section data-section="faq" id="faq" class="py-20 px-6 max-w-4xl mx-auto border-b border-zinc-800/80 space-y-8">
  <div class="text-center space-y-2">
    <span class="obs-accent-badge inline-flex px-3 py-1 rounded-full text-[11px] font-mono uppercase">Questions & Technical Specs</span>
    <h2 class="text-3xl font-bold text-white">Frequently Asked Questions</h2>
  </div>
  <div class="space-y-3">
    ${[
      {
        q: `How quickly can we customize and deploy ${safeBrand}?`,
        a: "Every layout exports clean semantic HTML, CSS design tokens, and responsive breakpoints ready for instant hosting.",
      },
      {
        q: "Are SEO metadata, OpenGraph cards, and Schema.org JSON-LD included?",
        a: "Yes. Semantic landmarks, title/description meta tags, and structured JSON-LD scripts are embedded automatically.",
      },
      {
        q: "Does the theme respect accessibility and reduced-motion preferences?",
        a: "High-contrast typography, keyboard focus rings, and prefers-reduced-motion media queries are built in by default.",
      },
    ]
      .map(
        (faq, idx) => `
    <details ${idx === 0 ? "open" : ""} class="obs-accent-card rounded-2xl border p-5 group">
      <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-white list-none">
        <span>${faq.q}</span>
        <span class="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">+</span>
      </summary>
      <p class="text-xs text-zinc-400 leading-relaxed mt-3 pt-3 border-t border-zinc-800/80">${faq.a}</p>
    </details>`
      )
      .join("")}
  </div>
</section>`);
  }

  if (merged.sections.leadCapture) {
    blocks.push(`
<section data-section="contact" id="contact" class="py-20 px-6 max-w-4xl mx-auto border-b border-zinc-800/80">
  <div class="obs-accent-card p-8 sm:p-10 rounded-3xl border text-center space-y-5" style="box-shadow: 0 28px 70px -24px ${accent.glow};">
    <span class="obs-accent-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase">
      ${merged.elements.colorfulStatusDots ? `<span class="w-2 h-2 rounded-full" style="background:${accent.primary};"></span>` : ""}
      <span>Start With ${safeBrand}</span>
    </span>
    <h2 class="text-2xl sm:text-4xl font-bold text-white">Ready to Launch Your Next Release?</h2>
    <p class="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">Enter your email to receive private previews, changelog updates, and architecture kits.</p>
    <form onsubmit="event.preventDefault(); var msg=this.nextElementSibling; if(msg){msg.classList.remove('hidden');}" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
      <input type="email" required placeholder="founder@company.com" aria-label="Email address" class="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white" />
      <button type="submit" class="obs-accent-btn px-6 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap">Request Access →</button>
    </form>
    <p class="hidden text-xs font-mono" style="color:${accent.secondary};">✓ Confirmation received — welcome to ${safeBrand}.</p>
  </div>
</section>`);
  }

  if (merged.sections.seoSchema) {
    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brandName || "Obsidian Studio",
      description: `${brandName || "Obsidian Studio"} — Customized end-to-end digital flagship.`,
    };
    blocks.push(`
<script type="application/ld+json" data-obsidian-seo="true">${JSON.stringify(schemaObj)}</script>`);
  }

  return blocks.join("\n");
}

export function generateStandardCustomWebsiteHtml(
  prompt: string,
  pageName: string,
  isShopify: boolean,
  config?: Partial<WebsiteCustomConfig>
): string {
  const merged = mergeWebsiteConfig(config);
  const accent = getWebsiteAccent(merged.accentId);
  const brandName = extractSubjectForSite(prompt);
  const isStreetwear = /streetwear|hoodie|kinetic|apparel/i.test(prompt);
  const isAudio = /audio|headphone|apex|cyber|tech/i.test(prompt);
  const isCoffee = /coffee|roast|cafe|velvet|espresso/i.test(prompt);

  const resolvedBrand =
    brandName ||
    (isStreetwear
      ? "KINETIC Supply"
      : isAudio
      ? "Apex Cybernetics"
      : isCoffee
      ? "Velvet & Vine Roastery"
      : isShopify
      ? "Aura Botanicals"
      : "Obsidian Digital");

  const productImg = isStreetwear
    ? "/images/product-streetwear.jpg"
    : isAudio
    ? "/images/product-audio.jpg"
    : isCoffee
    ? "/images/product-coffee.jpg"
    : isShopify
    ? "/images/product-skincare.jpg"
    : "/images/parallax-tokyo.jpg";

  const styleBlock = buildWebsiteThemeStyleBlock(merged);

  if (pageName.toLowerCase().includes("feature") || pageName.toLowerCase().includes("pricing")) {
    return `${styleBlock}
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <span class="font-extrabold text-lg text-white">${escapeHtml(resolvedBrand)} — ${escapeHtml(pageName)}</span>
  <span class="obs-accent-badge px-3 py-1 rounded-full text-[11px] font-mono">${accent.name}</span>
</header>
${buildWebsiteEndToEndSupplementalSections(resolvedBrand, {
  ...merged,
  sections: {
    ...merged.sections,
    pricingMatrix: true,
    faqAccordion: true,
    leadCapture: true,
  },
})}`;
  }

  const headerMarkup =
    merged.headerStyle === "centered-editorial"
      ? `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
  <nav class="flex items-center gap-5 text-xs font-medium text-zinc-300">
    <a href="#hero" class="hover:text-white">Overview</a>
    <a href="#features" class="hover:text-white">Capabilities</a>
  </nav>
  <span class="font-black text-lg tracking-tight text-white">${escapeHtml(resolvedBrand)}</span>
  <div class="flex items-center gap-3">
    <a href="#pricing" class="text-xs text-zinc-300 hover:text-white">Plans</a>
    <a href="#contact" class="obs-accent-btn px-4 py-1.5 rounded-xl text-xs font-bold">Get Started</a>
  </div>
</header>`
      : `
<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
  <div class="flex items-center gap-2.5">
    <span class="w-8 h-8 rounded-xl obs-accent-btn flex items-center justify-center font-black text-xs">${escapeHtml(
      resolvedBrand.slice(0, 1).toUpperCase()
    )}</span>
    <span class="font-extrabold text-base sm:text-lg tracking-tight text-white">${escapeHtml(resolvedBrand)}</span>
  </div>
  <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
    <a href="#hero" class="hover:text-white transition-colors">Home</a>
    ${merged.sections.featuresBento ? `<a href="#features" class="hover:text-white transition-colors">Capabilities</a>` : ""}
    ${merged.sections.pricingMatrix ? `<a href="#pricing" class="hover:text-white transition-colors">Pricing</a>` : ""}
    ${merged.sections.faqAccordion ? `<a href="#faq" class="hover:text-white transition-colors">FAQ</a>` : ""}
  </nav>
  <a href="#contact" class="obs-accent-btn px-4 py-2 rounded-xl text-xs font-bold transition-transform hover:-translate-y-0.5">Start Now →</a>
</header>`;

  const heroSection =
    merged.heroLayout === "split"
      ? `
<section data-section="hero" id="hero" class="py-20 px-6 border-b border-zinc-800">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
    <div class="md:col-span-6 space-y-6">
      <span class="obs-accent-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono">
        ${merged.elements.colorfulStatusDots ? `<span class="w-2 h-2 rounded-full" style="background:${accent.primary};"></span>` : ""}
        <span>${escapeHtml(accent.name)} Edition</span>
      </span>
      <h1 class="text-4xl sm:text-5xl font-black text-white leading-tight">${escapeHtml(resolvedBrand)} — Crafted End to End.</h1>
      <p class="text-sm sm:text-base text-zinc-400 leading-relaxed">${escapeHtml(prompt.slice(0, 180))}</p>
      <div class="flex flex-wrap gap-3">
        <a href="#features" class="obs-accent-btn px-6 py-3 rounded-xl text-xs font-bold">Explore Architecture →</a>
        <a href="#contact" class="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white">Request Demo</a>
      </div>
    </div>
    <div class="md:col-span-6">
      <div class="obs-accent-card rounded-3xl border p-3 shadow-2xl" style="box-shadow: 0 30px 70px -20px ${accent.glow};">
        <img src="${productImg}" alt="${escapeHtml(resolvedBrand)}" class="w-full aspect-[4/3] object-cover rounded-2xl" />
      </div>
    </div>
  </div>
</section>`
      : `
<section data-section="hero" id="hero" class="relative py-24 sm:py-28 px-6 text-center border-b border-zinc-800 overflow-hidden">
  <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 50% 20%, ${accent.glow}, transparent 60%);"></div>
  <div class="max-w-4xl mx-auto space-y-6 relative z-10">
    <span class="obs-accent-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold">
      ${merged.elements.colorfulStatusDots ? `<span class="w-2 h-2 rounded-full" style="background:${accent.primary};"></span>` : ""}
      <span>${isShopify ? "Next-Gen Shopify Collection" : `${escapeHtml(accent.name)} Architecture`}</span>
    </span>
    <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      ${escapeHtml(resolvedBrand)}
    </h1>
    <p class="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      ${escapeHtml(prompt.slice(0, 190))}
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <a href="#features" class="obs-accent-btn px-8 py-3.5 rounded-xl font-black text-xs transition-all hover:-translate-y-0.5">
        Explore Platform →
      </a>
      <a href="#contact" class="px-8 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs transition-all">
        Book Consultation
      </a>
    </div>
  </div>
</section>`;

  const announcementMarkup = merged.sections.announcementBar
    ? `
<section data-section="announcement-bar" class="bg-zinc-900/90 border-b border-zinc-800 text-zinc-200 py-2.5 px-4 text-center text-xs font-mono flex items-center justify-center gap-2">
  ${merged.elements.colorfulStatusDots ? `<span class="w-2 h-2 rounded-full" style="background:${accent.primary}; box-shadow:0 0 10px ${accent.primary};"></span>` : ""}
  <span>LIVE RELEASE: ${escapeHtml(resolvedBrand.toUpperCase())} • ${escapeHtml(accent.name.toUpperCase())} DESIGN SYSTEM</span>
</section>`
    : "";

  const bentoFeaturesMarkup = merged.sections.featuresBento
    ? `
<section data-section="features" id="features" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
      <span class="obs-accent-badge inline-flex px-3 py-1 rounded-full text-[10px] font-mono uppercase mb-3">01 / Modular Bento Stack</span>
      <h2 class="text-3xl font-bold text-white">Engineered End-to-End Capabilities</h2>
    </div>
    <span class="text-xs font-mono text-zinc-400">RESPONSIVE • ACCESSIBLE • SEO READY</span>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 obs-accent-card p-6 rounded-3xl border flex flex-col sm:flex-row gap-6 items-center">
      <img src="${productImg}" alt="Showcase" class="w-full sm:w-56 h-44 object-cover rounded-2xl border border-zinc-800" />
      <div class="space-y-3">
        <span class="obs-accent-badge inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono">PRIMARY SYSTEM</span>
        <h3 class="text-xl font-bold text-white">Cohesive Visual Language & Performance</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Built around centralized CSS tokens, accessible semantic landmarks, and fast edge delivery for sub-second Core Web Vitals.</p>
      </div>
    </div>
    <div class="obs-accent-card p-6 rounded-3xl border space-y-3 flex flex-col justify-between">
      <div>
        <span class="obs-accent-badge inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono">02 / CONVERSION</span>
        <h3 class="text-lg font-bold text-white mt-3">Verified Trust & Lead Capture</h3>
        <p class="text-xs text-zinc-400 mt-2 leading-relaxed">Validated intake forms, structured Schema.org metadata, and crystal-clear pricing hierarchies.</p>
      </div>
      <div class="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
        <span class="text-zinc-400">Lighthouse</span>
        <span style="color:${accent.secondary};" class="font-bold">100 / 100</span>
      </div>
    </div>
  </div>
</section>`
    : "";

  const footerMarkup = `
<footer data-section="footer" id="footer" class="py-12 px-6 bg-zinc-950 text-zinc-400 text-xs">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p>&copy; ${new Date().getFullYear()} ${escapeHtml(resolvedBrand)}. Configured with ${escapeHtml(accent.name)}.</p>
    <div class="flex items-center gap-6 font-semibold">
      <a href="#hero" class="hover:text-white transition-colors">Overview</a>
      <a href="#features" class="hover:text-white transition-colors">Features</a>
      <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      <a href="#contact" class="hover:text-white transition-colors">Contact</a>
    </div>
  </div>
</footer>`;

  return `${styleBlock}
${announcementMarkup}
${headerMarkup}
${heroSection}
${bentoFeaturesMarkup}
${buildWebsiteEndToEndSupplementalSections(resolvedBrand, merged)}
${footerMarkup}`;
}

function extractSubjectForSite(prompt: string): string {
  if (!prompt) return "";
  const quoted = prompt.match(/"([^"]{2,36})"/);
  if (quoted && quoted[1]) return quoted[1].trim();
  const named = prompt.match(/(?:for|called|named|website for|store for)\s+([A-Z][A-Za-z0-9\s&'-]{2,32})/);
  if (named && named[1]) {
    return named[1].replace(/\s+(with|featuring|using|in|that).*$/i, "").trim();
  }
  const clean = prompt
    .replace(/^(create|design|build|generate|architect)\s+(a|an|the)?\s*/i, "")
    .split(/[,.]+/)[0]
    .trim();
  return clean.length > 36 ? clean.slice(0, 36).trim() : clean;
}

function escapeHtml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
