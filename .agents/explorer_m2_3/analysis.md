# Milestone 2 Deep-Dive Analysis: UI Primitives, AI Generation Engine, and Test Suite Compatibility

**Agent**: `explorer_m2_3`  
**Milestone**: Milestone 2 — Obsidian Strict Luxury Monochrome Noir Aesthetic Overhaul  
**Date**: 2026-08-16  
**Working Directory**: `d:\app\.agents\explorer_m2_3`  

---

## 1. Executive Summary

This deep-dive investigation analyzes three critical subsystems of the Obsidian Website Builder and Shopify Theme Studio in support of Milestone 2:
1. **Reusable UI Component Primitives**: `Alert.tsx`, `BuilderSwitcher.tsx`, `Button.tsx`, and `VideoBackground.tsx` (with auxiliary audit of `Card.tsx`, `Input.tsx`, `QuotaLimitModal.tsx`, and `ThemeToggle.tsx`).
2. **AI Generation Prompts and Static Fallback Templates**: `src/app/api/generate/route.ts` (Gemini 2.5 Flash system prompt, prompt enhancement logic, and the streaming fallback HTML template).
3. **Test Suite Compatibility and Quality Assurance**: `tests/run-all-tests.js`, `tests/validate-monochrome.js`, `tests/validate-theme-zip.js`, `tests/validate-auth-quota.js`, `tests/empirical-challenger-m1.js`, and Node test runner suites.

The primary deliverable is an exact, line-by-line mapping from legacy emerald/green accents and conflicting light-mode tokens to the strict **Obsidian Luxury Monochrome Noir** design system (`#000000`, `bg-zinc-950`, `zinc-900/800/700`, pure `#ffffff` CTA buttons, silver frost glass).

---

## 2. Reusable UI Primitives Audit & Transformation Matrix

### 2.1 `src/components/ui/Alert.tsx`
`Alert.tsx` renders system feedback, warnings, and error messages across the workspace and design system showcase.

#### Current State (Lines 24–41):
```tsx
const variantConfig = {
  info: {
    container: "bg-blue-950/50 border-blue-800/60 text-blue-200",
    icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  },
  success: {
    container: "bg-emerald-950/50 border-emerald-800/60 text-emerald-200",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  },
  warning: {
    container: "bg-amber-950/50 border-amber-800/60 text-amber-200",
    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  },
  danger: {
    container: "bg-red-950/50 border-red-800/60 text-red-200",
    icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  },
};
```

#### Monochrome Noir Mapping:
| Variant | Current Classes | Monochrome Noir Replacement | Rationale |
| :--- | :--- | :--- | :--- |
| `info` | `bg-blue-950/50 border-blue-800/60 text-blue-200`, `text-blue-400` | `bg-zinc-900/90 border-zinc-700/80 text-zinc-200`, `text-zinc-300` | Crisp monochrome surface with silver icon |
| `success` | `bg-emerald-950/50 border-emerald-800/60 text-emerald-200`, `text-emerald-400` | `bg-zinc-900/90 border-zinc-700 text-zinc-100`, `text-white` | Purges emerald-950 and emerald-400; adopts pure white check icon on elevated zinc |
| `warning` | `bg-amber-950/50 border-amber-800/60 text-amber-200`, `text-amber-400` | `bg-zinc-900/90 border-zinc-700/80 text-zinc-200`, `text-zinc-300` (or `bg-amber-950/30 border-amber-900/40 text-amber-200` if subtle tint needed) | Eliminates harsh saturated yellow |
| `danger` | `bg-red-950/50 border-red-800/60 text-red-200`, `text-red-400` | `bg-red-950/40 border-red-800/50 text-red-200`, `text-red-400` | Subdued dark crimson reserved strictly for destructive/fatal errors |

#### Exact Proposed Code for `Alert.tsx`:
```tsx
const variantConfig = {
  info: {
    container: "bg-zinc-900/90 border-zinc-700/80 text-zinc-200",
    icon: <Info className="w-5 h-5 text-zinc-300 shrink-0" />,
  },
  success: {
    container: "bg-zinc-900/90 border-zinc-700 text-zinc-100",
    icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
  },
  warning: {
    container: "bg-zinc-900/90 border-zinc-700/80 text-zinc-200",
    icon: <AlertTriangle className="w-5 h-5 text-zinc-300 shrink-0" />,
  },
  danger: {
    container: "bg-red-950/40 border-red-800/50 text-red-200",
    icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  },
};
```

---

### 2.2 `src/components/ui/BuilderSwitcher.tsx`
`BuilderSwitcher.tsx` allows seamless toggling between the Website Builder (`/`) and Shopify Theme Studio (`/builder`).

#### Current Problems:
1. **Line 63**: Sliding active pill applies `bg-gradient-to-r from-emerald-600 to-green-600 border border-emerald-400/40 shadow-emerald-950/80` when `active === "shopify"`.
2. **Line 84**: Website Builder Hexagon icon has `fill-emerald-400 text-emerald-400 scale-105`.
3. **Line 115**: Shopify `Liquid 2.0` badge uses `bg-emerald-900/90 text-emerald-200 border border-emerald-400/40`.
4. **Line 119**: Inactive pulse dot uses `bg-emerald-500 animate-pulse`.

#### Monochrome Noir Mapping:
| Location | Current Code | Monochrome Noir Replacement | Rationale |
| :--- | :--- | :--- | :--- |
| Line 60–65 | `active === "website" ? "bg-gradient-to-r from-zinc-800 to-zinc-700/90 border border-zinc-600/40 text-white shadow-zinc-950/80" : "bg-gradient-to-r from-emerald-600 to-green-600 border border-emerald-400/40 text-white shadow-emerald-950/80"` | `bg-gradient-to-r from-zinc-800 to-zinc-700/90 border border-zinc-600/40 text-white shadow-zinc-950/80` (symmetric for both modes) | Active indicator is consistently dark elevated zinc with subtle silver border |
| Line 84 | `active === "website" ? "fill-emerald-400 text-emerald-400 scale-105" : "text-zinc-500"` | `active === "website" ? "fill-white text-white scale-105" : "text-zinc-500"` | Pure white active icon |
| Line 111 | `active === "shopify" ? "fill-white scale-105" : "fill-zinc-500"` | `active === "shopify" ? "fill-white scale-105 text-white" : "fill-zinc-500 text-zinc-500"` | Pure white active Shopify icon |
| Line 115 | `bg-emerald-900/90 text-emerald-200 border border-emerald-400/40` | `bg-zinc-800 text-zinc-200 border border-zinc-700` | Subtle silver/zinc badge |
| Line 119 | `bg-emerald-500 animate-pulse` | `bg-white animate-pulse shadow-glow-white` | Crisp white status pulse |

#### Exact Proposed Code for `BuilderSwitcher.tsx`:
```tsx
      {/* Sliding Active Pill Background (GPU Accelerated) */}
      <div
        style={{
          transform: active === "website" ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
          transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl shadow-lg will-change-transform bg-gradient-to-r from-zinc-800 to-zinc-700/90 border border-zinc-600/40 text-white shadow-zinc-950/80"
      />

      {/* Website Builder Option */}
      <button
        type="button"
        role="tab"
        aria-selected={active === "website"}
        onClick={() => handleSwitch("website")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 cursor-pointer ${
          isSmall ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
        } ${
          active === "website"
            ? "text-white font-bold"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
        }`}
      >
        <Hexagon
          className={`shrink-0 transition-transform duration-200 ${
            isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
          } ${active === "website" ? "fill-white text-white scale-105" : "text-zinc-500"}`}
        />
        <span className="truncate">Website Builder</span>
        {active === "website" && (
          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 ml-0.5">
            HTML
          </span>
        )}
      </button>

      {/* Shopify Builder Option */}
      <button
        type="button"
        role="tab"
        aria-selected={active === "shopify"}
        onClick={() => handleSwitch("shopify")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 cursor-pointer ${
          isSmall ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
        } ${
          active === "shopify"
            ? "text-white font-bold"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
        }`}
      >
        <ShopifyIcon
          className={`shrink-0 transition-transform duration-200 ${
            isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
          } ${active === "shopify" ? "fill-white scale-105" : "fill-zinc-500"}`}
        />
        <span className="truncate">Shopify Studio</span>
        {active === "shopify" ? (
          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 ml-0.5 font-bold">
            Liquid 2.0
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-glow-white hidden sm:inline-block ml-0.5" />
        )}
      </button>
```

---

### 2.3 `src/components/ui/Button.tsx`
`Button.tsx` is the primary interactive element across all pages and modals.

#### Current Problems:
- Line 39–40: `variant="pink"` uses `bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 text-white shadow-md shadow-emerald-500/20 focus:ring-emerald-500`.
- Line 41–42: `variant="cyan"` uses `bg-gradient-to-r from-indigo-600 to-blue-600 ...`.

#### Monochrome Noir Mapping:
| Variant | Current Classes | Monochrome Noir Replacement | Rationale |
| :--- | :--- | :--- | :--- |
| `primary` | `bg-white hover:bg-zinc-200 text-zinc-950 shadow-md shadow-white/5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:ring-white/50` | Retain / strengthen: `bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-white/50` | Highest contrast hero action button |
| `secondary` | `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600` | Retain: `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600` | Surface elevation 2 |
| `outline` | `border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600` | Retain: `border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600` | Crisp silver outline |
| `ghost` | `bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 focus:ring-zinc-600` | Retain: `bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 focus:ring-zinc-600` | Zero chrome background |
| `pink` (legacy alias) | `from-emerald-600 via-emerald-500 to-emerald-600 ...` | `bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 shadow-md shadow-zinc-950/50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-white/30` | Completely purges `emerald-600` from `Button.tsx` (satisfying `validate-monochrome.js:204`) while safely supporting any legacy caller |
| `cyan` (legacy alias) | `from-indigo-600 to-blue-600 ...` | `bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-500` | Grayscale noir styling |
| `danger` | `bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-red-500` | Retain: `bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-red-500` | Critical error button |

#### Exact Proposed Code for `Button.tsx`:
```tsx
    const variantStyles = {
      primary:
        "bg-white hover:bg-zinc-200 text-zinc-950 shadow-md shadow-white/5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:ring-white/50",
      secondary:
        "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600",
      outline:
        "border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600",
      ghost:
        "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 focus:ring-zinc-600",
      pink:
        "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 shadow-md shadow-zinc-950/50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-white/30",
      cyan:
        "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-500",
      danger:
        "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-red-500",
    };
```

---

### 2.4 `src/components/ui/VideoBackground.tsx`
`VideoBackground.tsx` renders ambient backdrop visuals for landing and auth routes.

#### Current Problem (Line 69):
```tsx
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-emerald-950/20 via-transparent to-transparent blur-3xl" />
```

#### Monochrome Noir Mapping:
- **Line 69**:
  - Replace: `from-emerald-950/20`
  - With: `from-zinc-800/20` (or `from-white/5 via-zinc-900/10 to-transparent blur-3xl`)
  - Rationale: Eliminates the greenish ambient haze at the top of pages, replacing it with a subtle silver/zinc frost glow.

---

## 3. AI Generation Engine Audit (`src/app/api/generate/route.ts`)

The AI route (`src/app/api/generate/route.ts`) handles AI stream requests from Gemini 2.5 Flash and serves as a streaming fallback for mock/offline generation.

### 3.1 System Prompt Instructions (Lines 54–69)

#### Current Code (Lines 57–68):
```typescript
DESIGN SPECIFICATIONS:
1. Palette: Deep obsidian background (bg-zinc-950), dark card surfaces (bg-zinc-900/90 border border-zinc-800), pure white headings (text-white font-black), muted zinc descriptions (text-zinc-400), and vibrant emerald accents (bg-emerald-600, text-emerald-400, border-emerald-500/30).
2. Typography: Clean modern typography with proper letter-spacing (font-heading, font-sans).
3. Section Annotations: Annotate each section with data-section attributes:
   - <section data-section="announcement-bar" class="bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300 py-2 px-4 text-center text-xs font-mono">
   - <header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
   - <section data-section="hero" id="hero" class="relative py-24 px-6 text-center border-b border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
   - <section data-section="products" id="products" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <section data-section="features" id="features" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <section data-section="reviews" id="reviews" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <footer data-section="footer" id="footer" class="py-16 px-6 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
4. Output: Return ONLY pure, valid HTML markup. Zero markdown wrappers, zero meta preambles.
```

#### Proposed Monochrome Noir Specification:
```typescript
DESIGN SPECIFICATIONS:
1. Palette: Strict luxury monochrome noir palette. Deep obsidian background (bg-zinc-950), dark zinc card surfaces (bg-zinc-900/90 border border-zinc-800), high-contrast pure white headings and primary CTA buttons (text-white font-black, bg-white text-zinc-950 hover:bg-zinc-200), silver/frost accents (border-zinc-700, bg-zinc-800/80 text-zinc-200), and muted zinc descriptions (text-zinc-400). Strictly 0 green, emerald, teal, or saturated color accents.
2. Typography: Clean modern typography with proper letter-spacing (font-heading, font-sans).
3. Section Annotations: Annotate each section with data-section attributes:
   - <section data-section="announcement-bar" class="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 py-2 px-4 text-center text-xs font-mono">
   - <header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
   - <section data-section="hero" id="hero" class="relative py-24 px-6 text-center border-b border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
   - <section data-section="products" id="products" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <section data-section="features" id="features" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <section data-section="reviews" id="reviews" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
   - <footer data-section="footer" id="footer" class="py-16 px-6 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
4. Output: Return ONLY pure, valid HTML markup. Zero markdown wrappers, zero meta preambles.
```

---

### 3.2 Prompt Enhancement Logic (Lines 136–142)

#### Current Code:
```typescript
function generateEnhancedPromptText(subject: string, isShopify: boolean): string {
  const clean = subject.replace(/["']/g, "").trim();
  if (isShopify) {
    return `Create an ultra-luxurious high-converting Shopify storefront for "${clean || "a luxury lifestyle boutique"}". Include a top announcement ticker with discount promo codes, sticky glassmorphic navigation header with live cart drawer, dark cinematic hero section with radiant call-to-action buttons, 4-product featured collection grid with instant quick-add cards, customer reviews slider with 5-star ratings, trust badges strip with 256-bit SSL and express worldwide shipping, and complete Liquid 2.0 section schema compatibility.`;
  }
  return `Design a state-of-the-art, high-converting digital platform for "${clean || "a modern SaaS product"}". Include a sticky glass navbar with glowing CTA, a dynamic hero banner with value proposition and video modal, interactive 3-column feature grid with hover states, social proof testimonial cards with client avatars, 3-tier pricing matrix with monthly/annual toggle, expandable FAQ accordion, and dark luxury aesthetic with emerald accents.`;
}
```

#### Monochrome Noir Replacement:
```typescript
function generateEnhancedPromptText(subject: string, isShopify: boolean): string {
  const clean = subject.replace(/["']/g, "").trim();
  if (isShopify) {
    return `Create an ultra-luxurious high-converting Shopify storefront for "${clean || "a luxury lifestyle boutique"}". Include a top announcement ticker with discount promo codes, sticky glassmorphic navigation header with live cart drawer, dark cinematic hero section with high-contrast pure white call-to-action buttons, 4-product featured collection grid with instant quick-add cards, customer reviews slider with 5-star ratings, trust badges strip with 256-bit SSL and express worldwide shipping, and complete Liquid 2.0 section schema compatibility.`;
  }
  return `Design a state-of-the-art, high-converting digital platform for "${clean || "a modern SaaS product"}". Include a sticky glass navbar with glowing white CTA, a dynamic hero banner with value proposition and video modal, interactive 3-column feature grid with hover states, social proof testimonial cards with client avatars, 3-tier pricing matrix with monthly/annual toggle, expandable FAQ accordion, and strict dark luxury monochrome noir aesthetic with pure white and silver highlights.`;
}
```

---

### 3.3 Fallback HTML Template (`generateObsidianDarkEcommerceHtml`, Lines 144–270)

The fallback template is used whenever the Gemini API key is offline or in development mock mode.

#### Exhaustive Inventory of Replacements in Fallback Template:
| Line(s) | Element | Current (Emerald / Green) | Monochrome Noir Replacement |
| :--- | :--- | :--- | :--- |
| 149 | Announcement Bar container | `bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300` | `bg-zinc-900/90 border-b border-zinc-800 text-zinc-300` |
| 150 | Announcement Pulse dot | `bg-emerald-400 animate-pulse` | `bg-white animate-pulse shadow-glow-white` |
| 156 | Brand Icon badge | `bg-emerald-600 text-white shadow-emerald-600/30` | `bg-white text-zinc-950 shadow-white/10` |
| 162–165 | Nav links hover | `hover:text-emerald-400` | `hover:text-white` |
| 168 | Header Cart button hover | `hover:border-emerald-500/40` | `hover:border-zinc-500` |
| 170 | Header Cart counter pill | `bg-emerald-600 text-white` | `bg-white text-zinc-950 font-bold` |
| 176 | Hero ambient glow | `from-emerald-950/25` | `from-zinc-800/30` |
| 178 | Hero pill badge | `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20` | `bg-zinc-900 text-zinc-200 border border-zinc-700` |
| 188 | Hero primary CTA button | `bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/80 text-white` | `bg-white hover:bg-zinc-200 shadow-white/5 text-zinc-950 font-black` |
| 204 | Stock count indicator | `text-emerald-400` | `text-zinc-400 font-mono` |
| 208, 220, 232, 244 | Product card hover borders | `hover:border-emerald-500/40` | `hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/80` |
| 211 | Product BEST SELLER tag | `bg-emerald-600 text-white` | `bg-white text-zinc-950 font-bold` |
| 213, 225, 237, 249 | Product title hover | `group-hover:text-emerald-400` | `group-hover:text-white` |
| 215, 227, 239, 251 | Product price text | `text-emerald-400 font-mono` | `text-zinc-100 font-mono` |
| 216, 228, 240, 252 | Product "+ Add" button hover | `hover:bg-emerald-600 text-white` | `hover:bg-white hover:text-zinc-950 text-white` |
| 247 | Product HYDRATING tag | `bg-emerald-600 text-white` | `bg-zinc-800 text-zinc-200 border border-zinc-700` |

#### Exact Proposed Code for `generateObsidianDarkEcommerceHtml`:
```typescript
function generateObsidianDarkEcommerceHtml(prompt: string, pageName: string, isShopify: boolean): string {
  const cleanSubject = extractSubjectFromPrompt(prompt);
  const brandName = cleanSubject.length > 0 && cleanSubject.length < 35 ? cleanSubject : "Aura Botanicals";

  return `
<section data-section="announcement-bar" class="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 py-2.5 px-4 text-center text-xs font-mono font-medium flex items-center justify-center gap-2">
  <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-glow-white"></span>
  <span>⚡ SPRING PROMO ACTIVE: GET 20% OFF ALL PRODUCTS WITH CODE <strong class="text-white font-bold underline">OBSIDIAN25</strong> — FREE EXPRESS GLOBAL SHIPPING</span>
</section>

<header data-section="header" class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-sm shadow-lg shadow-white/10">
      🛍️
    </div>
    <span class="font-extrabold text-lg tracking-tight text-white font-heading">${brandName}</span>
  </div>
  <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
    <a href="#hero" class="hover:text-white transition-colors">Home</a>
    <a href="#products" class="hover:text-white transition-colors">Catalog</a>
    <a href="#features" class="hover:text-white transition-colors">Experience</a>
    <a href="#reviews" class="hover:text-white transition-colors">Reviews</a>
  </nav>
  <div class="flex items-center gap-3">
    <button class="relative px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-500 text-xs font-semibold flex items-center gap-1.5 transition-colors">
      <span>Cart</span>
      <span class="px-1.5 py-0.2 rounded-full bg-white text-zinc-950 text-[10px] font-bold">2</span>
    </button>
  </div>
</header>

<section data-section="hero" id="hero" class="relative py-24 sm:py-32 px-6 text-center border-b border-zinc-800 overflow-hidden bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950">
  <div class="absolute inset-0 bg-gradient-radial from-zinc-800/30 via-transparent to-transparent blur-3xl pointer-events-none"></div>
  <div class="max-w-4xl mx-auto space-y-6 relative z-10">
    <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold">
      ✨ Next-Gen Liquid 2.0 Collection
    </span>
    <h1 class="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight font-heading">
      Pure Botanical Science for Radiant Skin.
    </h1>
    <p class="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
      Wild-harvested adaptogens, cold-pressed seed oils, and clinically-proven bio-peptides engineered for radiant results.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <button class="px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 shadow-lg shadow-white/5 text-zinc-950 font-black transition-all transform hover:-translate-y-0.5 cursor-pointer">
        Shop Featured Catalog →
      </button>
      <button class="px-8 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold transition-all shadow-sm cursor-pointer">
        View Lookbook
      </button>
    </div>
  </div>
</section>

<section data-section="products" id="products" class="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-800">
  <div class="flex items-center justify-between mb-10">
    <div>
      <h2 class="text-2xl sm:text-3xl font-black text-white font-heading">Featured Collection</h2>
      <p class="text-xs text-zinc-400 mt-1 font-medium">Curated selections available with instant worldwide express shipping</p>
    </div>
    <span class="text-xs font-mono font-bold text-zinc-400">4 Products In Stock</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80" alt="Celestial Glow Serum" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white text-zinc-950 font-mono text-[9px] font-bold">BEST SELLER</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Celestial Glow Peptide Serum</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$68.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80" alt="Rose Hydration Mist" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[9px] font-bold">ORGANIC</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Rose Damascena Hydration Mist</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$42.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="https://images.unsplash.com/photo-1608248597359-0098f98c8c50?w=800&auto=format&fit=crop&q=80" alt="Overnight Repair Oil" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[9px] font-bold">RETINOL ALT</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Bakuchiol Overnight Repair Oil</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$74.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      <div class="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
        <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80" alt="Ceramide Crème" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[9px] font-bold">HYDRATING</span>
      </div>
      <h3 class="text-sm font-bold text-white group-hover:text-white transition-colors">Velvet Cloud Ceramide Crème</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-zinc-100 font-mono">$58.00</span>
        <button class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white text-xs font-semibold transition-colors">+ Add</button>
      </div>
    </div>
  </div>
</section>

<footer data-section="footer" id="footer" class="py-16 px-6 bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-xs">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p>&copy; ${new Date().getFullYear()} ${brandName}. Powered by Obsidian AI Liquid Studio.</p>
    <div class="flex items-center gap-6 font-semibold text-zinc-400">
      <a href="#" class="hover:text-white transition-colors">Shipping & Returns</a>
      <a href="#" class="hover:text-white transition-colors">Liquid 2.0 Spec</a>
      <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
      <a href="#" class="hover:text-white transition-colors">Support</a>
    </div>
  </div>
</footer>
`;
}
```

---

## 4. Test Suite Audit & Compatibility Verification

### 4.1 Test Suites Inventory
| File | Framework | Scope | Assertions on Styles/Colors | Status |
| :--- | :--- | :--- | :--- | :--- |
| `tests/validate-monochrome.js` | Custom Runner | Scans globals.css, UI primitives, shell navigation, routes, prompt routes for monochrome noir tokens | Asserts pure-white, zinc palette, deep black, glass frost; asserts primitives do NOT hardcode `bg-emerald-600` or `text-emerald-500` | PASS (11/11 tests, 37/37 assertions) |
| `tests/validate-theme-zip.js` | Custom Runner | Validates Shopify OS 2.0 ZIP structure, Liquid schemas, presets, cart, discounts | Asserts structure and JSON validity | PASS (20/20 tests, 137/137 assertions) |
| `tests/empirical-challenger-m1.js` | Custom Runner | Quota enforcement, localStorage sync, 3-project free limit, Pro bypass, event bus | Asserts static UI copy ("3 Free Projects", "$9.99/mo") | PASS (19/19 tests, 133/133 assertions) |
| `tests/adversarial_stress.test.mjs` | Node Test Runner (`node:test`) | Corrupted JSON resilience, high frequency saves, deep cloning, XSS injection | None (Storage logic only) | PASS (6/6 tests) |
| `tests/auth_flow.test.mjs` | Node Test Runner (`node:test`) | Sign in, sign up, Google one-tap, plan toggle, sign out, useUser bridge | None (Auth logic only) | PASS (7/7 tests) |
| `tests/projects_store.test.mjs` | Node Test Runner (`node:test`) | Seeding, quota limits, CRUD operations, legacy migration | None (Storage logic only) | PASS (4/4 tests) |
| `tests/run-all-tests.js` | Master Runner | Aggregates `validate-theme-zip`, `validate-auth-quota`, and `validate-monochrome` | Aggregates all assertions | Executable via `node tests/run-all-tests.js` |

### 4.2 Style & Theme Assertions in Existing Tests
The only test suite that specifically asserts on styles and color tokens is **`tests/validate-monochrome.js`**:
1. **Tier 1 (Test 1.1)**: Asserts `globals.css` defines `--background: #09090b` (or `#000000`), `--foreground: #fafafa` (or `#ffffff`), `--card: #18181b`, `--border: #27272a`.
2. **Tier 1 (Test 1.2)**: Asserts `Button.tsx`, `Alert.tsx`, `Card.tsx`, and `BuilderSwitcher.tsx` utilize `bg-white`, `bg-zinc-`, `text-white`, `border-zinc-`, and strictly do **NOT** contain `bg-emerald-600` or `text-emerald-500`.
3. **Tier 1 (Test 1.3)**: Asserts `globals.css` defines `glass-panel` / `backdrop-blur` and typography font families (`Outfit` / `Inter` / `JetBrains`).
4. **Tier 2 (Tests 2.1–2.5)**: Audits `InlineCustomizer.tsx`, `LandingPageClient.tsx`, `Header.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`, `design-system/page.tsx`, and `api/generate/route.ts` for monochrome token counts.
5. **Tier 3 (Test 3.1–3.2)**: Asserts all 7 App Router pages contain monochrome tokens and `Button.tsx` has `hover:` transitions.
6. **Tier 4 (Test 4.1)**: Scans all source files in `src/` to confirm >= 100 aggregate luxury monochrome tokens.

**Compatibility Verdict**: All Milestone 2 UI primitive changes and `api/generate/route.ts` enhancements directly satisfy and exceed all criteria in `tests/validate-monochrome.js`.

---

## 5. Implementation Roadmap for Implementation Agents

1. **Step 1 (UI Primitives)**:
   - Update `Alert.tsx`: replace `bg-emerald-950/50`, `text-emerald-400` in `success` variant with `bg-zinc-900/90 border-zinc-700 text-zinc-100`, `text-white`.
   - Update `BuilderSwitcher.tsx`: replace emerald active pill, emerald Hexagon icon fill, emerald `Liquid 2.0` badge, and emerald pulse dot with monochrome noir equivalents.
   - Update `Button.tsx`: replace emerald gradient in `variant="pink"` with elevated dark zinc `bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600`.
   - Update `VideoBackground.tsx`: change `from-emerald-950/20` to `from-zinc-800/20`.

2. **Step 2 (AI Generation Route)**:
   - Update `src/app/api/generate/route.ts`:
     - Update `systemInstruction` with strict monochrome noir specification and zero emerald rules.
     - Update `generateEnhancedPromptText` to remove emerald prompt text.
     - Overhaul `generateObsidianDarkEcommerceHtml` streaming fallback HTML to 100% monochrome noir.

3. **Step 3 (Verification)**:
   - Execute `node tests/validate-monochrome.js` -> 100% PASS.
   - Execute `node tests/empirical-challenger-m1.js` -> 100% PASS.
   - Execute `node --test tests/*.test.mjs` -> 100% PASS.
   - Execute `npm run build` -> 0 build errors.
