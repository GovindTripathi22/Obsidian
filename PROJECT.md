# Project: Obsidian Website Builder & Shopify Theme Studio Overhaul

## Architecture
Obsidian Website Builder & Shopify Theme Studio is a Next.js 16 App Router full-stack web engineering studio combining an Obsidian dark luxury website builder and an Online Store 2.0 Shopify Theme Studio.
- **Frontend Core**: Next.js 16 (Turbopack), React 19, Tailwind CSS 4, Lucide React icons, JSZip.
- **Authentication & Quotas**: Clerk-compatible / unified authentication provider with shared sessions across `/`, `/builder`, `/shopify`, `/projects`, `/billing`, `/editor/[projectId]`, and a centralized `src/lib/projects.ts` storage engine strictly enforcing a 3-project free limit.
- **Design System**: Strict Luxury Monochrome Noir (#ffffff, #000000, bg-zinc-950, zinc-100...zinc-900, silver/frost glass) with 0 green/emerald accents across all components and AI generation templates.
- **Shopify Studio Engine**: Production-grade theme generator, responsive multi-viewport previewer (Desktop, Tablet 768px, Mobile 390px), 4 curated presets (Aura Botanicals, KINETIC Supply, Apex Cybernetics, Velvet & Vine), live two-way Liquid schema inspector, simulated checkout modal with discount engine, and valid Shopify OS 2.0 ZIP exporter.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Clerk Auth Integration | Add ClerkProvider and authentication hooks with fallback support, dark/monochrome styling, Google One-Tap, email sign-in | M1 | ORIGINAL_REQUEST §1, survey_explorer_1 |
| 2 | Shared Auth Session & User Profile | Shared session, user profile modal, and quota state across Obsidian and Shopify Studio | M1 | ORIGINAL_REQUEST §1, survey_explorer_1 |
| 3 | Unified Project Storage Store | Centralized `src/lib/projects.ts` with custom event bus for real-time quota sync and fixed project deletion | M1 | survey_explorer_1 |
| 4 | Strict 3-Project Free Limit | Harmonize quota limits across Billing, Sidebar, Projects, seed clean default mocks (<=1 project), and enforce limit | M1 | ORIGINAL_REQUEST §1, survey_explorer_1 |
| 5 | Global Monochrome Theme Tokens | Purge `--accent: #10b981`, emerald glows, and green tokens in `globals.css`; replace with pure white & zinc highlights | M2 | ORIGINAL_REQUEST §2, survey_explorer_2 |
| 6 | Obsidian Workspace Editor Monochrome | Set Monochrome Noir as default theme, metallic swatches (Silver Frost, Titanium Slate, Obsidian Carbon), white/zinc AI badges & code viewer | M2 | ORIGINAL_REQUEST §2, survey_explorer_2 |
| 7 | Floating Customizer & UI Primitives | Restyle `InlineCustomizer.tsx` to dark zinc-950 luxury glass; update `Button`, `Alert`, `BuilderSwitcher`, `VideoBackground` | M2 | ORIGINAL_REQUEST §2, survey_explorer_2 |
| 8 | Core Pages & Navigation Monochrome | Update `LandingPageClient`, `Header`, `Sidebar`, `SiteHeader`, `/projects`, `/billing`, `/design-system`, `/inspiration`, `/sign-in`, `/sign-up` to pure monochrome noir | M2 | ORIGINAL_REQUEST §2, survey_explorer_2 |
| 9 | AI Generation Monochrome Templates | Update Gemini AI system instructions and fallback HTML in `api/generate/route.ts` to strict monochrome styling | M2 | ORIGINAL_REQUEST §2, survey_explorer_2 |
| 10 | Unify Shopify Theme Studio & Viewports | Unify `/builder` and `/shopify` with `InteractiveShopifyStudio`, responsive viewports (Desktop, Tablet 768px, Mobile 390px), 4 studio tabs, 4 presets, currencies, promo engine | M3 | ORIGINAL_REQUEST §3, survey_explorer_3 |
| 11 | Complete Liquid 2.0 Theme Engine | Add missing `sections/features.liquid`, `sections/reviews.liquid`, `trust-badges.liquid`, `cart-drawer.liquid`, `snippets/product-card.liquid`, dynamic store data in ZIP | M3 | ORIGINAL_REQUEST §3, survey_explorer_3 |
| 12 | Interactive Liquid Section & Schema Inspector | Two-way live settings inspector in `/editor/[projectId]` syncing heading, subtitle, badges, buttons, colors directly with canvas | M3 | ORIGINAL_REQUEST §3, survey_explorer_3 |
| 13 | Simulated Shopify Checkout Journey | Replace raw browser `alert()` popups with structured checkout drawer: line items, discount codes, shipping, payment methods, order receipt | M3 | ORIGINAL_REQUEST §3, survey_explorer_3 |
| 14 | Clutter & Navigation Bug Fixes | Fix `Header.tsx:23` ternary bug, clean legacy "StitchStore AI" text, fix template link routing to `/builder` | M3 | ORIGINAL_REQUEST §3, survey_explorer_3 |
| 15 | E2E Verification & Zero Build Errors | Verify all routes compile cleanly with 0 TypeScript/ESLint/Next.js errors (`npm run build`), all unit & E2E tests pass | M4 | ORIGINAL_REQUEST §3, survey_explorer_3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Clerk Authentication & Quota System | Complete Clerk auth integration, unified project store (`src/lib/projects.ts`), shared session, and strict 3-project quota enforcement across all routes | None | DONE |
| 2 | Obsidian Strict Monochrome Aesthetic | Complete removal of all emerald/green accents across globals.css, editor canvas, sidebars, modals, floating customizer, and AI generation templates in favor of pure white and zinc noir | M1 | IN_PROGRESS |
| 3 | Shopify Studio Utility & Liquid 2.0 Overhaul | Unify Shopify Studio with interactive viewports, presets, cart & checkout drawer, two-way Liquid schema inspector, complete Shopify OS 2.0 ZIP package generation, bug fixes | M1 | PLANNED |
| 4 | E2E Testing Suite & Zero Build Error Validation | End-to-end validation across all engines, test suite execution, and clean production build with 0 errors (`npm run build`) | M1, M2, M3 | PLANNED |

## Interface Contracts

### Auth & Project Store (`src/lib/projects.ts` ↔ Components)
```typescript
export interface Project {
  id: string;
  title: string;
  type: "shopify" | "website";
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  data?: any;
}

export function getProjects(): Project[];
export function getProjectById(id: string): Project | undefined;
export function saveProject(project: Project): void;
export function deleteProject(id: string): void;
export function getProjectCount(): { totalCount: number; shopifyCount: number; websiteCount: number };
export function canCreateProject(isPro: boolean): boolean;
export const MAX_FREE_PROJECTS = 3;
export const PROJECTS_UPDATED_EVENT = "obsidian:projects-updated";
```

### Shopify Theme ZIP Generation (`src/lib/shopify.ts`)
```typescript
export interface ShopifyThemeExportOptions {
  storeName: string;
  tagline?: string;
  themePreset?: string;
  currency?: string;
  products?: Array<{ id: string; title: string; price: number; comparePrice?: number; image: string; tag: string }>;
  features?: Array<{ title: string; desc: string; icon: string }>;
  reviews?: Array<{ author: string; rating: number; comment: string; date: string }>;
  htmlContent?: string;
}

export async function compileShopifyLiquidTheme(options: ShopifyThemeExportOptions | string): Promise<Blob>;
```

## Code Layout
- `src/app/globals.css`: Global styles, CSS variables, monochrome luxury utility classes.
- `src/app/layout.tsx`: Root layout with AuthProvider / ClerkProvider.
- `src/middleware.ts`: Route protection and session header passing.
- `src/lib/projects.ts`: Unified project repository and storage synchronization.
- `src/lib/shopify.ts`: Complete Shopify OS 2.0 theme compiler and ZIP generator.
- `src/components/providers/AuthProvider.tsx`: Auth state, user profile, quota limits.
- `src/components/builder/InteractiveShopifyStudio.tsx`: Full interactive Shopify studio component.
- `src/components/editor/InlineCustomizer.tsx`: Floating canvas element editor in luxury monochrome.
- `src/app/builder/page.tsx` & `src/app/shopify/page.tsx`: Shopify studio routes.
- `src/app/editor/[projectId]/page.tsx`: Unified workspace editor for website and theme projects.
- `src/app/projects/page.tsx`: Project dashboard with unified project store integration.
- `src/app/billing/page.tsx`: Plan management and 3-project free limit display.
- `src/app/design-system/page.tsx`: Obsidian Luxury Monochrome design system showcase.
