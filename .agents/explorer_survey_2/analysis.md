# Obsidian Website Builder & Workspace Editor: Comprehensive Styling, Theme, & Color Audit

## 1. Executive Summary & Paradigm Transition

This audit provides a complete, exhaustive inventory of all colors, accents, styling tokens, and theme mechanisms across the **Obsidian Website Builder**, **Workspace Editor**, and **Shopify Theme Studio**.

### Core Objective
Systematically eliminate all **green, emerald, teal, lime, cyan, pink, and saturated accent styling** across the codebase and transition Obsidian into a **strict luxury monochrome noir aesthetic**.

### Monochrome Noir Design Philosophy
- **Base Surfaces**: Deep Obsidian (`#000000` / `bg-black`, `#09090b` / `bg-zinc-950`, `#18181b` / `bg-zinc-900`).
- **Surface Elevation**: Layered zinc elevation scale (`zinc-900` cards, `zinc-800` active/hover states, `zinc-700` subtle borders).
- **High-Contrast Accents**: Pure White (`#ffffff` / `text-white`, `bg-white` high-impact CTA buttons with `text-zinc-950 font-black`).
- **Metallic & Frost Accents**: Silver, titanium, and frosty glass borders (`rgba(255, 255, 255, 0.12)` border, `rgba(255, 255, 255, 0.05)` subtle glow).
- **Typography Scale**: High-contrast white headlines (`text-white font-black font-heading`), silver subheadings (`text-zinc-200`), and crisp muted zinc descriptions (`text-zinc-400` / `text-zinc-500 font-mono`).

---

## 2. Global CSS Tokens & Utilities Audit (`src/app/globals.css`)

### Current Green Tokens in `:root`
```css
/* CURRENT (globals.css:19-28) */
--accent: #10b981;
--accent-shopify: #008060;
--accent-hover: #059669;
--accent-glow: rgba(16, 185, 129, 0.2);
--success: #10b981;
```

### Proposed Monochrome Replacement Tokens
```css
/* MONOCHROME NOIR TOKENS */
--accent: #ffffff;
--accent-hover: #e4e4e7;
--accent-muted: #a1a1aa;
--accent-glow: rgba(255, 255, 255, 0.08);
--accent-border: rgba(255, 255, 255, 0.14);
--success: #f4f4f5; /* High-contrast white/silver badge for success indicators */
```

### Utility Classes Audit in `globals.css`
| Selector / Class | Current Value / Problem | Monochrome Noir Replacement |
| :--- | :--- | :--- |
| `.glass-shopify` (lines 119-125) | `rgba(6, 44, 30, 0.4)`, `rgba(16, 185, 129, 0.25)` | `background: linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(9, 9, 11, 0.95) 100%); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15);` |
| `.shadow-glow-emerald` (lines 135-137) | `rgba(16, 185, 129, 0.2)` | `.shadow-glow-white`: `box-shadow: 0 0 25px rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 255, 255, 0.04);` |
| `.shadow-glow-shopify` (lines 139-141) | `rgba(0, 128, 96, 0.3)` | `.shadow-glow-silver`: `box-shadow: 0 0 30px rgba(228, 228, 231, 0.15), 0 0 60px rgba(255, 255, 255, 0.05);` |

---

## 3. Comprehensive File-by-File & Component Audit

### 3.1 Root Layout (`src/app/layout.tsx`)
- **Line 19**: `selection:bg-emerald-900/40 selection:text-white`
  - **Replacement**: `selection:bg-zinc-800 selection:text-white` or `selection:bg-white selection:text-black`

---

### 3.2 Obsidian Landing Page (`src/components/LandingPageClient.tsx`)
| Line(s) | Current Element / Class | Issue | Monochrome Replacement |
| :--- | :--- | :--- | :--- |
| 19 | Suggestion prompt | Mentions "emerald accents" | "Use a luxury monochrome noir theme with high-contrast typography and pure white highlights." |
| 121 | Engine status dot | `bg-emerald-400 mr-2 animate-pulse` | `bg-white mr-2 animate-pulse shadow-glow-white` |
| 139 | Quota meter value | `text-emerald-400 font-bold` | `text-white font-bold` |
| 148 | Upgrade to Pro link | `text-emerald-400 hover:text-emerald-300 font-bold` | `text-zinc-200 hover:text-white font-bold underline underline-offset-4 decoration-zinc-700` |
| 157 | Prompt ambient glow | `bg-gradient-to-r from-emerald-600/30 to-zinc-700/40` | `bg-gradient-to-r from-white/10 via-zinc-600/20 to-white/10` |
| 165 | Prompt textarea focus | `focus:border-emerald-500/50` | `focus:border-white/60 focus:ring-1 focus:ring-white/20` |
| 201 | Enhance button | `text-emerald-400 hover:text-emerald-300 border-emerald-500/30` | `text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-500` |
| 237-243 | Shopify Studio CTA Card | `border-emerald-500/30 bg-gradient-to-r from-emerald-950/70...` | `border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/90 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/80 ring-1 ring-white/5` |
| 242 | ShopifyIcon | `fill-emerald-400` | `fill-white text-white` |
| 247 | Dedicated Studio badge | `bg-emerald-500/20 text-emerald-400 border-emerald-500/30` | `bg-zinc-800 text-zinc-200 border-zinc-700` |
| 256 | Arrow container | `group-hover:text-emerald-400 group-hover:border-emerald-500/40` | `group-hover:text-white group-hover:border-zinc-500` |
| 286 | Feature grid icons | `text-emerald-400` | `text-white` |
| 317 | Quota modal upgrade button | `bg-emerald-600 hover:bg-emerald-500` | `bg-white hover:bg-zinc-200 text-zinc-950 font-black` |

---

### 3.3 Obsidian Workspace Editor (`src/app/editor/[projectId]/page.tsx`)
This is the primary interactive workspace for website building and code inspection.

| Line(s) | Current Element / Feature | Issue | Monochrome Replacement |
| :--- | :--- | :--- | :--- |
| 58 | `COLOR_THEMES[0]` | Default is `Obsidian Emerald` (`#10b981`) | Change default to `Monochrome Noir` (`#ffffff`, bg `#000000`, accent `from-white via-zinc-200 to-zinc-400`). Replace other swatches with metallic scales: `Silver Frost`, `Titanium Slate`, `Obsidian Carbon`, `Liquid Platinum`. |
| 265 | Scaffold header dot | `bg-emerald-400` | `bg-white` |
| 271 | Scaffold page badge | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` | `bg-zinc-900 text-zinc-200 border-zinc-700` |
| 280 | Scaffold prompt button | `bg-emerald-600 hover:bg-emerald-500` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` |
| 438 | Header icon | `fill-emerald-400` | `fill-white text-white` |
| 473 | Add page button hover | `hover:text-emerald-400` | `hover:text-white hover:bg-zinc-800` |
| 511 | Export Shopify button | `bg-emerald-600 hover:bg-emerald-500` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` |
| 545 | Left panel icon box | `bg-emerald-600/20 border-emerald-500/30 text-emerald-400` | `bg-zinc-800 border-zinc-700 text-white` |
| 554-555 | Gemini status badge & dot | `bg-emerald-500/10 text-emerald-400`, `bg-emerald-400 animate-pulse` | `bg-zinc-900 text-zinc-300 border-zinc-700`, `bg-white animate-pulse shadow-glow-white` |
| 578-613 | Sub-tab icons | Emerald, amber, cyan, rose colors | Clean monochrome icons (`text-zinc-300`, active `text-white`) |
| 628 | Assistant avatar | `bg-emerald-600/20 border-emerald-500/30 text-emerald-400` | `bg-zinc-800 border-zinc-700 text-white` |
| 648 | Copy check icon | `text-emerald-400` | `text-white` |
| 658-661 | Streaming status card | `border-emerald-500/30 text-emerald-400` | `border-zinc-700 bg-zinc-900 text-zinc-200 font-mono`, spinner `text-white` |
| 680-688 | Quick fixes pill actions | `hover:border-emerald-500/40 group-hover:text-emerald-400` | `hover:border-zinc-500 group-hover:text-white` |
| 705-713 | Ready-made UI blocks | `hover:border-cyan-500/40 group-hover:text-cyan-400` | `hover:border-zinc-500 group-hover:text-white` |
| 735, 750 | Theme swatch active check | `border-emerald-500/60 text-emerald-400` | `border-white ring-1 ring-white/30 text-white` |
| 765 | Suggestion chips bar | `hover:border-emerald-500/40` | `hover:border-zinc-500 hover:text-white` |
| 787 | Input instruction textarea | `focus:border-emerald-500/50` | `focus:border-zinc-400 focus:ring-1 focus:ring-white/20` |
| 796 | Enhance prompt button | `text-emerald-400 hover:text-emerald-300` | `text-zinc-400 hover:text-white` |
| 804 | Submit instruction button | `bg-emerald-600 hover:bg-emerald-500 text-white` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` |
| 863-864 | Canvas address bar streaming | `bg-emerald-400 animate-pulse text-emerald-400` | `bg-white animate-pulse text-zinc-200 font-mono` |
| 884 | Code inspector text | `text-emerald-400 font-mono` | `text-zinc-200 font-mono` with crisp syntax highlighting |
| 949 | Add Page modal icon | `FileText text-emerald-400` | `text-white` |
| 970, 973 | Page template buttons | `hover:border-emerald-500/50 group-hover:text-emerald-400` | `hover:border-zinc-500 group-hover:text-white` |
| 1000 | Add page submit button | `bg-emerald-600 hover:bg-emerald-500` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` |
| 1015 | Export modal icon | `bg-emerald-500/10 border-emerald-500/20 text-emerald-400` | `bg-zinc-800 border-zinc-700 text-white` |
| 1031-1035 | Export progress bar | `text-emerald-400`, `from-emerald-600 via-green-500 to-emerald-400` | `text-white`, `from-zinc-600 via-zinc-300 to-white` |
| 1042-1044 | Export step checks | `text-emerald-400` | `text-white` |
| 1050 | Close & Open ZIP button | `bg-emerald-600 hover:bg-emerald-500` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold` |
| 1070 | Loading fallback spinner | `text-emerald-400` | `text-white` |

---

### 3.4 Floating Inline Customizer (`src/components/editor/InlineCustomizer.tsx`)
**Current Architecture Problem**: The `InlineCustomizer` component currently uses a light-mode slate theme (`bg-white border-slate-300`, `text-slate-900`) with saturated pink accents (`text-pink-600`, `variant="pink"` buttons) that violently clashes with the dark luxury aesthetic.

**Required Overhaul Plan**:
1. **Container**: `fixed bottom-6 right-6 z-50 w-96 bg-zinc-950/95 border border-zinc-800 backdrop-blur-2xl text-zinc-100 shadow-2xl rounded-2xl ring-1 ring-white/10`
2. **Header**: `border-zinc-800/80`, section code: `text-white font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700`
3. **Tab Switcher**: `bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold`, active tab `bg-zinc-800 text-white font-bold shadow-xs`, inactive `text-zinc-400 hover:text-white`
4. **Form Controls**: Textarea and inputs `bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-white/20`
5. **Button Variants**: Replace all `variant="pink"` with `variant="primary"` (`bg-white text-zinc-950 font-bold hover:bg-zinc-200`) or `variant="outline"` (`border-zinc-700 text-zinc-200 hover:bg-zinc-800`)
6. **Icons**: Replace pink/amber icons with crisp silver/white icons (`text-zinc-300`, `text-white`).

---

### 3.5 Navigation & Header Components (`Header.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`)
- **`Header.tsx`**:
  - Line 26: Pulsing status dot `bg-emerald-400` -> `bg-white animate-pulse shadow-glow-white`
  - Line 37: Design Tokens icon `text-emerald-400` -> `text-white`
- **`Sidebar.tsx`**:
  - Line 54: Brand logo box `bg-emerald-600 shadow-emerald-600/30` -> `bg-white text-black shadow-lg shadow-white/10`
  - Line 69: Active engine dot `bg-emerald-400` -> `bg-white animate-pulse`
  - Line 74: ShopifyIcon `fill-emerald-400` -> `fill-white text-white`
  - Line 85: Mode switch link `text-emerald-400 hover:text-emerald-300` -> `text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-700`
  - Line 107: Active nav item `bg-emerald-700 shadow-emerald-950/40` -> `bg-zinc-800 text-white border border-zinc-700/80`
  - Line 116, 121: Active icon & dot `text-emerald-400`, `bg-emerald-400` -> `text-white`, `bg-white`
  - Line 142: Quota progress bar `bg-emerald-500` -> `bg-white`
  - Line 147: Upgrade to Pro link `text-emerald-400 hover:text-emerald-300` -> `text-zinc-200 hover:text-white`
  - Line 157: User avatar `text-emerald-400` -> `text-white font-bold`
- **`SiteHeader.tsx`**:
  - Line 22: Logo container `bg-emerald-600 shadow-emerald-600/30` -> `bg-white text-black shadow-lg shadow-white/10`
  - Line 28: Version dot `bg-emerald-400` -> `bg-white`

---

### 3.6 Project Management Studio (`src/app/projects/page.tsx`)
- Line 117: Badge `text-emerald-400` -> `text-zinc-400`
- Line 132: Create button `bg-emerald-600 hover:bg-emerald-500` -> `bg-white text-zinc-950 hover:bg-zinc-200 font-bold`
- Line 156, 161: Shopify tab `text-emerald-400`, badge `bg-emerald-500/20 text-emerald-400 border-emerald-500/30` -> `text-white`, badge `bg-zinc-800 text-zinc-200 border-zinc-700`
- Line 203, 218: Empty state icon `text-emerald-400`, button `bg-emerald-600 hover:bg-emerald-500` -> `text-white`, button `bg-white hover:bg-zinc-200 text-zinc-950 font-bold`
- Line 255: Card badge `bg-emerald-500/20 text-emerald-400 border-emerald-500/30` -> `bg-zinc-800 text-zinc-300 border-zinc-700`
- Line 264: Card title hover `group-hover:text-emerald-400` -> `group-hover:text-white`
- Line 314: Suspense loader `text-emerald-400` -> `text-white`

---

### 3.7 Billing & Plans (`src/app/billing/page.tsx`)
- Line 88-89: Header badge & CreditCard icon `text-emerald-400` -> `text-zinc-300`, icon `text-white`
- Line 103: Crown container `text-emerald-400` -> `text-white`
- Line 110: Active badge `bg-emerald-950/80 text-emerald-400 border-emerald-800/60` -> `bg-zinc-800 text-zinc-200 border-zinc-700`
- Line 140: Monthly Pro card highlight `border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-emerald-950/30` -> `border-zinc-500 ring-2 ring-white/20 shadow-2xl shadow-black/80 bg-gradient-to-b from-zinc-900 to-zinc-950`
- Line 151: Popular badge `bg-emerald-950/80 text-emerald-400 border-emerald-800/60` -> `bg-white text-zinc-950 font-black border-0`
- Line 158: Active plan check `text-emerald-400` -> `text-white font-bold`
- Line 175: Feature list checkmarks `text-emerald-400` -> `text-white`
- Line 189: Upgrade button `bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-black shadow-lg shadow-white/5`

---

### 3.8 Design System Showcase (`src/app/design-system/page.tsx`)
- Lines 18-19: Colors array list currently includes `Emerald Accent (#10B981)` and `Emerald Light (#34D399)` -> Replace with `Monochrome Pure White (#FFFFFF)`, `Silver Frost (#E4E4E7)`, `Titanium Slate (#71717A)`, `Obsidian Surface (#18181B)`, `Deep Obsidian (#000000)`.
- Line 30-31: Header icons & text `text-emerald-400` -> `text-white`
- Line 95: Emerald button showcase `bg-emerald-600 hover:bg-emerald-500` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold`
- Line 120, 129, 137: Input focus states `focus:border-emerald-500 focus:ring-emerald-500/20` -> `focus:border-white focus:ring-white/20`
- Line 156, 170: Card footer status `text-emerald-400` -> `text-zinc-300 font-mono`
- Lines 175-186: Emerald theme card `border-emerald-800/60 bg-emerald-950/30`, `text-emerald-200`, `bg-emerald-600` -> Transform into Luxury Frost Glass Showcase card `border-white/10 bg-zinc-900/80 backdrop-blur-xl text-white` with `bg-white text-black` button.

---

### 3.9 Inspiration Gallery (`src/app/inspiration/page.tsx`)
- Line 41-42: Header icon & badge `text-emerald-400` -> `text-white`
- Line 75: Card title hover `group-hover:text-emerald-400` -> `group-hover:text-white`
- Line 86: Use template button `bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold`

---

### 3.10 Authentication Pages (`src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx`)
- `sign-in/page.tsx`:
  - Line 37: Avatar icon box `bg-emerald-950/80 border-emerald-800/60 text-emerald-400` -> `bg-zinc-800 border-zinc-700 text-white`
  - Line 85, 95: Input focus `focus:border-emerald-500 focus:ring-emerald-500/20` -> `focus:border-white focus:ring-white/20`
  - Line 102: Submit button `bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg shadow-white/5`
  - Line 113: Link `text-emerald-400` -> `text-white hover:underline`
- `sign-up/page.tsx`:
  - Line 38: Avatar icon box `bg-emerald-950/80 border-emerald-800/60 text-emerald-400` -> `bg-zinc-800 border-zinc-700 text-white`
  - Line 86, 96, 106: Input focus `focus:border-emerald-500 focus:ring-emerald-500/20` -> `focus:border-white focus:ring-white/20`
  - Line 111: Submit button `bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg shadow-white/5`
  - Line 122: Link `text-emerald-400` -> `text-white hover:underline`

---

### 3.11 Reusable UI Primitives (`src/components/ui/`)
- **`Alert.tsx`**:
  - Line 30-31: Success alert `bg-emerald-950/50 border-emerald-800/60 text-emerald-200`, icon `text-emerald-400` -> `bg-zinc-900/90 border-zinc-700 text-zinc-100`, icon `text-white`
- **`BuilderSwitcher.tsx`**:
  - Line 63: Active sliding indicator `bg-gradient-to-r from-emerald-600 to-green-600 border border-emerald-400/40 shadow-emerald-950/80` -> `bg-zinc-800 border border-zinc-700 text-white shadow-zinc-950/80` (or `bg-white text-black font-bold`)
  - Line 84: Website icon fill `active === "website" ? "fill-emerald-400 text-emerald-400 scale-105" : "text-zinc-500"` -> `"fill-white text-white scale-105" : "text-zinc-500"`
  - Line 115: Shopify badge `bg-emerald-900/90 text-emerald-200 border border-emerald-400/40` -> `bg-zinc-800 text-zinc-200 border border-zinc-700`
  - Line 119: Pulse dot `bg-emerald-500 animate-pulse` -> `bg-white animate-pulse`
- **`Button.tsx`**:
  - Line 39-42: `variant="pink"` was defined as `from-emerald-600 via-emerald-500 to-emerald-600` and `variant="cyan"` as `from-indigo-600 to-blue-600`.
  - Replace with monochrome variants:
    - `primary`: `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-white/50`
    - `secondary`: `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600`
    - `outline`: `border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600`
    - `ghost`: `bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 focus:ring-zinc-600`
    - `danger`: `bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20`
- **`VideoBackground.tsx`**:
  - Line 69: Glow gradient `bg-gradient-radial from-emerald-950/20 via-transparent to-transparent` -> `bg-gradient-radial from-zinc-800/20 via-transparent to-transparent`

---

### 3.12 AI Generation Prompt Engine (`src/app/api/generate/route.ts`)
- **Line 58**: System prompt instruction:
  - Current: `vibrant emerald accents (bg-emerald-600, text-emerald-400, border-emerald-500/30)`
  - Monochrome: `strict luxury monochrome noir accents (bg-white text-black, border-white/20, hover:bg-zinc-200, bg-zinc-900 surfaces, silver frost glows)`
- **Line 61**: Announcement bar prompt:
  - Current: `bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300`
  - Monochrome: `bg-zinc-900/90 border-b border-zinc-800 text-zinc-300`
- **Line 141**: Prompt enhance text:
  - Current: `dark luxury aesthetic with emerald accents`
  - Monochrome: `dark luxury aesthetic with strict monochrome noir typography and high-contrast styling`
- **Lines 149-255**: Static fallback HTML template contains 25+ emerald classes:
  - `bg-emerald-950/80`, `text-emerald-300`, `bg-emerald-400`, `bg-emerald-600`, `text-emerald-400`, `border-emerald-500/40`, `shadow-emerald-600/30`, `from-emerald-950/25`, `bg-emerald-500/10`
  - Overhaul to pure monochrome: pure white buttons (`bg-white hover:bg-zinc-200 text-zinc-950`), zinc-900 cards with zinc-800 borders, white status dots, and high-contrast typography.

---

### 3.13 Shopify Theme Studio & Compiler (`src/app/builder/page.tsx`, `InteractiveShopifyStudio.tsx`, `src/lib/shopify.ts`)
Even in the dedicated Shopify Theme Studio, all elements must cleanly align with the luxury monochrome design system:
- **`src/app/builder/page.tsx`**:
  - Line 261: `selection:bg-emerald-900` -> `selection:bg-zinc-800 selection:text-white`
  - Line 271, 272: Badge `border-emerald-500/30 bg-emerald-950/60 text-emerald-400`, `fill-emerald-400` -> `border-zinc-700 bg-zinc-900 text-zinc-200`, `fill-white text-white`
  - Line 290, 299: Quota indicator `text-emerald-400` -> `text-white font-bold`, link `text-emerald-400 hover:text-emerald-300` -> `text-zinc-200 hover:text-white`
  - Line 308: Glow `from-emerald-600/30 to-green-700/30` -> `from-white/10 via-zinc-600/20 to-white/10`
  - Line 317: Textarea `focus:border-emerald-500/50` -> `focus:border-white/60 focus:ring-1 focus:ring-white/20`
  - Line 337, 349: Enhance button `border-emerald-500/30 text-emerald-400`, Submit button `bg-emerald-600 hover:bg-emerald-500` -> `border-zinc-700 text-zinc-300`, Submit button `bg-white hover:bg-zinc-200 text-zinc-950 font-bold`
  - Line 372: Preset active card `border-emerald-500/60 shadow-emerald-950/40` -> `border-white ring-1 ring-white/20 shadow-2xl`
  - Line 393: Pulse dot `bg-emerald-400 animate-pulse` -> `bg-white animate-pulse`
  - Line 405, 415, 426, 431, 445, 449, 454, 458, 476, 490, 509, 515, 548: Replace all emerald buttons, tags, cart counters, and totals with high-contrast white & zinc elements.
- **`src/components/builder/InteractiveShopifyStudio.tsx`**:
  - Presets (lines 73, 132, 187, 191): Replace `accentColor: "#10b981"` / `"#059669"` with luxury monochrome accents (`"#ffffff"`, `"#e4e4e7"`, `"#d4d4d8"`).
  - Clean up all emerald badges, cart indicators, code viewer tints (`text-emerald-300` -> `text-zinc-200`), and buttons.
- **`src/lib/shopify.ts`**:
  - Line 30: `selection:bg-emerald-500 selection:text-white` -> `selection:bg-zinc-800 selection:text-white`
  - Line 55, 76: Settings schema default accent `"#10b981"` -> `"#ffffff"`
  - Lines 138-325: Overhaul Liquid template sections (announcement bar, header, hero, featured products, footer, product card) from emerald to luxury noir styling.

---

## 4. Monochrome Noir Replacement Master Matrix

| UI Element Type | Old Saturated / Emerald Style | New Strict Luxury Monochrome Noir Style |
| :--- | :--- | :--- |
| **Primary Buttons** | `bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/80` | `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]` |
| **Secondary Buttons** | `bg-zinc-900 border border-emerald-500/30 text-emerald-400` | `bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80` |
| **Active States / Tabs** | `border-emerald-500/60 bg-emerald-950/60 text-emerald-400` | `bg-zinc-800 text-white border border-zinc-700 font-bold shadow-sm ring-1 ring-white/10` |
| **Status Dots & Pulses** | `w-2 h-2 rounded-full bg-emerald-400 animate-pulse` | `w-2 h-2 rounded-full bg-white animate-pulse shadow-glow-white` |
| **Focus Rings & Borders** | `focus:border-emerald-500/50 focus:ring-emerald-500/20` | `focus:border-white/60 focus:ring-2 focus:ring-white/10` |
| **Glows & Backdrops** | `bg-gradient-radial from-emerald-950/25 via-transparent` | `bg-gradient-radial from-white/10 via-zinc-800/10 to-transparent blur-3xl` |
| **Badges & Pill Tags** | `bg-emerald-500/20 text-emerald-400 border border-emerald-500/30` | `bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[10px]` |
| **Selection Highlight** | `selection:bg-emerald-900 selection:text-white` | `selection:bg-zinc-800 selection:text-white` |
| **Code Syntax Preview** | `text-emerald-400 font-mono` | `text-zinc-200 font-mono bg-zinc-950` with crisp white/silver keywords |
| **Glass Panels** | `border: 1px solid rgba(16, 185, 129, 0.25)` | `backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);` |
| **Card Hover Outlines** | `hover:border-emerald-500/40` | `hover:border-zinc-500 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1` |

---

## 5. Architectural Verification & Build Impact
1. **Zero CSS Framework Disruption**: All proposed classes utilize standard Tailwind CSS utility classes and standard CSS variable overrides.
2. **Build Compatibility**: Removing emerald/teal/pink tokens does not introduce any missing CSS classes or TS errors.
3. **Hydration Guard**: Hydration safety guards across Auth indicators (`suppressHydrationWarning`, `mounted` state) remain intact.
