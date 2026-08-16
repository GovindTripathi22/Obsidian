# Milestone 2 Deep-Dive Analysis: Landing Page, Layouts, Navigation & App Sub-Pages
## Obsidian Strict Luxury Monochrome Noir Aesthetic Overhaul

**Explorer**: `explorer_m2_2`  
**Date**: 2026-08-16  
**Scope**: Landing Page (`LandingPageClient.tsx`), Layouts & Headers (`Header.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`, `RootLayoutContent.tsx`, `layout.tsx`, `page.tsx`), Sub-Pages (`/projects`, `/billing`, `/design-system`, `/inspiration`, `/sign-in`, `/sign-up`), and Supporting UI Primitives (`BuilderSwitcher.tsx`, `Button.tsx`, `Alert.tsx`, `VideoBackground.tsx`).

---

## 1. Executive Summary & Design System Axioms

The objective of Milestone 2 is to eradicate **all** legacy emerald/green/teal/lime/cyan/pink saturated accents across the Obsidian Website Builder and replace them with a **Strict Luxury Monochrome Noir** visual language.

### Luxury Monochrome Noir Axioms:
1. **Surfaces & Hierarchy**:
   - Canvas/Base: `#000000` (`bg-black`), `#09090b` (`bg-zinc-950`).
   - Cards/Containers: `bg-zinc-900/90` with `border-zinc-800`.
   - Elevated/Active/Hover Surfaces: `bg-zinc-800`, `border-zinc-700`.
2. **High-Contrast Pure White (#ffffff)**:
   - Primary Call-to-Actions (CTAs): `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg shadow-white/5 active:scale-[0.98]`.
   - Headings & Highlights: `text-white font-black font-heading`.
   - Active Indicators & Pulsing Dots: `bg-white animate-pulse shadow-glow-white`.
3. **Silver Frost & Titanium Metallic Accents**:
   - Secondary text / Muted highlights: `text-zinc-200`, `text-zinc-400`.
   - Metallic badges: `bg-zinc-800 text-zinc-200 border-zinc-700 font-mono`.
   - Glows & Ambience: `bg-gradient-to-r from-white/10 via-zinc-600/20 to-white/10 blur-xl`.
4. **Zero Saturated Clutter**:
   - No green/emerald badges, buttons, borders, focus rings, or gradients.
   - Focus rings: `focus:border-white/60 focus:ring-1 focus:ring-white/20` or `focus:border-zinc-500 focus:ring-zinc-500/20`.

---

## 2. File-by-File Audit & Exact Replacement Instructions

---

### 2.1 `src/components/LandingPageClient.tsx`
**Status**: Multiple emerald accents detected in prompt suggestions, engine status dot, quota indicators, focus rings, enhance button, Shopify Studio callout card, and feature grid icons.

#### Target Replacements:

1. **Line 21 (Prompt Suggestion Text)**:
   - *Current*:
     ```typescript
     prompt: "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern dark theme with emerald accents and Inter typography.",
     ```
   - *Monochrome Noir Replacement*:
     ```typescript
     prompt: "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern luxury monochrome noir theme with high-contrast typography, pure white accents (#ffffff), and deep zinc surfaces.",
     ```

2. **Line 29 (Coffee Shop Prompt Text)**:
   - *Current*: `(browns, creams, earthly greens)`
   - *Monochrome Noir Replacement*: `(rich dark obsidian, warm espresso, creams, and silver highlights)`

3. **Line 121 (Obsidian AI Engine Active Status Dot)**:
   - *Current*:
     ```tsx
     <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse shadow-glow-white" />
     ```

4. **Line 139 (Quota Meter Text Color)**:
   - *Current*:
     ```tsx
     className={mounted && stats.isLimitReached ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     className={mounted && stats.isLimitReached ? "text-red-400 font-bold" : "text-white font-bold"}
     ```

5. **Line 148 (Upgrade to Pro Link)**:
   - *Current*:
     ```tsx
     <Link href="/billing" className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 border-l border-zinc-700 pl-2">
       Upgrade to Pro →
     </Link>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Link href="/billing" className="text-zinc-200 hover:text-white font-bold ml-1 border-l border-zinc-700 pl-2 underline underline-offset-4 decoration-zinc-700">
       Upgrade to Pro →
     </Link>
     ```

6. **Line 157 (Prompt Glow Gradient Backdrop)**:
   - *Current*:
     ```tsx
     <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-zinc-700/40 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-zinc-600/20 to-white/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
     ```

7. **Line 165 (Textarea Focus State)**:
   - *Current*: `focus:border-emerald-500/50 focus:outline-none`
   - *Monochrome Noir Replacement*: `focus:border-white/60 focus:ring-1 focus:ring-white/20 focus:outline-none`

8. **Line 201 (AI Enhance Button)**:
   - *Current*:
     ```tsx
     className="h-10 w-10 rounded-xl bg-zinc-900 text-emerald-400 hover:bg-zinc-800 hover:text-emerald-300 transition-all border border-emerald-500/30 flex items-center justify-center disabled:opacity-40 cursor-pointer"
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     className="h-10 w-10 rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-700 hover:border-zinc-500 flex items-center justify-center disabled:opacity-40 cursor-pointer"
     ```

9. **Lines 237–260 (Shopify Studio Callout Card)**:
   - *Current*:
     ```tsx
     <Link
       href="/builder"
       className="group block p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-zinc-950/90 to-emerald-950/70 hover:from-emerald-950/90 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/60"
     >
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/40 group-hover:scale-105 transition-all shrink-0 shadow-lg shadow-emerald-950/50">
             <ShopifyIcon className="w-6 h-6 fill-emerald-400" />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-1">
               <p className="text-base font-bold text-white font-heading">Shopify AI Theme Studio</p>
               <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                 DEDICATED STUDIO
               </span>
             </div>
             <p className="text-xs text-zinc-400 leading-relaxed">
               Switch to the dedicated Shopify Liquid 2.0 Theme Generator with live cart drawer simulation, section schema inspector, and 1-click ZIP export.
             </p>
           </div>
         </div>
         <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 group-hover:translate-x-1 transition-all shrink-0">
           <ArrowRight className="h-4 w-4" />
         </div>
       </div>
     </Link>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Link
       href="/builder"
       className="group block p-6 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/90 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/80 ring-1 ring-white/5"
     >
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white group-hover:bg-zinc-700 group-hover:scale-105 transition-all shrink-0 shadow-lg shadow-black/50">
             <ShopifyIcon className="w-6 h-6 fill-white text-white" />
           </div>
           <div>
             <div className="flex items-center gap-2 mb-1">
               <p className="text-base font-bold text-white font-heading">Shopify AI Theme Studio</p>
               <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">
                 DEDICATED STUDIO
               </span>
             </div>
             <p className="text-xs text-zinc-400 leading-relaxed">
               Switch to the dedicated Shopify Liquid 2.0 Theme Generator with live cart drawer simulation, section schema inspector, and 1-click ZIP export.
             </p>
           </div>
         </div>
         <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-500 group-hover:translate-x-1 transition-all shrink-0">
           <ArrowRight className="h-4 w-4" />
         </div>
       </div>
     </Link>
     ```

10. **Line 286 (Feature Grid Icon Color)**:
    - *Current*: `<p className="text-2xl font-black text-emerald-400 mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</p>`
    - *Monochrome Noir Replacement*: `<p className="text-2xl font-black text-white mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</p>`

---

### 2.2 `src/components/Header.tsx`
**Status**: Clean monochrome structure. Polishing for luxury noir shine.

- Line 25: `<span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-glow-white" />`
- Line 36: `<Sparkles className="w-3.5 h-3.5 text-zinc-300" />`
- Confirmed zero green/emerald artifacts.

---

### 2.3 `src/components/Sidebar.tsx`
**Status**: Clean monochrome structure.
- Line 56: `Hexagon className="w-5 h-5 text-white fill-white"`
- Line 70: `bg-white animate-pulse`
- Line 75: `ShopifyIcon className="w-4 h-4 fill-white text-white"`
- Line 108: `bg-zinc-800 text-white border border-zinc-700 shadow-sm`
- Line 142: Quota meter `bg-white transition-all duration-300 rounded-full`
- Confirmed zero green/emerald artifacts.

---

### 2.4 `src/components/SiteHeader.tsx`
**Status**: Clean monochrome structure.
- Line 21: `Hexagon className="h-5 w-5 fill-white text-white"`
- Line 26: `bg-white animate-pulse`
- Navigation links: `text-zinc-400 hover:text-white`
- Confirmed zero green/emerald artifacts.

---

### 2.5 `src/app/projects/page.tsx`
**Status**: Verified clean monochrome styling.
- Line 83 & 91: Buttons use `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md`
- Line 124: Quota meter bar uses `bg-white` (or `bg-zinc-400` on limit reached)
- Line 165 & 186: Sub-navigation active tabs use `bg-white text-zinc-950 font-bold`
- Line 259: Badges use `bg-zinc-900/90 text-zinc-200 border-zinc-700`
- Line 297: `Button` uses `bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700`
- Confirmed zero green/emerald artifacts.

---

### 2.6 `src/app/billing/page.tsx`
**Status**: Verified clean monochrome styling.
- Line 92: `CreditCard className="w-4 h-4 text-white"`
- Line 106: `Crown` container `bg-zinc-800 border border-zinc-700 text-white`
- Line 113: Badge `bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold`
- Line 133: `Button` uses `bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs`
- Line 164: Pro card highlight uses `border-zinc-600 ring-1 ring-zinc-500/30 shadow-2xl`
- Line 197: Features checkmark `Check className="w-4 h-4 text-white shrink-0"`
- Line 211: Pro upgrade CTA uses `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg border-0`
- Confirmed zero green/emerald artifacts.

---

### 2.7 `src/app/design-system/page.tsx`
**Status**: Contains 7 emerald references and legacy color swatches.

#### Target Replacements:

1. **Lines 18–23 (Color Tokens Array)**:
   - *Current*:
     ```typescript
     { name: "Emerald Accent (Primary)", class: "bg-emerald-500", hex: "#10B981" },
     { name: "Emerald Light (Text)", class: "bg-emerald-400", hex: "#34D399" },
     { name: "Indigo Accent", class: "bg-indigo-600", hex: "#4F46E5" },
     { name: "Warning (Amber)", class: "bg-amber-500", hex: "#F59E0B" },
     { name: "Danger (Rose)", class: "bg-rose-600", hex: "#EF4444" },
     ```
   - *Monochrome Noir Replacement*:
     ```typescript
     { name: "Pure White (Primary CTA)", class: "bg-white border border-zinc-200 text-zinc-950", hex: "#FFFFFF" },
     { name: "Silver Frost (Accent Muted)", class: "bg-zinc-200 border border-zinc-300 text-zinc-900", hex: "#E4E4E7" },
     { name: "Titanium Slate (Borders)", class: "bg-zinc-700 border border-zinc-600", hex: "#3F3F46" },
     { name: "Obsidian Surface (Elevated)", class: "bg-zinc-800 border border-zinc-700", hex: "#27272A" },
     { name: "Danger (Rose Muted)", class: "bg-red-600", hex: "#DC2626" },
     ```

2. **Lines 30–31 (Header Sparkles & Badge)**:
   - *Current*:
     ```tsx
     <Sparkles className="w-5 h-5 text-emerald-400" />
     <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
       Dark Obsidian Design System
     </span>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Sparkles className="w-5 h-5 text-white" />
     <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest font-semibold">
       Strict Luxury Monochrome Noir Design System
     </span>
     ```

3. **Lines 95–97 (Button Showcase Variant)**:
   - *Current*:
     ```tsx
     <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0" leftIcon={<Sparkles className="w-4 h-4" />}>
       Emerald Accent
     </Button>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Button variant="outline" className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700" leftIcon={<Sparkles className="w-4 h-4" />}>
       Silver Metallic
     </Button>
     ```

4. **Lines 120, 129, 137 (Input Focus Rings)**:
   - *Current*: `focus:border-emerald-500 focus:ring-emerald-500/20`
   - *Monochrome Noir Replacement*: `focus:border-white focus:ring-white/20`

5. **Lines 156, 170 (Card Status Text)**:
   - *Current*: `<span className="text-xs font-mono text-emerald-400 font-semibold">Status: Active</span>`
   - *Monochrome Noir Replacement*: `<span className="text-xs font-mono text-zinc-300 font-semibold">Status: Active</span>`
   - *Current*: `<span className="text-xs font-mono text-emerald-400 font-semibold">Dark Glass</span>`
   - *Monochrome Noir Replacement*: `<span className="text-xs font-mono text-zinc-300 font-semibold">Dark Glass</span>`

6. **Lines 175–187 (Emerald Theme Accent Card)**:
   - *Current*:
     ```tsx
     <Card glass={false} className="border-emerald-800/60 bg-emerald-950/30">
       <CardHeader>
         <CardTitle className="font-heading text-emerald-200">Emerald Theme Accent</CardTitle>
         <CardDescription className="text-emerald-400/80">Tailored for luxury fashion & cosmetics presets.</CardDescription>
       </CardHeader>
       <CardContent className="text-emerald-300">
         Custom CSS variables enable theme switching across store layouts seamlessly.
       </CardContent>
       <CardFooter className="border-emerald-800/60">
         <span className="text-xs font-mono text-emerald-400 font-semibold">Emerald Theme</span>
         <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Select</Button>
       </CardFooter>
     </Card>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Card glass={false} className="border-zinc-700 bg-zinc-900/90 shadow-xl">
       <CardHeader>
         <CardTitle className="font-heading text-white">Monochrome Noir Theme</CardTitle>
         <CardDescription className="text-zinc-400">High-contrast pure white (#ffffff) & deep zinc-950 luxury aesthetic.</CardDescription>
       </CardHeader>
       <CardContent className="text-zinc-300">
         Engineered for ultra-premium digital architecture, high contrast readability, and zero saturation clutter.
       </CardContent>
       <CardFooter className="border-zinc-800">
         <span className="text-xs font-mono text-zinc-300 font-semibold">Noir Mode</span>
         <Button size="sm" className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold border-0">Select</Button>
       </CardFooter>
     </Card>
     ```

---

### 2.8 `src/app/inspiration/page.tsx`
**Status**: Contains 4 emerald references and legacy naming.

#### Target Replacements:
1. **Line 16 (Tags)**:
   - *Current*: `tags: ["Pink Accent", "Liquid 2.0", "ImageKit AI"]`
   - *Monochrome Noir Replacement*: `tags: ["Luxury Noir", "Liquid 2.0", "ImageKit AI"]`
2. **Line 41–42 (Header Badge & Sparkles)**:
   - *Current*:
     ```tsx
     <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
       <Sparkles className="w-4 h-4 text-emerald-400" />
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-semibold">
       <Sparkles className="w-4 h-4 text-white" />
     ```
3. **Line 47 (Description Copy)**:
   - *Current*: `StitchStore AI` -> *Monochrome Noir Replacement*: `Obsidian AI`
4. **Line 75 (Card Title Hover)**:
   - *Current*: `group-hover:text-emerald-400 transition-colors`
   - *Monochrome Noir Replacement*: `group-hover:text-white transition-colors`
5. **Line 86 (Use Template Button)**:
   - *Current*:
     ```tsx
     <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-md shadow-emerald-900/20" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
       Use Template
     </Button>
     ```
   - *Monochrome Noir Replacement*:
     ```tsx
     <Button size="sm" className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold border-0 shadow-md shadow-white/5" rightIcon={<ArrowRight className="w-3.5 h-3.5 text-zinc-950" />}>
       Use Template
     </Button>
     ```

---

### 2.9 `src/app/sign-in/page.tsx` & `src/app/sign-up/page.tsx`
**Status**: Clean monochrome styling.
- Both pages use `bg-zinc-950`, `bg-zinc-900` cards, `border-zinc-800`, `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` primary buttons, and `focus:border-zinc-500 focus:ring-zinc-500/20` inputs.
- Confirmed zero green/emerald artifacts.

---

### 2.10 Supporting Layout UI Primitives

#### `src/components/ui/BuilderSwitcher.tsx`
- **Line 63 (Active Pill Slider)**:
  - *Current*: `: "bg-gradient-to-r from-emerald-600 to-green-600 border border-emerald-400/40 text-white shadow-emerald-950/80"`
  - *Monochrome Noir Replacement*: `: "bg-zinc-800 border border-zinc-600 text-white shadow-black/80"`
- **Line 84 (Website Icon Fill)**:
  - *Current*: `active === "website" ? "fill-emerald-400 text-emerald-400 scale-105" : "text-zinc-500"`
  - *Monochrome Noir Replacement*: `active === "website" ? "fill-white text-white scale-105" : "text-zinc-500"`
- **Line 115 (Shopify Pill Badge)**:
  - *Current*: `bg-emerald-900/90 text-emerald-200 border border-emerald-400/40`
  - *Monochrome Noir Replacement*: `bg-zinc-800 text-zinc-200 border border-zinc-700`
- **Line 119 (Shopify Active Pulse Dot)**:
  - *Current*: `<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block ml-0.5" />`
  - *Monochrome Noir Replacement*: `<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse hidden sm:inline-block ml-0.5" />`

#### `src/components/ui/Button.tsx`
- **Lines 39–42 (Variant Styles)**:
  - *Current*:
    ```typescript
    pink: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-emerald-500",
    cyan: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-indigo-500",
    ```
  - *Monochrome Noir Replacement*:
    ```typescript
    pink: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-500",
    cyan: "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600",
    ```

#### `src/components/ui/Alert.tsx`
- **Lines 30–31 (`success` Variant)**:
  - *Current*:
    ```typescript
    success: {
      container: "bg-emerald-950/50 border-emerald-800/60 text-emerald-200",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    ```
  - *Monochrome Noir Replacement*:
    ```typescript
    success: {
      container: "bg-zinc-900/90 border-zinc-700 text-zinc-100",
      icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
    },
    ```

#### `src/components/ui/VideoBackground.tsx`
- **Line 69 (Glow Radial Layer)**:
  - *Current*:
    ```tsx
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-emerald-950/20 via-transparent to-transparent blur-3xl" />
    ```
  - *Monochrome Noir Replacement*:
    ```tsx
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-white/5 via-zinc-800/10 to-transparent blur-3xl" />
    ```

---

## 3. Summary of Files Requiring Modifications in Milestone 2

| # | File Path | Line(s) | Key Changes |
|---|-----------|---------|-------------|
| 1 | `src/components/LandingPageClient.tsx` | 21, 29, 121, 139, 148, 157, 165, 201, 237–260, 286 | Purge prompt strings, emerald status dot, quota text, enhance button, callout card, feature icon |
| 2 | `src/app/design-system/page.tsx` | 18–23, 30–31, 95–97, 120, 129, 137, 156, 170, 175–187 | Replace color swatches with monochrome noir tokens, purge emerald buttons/inputs/showcase card |
| 3 | `src/app/inspiration/page.tsx` | 16, 41–42, 47, 75, 86 | Purge header emerald badge/icon, card title hover, Use Template button, update legacy text |
| 4 | `src/components/ui/BuilderSwitcher.tsx` | 63, 84, 115, 119 | Replace Shopify active gradient with zinc-800/600, replace emerald icon fill and dots with white |
| 5 | `src/components/ui/Button.tsx` | 40, 42 | Replace `pink` and `cyan` variant styles with metallic noir and zinc styling |
| 6 | `src/components/ui/Alert.tsx` | 30–31 | Replace `success` variant styling and check icon from emerald to zinc-900/white |
| 7 | `src/components/ui/VideoBackground.tsx` | 69 | Replace radial glow from `from-emerald-950/20` to `from-white/5` |

---

## 4. Verification Plan

1. **Grep Validation**:
   - Run `grep_search` across all target files for `emerald`, `bg-green-`, `text-green-`, `border-green-` to guarantee 0 matches.
2. **Build Validation**:
   - Execute `npm run build` (Turbopack Next.js 16) to verify 0 TypeScript/ESLint/CSS compilation errors.
3. **Visual Aesthetics Inspection**:
   - Verify that all pages (Landing, Sidebar, SiteHeader, Header, Projects, Billing, Design System, Inspiration, Sign-in, Sign-up) render cleanly with pure black/zinc-950 surfaces, crisp white typography/buttons, and silver frost accents.
