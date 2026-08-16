# Scope: Milestone 2 — Obsidian Strict Luxury Monochrome Noir Aesthetic Overhaul

## Overview
Complete elimination of all legacy green/emerald/teal/lime styling across the entire Obsidian workspace, landing page, editor, modals, components, and generation routes, establishing a strict luxury monochrome noir design language:
- Pure Deep Black `#000000` / `bg-zinc-950` / `bg-black`
- Pure Crisp White `#ffffff` for primary CTAs, active indicators, highlights
- Subtle Zinc Greys (`zinc-900`, `zinc-800`, `zinc-700`, `zinc-400`, `zinc-500`) for structural borders and secondary surfaces
- Silver Frost / Metallic glass accents (`border-white/10`, `backdrop-blur-xl`, `shadow-2xl`)

## Target File Inventory & Modules
1. **Global Styles & Token Definition**:
   - `src/app/globals.css`: Replace emerald `--accent`, `--accent-shopify`, `--accent-hover`, `--accent-glow`, `--success` variables with monochrome white/zinc tokens.
   - `src/app/layout.tsx`: Selection highlights from emerald to white/zinc.
2. **Editor & Customizer**:
   - `src/app/editor/[projectId]/page.tsx`: Set default theme `COLOR_THEMES[0]` to Monochrome Noir with metallic swatches (Silver Frost, Titanium Slate, Obsidian Carbon). Update AI streaming pulses, assistant badges, export modals, code viewer tokens.
   - `src/components/editor/InlineCustomizer.tsx`: Complete overhaul from light mode to dark luxury zinc-950 glass (`bg-zinc-950/95 border-zinc-800 backdrop-blur-xl shadow-2xl`, pure white primary buttons).
3. **Navigation & Core Layout**:
   - `src/components/landing/LandingPageClient.tsx`: Logos, hero glows, prompt glows, quota bars, CTAs.
   - `src/components/layout/Header.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`: Green active dots, badges, quota indicators to white/zinc.
4. **App Pages & Routes**:
   - `src/app/projects/page.tsx`: Badges, create project buttons, hover highlights.
   - `src/app/billing/page.tsx`: Plan highlight rings, active subscription badges, action buttons.
   - `src/app/design-system/page.tsx`, `src/app/inspiration/page.tsx`, `src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx`: Submit buttons, focus rings, badges.
5. **UI Primitives**:
   - `src/components/ui/Alert.tsx`, `BuilderSwitcher.tsx`, `Button.tsx`, `VideoBackground.tsx`: Replace emerald/green variants with monochrome/zinc styles.
6. **API / AI Generation Prompts**:
   - `src/app/api/generate/route.ts`: Update system instructions and fallback templates to enforce strict luxury monochrome noir styling for generated websites.

## Verification Requirements
- `node tests/run-all-tests.js` passes 100%
- `npm run build` exits 0 with 0 TypeScript/ESLint errors
- Reviewer, Challenger, and Forensic Auditor gate approval with 0 integrity violations
