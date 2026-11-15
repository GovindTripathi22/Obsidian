/**
 * Website ↔ Shopify Studio Transaction & Context Handoff Engine
 * Location: src/lib/builder-bridge.ts
 */

export interface BuilderDraftProduct {
  id: string;
  title: string;
  price: number;
  tag: string;
  image: string;
}

export interface BuilderDraftTransaction {
  source: "website" | "shopify";
  prompt: string;
  brandName: string;
  parallaxMode: boolean;
  parallaxThemeId: string;
  presetId?: string;
  websiteAccentId?: string;
  shopifyThemeId?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  products?: BuilderDraftProduct[];
  updatedAt: number;
}

export const BUILDER_DRAFT_STORAGE_KEY = "obsidian_builder_transaction_draft";

export function extractBrandFromPrompt(prompt: string, fallback: string = "Obsidian Atelier"): string {
  if (!prompt || !prompt.trim()) return fallback;
  const quoted = prompt.match(/"([^"]{2,36})"/);
  if (quoted && quoted[1]) return quoted[1].trim();

  const namedMatch = prompt.match(/(?:for|called|named|storefront for|website for)\s+([A-Z][A-Za-z0-9\s&'-]{2,32})/);
  if (namedMatch && namedMatch[1]) {
    return namedMatch[1].replace(/\s+(with|featuring|using|in|that).*$/i, "").trim();
  }

  const words = prompt
    .replace(/^(create|design|build|generate|architect)\s+(a|an|the)?\s*/i, "")
    .split(/[\s,.]+/)
    .filter(Boolean)
    .slice(0, 3);

  if (words.length > 0) {
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  return fallback;
}

export function suggestShopifyPresetFromPrompt(prompt: string): string {
  const lower = (prompt || "").toLowerCase();
  if (lower.includes("streetwear") || lower.includes("hoodie") || lower.includes("apparel") || lower.includes("fashion") || lower.includes("clothing")) {
    return "streetwear-lab";
  }
  if (lower.includes("audio") || lower.includes("headphone") || lower.includes("tech") || lower.includes("keyboard") || lower.includes("hardware") || lower.includes("cyber")) {
    return "cyber-audio";
  }
  if (lower.includes("coffee") || lower.includes("roast") || lower.includes("cafe") || lower.includes("espresso") || lower.includes("tea")) {
    return "artisanal-roast";
  }
  return "luxe-skincare";
}

export function convertWebsitePromptToShopifyPrompt(
  websitePrompt: string,
  brandName?: string
): {
  shopifyPrompt: string;
  storeName: string;
  suggestedPresetId: string;
} {
  const cleanPrompt = (websitePrompt || "").trim();
  const resolvedBrand = (brandName || "").trim() || extractBrandFromPrompt(cleanPrompt, "Obsidian Flagship Store");
  const suggestedPresetId = suggestShopifyPresetFromPrompt(cleanPrompt);

  if (!cleanPrompt) {
    return {
      shopifyPrompt: `Create a high-converting luxury Shopify Liquid 2.0 storefront for "${resolvedBrand}" with announcement bar, sticky glass header, featured 4-product collection grid, customer reviews, and instant slide-out cart drawer.`,
      storeName: resolvedBrand,
      suggestedPresetId,
    };
  }

  // If already mentions Shopify/Liquid, keep and enrich
  if (cleanPrompt.toLowerCase().includes("shopify") || cleanPrompt.toLowerCase().includes("liquid")) {
    return {
      shopifyPrompt: cleanPrompt,
      storeName: resolvedBrand,
      suggestedPresetId,
    };
  }

  return {
    shopifyPrompt: `Convert this brand concept into a Shopify Liquid 2.0 storefront for "${resolvedBrand}": ${cleanPrompt}. Include a featured product catalog with quick-add cart drawer, multi-currency pricing, customer reviews, and OS 2.0 JSON section schemas.`,
    storeName: resolvedBrand,
    suggestedPresetId,
  };
}

export function convertShopifyToWebsitePrompt(
  shopifyPrompt: string,
  storeName?: string,
  parallaxMode: boolean = false
): {
  websitePrompt: string;
  brandName: string;
} {
  const cleanPrompt = (shopifyPrompt || "").trim();
  const resolvedBrand = (storeName || "").trim() || extractBrandFromPrompt(cleanPrompt, "Obsidian Digital Studio");

  if (!cleanPrompt) {
    return {
      websitePrompt: parallaxMode
        ? `Create an immersive multi-layer parallax flagship website for "${resolvedBrand}" with 3D scroll depth, interactive spatial sections, and embedded motion video.`
        : `Create a high-converting luxury monochrome editorial website for "${resolvedBrand}" with hero showcase, bento feature grid, interactive gallery, and testimonials.`,
      brandName: resolvedBrand,
    };
  }

  const baseConcept = cleanPrompt
    .replace(/^Convert this brand concept into a Shopify Liquid 2\.0 storefront for "[^"]+":\s*/i, "")
    .replace(/\.?\s*Include a featured product catalog[\s\S]*$/i, "")
    .trim();

  if (parallaxMode) {
    return {
      websitePrompt: `Create a multi-layer parallax experience for "${resolvedBrand}": ${baseConcept}. Include scroll-driven foreground and horizon depth planes, spatial telemetry, and motion video reel.`,
      brandName: resolvedBrand,
    };
  }

  return {
    websitePrompt: baseConcept || cleanPrompt,
    brandName: resolvedBrand,
  };
}

export function saveBuilderDraftTransaction(
  partial: Partial<BuilderDraftTransaction>
): BuilderDraftTransaction | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = loadBuilderDraftTransaction();
    const merged: BuilderDraftTransaction = {
      source: partial.source || existing?.source || "website",
      prompt: partial.prompt !== undefined ? partial.prompt : existing?.prompt || "",
      brandName: partial.brandName !== undefined ? partial.brandName : existing?.brandName || "",
      parallaxMode: partial.parallaxMode !== undefined ? partial.parallaxMode : existing?.parallaxMode || false,
      parallaxThemeId: partial.parallaxThemeId || existing?.parallaxThemeId || "tokyo-noir",
      presetId: partial.presetId || existing?.presetId,
      websiteAccentId: partial.websiteAccentId || existing?.websiteAccentId,
      shopifyThemeId: partial.shopifyThemeId || existing?.shopifyThemeId,
      heroTitle: partial.heroTitle || existing?.heroTitle,
      heroSubtitle: partial.heroSubtitle || existing?.heroSubtitle,
      products: partial.products || existing?.products,
      updatedAt: Date.now(),
    };
    sessionStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return null;
  }
}

export function loadBuilderDraftTransaction(): BuilderDraftTransaction | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BUILDER_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuilderDraftTransaction;
  } catch {
    return null;
  }
}
