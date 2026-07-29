# StitchStore AI / Shopify Liquid Theme Generator Module Analysis

## Executive Summary
This document provides a comprehensive structural, component, and architectural analysis of the StitchStore AI / Shopify Liquid Theme Generator codebase located at `d:\app`. The application is built using Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and InsForge BaaS (PostgreSQL & Storage). It generates modern e-commerce storefronts using Gemini 2.5 Flash AI, customizes sections inline using ImageKit AI transformations, and compiles raw HTML/Tailwind templates directly into production-ready Shopify Liquid 2.0 theme ZIP packages (`layout/theme.liquid`, `templates/index.json`, `sections/*.liquid`, `snippets/*.liquid`, `assets/theme.css`).

---

## 1. Directory & Codebase Architecture Overview

The codebase follows the Next.js App Router layout structure under `src/`:

```
d:\app\src\
├── app\
│   ├── api\
│   │   ├── billing\
│   │   │   ├── checkout\route.ts
│   │   │   └── webhook\route.ts
│   │   └── generate\route.ts             # Gemini AI HTML Streaming & Fallback Generator
│   ├── billing\page.tsx                  # Tiered Subscription & Quota Management
│   ├── design-system\page.tsx            # White Edition Component & Token Catalog
│   ├── editor\[projectId]\page.tsx       # StitchStore AI Workspace & Split Canvas
│   ├── inspiration\page.tsx              # Pre-configured Store Templates & Prompts
│   ├── projects\page.tsx                 # InsForge Project Dashboard
│   ├── sign-in\page.tsx
│   ├── sign-up\page.tsx
│   ├── globals.css                       # Tailwind CSS v4 Theme Variables
│   ├── layout.tsx                        # Global Layout with Sidebar & Header
│   └── page.tsx                          # Home Page & 3D Interactive Prompt Card
├── components\
│   ├── editor\
│   │   └── InlineCustomizer.tsx          # Floating Canvas Section & ImageKit Editor
│   ├── providers\
│   │   └── AuthProvider.tsx              # Auth Context & Stripe Plan State
│   ├── ui\
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── Header.tsx                        # Top Bar with AI Engine Status & User Profile
│   └── Sidebar.tsx                       # Fixed Navigation Sidebar Shell
└── lib\
    ├── insforge.ts                       # InsForge BaaS SDK (PostgreSQL, Storage, User Profile)
    ├── schema.sql                        # PostgreSQL Database Migration Schema
    ├── shopify.ts                        # Shopify Liquid 2.0 Theme Compiler & JSZip Export
    └── stripe.ts                         # Stripe Subscription & Project Quota Enforcer
```

---

## 2. Inventory of Subsystem Modules & Components

### A. Core Engine & Shopify Export Utilities
1. **Shopify Liquid Theme Compiler** (`d:\app\src\lib\shopify.ts`)
   - **Key Export Function**: `compileShopifyLiquidTheme(projectId: string, htmlContent: string, cssContent: string)`
   - **Functionality**: Uses `JSZip` to assemble a standard Shopify theme structure:
     - `layout/theme.liquid`: Master layout with Liquid tags `{{ content_for_header }}`, `{{ content_for_layout }}`, `{% section 'header' %}`, `{% section 'footer' %}`, Tailwind CDN script tag, and stylesheet linking `{{ 'theme.css' | asset_url | stylesheet_tag }}`.
     - `templates/index.json`: JSON template ordering sections (`hero`, `featured_products`).
     - `sections/hero.liquid`: Liquid 2.0 section schema with configurable settings (`heading`, `subheading`, `button_text`, `button_link`).
     - `sections/featured-products.liquid`: Liquid 2.0 section looping over `collections.frontpage.products` and rendering snippets.
     - `snippets/product-card.liquid`: Reusable product card component rendering Shopify product image and price filters.
     - `assets/theme.css` & `assets/raw_source.html`: Compiled stylesheets and backup raw HTML reference.
   - **Output**: Returns `{ zipBlob: Blob, fileName: string }` formatted as `${projectId}-shopify-theme.zip`.

2. **Gemini AI Streaming API Handler** (`d:\app\src\app\api\generate\route.ts`)
   - **Route**: `POST /api/generate`
   - **Functionality**: Communicates with `@google/generative-ai` model (`gemini-2.5-flash`). Enforces system instructions for e-commerce section IDs (`data-section="hero"`, `data-section="products"`, etc.) and ImageKit placeholder image URLs.
   - **Fallback**: Includes `generateFallbackEcommerceHtml(prompt, pageName)` which streams structured high-converting e-commerce HTML when running in development mode without an API key.

3. **InsForge BaaS Data Client** (`d:\app\src\lib\insforge.ts` & `d:\app\src\lib\schema.sql`)
   - Manages user profiles, project records, multi-page HTML/CSS state (`project_pages`), and conversation messages (`project_messages`).

4. **Stripe Subscription & Quota Manager** (`d:\app\src\lib\stripe.ts`)
   - Enforces project limits (Free: max 2 projects, Pro: unlimited).

---

### B. User Interface Pages
1. **Home Landing & Prompt Studio** (`d:\app\src\app\page.tsx`)
   - Central entry point featuring a 3D tilt interactive card, prompt input textarea, reference design attachment handler, pre-configured suggestion cards (Cosmetics 💄, Streetwear 👕, 3D Tech 🖨️), and quota check modal. Submitting creates a project in `localStorage`/InsForge and routes to `/editor/[projectId]?initialPrompt=...`.

2. **Editor Workspace** (`d:\app\src\app\editor\[projectId]\page.tsx`)
   - The central IDE for StitchStore AI. Hides global layout chrome to maximize workspace screen area.
   - **Header Bar**: Project title, back button, multi-page tab bar (`Home Page`, `Product Page`, `Cart Page`), viewport width switches (`desktop` 100%, `tablet` 768px, `mobile` 375px), and export action buttons ("Export to Shopify", "Code ZIP", "PNG Mockup").
   - **Left Panel (35%)**: Gemini AI Chat Thread for prompt refinement and streaming text updates.
   - **Right Panel (65%)**: Interactive preview canvas iframe with clickable elements that activate `InlineCustomizer`.
   - **Export Progress Modal**: 3-step compilation progress bar showing real-time file creation (`layout/theme.liquid`, `sections/hero.liquid`, `snippets/product-card.liquid`).

3. **Projects Dashboard** (`d:\app\src\app\projects\page.tsx`)
   - Lists stored user projects with thumbnail previews, titles, creation dates, and edit buttons.

4. **Inspiration Gallery** (`d:\app\src\app\inspiration\page.tsx`)
   - Showcases curated store templates and allows 1-click loading of prompts into the home generator.

5. **Design System Viewer** (`d:\app\src\app\design-system\page.tsx`)
   - Catalog of White Edition design system tokens, typography scales, buttons, inputs, cards, and alerts.

---

### C. Reusable UI & Customizer Components
1. **Inline Customizer Widget** (`d:\app\src\components\editor\InlineCustomizer.tsx`)
   - Floating Card attached to the active section in the editor preview iframe.
   - **Text Tab**: Real-time content editing.
   - **Style Tab**: Reorders section blocks (Move Up, Move Down), duplicates, or deletes blocks.
   - **Image Kit Tab**: Offers instant AI image transformations (`tr:bg-remove`, HD upscaling, drop shadows, sunset glow) and AI image prompt replacement.
   - **AI Refine Tab**: Sends section-specific refinement prompts to Gemini AI.

2. **Navigation Sidebar Shell** (`d:\app\src\components\Sidebar.tsx`)
   - Fixed left sidebar with branding, navigation links (`Home`, `Projects`, `Inspiration`, `Billing & Plans`, `Design System`), quota usage progress bar, and user profile box. Automatically hidden when on `/editor/*` paths.

3. **Header Shell** (`d:\app\src\components\Header.tsx`)
   - Fixed top header showing engine status indicator (`Gemini 2.5 Flash • Shopify Liquid Ready`), design system link, and auth state controls.

---

## 3. Invocation, Rendering, and Routing Flow

```
[User Interface / Navigation Shell]
               │
   ┌───────────┴───────────┐
   ▼                       ▼
HomePage (`/`)     ProjectsPage (`/projects`)
   │                       │
   │ (Submit Prompt)       │ (Select Store)
   └───────────┬───────────┘
               ▼
   EditorPage (`/editor/[projectId]`)
               │
      ┌────────┴────────┐
      ▼                 ▼
Left Panel (35%)     Right Panel (65%)
Gemini AI Chat       Live Preview Canvas (Iframe)
(POST /api/generate)            │
                        (Click Element)
                                ▼
                     InlineCustomizer Widget
                     - Text Editing
                     - Section Reordering
                     - ImageKit AI Transformations
                                │
                        (Export Trigger)
                                ▼
                     compileShopifyLiquidTheme()
                     (d:\app\src\lib\shopify.ts)
                                │
                                ▼
                     Shopify Theme `.zip` Download
```

---

## 4. Obsidian Builder Workspace Integration Plan

To cleanly connect StitchStore AI with the Obsidian Builder workspace and navigation shell:

1. **Navigation Shell Connection**:
   - Add Obsidian Builder to `Sidebar.tsx` navigation menu (`navItems` array in `d:\app\src\components\Sidebar.tsx`):
     ```typescript
     { name: "Obsidian Builder", href: "/obsidian-builder", icon: Code2 }
     ```
2. **Workspace Tab & State Integration**:
   - Connect `EditorContent` page tabs (`src/app/editor/[projectId]/page.tsx`) with Obsidian Builder's file tree model.
   - Store generated Liquid sections (`sections/*.liquid`, `layout/theme.liquid`) into the `project_pages` database table in InsForge (`src/lib/schema.sql`).
   - Enable Obsidian Builder to directly open and edit generated Liquid theme source files side-by-side with the visual iframe preview canvas.
3. **Unified Context & Storage**:
   - Share user project state (`ProjectRecord` and `ProjectPage` interfaces in `src/lib/insforge.ts`) between Obsidian Builder and StitchStore AI.

---

## 5. Summary Table of Files & Roles

| File Path | Module Role | Key Functions / Exports |
| --- | --- | --- |
| `d:\app\src\lib\shopify.ts` | Theme Export Engine | `compileShopifyLiquidTheme(...)`, Liquid 2.0 template generator |
| `d:\app\src\app\api\generate\route.ts` | AI Generation Route | `POST(req)`, Gemini 2.5 Flash stream, `generateFallbackEcommerceHtml(...)` |
| `d:\app\src\app\page.tsx` | Main Landing & Prompt Studio | 3D Interactive prompt card, suggestion templates, quota modal |
| `d:\app\src\app\editor\[projectId]\page.tsx` | StitchStore AI Editor | Split workspace, live iframe canvas, page tabs, export modal |
| `d:\app\src\components\editor\InlineCustomizer.tsx` | Canvas Floating Editor | Text update, block reordering, ImageKit AI transformations |
| `d:\app\src\components\Sidebar.tsx` | Global Navigation | Brand logo, nav links, usage quota bar, auth state card |
| `d:\app\src\components\Header.tsx` | Global Top Bar | Engine status banner, design system link, auth sign-in/out |
| `d:\app\src\app\projects\page.tsx` | Project Dashboard | List user stores, render thumbnails, navigate to editor |
| `d:\app\src\app\inspiration\page.tsx` | Template Gallery | Curated store gallery, prompt auto-fill trigger |
| `d:\app\src\app\design-system\page.tsx` | Design System Catalog | Color tokens, typography, component variant showcase |
| `d:\app\src\lib\insforge.ts` | BaaS SDK Integration | `InsForgeClient`, `UserProfile`, `ProjectRecord`, storage helpers |
| `d:\app\src\lib\schema.sql` | PostgreSQL DB Schema | `profile`, `project`, `project_pages`, `subscription` tables |
