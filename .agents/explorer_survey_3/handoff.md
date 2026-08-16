# Handoff Report: Shopify Theme Studio Audit & Enhancement Blueprint

**Agent**: Survey Explorer 3  
**Working Directory**: `d:\app\.agents\explorer_survey_3`  
**Target Project**: Shopify Theme Studio (`/builder`, `/shopify`, components, and Liquid 2.0 utilities)  
**Date**: 2026-08-16  

---

## 1. Observation

Direct observations from source code inspection and build diagnostics:

### 1.1 Disconnected Component & Preset Duplication
- **File**: `d:\app\src\components\builder\InteractiveShopifyStudio.tsx` (Lines 1–1069)
  - Contains full interactive studio with responsive viewport switcher (Desktop `w-full`, Tablet `w-[768px]`, Mobile `w-[390px]`), 4 tabbed modes (`live`, `sections`, `code`, `ai`), currency switcher (`USD`, `EUR`, `GBP`), promo discount applicator (`OBSIDIAN25` / `SHOPIFY25`), customer reviews, and Liquid code tree.
  - **Grep search for `InteractiveShopifyStudio` across `src/`**: Returned only `InteractiveShopifyStudio.tsx` itself. It is not imported or mounted anywhere in the application.
- **File**: `d:\app\src\app\builder\page.tsx` (Lines 37–98, Lines 390–466)
  - Implements a separate, inline preset array (`PRESET_STORES` with 4 stores) and a simplified live simulation card without viewport toggle, code tree, section manager, currency selector, promo codes, or reviews.

### 1.2 Broken Liquid 2.0 Theme Index Schema
- **File**: `d:\app\src\lib\shopify.ts` (Lines 110–134 vs Lines 137–335)
  - `templates/index.json` declares:
    ```json
    "sections": {
      "announcement_bar": { "type": "announcement-bar" },
      "header": { "type": "header" },
      "hero": { "type": "hero" },
      "featured_products": { "type": "featured-products" },
      "features": { "type": "features" },
      "reviews": { "type": "reviews" },
      "footer": { "type": "footer" }
    },
    "order": [
      "announcement_bar",
      "header",
      "hero",
      "featured_products",
      "features",
      "reviews",
      "footer"
    ]
    ```
  - However, `compileShopifyLiquidTheme` only writes files for `announcement-bar.liquid`, `header.liquid`, `hero.liquid`, `featured-products.liquid`, and `footer.liquid`.
  - `sections/features.liquid` and `sections/reviews.liquid` are **omitted from the ZIP**, which triggers fatal Shopify validation errors when uploading the theme to a Shopify store.
  - In addition, `compileShopifyLiquidTheme` takes `htmlContent: string` as an argument (Line 10), but never uses it anywhere in the function body, emitting static hardcoded template strings instead.

### 1.3 Static Read-Only Schema Inspector in Editor
- **File**: `d:\app\src\app\editor\[projectId]\page.tsx` (Lines 888–904)
  - When `activeView === "schema" && isShopify`, the editor renders a static `<pre>` tag formatting a hardcoded object with two properties (`heading` and `bg_color`). There is no form binding, no field inputs, no ability to add blocks, and no communication with the live preview iframe.
- **File**: `d:\app\src\components\editor\InlineCustomizer.tsx` (Lines 83–136, Lines 154–174)
  - Styled with light-mode classes: `bg-white`, `border-slate-300`, `text-slate-900`, `variant="pink"`.
  - Handlers for `onMoveUp`, `onMoveDown`, `onDuplicate`, `onDelete` (lines 920–923 in `editor/[projectId]/page.tsx`) are dummy stubs that simply call `setSelectedElement(null)`.

### 1.4 Code Clutter, Inconsistent Branding & Navigation Bugs
- **File**: `d:\app\src\components\Header.tsx` (Line 23)
  - `<BuilderSwitcher active={isShopifyStudio ? "shopify" : "shopify"} size="sm" />` — The ternary expression hardcodes `"shopify"` in both branches.
- **File**: `d:\app\src\app\inspiration/page.tsx` (Line 47, Line 85)
  - Line 47: Text mentions `"built with StitchStore AI, Gemini 2.5 Flash, and Shopify Liquid 2.0"` (legacy branding).
  - Line 85: Template button routes to `<Link href={`/?prompt=${encodeURIComponent(item.prompt)}`}>` (Website Builder) rather than `/builder?prompt=...` (Shopify Theme Studio).
- **Files**: `src/app/builder/page.tsx` (Line 513) and `src/components/builder/InteractiveShopifyStudio.tsx` (Line 924)
  - Proceed to checkout invokes `alert(...)` instead of rendering a structured simulated checkout modal.

### 1.5 Build Diagnostics
- **Command**: `npm run build`
- **Result**: Exit code `0`, Turbopack compiled successfully, TypeScript finished with 0 errors across all 14 routes.

---

## 2. Logic Chain

1. **Premise 1**: A tool designed to build production Shopify themes must produce valid Shopify Online Store 2.0 ZIP packages that Shopify's theme validator will accept without missing section errors.
   - *Supported by Observation 1.2*: `index.json` explicitly references `"features"` and `"reviews"` section types, but `shopify.ts` does not create `sections/features.liquid` or `sections/reviews.liquid`. Therefore, the current ZIP output is invalid on Shopify.
2. **Premise 2**: High utility in a theme studio requires multi-viewport previewing (desktop, tablet, mobile) and section customization so merchants can inspect their responsive layouts before exporting.
   - *Supported by Observation 1.1*: A complete, responsive viewport switcher and Liquid section manager was built in `InteractiveShopifyStudio.tsx` but was orphaned, leaving `/builder` and `/shopify` with a static preview and no viewport controls.
3. **Premise 3**: Interactive theme editing requires live schema manipulation and two-way binding with the visual canvas rather than static JSON previews.
   - *Supported by Observation 1.3*: The current `schema` view in the editor is a static read-only text block, and `InlineCustomizer` has dummy callback stubs and light-mode/pink styling that conflicts with the Obsidian Dark Luxury aesthetic.
4. **Premise 4**: An e-commerce simulation should faithfully replicate the customer checkout journey (discounts, taxes, address, payment methods, order confirmation) rather than firing raw browser `alert()` dialogs.
   - *Supported by Observation 1.4*: Both `/builder` and `InteractiveShopifyStudio.tsx` execute `alert()` on checkout button click.
5. **Conclusion**: Unifying `/builder` with `InteractiveShopifyStudio.tsx`, correcting `shopify.ts` to include all referenced sections with dynamic data, replacing the static schema viewer with an interactive Section Inspector, implementing a simulated checkout modal, and cleaning up legacy branding/ternary bugs will transform Shopify Studio into a high-utility, production-grade tool.

---

## 3. Caveats

1. **No External Shopify API Access**: The studio runs locally without direct live Shopify Admin API credentials; theme verification is performed via Shopify OS 2.0 schema and file structure specification compliance.
2. **AI Generation Fallback**: When `process.env.GEMINI_API_KEY` is unavailable or throttled, `src/app/api/generate/route.ts` streams a fallback Obsidian Dark e-commerce template. Both streaming and fallback paths must maintain valid section markup (`data-section`).
3. **Dual-Engine Coexistence**: Changes in Shopify Studio must preserve shared quota tracking in `AuthProvider.tsx` (3 projects max across Website Builder + Shopify Builder) without breaking the Website Builder (`/`).

---

## 4. Conclusion

The Shopify Theme Studio possesses strong foundational architecture but is hindered by orphaned code (`InteractiveShopifyStudio.tsx`), invalid theme ZIP schemas (missing `features.liquid` and `reviews.liquid`), a non-interactive schema inspector, light-mode customizer popups, and raw `alert()` checkouts.

### Actionable Implementation Blueprint:
1. **Unify `/builder` and `/shopify`**: Replace the inline preview in `src/app/builder/page.tsx` with the enhanced `InteractiveShopifyStudio` component, combining the 4 curated store presets (*Aura Botanicals Skincare*, *KINETIC Supply Streetwear*, *Apex Cybernetics Audio*, *Velvet & Vine Roastery*) with viewport toggling (Desktop 100%, Tablet 768px, Mobile 390px), 4 studio tabs, and multi-currency/promo code capabilities.
2. **Fix Liquid 2.0 Theme Engine (`src/lib/shopify.ts`)**:
   - Add `sections/features.liquid`, `sections/reviews.liquid`, `sections/trust-badges.liquid`, `sections/cart-drawer.liquid`.
   - Populate `compileShopifyLiquidTheme` with dynamic preset and store data.
   - Validate full compatibility with Shopify OS 2.0 file hierarchy.
3. **Build Interactive Section & Schema Inspector (`src/app/editor/[projectId]`)**:
   - Replace the static JSON string in `activeView === "schema"` with a live settings editor (Hero text, Subtitle, Badges, Button labels, Accent colors, Section toggles).
   - Bind settings directly to the preview iframe canvas.
4. **Implement Simulated Shopify Checkout Modal**:
   - Replace `alert()` with a slide-out modal featuring line item breakdown, promo code deductions, free shipping check, payment buttons (Shopify Pay, Apple Pay, Google Pay), and order confirmation receipt generation.
5. **Clean Clutter & Fix Bugs**:
   - Restyle `InlineCustomizer.tsx` to obsidian luxury dark styling and wire real section mutations.
   - Fix ternary bug in `Header.tsx` line 23.
   - Fix branding and link targets in `src/app/inspiration/page.tsx`.

---

## 5. Verification Method

To independently verify the findings and any future implementation:

1. **Build & Typecheck Command**:
   ```bash
   npm run build
   ```
   *Expected output*: Next.js build passes with exit code `0`, Turbopack compilation succeeds, 0 TypeScript/ESLint errors across all routes.

2. **Inspect Exported Theme ZIP**:
   - Download theme ZIP from `/builder` or `/editor/[projectId]`.
   - Extract and inspect file structure:
     - `layout/theme.liquid`
     - `templates/index.json` (Verify every section in `order` exists in `sections/`)
     - `sections/announcement-bar.liquid`
     - `sections/header.liquid`
     - `sections/hero.liquid`
     - `sections/featured-products.liquid`
     - `sections/features.liquid`
     - `sections/reviews.liquid`
     - `sections/trust-badges.liquid`
     - `sections/footer.liquid`
     - `snippets/product-card.liquid`
     - `config/settings_schema.json` & `config/settings_data.json`
     - `locales/en.default.json`
     - `assets/theme.css`

3. **Verify Interactive Features on `/builder` & `/shopify`**:
   - Test viewport switching: Click Desktop, Tablet (768px), Mobile (390px).
   - Test studio tabs: Canvas, Liquid 2.0 Sections, Liquid Code Tree (copy code), AI Prompt.
   - Test cart drawer: Add to cart, quantity change, currency switcher (USD/EUR/GBP), promo code entry (`OBSIDIAN25` -> 25% off), simulated checkout modal.
