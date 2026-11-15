import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PARALLAX_THEMES,
  buildBackgroundParallaxPrompt,
  detectParallaxIntent,
  generateParallaxWebsiteHtml,
  getParallaxThemeById,
  synthesizeCustomParallaxTheme,
} from "../parallax";
import {
  parseTopLevelSections,
  moveSectionInHtml,
  duplicateSectionInHtml,
  deleteSectionInHtml,
  updateSectionTextInHtml,
  updateElementStyleInHtml,
  updateSectionImageInHtml,
  extractSelectedElementFromMessage,
  extractInlineCommitFromMessage,
  buildIframeBridgeScript,
} from "../editor-dom";
import {
  extractBrandFromPrompt,
  convertWebsitePromptToShopifyPrompt,
  convertShopifyToWebsitePrompt,
  suggestShopifyPresetFromPrompt,
} from "../builder-bridge";
import { compileShopifyLiquidTheme } from "../shopify";
import {
  WEBSITE_ACCENT_PALETTES,
  SHOPIFY_COLOR_THEMES,
  mergeWebsiteConfig,
  buildWebsiteThemeStyleBlock,
  buildWebsiteCustomizationPrompt,
  generateStandardCustomWebsiteHtml,
  reorderShopifySection,
  mapWebsiteAccentToShopifyTheme,
} from "../customization";

describe("3D Parallax & Product Dedicated Engine (src/lib/parallax.ts)", () => {
  it("detects parallax, city, and product-dedicated intent accurately across themes", () => {
    const tokyo = detectParallaxIntent("Create a Tokyo skyline parallax website at dusk");
    assert.equal(tokyo.isParallax, true);
    assert.equal(tokyo.theme.id, "tokyo-noir");

    const alpine = detectParallaxIntent("Build a Swiss Alpine mountain sanctuary with scroll depth");
    assert.equal(alpine.isParallax, true);
    assert.equal(alpine.theme.id, "alpine-horizon");

    const nyc = detectParallaxIntent("Design a Manhattan skyscraper real estate portfolio", true);
    assert.equal(nyc.isParallax, true);
    assert.equal(nyc.theme.id, "manhattan-vertical");

    const serum = detectParallaxIntent("Create a 3D parallax skincare serum bottle launch", true);
    assert.equal(serum.isParallax, true);
    assert.equal(serum.theme.id, "product-botanical");
    assert.equal(serum.theme.category, "product");

    const saas = detectParallaxIntent("Build a 3D spatial SaaS dashboard showcase", true);
    assert.equal(saas.isParallax, true);
    assert.equal(saas.theme.id, "spatial-saas");

    const standard = detectParallaxIntent("Simple B2B SaaS accounting dashboard", false);
    assert.equal(standard.isParallax, false);
  });

  it("generates true 3D perspective & cursor-tilt parallax HTML with viewport-centered physics", () => {
    const html = generateParallaxWebsiteHtml({
      prompt: 'Create a parallax city website for "Neo Tokyo Sky"',
      pageName: "Home Page",
      themeId: "tokyo-noir",
      parallaxOptions: {
        depthPreset: "interactive-3d",
        enableTiltStage: true,
        enableExplodedSpecs: true,
        enableVideoLayer: true,
      },
    });

    assert.ok(html.includes("Neo Tokyo Sky"));
    assert.ok(html.includes('data-section="hero"'));
    assert.ok(html.includes("perspective(1200px)"));
    assert.ok(html.includes("preserve-3d"));
    assert.ok(html.includes("data-parallax-z="));
    assert.ok(html.includes("rotateX("));
    assert.ok(html.includes("rotateY("));
    assert.ok(html.includes("/images/parallax-tokyo.jpg"));
    assert.ok(html.includes("/background.mp4"));
    assert.ok(!html.includes("images.unsplash.com"));
  });

  it("generates Product-Dedicated 3D showcase with variant finish switcher & exploded hardware planes", () => {
    const productHtml = generateParallaxWebsiteHtml({
      prompt: 'Product-dedicated 3D website for "Apex Planar Studio"',
      pageName: "Home Page",
      themeId: "obsidian-kinetic",
      parallaxOptions: {
        category: "product",
        depthPreset: "cinematic",
        enableTiltStage: true,
        enableExplodedSpecs: true,
      },
    });

    assert.ok(productHtml.includes("Apex Planar Studio"));
    assert.ok(productHtml.includes("PRODUCT DEDICATED 3D MONOLITH"));
    assert.ok(productHtml.includes("data-variant-btn"));
    assert.ok(productHtml.includes("Matte Titanium"));
    assert.ok(productHtml.includes("obsidian-quick-reserve-btn"));
    assert.ok(productHtml.includes("$349.00"));
  });

  it("generates dedicated Specs/Districts and Editions/Reservations subpages", () => {
    const districtsHtml = generateParallaxWebsiteHtml({
      prompt: 'Create a parallax website for "Alpine Monolith"',
      pageName: "Features",
      themeId: "alpine-horizon",
    });
    assert.ok(districtsHtml.includes("Urban Sectors & Elevation Profiles"));

    const pricingHtml = generateParallaxWebsiteHtml({
      prompt: 'Create a parallax website for "Alpine Monolith"',
      pageName: "Pricing",
      themeId: "alpine-horizon",
    });
    assert.ok(pricingHtml.includes("Reserve Your Elevation"));
    assert.equal(getParallaxThemeById("alpine-horizon").city, "Zermatt & Vals, Switzerland");
    assert.ok(PARALLAX_THEMES.length >= 8);
    assert.equal(PARALLAX_THEMES.filter((t) => t.category === "product").length, 4);
  });

  it("synthesizes bespoke custom topics for short prompts without preset lock-in", () => {
    const custom = synthesizeCustomParallaxTheme("luxury titanium mechanical watch");
    assert.equal(custom.name, "Luxury Titanium Mechanical Watch");
    assert.equal(custom.category, "product");
    assert.ok(!custom.name.includes("Obsidian Acoustic"));

    const brief = buildBackgroundParallaxPrompt("luxury titanium watch", {
      category: "product",
      depthPreset: "cinematic",
      enableTiltStage: true,
      enableExplodedSpecs: true,
    });
    assert.ok(brief.includes("Luxury Titanium Watch"));
    assert.ok(brief.includes("CINEMATIC"));
    assert.ok(brief.includes("[data-sticky-runway]"));

    const customHtml = generateParallaxWebsiteHtml({
      prompt: "luxury titanium watch",
      pageName: "Home Page",
      parallaxOptions: {
        category: "product",
        depthPreset: "cinematic",
        enableTiltStage: true,
        enableExplodedSpecs: true,
      },
    });
    assert.ok(customHtml.includes("Luxury Titanium Watch"));
    assert.ok(!customHtml.includes("50mm Planar Magnetic Driver"));
    assert.ok(customHtml.includes("overflow-x: clip"));
    assert.ok(customHtml.includes("data-sticky-runway"));
    assert.ok(customHtml.includes("data-sticky-stage"));
    assert.ok(customHtml.includes("data-parallax-x"));
    assert.ok(customHtml.includes("data-glare-layer"));
    assert.ok(customHtml.includes("data-obsidian-parallax-runtime"));
  });
});

describe("Editor DOM Manipulation & Iframe Bridge (src/lib/editor-dom.ts)", () => {
  const sampleHtml = `
<header data-section="header"><h1>Brand Header</h1></header>
<section data-section="hero" id="hero"><h1>Original Hero Headline</h1><img src="/images/parallax-tokyo.jpg" class="w-full" /></section>
<section data-section="features" id="features"><h2>Key Features</h2></section>
<footer data-section="footer"><p>Footer</p></footer>
  `.trim();

  it("parses, reorders, duplicates, and deletes sections cleanly", () => {
    const parsed = parseTopLevelSections(sampleHtml);
    assert.equal(parsed.sections.length, 4);
    assert.deepEqual(
      parsed.sections.map((s) => s.id),
      ["header", "hero", "features", "footer"]
    );

    const movedDown = moveSectionInHtml(sampleHtml, "hero", "down");
    const afterMove = parseTopLevelSections(movedDown);
    assert.deepEqual(
      afterMove.sections.map((s) => s.id),
      ["header", "features", "hero", "footer"]
    );

    const duplicated = duplicateSectionInHtml(sampleHtml, "hero");
    const afterDup = parseTopLevelSections(duplicated);
    assert.equal(afterDup.sections.length, 5);
    assert.equal(afterDup.sections[2].id, "hero-copy");

    const deleted = deleteSectionInHtml(sampleHtml, "features");
    const afterDel = parseTopLevelSections(deleted);
    assert.equal(afterDel.sections.length, 3);
    assert.ok(!afterDel.sections.some((s) => s.id === "features"));
  });

  it("updates section text and image sources accurately", () => {
    const textUpdated = updateSectionTextInHtml(
      sampleHtml,
      "hero",
      "Original Hero Headline",
      "Updated Noir Metropolis"
    );
    assert.ok(textUpdated.includes("Updated Noir Metropolis"));
    assert.ok(!textUpdated.includes("Original Hero Headline"));

    const imgUpdated = updateSectionImageInHtml(
      sampleHtml,
      "hero",
      "/images/parallax-nyc.jpg",
      "tr:drop-shadow",
      "/images/parallax-tokyo.jpg"
    );
    assert.ok(imgUpdated.includes("/images/parallax-nyc.jpg"));
    assert.ok(imgUpdated.includes("drop-shadow-"));
  });

  it("extracts nested element payloads from OBSIDIAN_SELECT_ELEMENT postMessage events", () => {
    const nested = extractSelectedElementFromMessage({
      type: "OBSIDIAN_SELECT_ELEMENT",
      element: {
        sectionId: "products",
        tagName: "h3",
        textContent: "50mm Planar Magnetic Driver",
        imgSrc: "/images/product-audio.jpg",
      },
    });
    assert.deepEqual(nested, {
      sectionId: "products",
      tagName: "h3",
      textContent: "50mm Planar Magnetic Driver",
      imgSrc: "/images/product-audio.jpg",
    });

    const ignored = extractSelectedElementFromMessage({ type: "UNRELATED_EVENT" });
    assert.equal(ignored, null);
  });
});

describe("Website ↔ Shopify Transaction Bridge (src/lib/builder-bridge.ts)", () => {
  it("extracts brand names and converts Website prompts into Shopify Studio prompts", () => {
    const brand = extractBrandFromPrompt('Create a minimalist coffee shop website for "Velvet Roast" with warm tones');
    assert.equal(brand, "Velvet Roast");

    const converted = convertWebsitePromptToShopifyPrompt(
      'Create a minimalist coffee shop website for "Velvet Roast" with warm tones'
    );
    assert.equal(converted.storeName, "Velvet Roast");
    assert.equal(converted.suggestedPresetId, "artisanal-roast");
    assert.ok(converted.shopifyPrompt.includes("Shopify Liquid 2.0 storefront"));

    const backToWebsite = convertShopifyToWebsitePrompt(converted.shopifyPrompt, converted.storeName, true);
    assert.equal(backToWebsite.brandName, "Velvet Roast");
    assert.ok(backToWebsite.websitePrompt.includes("parallax"));
    assert.equal(suggestShopifyPresetFromPrompt("Heavyweight hoodie streetwear drop"), "streetwear-lab");
  });
});

describe("Shopify Liquid 2.0 Theme Compiler (src/lib/shopify.ts)", () => {
  it("compiles custom store config and product catalog into OS 2.0 ZIP archive", async () => {
    const result = await compileShopifyLiquidTheme(
      "noir-atelier",
      "<section><h1>Custom Noir Heading</h1></section>",
      "body { background: #000; }",
      {
        storeName: "Noir Atelier Paris",
        heroHeading: "Haute Horlogerie & Objects",
        announcementText: "COMPLIMENTARY CONCIERGE DELIVERY",
        products: [
          { id: "p1", title: "Chronograph 01", price: 1450, tag: "LIMITED", image: "/images/product-audio.jpg" },
        ],
      }
    );

    assert.ok(result.fileName.endsWith("-shopify-liquid-theme.zip"));
    assert.ok(result.zipBlob.size > 1000);
  });

  it("writes dynamic section order, freeShippingThreshold, and merchandising flags into OS 2.0 ZIP", async () => {
    const JSZip = (await import("jszip")).default;
    const result = await compileShopifyLiquidTheme(
      "indigo-atelier",
      "<section><h1>Indigo Drop</h1></section>",
      "",
      {
        storeName: "Indigo Atelier",
        accentColor: "#6366f1",
        currency: "EUR",
        freeShippingThreshold: 125,
        gridColumns: 3,
        showAnnouncement: false,
        showSearchBar: true,
        showSaleBadges: true,
        showColorSwatches: true,
        showStarRatings: true,
        showExpressPay: true,
        sectionOrder: ["hero", "featured-products", "trust-bar", "reviews", "newsletter"],
        enabledSections: {
          hero: true,
          "featured-products": true,
          "trust-bar": true,
          reviews: false,
          newsletter: true,
        },
      }
    );

    const buf = await result.zipBlob.arrayBuffer();
    const loaded = await JSZip.loadAsync(buf);
    const indexJsonText = await loaded.file("templates/index.json")?.async("string");
    assert.ok(indexJsonText);
    const indexParsed = JSON.parse(indexJsonText);
    assert.ok(!indexParsed.order.includes("announcement_bar"));
    assert.ok(!indexParsed.order.includes("reviews"));
    assert.ok(indexParsed.order.indexOf("featured_products") < indexParsed.order.indexOf("trust_bar"));

    const settingsDataText = await loaded.file("config/settings_data.json")?.async("string");
    assert.ok(settingsDataText?.includes('"free_shipping_threshold": 125'));
    assert.ok(settingsDataText?.includes('"primary_accent": "#6366f1"'));
    assert.ok(settingsDataText?.includes('"currency": "EUR"'));
  });
});

describe("Precision Inline Editing & Balanced DOM Parser (src/lib/editor-dom.ts)", () => {
  const nestedDoc = `
<style>.keep { color: white; }</style>
<header data-section="header"><nav><a href="#hero">Home</a><a href="#pricing">Plans</a></nav></header>
<section data-section="hero" id="hero">
  <h1>Hero Title</h1>
  <section data-nested="true"><p>Nested detail</p></section>
  <p>Subtitle Copy</p>
  <a href="#features">Explore Now</a>
</section>
<section data-section="features" id="features"><h2>Capabilities</h2><p>Feature Text</p></section>
<script>window.__keepMe = true;</script>
  `.trim();

  it("preserves nested sections, styles, and scripts when parsing or moving sections", () => {
    const parsed = parseTopLevelSections(nestedDoc);
    assert.equal(parsed.sections.length, 3);
    assert.deepEqual(
      parsed.sections.map((s) => s.id),
      ["header", "hero", "features"]
    );
    assert.ok(parsed.prefix.includes("<style>.keep"));
    assert.ok(parsed.suffix.includes("window.__keepMe"));

    const moved = moveSectionInHtml(nestedDoc, "features", "up");
    const afterMove = parseTopLevelSections(moved);
    assert.deepEqual(
      afterMove.sections.map((s) => s.id),
      ["header", "features", "hero"]
    );
    assert.ok(moved.includes("window.__keepMe = true"));
  });

  it("updates exact element by nodeIndex without touching hero h1 or sibling sections", () => {
    const updatedP = updateSectionTextInHtml(
      nestedDoc,
      "hero",
      "Subtitle Copy",
      "Precision Inline Subheading",
      1,
      "p",
      1
    );
    assert.ok(updatedP.includes("<h1>Hero Title</h1>"));
    assert.ok(updatedP.includes("<p>Nested detail</p>"));
    assert.ok(updatedP.includes("<p>Precision Inline Subheading</p>"));
  });

  it("updates inline styles and anchor href on the targeted element cleanly", () => {
    const styled = updateElementStyleInHtml(
      nestedDoc,
      "hero",
      "a",
      0,
      { color: "#22d3ee", "font-size": "1.125rem" },
      "#pricing",
      1
    );
    assert.ok(styled.includes('href="#pricing"'));
    assert.ok(styled.includes("color: #22d3ee"));
    assert.ok(styled.includes("font-size: 1.125rem"));

    const reset = updateElementStyleInHtml(styled, "hero", "a", 0, { color: "", "font-size": "" }, undefined, 1);
    assert.ok(!reset.includes('style=""'));
  });

  it("inserts editorial image onto text-only sections and supports fx + reset", () => {
    const inserted = updateSectionImageInHtml(nestedDoc, "features", "/images/parallax-nyc.jpg", "tr:drop-shadow");
    assert.ok(inserted.includes("/images/parallax-nyc.jpg"));
    assert.ok(inserted.includes("drop-shadow-"));

    const reset = updateSectionImageInHtml(inserted, "features", undefined, "tr:reset");
    assert.ok(!reset.includes("drop-shadow-"));
  });

  it("extracts OBSIDIAN_INLINE_COMMIT payloads and embeds editMode state in bridge script", () => {
    const commit = extractInlineCommitFromMessage({
      type: "OBSIDIAN_INLINE_COMMIT",
      payload: {
        sectionId: "features",
        sectionIndex: 2,
        tagName: "p",
        nodeIndex: 0,
        oldText: "Feature Text",
        newText: "Updated Inline Text",
      },
    });
    assert.deepEqual(commit, {
      sectionId: "features",
      sectionIndex: 2,
      tagName: "p",
      nodeIndex: 0,
      oldText: "Feature Text",
      newText: "Updated Inline Text",
    });

    assert.ok(buildIframeBridgeScript(true).includes("var editMode = true;"));
    assert.ok(buildIframeBridgeScript(false).includes("var editMode = false;"));
  });
});

describe("End-to-End Website & Shopify Customization Engine (src/lib/customization.ts)", () => {
  it("provides colorful accent palettes, Shopify themes, and deterministic config merging", () => {
    assert.ok(WEBSITE_ACCENT_PALETTES.length >= 7);
    assert.ok(SHOPIFY_COLOR_THEMES.length >= 6);
    assert.equal(mapWebsiteAccentToShopifyTheme("cyber-cyan"), "cyan-hardware");
    assert.equal(mapWebsiteAccentToShopifyTheme("electric-violet"), "indigo-luxe");

    const merged = mergeWebsiteConfig({
      accentId: "cyber-cyan",
      sections: { pricingMatrix: false } as never,
    });
    assert.equal(merged.accentId, "cyber-cyan");
    assert.equal(merged.sections.pricingMatrix, false);
    assert.equal(merged.sections.faqAccordion, true);
  });

  it("renders CSS tokens, customization prompts, and modular end-to-end HTML sections", () => {
    const styleBlock = buildWebsiteThemeStyleBlock({ accentId: "crimson-rose", surfaceId: "midnight" });
    assert.ok(styleBlock.includes("--obs-accent: #f43f5e"));
    assert.ok(styleBlock.includes("--obs-bg: #060a14"));

    const enriched = buildWebsiteCustomizationPrompt('Build a site for "Vesper Audio"', { accentId: "cyber-cyan" });
    assert.ok(enriched.includes("Cyber Cyan"));
    assert.ok(enriched.includes("pricingMatrix"));

    const html = generateStandardCustomWebsiteHtml('Launch "Vesper Audio" studio', "Home Page", false, {
      accentId: "cyber-cyan",
      heroLayout: "split",
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
    });
    assert.ok(html.includes("Vesper Audio"));
    assert.ok(html.includes('data-section="pricing"'));
    assert.ok(html.includes('data-section="faq"'));
    assert.ok(html.includes('data-obsidian-seo="true"'));
    assert.ok(!html.includes("images.unsplash.com"));
  });

  it("reorders Shopify OS 2.0 sections safely without mutating bounds", () => {
    const start = ["hero", "trust-bar", "featured-products", "reviews", "newsletter"] as const;
    const moved = reorderShopifySection([...start], "featured-products", "up");
    assert.deepEqual(moved, ["hero", "featured-products", "trust-bar", "reviews", "newsletter"]);
    const clamped = reorderShopifySection([...start], "hero", "up");
    assert.deepEqual(clamped, [...start]);
  });
});
