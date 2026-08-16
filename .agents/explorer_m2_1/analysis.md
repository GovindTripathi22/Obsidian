# Milestone 2 Deep-Dive Exploration: Global Tokens, Selection Styling, Editor Page, & InlineCustomizer

## 1. Executive Summary & Scope

This exploration conducts an exhaustive technical investigation of the core visual design tokens and primary editing interfaces in Obsidian:
- **Global Theme Tokens & Utilities** (`src/app/globals.css`)
- **Selection Highlights** (`src/app/layout.tsx`)
- **Interactive Workspace Editor** (`src/app/editor/[projectId]/page.tsx`)
- **Floating Inline Section Customizer** (`src/components/editor/InlineCustomizer.tsx`)

The goal is to transition the entire builder and workspace editor from legacy green (`#10b981`, `#008060`, `emerald-500/600`, `teal`, `pink`, `cyan`) to a **strict luxury monochrome noir aesthetic** (#ffffff, zinc elevation scale, obsidian carbon surfaces, pure white ambient glows, silver frost borders, high-contrast typography).

---

## 2. Task 1: Global Theme Tokens & Utilities (`src/app/globals.css`)

### 2.1 Current Green/Emerald Variables in `:root`
In `src/app/globals.css` (lines 19-28):
```css
/* CURRENT (globals.css:19-28) */
/* Emerald & Shopify Green Accents */
--accent: #10b981;
--accent-shopify: #008060;
--accent-hover: #059669;
--accent-glow: rgba(16, 185, 129, 0.2);

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
```

### 2.2 Luxury Monochrome Noir Variable Mapping
| Variable Name | Legacy Value | Luxury Monochrome Replacement | Purpose & Visual Intent |
| :--- | :--- | :--- | :--- |
| `--accent` | `#10b981` | `#ffffff` | High-impact pure white primary highlights |
| `--accent-shopify` | `#008060` | `#ffffff` | High-contrast white brand accent |
| `--accent-hover` | `#059669` | `#e4e4e7` | Zinc-200 / frosted silver hover state |
| `--accent-muted` | *(New)* | `#a1a1aa` | Zinc-400 muted secondary accent |
| `--accent-glow` | `rgba(16, 185, 129, 0.2)` | `rgba(255, 255, 255, 0.08)` | Subtle white ambient luminescence |
| `--accent-border` | *(New)* | `rgba(255, 255, 255, 0.14)` | Crisp silver frost structural border |
| `--success` | `#10b981` | `#f4f4f5` | Zinc-100 high-contrast indicator |

### 2.3 Utility Classes Overhaul
1. **`.glass-shopify` (lines 119-125)**:
   - *Current*: `linear-gradient(135deg, rgba(6, 44, 30, 0.4) 0%, rgba(9, 9, 11, 0.9) 100%)`, `border: 1px solid rgba(16, 185, 129, 0.25)`
   - *Replacement*: `linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(9, 9, 11, 0.95) 100%)`, `border: 1px solid rgba(255, 255, 255, 0.12)`, `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1);`
2. **`.shadow-glow-emerald` & `.shadow-glow-shopify` (lines 135-141)**:
   - Remap both classes to pure white and silver glows, and introduce `.shadow-glow-white` and `.shadow-glow-silver`:
   - `.shadow-glow-white`, `.shadow-glow-emerald`: `box-shadow: 0 0 25px rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 255, 255, 0.04);`
   - `.shadow-glow-silver`, `.shadow-glow-shopify`: `box-shadow: 0 0 30px rgba(228, 228, 231, 0.15), 0 0 60px rgba(255, 255, 255, 0.05);`

### 2.4 Exact Proposed Replacement Snippet for `src/app/globals.css`
```css
<<<<
    /* Emerald & Shopify Green Accents */
    --accent: #10b981;
    --accent-shopify: #008060;
    --accent-hover: #059669;
    --accent-glow: rgba(16, 185, 129, 0.2);

    /* Status Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
====
    /* Luxury Monochrome Noir Accents */
    --accent: #ffffff;
    --accent-shopify: #ffffff;
    --accent-hover: #e4e4e7;
    --accent-muted: #a1a1aa;
    --accent-glow: rgba(255, 255, 255, 0.08);
    --accent-border: rgba(255, 255, 255, 0.14);

    /* Status Colors */
    --success: #f4f4f5;
    --warning: #f59e0b;
    --danger: #ef4444;
>>>>
```

```css
<<<<
.glass-shopify {
  background: linear-gradient(135deg, rgba(6, 44, 30, 0.4) 0%, rgba(9, 9, 11, 0.9) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 20px 40px -15px rgba(6, 44, 30, 0.4), inset 0 1px 0 rgba(16, 185, 129, 0.15);
}
====
.glass-shopify {
  background: linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(9, 9, 11, 0.95) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1);
}
>>>>
```

```css
<<<<
.shadow-glow-emerald {
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.2), 0 0 50px rgba(16, 185, 129, 0.08);
}

.shadow-glow-shopify {
  box-shadow: 0 0 30px rgba(0, 128, 96, 0.3), 0 0 60px rgba(16, 185, 129, 0.1);
}
====
.shadow-glow-emerald,
.shadow-glow-white {
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 255, 255, 0.04);
}

.shadow-glow-shopify,
.shadow-glow-silver {
  box-shadow: 0 0 30px rgba(228, 228, 231, 0.15), 0 0 60px rgba(255, 255, 255, 0.05);
}
>>>>
```

---

## 3. Task 2: Root Selection Styling (`src/app/layout.tsx`)

### 3.1 Observation
In `src/app/layout.tsx` (line 21):
`<body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">`

### 3.2 Recommended Monochrome Selection Token
`selection:bg-white/20 selection:text-white` or `selection:bg-zinc-800 selection:text-white`. Using `selection:bg-white/20 selection:text-white` delivers a luminous frosted luxury highlight when selecting text across the application.

### 3.3 Exact Proposed Replacement Snippet for `src/app/layout.tsx`
```tsx
<<<<
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
====
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-white/20 selection:text-white">
>>>>
```

*(Note for other files across workspace: `src/app/builder/page.tsx:256` and `src/lib/shopify.ts:30` which had `selection:bg-emerald-900` and `selection:bg-emerald-500` will also be updated to `selection:bg-white/20 selection:text-white`).*

---

## 4. Task 3: Interactive Workspace Editor (`src/app/editor/[projectId]/page.tsx`)

### 4.1 Detailed Inventory of Issues & Overhaul Plan

#### A. `COLOR_THEMES` Constant (lines 58-64)
- **Current**: Default theme is `Obsidian Emerald` (`#10b981`). Other themes include `Cyberpunk Neon` (cyan), `Violet Luxury` (purple), and `Sunset Crimson` (rose).
- **Redesign**: Make `Monochrome Noir` the #1 default theme (`COLOR_THEMES[0]`), and accompany it with a series of metallic and obsidian mineral palettes:
```typescript
const COLOR_THEMES = [
  { name: "Monochrome Noir", primary: "#ffffff", bg: "#000000", accent: "from-white via-zinc-200 to-zinc-400", label: "Pure Monochrome (Default)" },
  { name: "Silver Frost", primary: "#e4e4e7", bg: "#09090b", accent: "from-zinc-100 to-zinc-400", label: "Frosted Silver" },
  { name: "Titanium Slate", primary: "#a1a1aa", bg: "#09090b", accent: "from-zinc-300 to-zinc-600", label: "Brushed Titanium" },
  { name: "Obsidian Carbon", primary: "#71717a", bg: "#050505", accent: "from-zinc-400 to-zinc-800", label: "Deep Carbon" },
  { name: "Liquid Platinum", primary: "#f4f4f5", bg: "#0c0c0e", accent: "from-white to-zinc-500", label: "Liquid Platinum" },
];
```

#### B. Zero-Token Scaffold Template (`handleCreatePage`, lines 263-289)
- **Line 266**: Status dot `bg-emerald-400` -> `bg-white animate-pulse shadow-glow-white`
- **Line 272**: Overview badge `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20` -> `bg-zinc-900 text-zinc-200 border border-zinc-700`
- **Line 281**: CTA button `bg-emerald-600 hover:bg-emerald-500 text-white font-bold` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5`

#### C. Top Header Navigation (lines 438-515)
- **Line 439**: Shopify brand icon `fill-emerald-400` -> `fill-white text-white`
- **Line 474**: Add Page tab button hover `hover:text-emerald-400` -> `hover:text-white`
- **Line 512**: Shopify Export button `bg-emerald-600 hover:bg-emerald-500 text-white font-bold` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5`

#### D. Left Panel AI Workspace Header & Sub-Tabs (lines 550-618)
- **Line 550**: Sparkles icon container `bg-emerald-600/20 border border-emerald-500/30 text-emerald-400` -> `bg-zinc-800 border border-zinc-700 text-white`
- **Line 559-560**: Gemini badge `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`, dot `bg-emerald-400 animate-pulse` -> `bg-zinc-900 text-zinc-300 border border-zinc-700`, dot `bg-white animate-pulse shadow-glow-white`
- **Sub-Tab Icons (lines 583, 594, 605, 616)**:
  - Chat: `MessageSquare text-emerald-400` -> active `text-white`, inactive `text-zinc-400`
  - Fixes: `Zap text-amber-400` -> active `text-white`, inactive `text-zinc-400`
  - Blocks: `Layers text-cyan-400` -> active `text-white`, inactive `text-zinc-400`
  - Theme: `Palette text-rose-400` -> active `text-white`, inactive `text-zinc-400`

#### E. Chat Conversation Stream (lines 633-665)
- **Line 633**: Assistant avatar icon box `bg-emerald-600/20 border border-emerald-500/30 text-emerald-400` -> `bg-zinc-800 border border-zinc-700 text-white`
- **Line 653**: Copied check icon `text-emerald-400` -> `text-white`
- **Lines 663-665**: Live streaming status indicator `border border-emerald-500/30`, spinner `text-emerald-400`, text `text-emerald-400` -> `border border-zinc-700 bg-zinc-900/90`, spinner `text-white`, text `text-zinc-200`

#### F. Actions & Blocks Sub-Tabs (lines 685-718)
- **Lines 685, 688, 693**: Quick fixes hover `hover:border-emerald-500/40`, `group-hover:text-emerald-400` -> `hover:border-zinc-600`, `group-hover:text-white`
- **Lines 710, 715, 718**: UI blocks hover `hover:border-cyan-500/40`, `group-hover:text-cyan-400` -> `hover:border-zinc-600`, `group-hover:text-white`

#### G. Theme Swatches Sub-Tab (lines 740, 755)
- **Line 740**: Active theme card `bg-zinc-900 border-emerald-500/60 shadow-md` -> `bg-zinc-900 border-white ring-1 ring-white/20 shadow-md`
- **Line 755**: Active check icon `text-emerald-400` -> `text-white`

#### H. Suggestion Chips & Prompt Input Form (lines 770, 792, 801, 809)
- **Line 770**: Suggestion chips `hover:border-emerald-500/40 text-zinc-300 hover:text-white` -> `hover:border-zinc-600 text-zinc-300 hover:text-white`
- **Line 792**: Instruction textarea `focus:border-emerald-500/50` -> `focus:border-zinc-400 focus:ring-1 focus:ring-white/20`
- **Line 801**: Enhance prompt button `text-emerald-400 hover:text-emerald-300` -> `text-zinc-400 hover:text-white`
- **Line 809**: Submit button `bg-emerald-600 hover:bg-emerald-500 text-white` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5`

#### I. Live Canvas Address Bar & Syntax Inspector (lines 863-894)
- **Line 863**: Address bar decorative dot `bg-emerald-500/80` -> `bg-zinc-600`
- **Line 868-869**: Live streaming status `bg-emerald-400 animate-pulse`, `text-emerald-400 font-semibold` -> `bg-white animate-pulse shadow-glow-white`, `text-white font-semibold`
- **Line 889**: HTML code inspector `<pre className="bg-zinc-950 text-emerald-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">` -> `<pre className="bg-zinc-950 text-zinc-200 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-zinc-800">`
- **Line 894**: Liquid Schema inspector `<pre className="bg-zinc-950 text-amber-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">` -> `<pre className="bg-zinc-950 text-zinc-300 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-zinc-800">`

#### J. Modals: Add Page Modal & Shopify Export Modal (lines 954-1075)
- **Line 954**: Modal icon `<FileText className="w-5 h-5 text-emerald-400" />` -> `<FileText className="w-5 h-5 text-white" />`
- **Line 975, 978**: Template buttons `hover:border-emerald-500/50`, `group-hover:text-emerald-400` -> `hover:border-zinc-600`, `group-hover:text-white`
- **Line 1005**: Add Page button `bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold px-4 shadow-md shadow-white/5`
- **Line 1020**: Export modal icon box `bg-emerald-500/10 border border-emerald-500/20 text-emerald-400` -> `bg-zinc-800 border border-zinc-700 text-white`
- **Line 1036**: Export progress `%` `text-emerald-400 font-bold` -> `text-white font-bold`
- **Line 1040**: Export progress bar gradient `bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400` -> `bg-gradient-to-r from-zinc-600 via-zinc-300 to-white`
- **Lines 1047-1049**: Export step checks `text-emerald-400 font-bold` -> `text-white font-bold`
- **Line 1055**: Export modal close button `bg-emerald-600 hover:bg-emerald-500 text-white font-bold` -> `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5`
- **Line 1075**: Suspense loader spinner `text-emerald-400` -> `text-white`

### 4.2 Complete Before/After Snippets for `src/app/editor/[projectId]/page.tsx`

```tsx
/* CHUNK 1: COLOR_THEMES */
<<<<
const COLOR_THEMES = [
  { name: "Obsidian Emerald", primary: "#10b981", bg: "#09090b", accent: "from-emerald-600 to-teal-500", label: "Emerald (Default)" },
  { name: "Cyberpunk Neon", primary: "#06b6d4", bg: "#030712", accent: "from-cyan-500 to-blue-600", label: "Cyan & Blue" },
  { name: "Violet Luxury", primary: "#8b5cf6", bg: "#090514", accent: "from-violet-600 to-purple-500", label: "Purple Velvet" },
  { name: "Sunset Crimson", primary: "#f43f5e", bg: "#0c0507", accent: "from-rose-600 to-amber-500", label: "Rose & Amber" },
  { name: "Monochrome Noir", primary: "#f4f4f5", bg: "#000000", accent: "from-zinc-100 to-zinc-400", label: "Pure Monochrome" },
];
====
const COLOR_THEMES = [
  { name: "Monochrome Noir", primary: "#ffffff", bg: "#000000", accent: "from-white via-zinc-200 to-zinc-400", label: "Pure Monochrome (Default)" },
  { name: "Silver Frost", primary: "#e4e4e7", bg: "#09090b", accent: "from-zinc-100 to-zinc-400", label: "Frosted Silver" },
  { name: "Titanium Slate", primary: "#a1a1aa", bg: "#09090b", accent: "from-zinc-300 to-zinc-600", label: "Brushed Titanium" },
  { name: "Obsidian Carbon", primary: "#71717a", bg: "#050505", accent: "from-zinc-400 to-zinc-800", label: "Deep Carbon" },
  { name: "Liquid Platinum", primary: "#f4f4f5", bg: "#0c0c0e", accent: "from-white to-zinc-500", label: "Liquid Platinum" },
];
>>>>
```

```tsx
/* CHUNK 2: Zero-Token Scaffold Template in handleCreatePage */
<<<<
<header class="bg-zinc-950/90 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
  <div class="flex items-center gap-2 font-bold text-white font-heading">
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
    <span>${finalTitle}</span>
  </div>
  <a href="#home" class="text-xs font-semibold text-zinc-400 hover:text-white">← Return Home</a>
</header>
<section class="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
    ✨ ${finalTitle} Overview
  </span>
  <h1 class="text-4xl sm:text-5xl font-black text-white font-heading">${finalTitle}</h1>
  <p class="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
    This page was created with 0 tokens. Use the AI Assistant on the left panel to synthesize custom content, grids, or interactive forms whenever you are ready.
  </p>
  <div class="p-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center space-y-3">
    <p class="text-xs font-mono text-zinc-500">Ready for AI Customization</p>
    <button onclick="window.parent.postMessage('openChat', '*')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">
      Prompt AI to Design This Page →
    </button>
  </div>
</section>
====
<header class="bg-zinc-950/90 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
  <div class="flex items-center gap-2 font-bold text-white font-heading">
    <span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-glow-white"></span>
    <span>${finalTitle}</span>
  </div>
  <a href="#home" class="text-xs font-semibold text-zinc-400 hover:text-white">← Return Home</a>
</header>
<section class="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold">
    ✨ ${finalTitle} Overview
  </span>
  <h1 class="text-4xl sm:text-5xl font-black text-white font-heading">${finalTitle}</h1>
  <p class="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
    This page was created with 0 tokens. Use the AI Assistant on the left panel to synthesize custom content, grids, or interactive forms whenever you are ready.
  </p>
  <div class="p-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center space-y-3">
    <p class="text-xs font-mono text-zinc-500">Ready for AI Customization</p>
    <button onclick="window.parent.postMessage('openChat', '*')" class="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-white/5">
      Prompt AI to Design This Page →
    </button>
  </div>
</section>
>>>>
```

```tsx
/* CHUNK 3: Header ShopifyIcon & Add Page Button */
<<<<
            {isShopify ? (
              <ShopifyIcon className="w-4 h-4 fill-emerald-400 shrink-0" />
            ) : (
              <Hexagon className="w-4 h-4 fill-white text-white shrink-0" />
            )}
====
            {isShopify ? (
              <ShopifyIcon className="w-4 h-4 fill-white text-white shrink-0" />
            ) : (
              <Hexagon className="w-4 h-4 fill-white text-white shrink-0" />
            )}
>>>>
```

```tsx
/* CHUNK 4: Header Add Page tab hover and Export button */
<<<<
          <button
            onClick={() => setShowAddPageModal(true)}
            title="Add Page (0 Tokens)"
            className="p-1 text-zinc-400 hover:text-emerald-400 rounded-md hover:bg-zinc-800 transition-colors flex items-center gap-1 px-2 text-xs font-semibold"
          >
====
          <button
            onClick={() => setShowAddPageModal(true)}
            title="Add Page (0 Tokens)"
            className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors flex items-center gap-1 px-2 text-xs font-semibold"
          >
>>>>
```

```tsx
<<<<
          {isShopify ? (
            <Button
              size="sm"
              onClick={handleExportShopify}
              leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Export Shopify Theme (ZIP)
            </Button>
          ) : (
====
          {isShopify ? (
            <Button
              size="sm"
              onClick={handleExportShopify}
              leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
            >
              Export Shopify Theme (ZIP)
            </Button>
          ) : (
>>>>
```

```tsx
/* CHUNK 5: Left Panel Assistant Header & Sub-Tabs */
<<<<
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-heading">AI Studio Assistant</h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 2.5
                </span>
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Minimalist Sub-Tabs */}
            <div className="grid grid-cols-4 bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-[10px] font-semibold">
              <button
                onClick={() => setSidebarTab("chat")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "chat"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setSidebarTab("actions")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "actions"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Fixes</span>
              </button>
              <button
                onClick={() => setSidebarTab("blocks")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "blocks"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Blocks</span>
              </button>
              <button
                onClick={() => setSidebarTab("theme")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "theme"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Palette className="w-3 h-3 text-rose-400" />
                <span>Theme</span>
              </button>
            </div>
====
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-heading">AI Studio Assistant</h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-glow-white" />
                  Gemini 2.5
                </span>
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Minimalist Sub-Tabs */}
            <div className="grid grid-cols-4 bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-[10px] font-semibold">
              <button
                onClick={() => setSidebarTab("chat")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "chat"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <MessageSquare className={`w-3 h-3 ${sidebarTab === "chat" ? "text-white" : "text-zinc-400"}`} />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setSidebarTab("actions")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "actions"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Zap className={`w-3 h-3 ${sidebarTab === "actions" ? "text-white" : "text-zinc-400"}`} />
                <span>Fixes</span>
              </button>
              <button
                onClick={() => setSidebarTab("blocks")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "blocks"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Layers className={`w-3 h-3 ${sidebarTab === "blocks" ? "text-white" : "text-zinc-400"}`} />
                <span>Blocks</span>
              </button>
              <button
                onClick={() => setSidebarTab("theme")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "theme"
                    ? "bg-zinc-800 text-white shadow-xs font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Palette className={`w-3 h-3 ${sidebarTab === "theme" ? "text-white" : "text-zinc-400"}`} />
                <span>Theme</span>
              </button>
            </div>
>>>>
```

```tsx
/* CHUNK 6: Chat Stream Messages & Streaming State */
<<<<
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
====
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
>>>>
```

```tsx
<<<<
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopyMessage(msg.content, i)}
                          className="hover:text-zinc-300 flex items-center gap-1"
                        >
                          {copiedMsg === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedMsg === i ? "Copied" : "Copy"}</span>
                        </button>
                      )}
====
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopyMessage(msg.content, i)}
                          className="hover:text-zinc-300 flex items-center gap-1"
                        >
                          {copiedMsg === i ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedMsg === i ? "Copied" : "Copy"}</span>
                        </button>
                      )}
>>>>
```

```tsx
<<<<
              {isGenerating && (
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 font-medium">
                    Streaming live updates for {activePageTab}...
                  </span>
                </div>
              )}
====
              {isGenerating && (
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-xs font-mono text-zinc-200 font-medium">
                    Streaming live updates for {activePageTab}...
                  </span>
                </div>
              )}
>>>>
```

```tsx
/* CHUNK 7: Actions & Blocks Cards */
<<<<
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, action.prompt)}
                  className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">{action.prompt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
====
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, action.prompt)}
                  className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-left transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">{action.prompt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
>>>>
```

```tsx
<<<<
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, block.prompt)}
                  className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-left transition-all flex items-start gap-2.5 group cursor-pointer disabled:opacity-50"
                >
                  <span className="text-lg shrink-0 mt-0.5">{block.icon}</span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {block.name}
                      </p>
                      <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{block.desc}</p>
                  </div>
                </button>
====
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, block.prompt)}
                  className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-left transition-all flex items-start gap-2.5 group cursor-pointer disabled:opacity-50"
                >
                  <span className="text-lg shrink-0 mt-0.5">{block.icon}</span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                        {block.name}
                      </p>
                      <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{block.desc}</p>
                  </div>
                </button>
>>>>
```

```tsx
/* CHUNK 8: Theme Swatch Active State */
<<<<
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                    activeTheme.name === theme.name
                      ? "bg-zinc-900 border-emerald-500/60 shadow-md"
                      : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{theme.name}</p>
                      <p className="text-[10px] text-zinc-400">{theme.label}</p>
                    </div>
                  </div>
                  {activeTheme.name === theme.name && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
====
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                    activeTheme.name === theme.name
                      ? "bg-zinc-900 border-white ring-1 ring-white/20 shadow-md"
                      : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{theme.name}</p>
                      <p className="text-[10px] text-zinc-400">{theme.label}</p>
                    </div>
                  </div>
                  {activeTheme.name === theme.name && (
                    <Check className="w-4 h-4 text-white shrink-0" />
                  )}
>>>>
```

```tsx
/* CHUNK 9: Suggestion Chips & Prompt Input Form */
<<<<
              {quickPillActions.slice(0, 3).map((pill, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, pill.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-[10px] font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {pill.label}
                </button>
              ))}
====
              {quickPillActions.slice(0, 3).map((pill, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, pill.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-[10px] font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {pill.label}
                </button>
              ))}
>>>>
```

```tsx
<<<<
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 pr-20 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none resize-none font-medium"
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  title="Enhance prompt with AI"
                  disabled={!inputInstruction.trim() || isEnhancing}
                  onClick={handleEnhancePrompt}
                  className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-40"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                </button>

                <button
                  type="submit"
                  disabled={!inputInstruction.trim() || isGenerating}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
====
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 pr-20 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:outline-none resize-none font-medium"
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  title="Enhance prompt with AI"
                  disabled={!inputInstruction.trim() || isEnhancing}
                  onClick={handleEnhancePrompt}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-40"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                </button>

                <button
                  type="submit"
                  disabled={!inputInstruction.trim() || isGenerating}
                  className="p-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 disabled:opacity-40 transition-colors cursor-pointer shadow-md shadow-white/5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
>>>>
```

```tsx
/* CHUNK 10: Live Canvas Address Bar & Syntax Inspector */
<<<<
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-zinc-950 rounded-md px-2 py-0.5 text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2 truncate border border-zinc-800">
                {isGenerating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-semibold">Streaming Code...</span>
                  </>
                ) : (
====
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-zinc-950 rounded-md px-2 py-0.5 text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2 truncate border border-zinc-800">
                {isGenerating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-glow-white" />
                    <span className="text-white font-semibold">Streaming Code...</span>
                  </>
                ) : (
>>>>
```

```tsx
<<<<
              {activeView === "code" && (
                <pre className="bg-zinc-950 text-emerald-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">
                  <code>{currentHtml || "<!-- No code generated yet -->"}</code>
                </pre>
              )}
              {activeView === "schema" && isShopify && (
                <pre className="bg-zinc-950 text-amber-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">
                  <code>{JSON.stringify(
====
              {activeView === "code" && (
                <pre className="bg-zinc-950 text-zinc-200 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-zinc-800">
                  <code>{currentHtml || "<!-- No code generated yet -->"}</code>
                </pre>
              )}
              {activeView === "schema" && isShopify && (
                <pre className="bg-zinc-950 text-zinc-300 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-zinc-800">
                  <code>{JSON.stringify(
>>>>
```

```tsx
/* CHUNK 11: Modals (Add Page, Export, Suspense) */
<<<<
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-base text-white">Add New Page</h3>
              </div>
====
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h3 className="font-heading font-bold text-base text-white">Add New Page</h3>
              </div>
>>>>
```

```tsx
<<<<
                <button
                  key={tmpl.title}
                  onClick={() => handleCreatePage(tmpl.title)}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-emerald-500/50 hover:bg-zinc-800 text-left transition-all group cursor-pointer space-y-1"
                >
                  <span className="text-xl">{tmpl.icon}</span>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {tmpl.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{tmpl.desc}</p>
                </button>
====
                <button
                  key={tmpl.title}
                  onClick={() => handleCreatePage(tmpl.title)}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 hover:bg-zinc-800 text-left transition-all group cursor-pointer space-y-1"
                >
                  <span className="text-xl">{tmpl.icon}</span>
                  <p className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                    {tmpl.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{tmpl.desc}</p>
                </button>
>>>>
```

```tsx
<<<<
                <Button
                  size="sm"
                  disabled={!customPageName.trim()}
                  onClick={() => handleCreatePage(customPageName)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4"
                >
                  Add
                </Button>
====
                <Button
                  size="sm"
                  disabled={!customPageName.trim()}
                  onClick={() => handleCreatePage(customPageName)}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold px-4 shadow-md shadow-white/5"
                >
                  Add
                </Button>
>>>>
```

```tsx
<<<<
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShopifyIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Shopify Liquid Compiler</h3>
                <p className="text-xs text-zinc-400">Building production Liquid 2.0 ZIP package</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">
                  {exportStep === 1 && "1/3 Parsing sections & schema..."}
                  {exportStep === 2 && "2/3 Compiling layout/theme.liquid..."}
                  {exportStep === 3 && "3/3 Theme ZIP bundle generated!"}
                </span>
                <span className="text-emerald-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <p className={exportStep >= 1 ? "text-emerald-400 font-bold" : ""}>✓ layout/theme.liquid compiled</p>
              <p className={exportStep >= 2 ? "text-emerald-400 font-bold" : ""}>✓ templates/index.json configured</p>
              <p className={exportStep >= 3 ? "text-emerald-400 font-bold" : ""}>✓ sections/*.liquid modularized</p>
            </div>

            {exportStep === 3 && (
              <Button
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                onClick={() => setShowExportModal(false)}
              >
                Close & Open ZIP
              </Button>
            )}
====
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                <ShopifyIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Shopify Liquid Compiler</h3>
                <p className="text-xs text-zinc-400">Building production Liquid 2.0 ZIP package</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">
                  {exportStep === 1 && "1/3 Parsing sections & schema..."}
                  {exportStep === 2 && "2/3 Compiling layout/theme.liquid..."}
                  {exportStep === 3 && "3/3 Theme ZIP bundle generated!"}
                </span>
                <span className="text-white font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-zinc-600 via-zinc-300 to-white transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <p className={exportStep >= 1 ? "text-white font-bold" : ""}>✓ layout/theme.liquid compiled</p>
              <p className={exportStep >= 2 ? "text-white font-bold" : ""}>✓ templates/index.json configured</p>
              <p className={exportStep >= 3 ? "text-white font-bold" : ""}>✓ sections/*.liquid modularized</p>
            </div>

            {exportStep === 3 && (
              <Button
                variant="primary"
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
                onClick={() => setShowExportModal(false)}
              >
                Close & Open ZIP
              </Button>
            )}
>>>>
```

```tsx
<<<<
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
          Loading Workspace...
        </div>
====
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
          Loading Workspace...
        </div>
>>>>
```

---

## 5. Task 4: Complete Architecture & Code Overhaul of `InlineCustomizer.tsx`

### 5.1 Problem Diagnostics
The current `InlineCustomizer` component suffers from three severe design issues:
1. **Light Mode Bleed**: Hardcoded `bg-white`, `border-slate-300`, `text-slate-900`, `bg-slate-100`, and `bg-slate-50`.
2. **Saturated Pink Theme Residue**: `text-pink-600`, `variant="pink"` buttons, and pink wand icons (`text-pink-500`).
3. **Inconsistent UI Tokens**: Out of place in the dark luxury obsidian canvas.

### 5.2 Luxury Noir Architecture Design
1. **Container Glass Card**:
   - `fixed bottom-6 right-6 z-50 w-96 bg-zinc-950/95 border border-zinc-800 backdrop-blur-2xl text-zinc-100 shadow-2xl rounded-2xl ring-1 ring-white/10 space-y-4 p-4 animate-in fade-in slide-in-from-bottom-4`
2. **Header Bar**:
   - Section tag formatted with subtle dark badge: `<code className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 font-mono text-[11px] lowercase">`
   - Close button: `text-zinc-400 hover:text-white hover:bg-zinc-800`
3. **Tabs**:
   - Pill container: `flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold`
   - Active Tab: `bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60`
   - Inactive Tab: `text-zinc-400 hover:text-zinc-200`
4. **Form Controls**:
   - Textareas and Inputs: `bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-white/20`
5. **Primary Action Buttons**:
   - Replace all `variant="pink"` with `variant="primary"` (`bg-white text-zinc-950 font-bold hover:bg-zinc-200 shadow-md shadow-white/5`).
   - Secondary/Outline buttons styled with `border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200`.

### 5.3 Complete Drop-In Source Code for `src/components/editor/InlineCustomizer.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  X,
  Layers,
  Check,
} from "lucide-react";

export interface SelectedElement {
  sectionId: string;
  tagName: string;
  textContent: string;
  imgSrc?: string;
}

interface InlineCustomizerProps {
  element: SelectedElement;
  onClose: () => void;
  onUpdateText: (newText: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAIRefine: (instruction: string) => void;
  onImageTransform: (transformString: string, newSrc?: string) => void;
}

export const InlineCustomizer: React.FC<InlineCustomizerProps> = ({
  element,
  onClose,
  onUpdateText,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAIRefine,
  onImageTransform,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "style" | "image" | "ai">("text");
  const [textVal, setTextVal] = useState(element.textContent || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const isImage = element.tagName.toLowerCase() === "img" || !!element.imgSrc;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateText(textVal);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    await onAIRefine(aiPrompt);
    setIsAiLoading(false);
    setAiPrompt("");
  };

  const handleApplyImageTransform = (transform: string) => {
    onImageTransform(transform);
  };

  const handleGenerateNewImage = () => {
    if (!imagePrompt.trim()) return;
    const transformedUrl = `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80&prompt=${encodeURIComponent(imagePrompt)}`;
    onImageTransform("", transformedUrl);
  };

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-96 bg-zinc-950/95 border border-zinc-800 backdrop-blur-2xl text-zinc-100 shadow-2xl rounded-2xl ring-1 ring-white/10 space-y-4 p-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Section Editor:{" "}
            <code className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 font-mono text-[11px] lowercase">
              {element.sectionId || element.tagName}
            </code>
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "text"
              ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "style"
              ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Style
        </button>
        {isImage && (
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "image"
                ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Image Kit
          </button>
        )}
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "ai"
              ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          AI Refine
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "text" && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-zinc-400 font-semibold">Content Text</label>
          <textarea
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:outline-none resize-none font-medium"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Apply Text Update
          </Button>
        </form>
      )}

      {activeTab === "style" && (
        <div className="space-y-3 text-xs">
          <p className="font-mono text-zinc-400 font-semibold">Section Reordering & Structure</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={onMoveUp} leftIcon={<ArrowUp className="w-3.5 h-3.5" />}>
              Move Up
            </Button>
            <Button size="sm" variant="outline" onClick={onMoveDown} leftIcon={<ArrowDown className="w-3.5 h-3.5" />}>
              Move Down
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
            <Button size="sm" variant="secondary" onClick={onDuplicate} leftIcon={<Copy className="w-3.5 h-3.5" />}>
              Duplicate
            </Button>
            <Button size="sm" variant="danger" onClick={onDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              Delete Block
            </Button>
          </div>
        </div>
      )}

      {activeTab === "image" && isImage && (
        <div className="space-y-3">
          <p className="text-xs font-mono text-zinc-400 font-semibold">Image Kit AI Transformations</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:bg-remove")}
              leftIcon={<Wand2 className="w-3.5 h-3.5 text-zinc-300" />}
            >
              Remove BG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:w-1200,h-1200,q-90")}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-zinc-300" />}
            >
              Upscale HD
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:drop-shadow")}
            >
              Drop Shadow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:bg-sunset")}
            >
              Sunset Glow
            </Button>
          </div>

          <div className="border-t border-zinc-800/80 pt-3 space-y-2">
            <label className="block text-[11px] font-mono text-zinc-400 font-semibold">
              Generate Replacement Image
            </label>
            <Input
              placeholder="e.g. Luxury perfume bottle noir background..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-400"
            />
            <Button
              size="sm"
              variant="primary"
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
              onClick={handleGenerateNewImage}
              leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
            >
              Replace with ImageKit AI
            </Button>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <form onSubmit={handleAiSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-zinc-400 font-semibold">
            Gemini Targeted Section Refinement
          </label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Make this section have rounded floating corners, soft shadow, and 3 review cards..."
            rows={3}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:outline-none resize-none font-medium"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
            isLoading={isAiLoading}
            leftIcon={<Wand2 className="w-3.5 h-3.5" />}
          >
            Refine Section with Gemini
          </Button>
        </form>
      )}
    </Card>
  );
};
```

---

## 6. Verification Method

To verify these changes after application:
1. **Compilation Check**: Run `npm run build` to confirm zero TS or styling errors.
2. **Visual Inspection**:
   - Navigate to `/editor/demo-project` (or any projectId).
   - Verify that the theme default is `Monochrome Noir`.
   - Verify that all AI status badges, pulses, sub-tab icons, and buttons are high-contrast monochrome.
   - Click on an element in the live preview to open `InlineCustomizer` — verify it renders in dark obsidian glass (`bg-zinc-950/95 border-zinc-800`) with zero pink/slate styling.
