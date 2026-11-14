import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PARALLAX_THEMES,
  detectParallaxIntent,
  generateParallaxWebsiteHtml,
  getParallaxThemeById,
} from "../parallax";
import {
  parseTopLevelSections,
  moveSectionInHtml,
  duplicateSectionInHtml,
  deleteSectionInHtml,
  updateSectionTextInHtml,
  updateSectionImageInHtml,
  extractSelectedElementFromMessage,
} from "../editor-dom";
import {
  extractBrandFromPrompt,
  convertWebsitePromptToShopifyPrompt,
  convertShopifyToWebsitePrompt,
  suggestShopifyPresetFromPrompt,
} from "../builder-bridge";
import { compileShopifyLiquidTheme } from "../shopify";

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
});
