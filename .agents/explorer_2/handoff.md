# Handoff Report: StitchStore AI / Shopify Liquid Theme Generator Module Exploration

**Agent**: Explorer 2 (StitchStore AI Module Explorer)  
**Target Path**: `d:\app\.agents\explorer_2\handoff.md`  
**Date**: 2026-07-29  

---

## 1. Observation

Direct observations from inspecting `d:\app`:

1. **Framework & Dependencies** (`d:\app\package.json`):
   - Next.js 16.2.12 (App Router), React 19.2.4, `@google/generative-ai` v0.24.1, `jszip` v3.10.1, `html-to-image` v1.11.13, `lucide-react` v1.27.0, `stripe` v22.3.2, Tailwind CSS v4.

2. **Core Shopify Theme Export Compiler** (`d:\app\src\lib\shopify.ts:8-136`):
   - Exports `compileShopifyLiquidTheme(projectId: string, htmlContent: string, cssContent: string)` which creates a `JSZip` structure containing:
     - `layout/theme.liquid` (`lines 16-34`): Includes Liquid tags `{{ content_for_header }}`, `{{ content_for_layout }}`, `{% section 'header' %}`, `{% section 'footer' %}`, Tailwind CDN, and `{{ 'theme.css' | asset_url | stylesheet_tag }}`.
     - `templates/index.json` (`lines 39-50`): JSON ordering `hero` and `featured_products` sections.
     - `sections/hero.liquid` (`lines 53-79`): Liquid 2.0 section schema with configurable settings.
     - `sections/featured-products.liquid` (`lines 81-103`): Featured product grid rendering snippets.
     - `snippets/product-card.liquid` (`lines 109-119`): Reusable Liquid product card snippet.
     - `assets/theme.css` (`lines 122-126`) & `assets/raw_source.html` (`line 129`).

3. **Generative AI Endpoint Handler** (`d:\app\src\app\api\generate\route.ts:9-191`):
   - Handles `POST` requests, initializes `GoogleGenerativeAI` with `GEMINI_API_KEY` and model `gemini-2.5-flash` (`lines 4-7`).
   - Generates e-commerce Tailwind HTML with section identifiers (`data-section="hero"`, `data-section="products"`).
   - Contains fallback function `generateFallbackEcommerceHtml` (`lines 71-191`) for offline or development environments.

4. **Interactive Editor Workspace** (`d:\app\src\app\editor\[projectId]\page.tsx:32-455`):
   - `EditorContent` component manages multi-page tabs (`lines 41-42`), viewport toggles (`desktop`, `tablet`, `mobile`) (`line 40`), Gemini chat thread (`lines 44-46`), iframe preview canvas (`lines 342-372`), and export handlers (`handleExportShopify`, `handleExportStaticCode`, `handleExportPNG`).
   - Triggering "Export to Shopify" executes `compileShopifyLiquidTheme` and downloads `${projectId}-shopify-theme.zip`.

5. **Inline Canvas Customizer Component** (`d:\app\src\components\editor\InlineCustomizer.tsx:39-257`):
   - Renders floating section editing card with tabs for Text editing, Section reordering/duplication/deletion, ImageKit AI transformations (`tr:bg-remove`, upscaling, drop shadows, URL prompts), and targeted Gemini AI section refinement.

6. **Navigation & Application Shell** (`d:\app\src\components\Sidebar.tsx:19-150` & `d:\app\src\components\Header.tsx:9-61`):
   - `Sidebar` provides fixed layout navigation to `/`, `/projects`, `/inspiration`, `/billing`, `/design-system`, with quota usage indicator. It conditionally hides itself when `pathname.startsWith('/editor')` (`line 24`).
   - `Header` provides top-level engine status banner (`Gemini 2.5 Flash • Shopify Liquid Ready`) and user profile auth controls.

7. **Database Schema & BaaS Integration** (`d:\app\src\lib\insforge.ts` & `d:\app\src\lib\schema.sql`):
   - Schema defines PostgreSQL tables: `profile`, `project`, `project_pages`, `project_messages`, and `subscription`.

---

## 2. Logic Chain

1. **Premise**: The project requires locating, analyzing, and documenting the StitchStore AI / Shopify Theme Generator module and outlining how to connect it cleanly to the navigation shell and Obsidian Builder workspace.
2. **Analysis of Execution Stream**:
   - When a user enters a prompt on `src/app/page.tsx`, a project record is created and routed to `src/app/editor/[projectId]/page.tsx`.
   - The editor requests e-commerce HTML layout streaming from `src/app/api/generate/route.ts` powered by Gemini 2.5 Flash.
   - The generated layout renders dynamically inside an iframe preview canvas. Interactive section clicks mount `src/components/editor/InlineCustomizer.tsx` for inline text edits, block reordering, and ImageKit AI image transformations.
   - Upon clicking "Export to Shopify", `compileShopifyLiquidTheme()` in `src/lib/shopify.ts` converts the HTML/CSS structure into standard Shopify Liquid 2.0 files (`layout/theme.liquid`, `templates/index.json`, `sections/*.liquid`, `snippets/*.liquid`, `assets/theme.css`) and downloads a `.zip` archive.
3. **Integration Point Deduction**:
   - The navigation shell is controlled by `src/components/Sidebar.tsx` and `src/app/layout.tsx`.
   - Adding Obsidian Builder to `Sidebar.tsx` navItems array will expose the builder alongside StitchStore AI.
   - Connecting `src/app/editor/[projectId]/page.tsx` page state with InsForge PostgreSQL database table `project_pages` will allow Obsidian Builder to read and edit raw Liquid 2.0 source files directly while preserving StitchStore AI visual editing.

---

## 3. Caveats

- **Gemini API Key**: In development environment, if `GEMINI_API_KEY` is not supplied, `src/app/api/generate/route.ts` seamlessly uses the fallback generator `generateFallbackEcommerceHtml`.
- **Read-Only Inspection**: In accordance with Explorer constraints, no modifications to source code files outside `d:\app\.agents\explorer_2\` were made during this analysis.

---

## 4. Conclusion

The StitchStore AI / Shopify Liquid Theme Generator module is fully implemented, modular, and cleanly structured across:
- Export compiler: `d:\app\src\lib\shopify.ts`
- AI streaming API: `d:\app\src\app\api\generate\route.ts`
- Prompt studio & Landing: `d:\app\src\app\page.tsx`
- Interactive Editor & Split Workspace: `d:\app\src\app\editor\[projectId]\page.tsx`
- Canvas Customizer: `d:\app\src\components\editor\InlineCustomizer.tsx`
- Navigation Shell: `d:\app\src\components\Sidebar.tsx` and `d:\app\src\components\Header.tsx`
- BaaS & Schema: `d:\app\src\lib\insforge.ts` and `d:\app\src\lib\schema.sql`

Connecting StitchStore AI to the Obsidian Builder workspace requires:
1. Adding the Obsidian Builder route to `Sidebar.tsx`.
2. Persisting generated Liquid section files to InsForge `project_pages` database table for joint access by both the visual customizer and code editor.

---

## 5. Verification Method

To independently verify these findings:

1. **Inspect Core Files**:
   ```bash
   # View Shopify Liquid theme compilation logic
   view_file d:\app\src\lib\shopify.ts
   
   # View Gemini streaming API route
   view_file d:\app\src\app\api\generate\route.ts
   
   # View Editor workspace layout
   view_file d:\app\src\app\editor\[projectId]\page.tsx
   ```

2. **Verify Navigation & Layout**:
   ```bash
   # View Sidebar nav items and layout conditional check
   view_file d:\app\src\components\Sidebar.tsx
   ```

3. **Verify Build**:
   Run `npm run build` at project root `d:\app` to confirm Next.js build compilation.
