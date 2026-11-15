import JSZip from "jszip";

export interface ShopifyProductInput {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  tag?: string;
  image?: string;
}

export interface ShopifyStoreConfig {
  storeName?: string;
  tagline?: string;
  accentColor?: string;
  heroHeading?: string;
  heroSubheading?: string;
  announcementText?: string;
  currency?: string;
  cardRadius?: string;
  freeShippingThreshold?: number;
  gridColumns?: 3 | 4;
  showAnnouncement?: boolean;
  showSearchBar?: boolean;
  showSaleBadges?: boolean;
  showColorSwatches?: boolean;
  showStarRatings?: boolean;
  showQuickAdd?: boolean;
  showExpressPay?: boolean;
  sectionOrder?: string[];
  enabledSections?: Record<string, boolean>;
  products?: ShopifyProductInput[];
}

export interface ShopifyExportResult {
  zipBlob: Blob;
  fileName: string;
}

export async function compileShopifyLiquidTheme(
  projectId: string,
  htmlContent: string,
  cssContent: string,
  storeConfig?: ShopifyStoreConfig
): Promise<ShopifyExportResult> {
  const zip = new JSZip();

  // Extract dynamic values from storeConfig or htmlContent when present
  const extractedHeading = extractFirstMatch(htmlContent, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const extractedSubheading = extractFirstMatch(htmlContent, /<p[^>]*>([\s\S]*?)<\/p>/i);

  const storeName = storeConfig?.storeName?.trim() || formatProjectStoreName(projectId);
  const heroHeading = escapeJsonString(
    storeConfig?.heroHeading?.trim() || stripHtmlTags(extractedHeading) || "Next-Generation Luxury E-Commerce"
  );
  const heroSubheading = escapeJsonString(
    storeConfig?.heroSubheading?.trim() ||
      stripHtmlTags(extractedSubheading) ||
      "Architected with Liquid 2.0, high-speed streaming architecture, and instant global checkout."
  );
  const announcementText = escapeJsonString(
    storeConfig?.announcementText?.trim() ||
      "⚡ FREE EXPRESS GLOBAL SHIPPING ON ALL ORDERS OVER $100 — USE CODE: OBSIDIAN25"
  );
  const primaryAccent = storeConfig?.accentColor || "#10b981";
  const currencyCode = storeConfig?.currency || "USD";
  const shippingThreshold = Math.max(10, storeConfig?.freeShippingThreshold ?? 100);
  const gridCols = storeConfig?.gridColumns === 3 ? 3 : 4;
  const showAnnouncement = storeConfig?.showAnnouncement ?? true;
  const showSearchBar = storeConfig?.showSearchBar ?? true;
  const showSaleBadges = storeConfig?.showSaleBadges ?? true;
  const showColorSwatches = storeConfig?.showColorSwatches ?? true;
  const showStarRatings = storeConfig?.showStarRatings ?? true;
  const showQuickAdd = storeConfig?.showQuickAdd ?? true;
  const showExpressPay = storeConfig?.showExpressPay ?? true;
  const products = storeConfig?.products || [];

  // Map UI section keys cleanly into templates/index.json section keys
  const enabledMap = storeConfig?.enabledSections || {};
  const defaultBodyOrder = ["hero", "trust-bar", "featured-products", "reviews", "newsletter"];
  const requestedOrder =
    storeConfig?.sectionOrder && storeConfig.sectionOrder.length > 0
      ? storeConfig.sectionOrder
      : defaultBodyOrder;

  const keyMap: Record<string, string> = {
    hero: "hero",
    "trust-bar": "trust_bar",
    "featured-products": "featured_products",
    features: "features",
    reviews: "reviews",
    newsletter: "newsletter",
  };

  const activeBodyKeys = requestedOrder
    .filter((id) => enabledMap[id] !== false)
    .map((id) => keyMap[id] || id.replace(/-/g, "_"));

  const finalOrder: string[] = [
    ...(showAnnouncement ? ["announcement_bar"] : []),
    "header",
    ...activeBodyKeys,
    ...(activeBodyKeys.includes("features") ? [] : ["features"]),
    "footer",
  ];

  // 1. Layout directory: layout/theme.liquid
  const themeLiquid = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ page_title }} - {{ shop.name }}</title>
    {{ content_for_header }}
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700,900&f[]=general-sans@400,500,600,700&f[]=cabinet-grotesk@500,700,800,900&f[]=syne@500,700,800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    {{ 'theme.css' | asset_url | stylesheet_tag }}
    <style>:root { --obsidian-accent: ${primaryAccent}; }</style>
  </head>
  <body class="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-white/20 selection:text-white">
    ${showAnnouncement ? "{% section 'announcement-bar' %}" : ""}
    {% section 'header' %}
    <main id="MainContent" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>
    {% section 'cart-drawer' %}
    {% section 'footer' %}
  </body>
</html>`;
  zip.file("layout/theme.liquid", themeLiquid);

  // 2. Config directory: settings_schema.json & settings_data.json
  const settingsSchema = JSON.stringify(
    [
      {
        name: "theme_info",
        theme_name: `${storeName} — Obsidian Liquid 2.0`,
        theme_version: "2.6.0",
        theme_author: "Obsidian AI",
        theme_documentation_url: "https://obsidian.ai/docs",
        theme_support_url: "https://obsidian.ai/support",
      },
      {
        name: "Colors & Branding",
        settings: [
          { type: "color", id: "primary_accent", label: "Primary Accent Color", default: primaryAccent },
          { type: "color", id: "bg_dark", label: "Background Dark", default: "#09090b" },
          { type: "color", id: "card_bg", label: "Card Background", default: "#18181b" },
        ],
      },
      {
        name: "Storefront Merchandising",
        settings: [
          { type: "range", id: "grid_columns", label: "Product Grid Columns", min: 3, max: 4, step: 1, default: gridCols },
          { type: "number", id: "free_shipping_threshold", label: "Free Shipping Threshold", default: shippingThreshold },
          { type: "checkbox", id: "show_search_bar", label: "Show Header Search Bar", default: showSearchBar },
          { type: "checkbox", id: "show_sale_badges", label: "Show Sale & Promo Badges", default: showSaleBadges },
          { type: "checkbox", id: "show_color_swatches", label: "Show Variant Color Swatches", default: showColorSwatches },
          { type: "checkbox", id: "show_star_ratings", label: "Show Review Star Ratings", default: showStarRatings },
        ],
      },
      {
        name: "Typography",
        settings: [
          { type: "font_picker", id: "type_header_font", label: "Heading Font", default: "sans-serif" },
          { type: "font_picker", id: "type_body_font", label: "Body Font", default: "sans-serif" },
        ],
      },
    ],
    null,
    2
  );
  zip.file("config/settings_schema.json", settingsSchema);

  const settingsData = JSON.stringify(
    {
      current: {
        store_name: storeName,
        primary_accent: primaryAccent,
        currency: currencyCode,
        card_radius: storeConfig?.cardRadius || "glass-rounded",
        free_shipping_threshold: shippingThreshold,
        grid_columns: gridCols,
        show_search_bar: showSearchBar,
        show_sale_badges: showSaleBadges,
        show_color_swatches: showColorSwatches,
        show_star_ratings: showStarRatings,
        show_quick_add: showQuickAdd,
        show_express_pay: showExpressPay,
        bg_dark: "#09090b",
        card_bg: "#18181b",
        catalog_count: products.length,
      },
    },
    null,
    2
  );
  zip.file("config/settings_data.json", settingsData);

  // 3. Locales directory: locales/en.default.json
  const localesEn = JSON.stringify(
    {
      general: {
        cart: "Cart",
        search: "Search products",
        checkout: "Secure Checkout",
        add_to_cart: "Add to Cart",
        sold_out: "Sold Out",
      },
      products: {
        product: {
          regular_price: "Regular price",
          sale_price: "Sale price",
          quantity: "Quantity",
        },
      },
    },
    null,
    2
  );
  zip.file("locales/en.default.json", localesEn);

  // 4. Templates directory: templates/index.json
  const sectionsMap: Record<string, unknown> = {
    ...(showAnnouncement
      ? {
          announcement_bar: {
            type: "announcement-bar",
            settings: { announcement_text: announcementText },
          },
        }
      : {}),
    header: {
      type: "header",
      settings: { show_search: showSearchBar },
    },
    hero: {
      type: "hero",
      settings: {
        badge: `${storeName} • 2026 Collection`,
        heading: heroHeading,
        subheading: heroSubheading,
        button_text: "Explore Catalog →",
      },
    },
    trust_bar: {
      type: "trust-bar",
      settings: { free_shipping_threshold: shippingThreshold },
    },
    featured_products: {
      type: "featured-products",
      settings: { columns: gridCols },
    },
    features: { type: "features" },
    reviews: { type: "reviews" },
    newsletter: { type: "newsletter" },
    footer: {
      type: "footer",
      settings: { show_express_pay: showExpressPay },
    },
  };

  const indexJson = JSON.stringify(
    {
      sections: sectionsMap,
      order: finalOrder,
    },
    null,
    2
  );
  zip.file("templates/index.json", indexJson);

  // 5. Sections directory
  const announcementSection = `{% comment %} Shopify Announcement Bar Section {% endcomment %}
<div class="bg-zinc-900 border-b border-zinc-800 text-zinc-200 py-2 px-4 text-center text-xs font-mono font-medium flex items-center justify-center gap-2">
  <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${primaryAccent};"></span>
  <span>{{ section.settings.announcement_text | default: '${announcementText}' }}</span>
</div>

{% schema %}
{
  "name": "Announcement Bar",
  "settings": [
    { "type": "text", "id": "announcement_text", "label": "Announcement Text", "default": "${announcementText}" }
  ],
  "presets": [{ "name": "Announcement Bar" }]
}
{% endschema %}`;
  zip.file("sections/announcement-bar.liquid", announcementSection);

  const headerSection = `{% comment %} Shopify Header Section {% endcomment %}
<header class="bg-zinc-950/90 border-b border-zinc-800/80 py-4 px-6 sticky top-0 z-50 backdrop-blur-xl">
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
    <a href="/" class="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center shadow-md text-white" style="background-color: ${primaryAccent};">
        <span class="font-black text-xs">${escapeJsonString(storeName.slice(0, 1).toUpperCase() || "S")}</span>
      </div>
      <span>{{ shop.name | default: '${escapeJsonString(storeName)}' }}</span>
    </a>
    <nav class="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300">
      <a href="/" class="hover:text-white transition-colors">Home</a>
      <a href="/collections/all" class="hover:text-white transition-colors">Catalog</a>
      <a href="/pages/lookbook" class="hover:text-white transition-colors">Lookbook</a>
      <a href="/pages/about" class="hover:text-white transition-colors">Brand Story</a>
    </nav>
    <div class="flex items-center gap-3">
      {% if section.settings.show_search %}
      <form action="{{ routes.search_url }}" class="hidden sm:block">
        <input type="search" name="q" placeholder="{{ 'general.search' | t }}" class="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500" />
      </form>
      {% endif %}
      <a href="/cart" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:border-zinc-500 transition-colors">
        <span>Cart</span>
        <span class="px-1.5 py-0.2 rounded-full text-white text-[10px] font-bold" style="background-color: ${primaryAccent};">{{ cart.item_count | default: 0 }}</span>
      </a>
    </div>
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    { "type": "checkbox", "id": "show_search", "label": "Show Predictive Search", "default": ${showSearchBar} }
  ],
  "presets": [{ "name": "Header" }]
}
{% endschema %}`;
  zip.file("sections/header.liquid", headerSection);

  const heroSection = `{% comment %} Shopify Hero Section {% endcomment %}
<section class="relative bg-zinc-950 py-24 sm:py-32 px-6 text-center border-b border-zinc-800 overflow-hidden">
  <div class="max-w-4xl mx-auto space-y-6 relative z-10">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border text-xs font-semibold text-zinc-200" style="border-color: ${primaryAccent};">
      <span>✨ {{ section.settings.badge | default: 'New Collection 2026' }}</span>
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
      {{ section.settings.heading | default: '${heroHeading}' }}
    </h1>
    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      {{ section.settings.subheading | default: '${heroSubheading}' }}
    </p>
    <div class="flex items-center justify-center gap-4 pt-4">
      <a href="{{ section.settings.button_link | default: '/collections/all' }}" class="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:-translate-y-0.5" style="background-color: ${primaryAccent};">
        {{ section.settings.button_text | default: 'Explore Catalog →' }}
      </a>
      <a href="/pages/lookbook" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold transition-all">
        View Lookbook
      </a>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Hero Banner",
  "settings": [
    { "type": "text", "id": "badge", "label": "Badge Text", "default": "New Collection 2026" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "${heroHeading}" },
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "${heroSubheading}" },
    { "type": "text", "id": "button_text", "label": "Button Text", "default": "Explore Catalog →" },
    { "type": "url", "id": "button_link", "label": "Button Link" }
  ],
  "presets": [{ "name": "Hero Banner" }]
}
{% endschema %}`;
  zip.file("sections/hero.liquid", heroSection);

  const trustBarSection = `{% comment %} Merchant Trust & Free Shipping Strip {% endcomment %}
<section class="py-6 px-6 bg-zinc-900/60 border-b border-zinc-800">
  <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-300">
    <div class="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full" style="background:${primaryAccent};"></span>
      <span>Free Shipping Over $${shippingThreshold}</span>
    </div>
    <div class="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full" style="background:${primaryAccent};"></span>
      <span>30-Day Hassle-Free Returns</span>
    </div>
    <div class="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full" style="background:${primaryAccent};"></span>
      <span>256-Bit SSL Shop Pay Checkout</span>
    </div>
    <div class="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full" style="background:${primaryAccent};"></span>
      <span>Verified Authentic Craftsmanship</span>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Trust Bar",
  "settings": [
    { "type": "number", "id": "free_shipping_threshold", "label": "Free Shipping Threshold", "default": ${shippingThreshold} }
  ],
  "presets": [{ "name": "Trust Bar" }]
}
{% endschema %}`;
  zip.file("sections/trust-bar.liquid", trustBarSection);

  const fallbackProductsMarkup =
    products.length > 0
      ? products
          .map(
            (p) => `
      <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 flex flex-col justify-between">
        <div>
          <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
            <img src="${p.image || "/images/product-skincare.jpg"}" alt="${escapeJsonString(p.title)}" class="w-full h-full object-cover" />
            ${
              showSaleBadges
                ? `<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-white font-mono text-[9px] font-bold" style="background-color: ${primaryAccent};">${escapeJsonString(p.tag || "FEATURED")}</span>`
                : ""
            }
          </div>
          <h3 class="text-sm font-bold text-white">${escapeJsonString(p.title)}</h3>
          <p class="text-xs font-mono font-bold mt-1.5" style="color: ${primaryAccent};">$${p.price}.00 ${currencyCode}</p>
        </div>
      </div>`
          )
          .join("\n")
      : `
      <div class="col-span-full p-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-center text-zinc-400 space-y-2">
        <p class="font-bold text-white">Live Storefront Simulation Active</p>
        <p class="text-xs text-zinc-500">Products are populated directly from your Shopify store catalog.</p>
      </div>`;

  const featuredProductsSection = `{% comment %} Shopify Featured Products Section {% endcomment %}
<section class="py-20 px-6 max-w-7xl mx-auto">
  <div class="flex items-center justify-between mb-10">
    <div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
        <span>✨ Featured Collection</span>
      </h2>
      <p class="text-zinc-400 text-xs sm:text-sm mt-1">Curated luxury products ready for instant checkout</p>
    </div>
    <a href="/collections/all" class="text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1">
      <span>View All Products →</span>
    </a>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-6">
    {% for product in collections.frontpage.products limit: ${gridCols} %}
      {% render 'product-card', product: product %}
    {% else %}
      ${fallbackProductsMarkup}
    {% endfor %}
  </div>
</section>

{% schema %}
{
  "name": "Featured Products",
  "settings": [
    { "type": "range", "id": "columns", "label": "Desktop Columns", "min": 3, "max": 4, "step": 1, "default": ${gridCols} }
  ],
  "presets": [{ "name": "Featured Products" }]
}
{% endschema %}`;
  zip.file("sections/featured-products.liquid", featuredProductsSection);

  const featuresSection = `{% comment %} Storefront Craftsmanship & Value Props {% endcomment %}
<section class="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="font-mono uppercase" style="color:${primaryAccent};">01 / Formulation & Spec</p>
      <h3 class="text-base font-bold text-white">Archival Material Standard</h3>
      <p class="text-zinc-400 leading-relaxed">Produced in small verified runs with traceable sourcing.</p>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="font-mono uppercase" style="color:${primaryAccent};">02 / Fulfillment</p>
      <h3 class="text-base font-bold text-white">Same-Day Global Dispatch</h3>
      <p class="text-zinc-400 leading-relaxed">Complimentary express shipping above $${shippingThreshold}.</p>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
      <p class="font-mono uppercase" style="color:${primaryAccent};">03 / Shop Pay</p>
      <h3 class="text-base font-bold text-white">1-Click Biometric Checkout</h3>
      <p class="text-zinc-400 leading-relaxed">Encrypted transactions via Shop Pay, Apple Pay, and cards.</p>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Store Features",
  "settings": [],
  "presets": [{ "name": "Store Features" }]
}
{% endschema %}`;
  zip.file("sections/features.liquid", featuresSection);

  const reviewsSection = `{% comment %} Verified Customer Reviews Section {% endcomment %}
<section class="py-16 px-6 max-w-7xl mx-auto border-t border-zinc-800">
  <div class="flex items-center justify-between mb-8">
    <h2 class="text-2xl font-bold text-white">Verified Customer Reviews</h2>
    <span class="text-xs font-mono text-amber-400">★★★★★ 4.9 / 5.0</span>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
      <p class="text-amber-400">★★★★★</p>
      <p class="text-zinc-200">"Fastest checkout and flagship build quality right out of the box."</p>
      <p class="text-zinc-400 font-semibold">Sophia L. — Verified Buyer</p>
    </div>
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
      <p class="text-amber-400">★★★★★</p>
      <p class="text-zinc-200">"Packaging and material finish exceeded every expectation."</p>
      <p class="text-zinc-400 font-semibold">Marcus V. — Verified Buyer</p>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Customer Reviews",
  "settings": [],
  "presets": [{ "name": "Customer Reviews" }]
}
{% endschema %}`;
  zip.file("sections/reviews.liquid", reviewsSection);

  const newsletterSection = `{% comment %} VIP Newsletter Capture Section {% endcomment %}
<section class="py-16 px-6 max-w-4xl mx-auto text-center">
  <div class="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
    <h2 class="text-2xl font-bold text-white">Join Private Release Drops</h2>
    <p class="text-xs text-zinc-400">Unlock 15% off your first order and early access to limited editions.</p>
    {% form 'customer' %}
      <div class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input type="email" name="contact[email]" required placeholder="Enter your email" class="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
        <button type="submit" class="px-5 py-2.5 rounded-xl text-white text-xs font-bold" style="background-color:${primaryAccent};">Subscribe</button>
      </div>
    {% endform %}
  </div>
</section>

{% schema %}
{
  "name": "Newsletter Signup",
  "settings": [],
  "presets": [{ "name": "Newsletter Signup" }]
}
{% endschema %}`;
  zip.file("sections/newsletter.liquid", newsletterSection);

  const cartDrawerSection = `{% comment %} OS 2.0 Slide-Out Cart Drawer with Free Shipping Progress {% endcomment %}
<aside id="shopify-cart-drawer" class="hidden fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 p-6 z-50">
  <div class="space-y-4">
    <h2 class="text-base font-bold text-white">{{ section.settings.drawer_title | default: 'Your Cart' }}</h2>
    {% assign threshold_cents = ${shippingThreshold * 100} %}
    <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
      <p class="text-zinc-300">Free Express Shipping Threshold: $${shippingThreshold}</p>
      <div class="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
        <div class="h-full" style="width: 65%; background-color: ${primaryAccent};"></div>
      </div>
    </div>
  </div>
</aside>

{% schema %}
{
  "name": "Cart Drawer",
  "settings": [
    { "type": "text", "id": "drawer_title", "label": "Drawer Title", "default": "Your Cart" },
    { "type": "number", "id": "shipping_threshold", "label": "Free Shipping Threshold", "default": ${shippingThreshold} }
  ]
}
{% endschema %}`;
  zip.file("sections/cart-drawer.liquid", cartDrawerSection);

  const footerSection = `{% comment %} Shopify Footer Section {% endcomment %}
<footer class="bg-zinc-950 border-t border-zinc-800 py-16 px-6 text-zinc-400 text-xs">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
    <div class="space-y-3">
      <p class="text-base font-bold text-white">{{ shop.name | default: '${escapeJsonString(storeName)}' }}</p>
      <p class="text-zinc-500 leading-relaxed">Production-ready Shopify Liquid 2.0 store powered by Obsidian AI.</p>
    </div>
    <div class="space-y-2">
      <p class="font-bold text-white uppercase text-[11px] font-mono">Collections</p>
      <p><a href="/collections/new" class="hover:text-white transition-colors">New Arrivals</a></p>
      <p><a href="/collections/bestsellers" class="hover:text-white transition-colors">Best Sellers</a></p>
      <p><a href="/collections/limited" class="hover:text-white transition-colors">Limited Edition</a></p>
    </div>
    <div class="space-y-2">
      <p class="font-bold text-white uppercase text-[11px] font-mono">Customer Care</p>
      <p><a href="/pages/shipping" class="hover:text-white transition-colors">Global Express Shipping</a></p>
      <p><a href="/pages/returns" class="hover:text-white transition-colors">30-Day Returns</a></p>
      <p><a href="/pages/faq" class="hover:text-white transition-colors">FAQ & Support</a></p>
    </div>
    <div class="space-y-2">
      <p class="font-bold text-white uppercase text-[11px] font-mono">Legal & Security</p>
      <p><a href="/policies/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</a></p>
      <p><a href="/policies/terms-of-service" class="hover:text-white transition-colors">Terms of Service</a></p>
      <p class="text-zinc-200 font-mono text-[10px]">🔒 256-Bit SSL Encrypted</p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
    <p>&copy; {{ 'now' | date: "%Y" }} {{ shop.name | default: '${escapeJsonString(storeName)}' }}. Built with Obsidian Liquid 2.0 Engine.</p>
    ${
      showExpressPay
        ? `<div class="flex items-center gap-3">
      <span class="px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-mono text-[10px]">Visa</span>
      <span class="px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-mono text-[10px]">Mastercard</span>
      <span class="px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-mono text-[10px]">Apple Pay</span>
      <span class="px-2 py-1 rounded text-white font-mono text-[10px]" style="background-color:${primaryAccent};">Shop Pay</span>
    </div>`
        : ""
    }
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "settings": [],
  "presets": [{ "name": "Footer" }]
}
{% endschema %}`;
  zip.file("sections/footer.liquid", footerSection);

  // 6. Snippets directory
  const productCardSnippet = `<div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1">
  <div>
    <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
      <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      ${
        showSaleBadges
          ? `<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-white font-mono text-[9px] font-bold" style="background-color:${primaryAccent};">IN STOCK</span>`
          : ""
      }
    </div>
    <h3 class="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
    ${
      showStarRatings
        ? `<p class="text-[10px] text-amber-400 mt-1">★★★★★ <span class="text-zinc-400">(4.9)</span></p>`
        : ""
    }
    <p class="text-xs font-mono font-bold mt-1.5" style="color:${primaryAccent};">{{ product.price | money }}</p>
  </div>
  ${
    showQuickAdd
      ? `<button class="w-full mt-4 py-2 rounded-xl bg-zinc-800 hover:text-white text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
    <span>+ Quick Add</span>
  </button>`
      : ""
  }
</div>`;
  zip.file("snippets/product-card.liquid", productCardSnippet);

  // 7. Assets directory
  const compiledCss =
    cssContent ||
    `/* Global Theme CSS compiled by Obsidian Liquid Studio */
:root { --obsidian-accent: ${primaryAccent}; }
body { background-color: #09090b; color: #fafafa; font-family: 'Inter', sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; }
.glass-panel { background: rgba(24, 24, 27, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(63, 63, 70, 0.5); }
`;
  zip.file("assets/theme.css", compiledCss);

  const safeId = (projectId || "obsidian-store").replace(/[^a-zA-Z0-9_-]/g, "_") || "obsidian-store";
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    zipBlob,
    fileName: `${safeId}-shopify-liquid-theme.zip`,
  };
}

function extractFirstMatch(text: string, regex: RegExp): string {
  if (!text) return "";
  const match = text.match(regex);
  return match && match[1] ? match[1] : "";
}

function stripHtmlTags(str: string): string {
  return (str || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeJsonString(str: string): string {
  return (str || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .trim();
}

function formatProjectStoreName(projectId: string): string {
  if (!projectId || !projectId.trim()) return "LuxeStore Studio";
  const cleaned = projectId
    .replace(/^proj-(shopify|obsidian)-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\d+\b/g, "")
    .trim();
  if (!cleaned) return "LuxeStore Studio";
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 40);
}
