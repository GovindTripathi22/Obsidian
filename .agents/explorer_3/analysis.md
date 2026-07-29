# Detailed Analysis Report: Design System, Session State & Export Mechanisms

## Summary of Core Findings
The Obsidian Builder / StitchStore AI integration codebase (`d:\app`) is a Next.js 16 (React 19) application styled with Tailwind CSS v4. It features a pristine white design system ("White Edition"), mock client-side session state management (`AuthProvider` backed by `localStorage`), gated project quota tracking (Free tier limit of 2 projects vs. Unlimited Pro tier), and three distinct export mechanisms (Shopify Liquid Theme `.zip`, Static Code `.zip`, and PNG mockup image).

---

## 1. White Stitch Design System Analysis

### CSS Variable & Theme Tokens (`src/app/globals.css`, lines 4–39)
The design system defines the following theme tokens in `globals.css`:
- **Porcelain Background (`--background`)**: `#f8fafc` (`src/app/globals.css:5`)
- **Dark Slate Typography (`--foreground`, `--primary`)**: `#0f172a` (`src/app/globals.css:6,14`)
- **Pure White Cards & Frosted Glass (`--card`, `--input-bg`)**: `#ffffff` (`src/app/globals.css:9,33`)
- **Card Border (`--card-border`, `--border`)**: `#e2e8f0` (`src/app/globals.css:11,32`)
- **Muted Elements (`--muted`, `--muted-foreground`)**: `#f1f5f9`, `#64748b` (`src/app/globals.css:30,31`)
- **Pink Fashion Accent (`--pink-accent`)**: `#ec4899` (`src/app/globals.css:20`). *Note discrepancy*: The prompt guidelines specify rose pink accents `#f43f5e` / `#e11d48`, whereas `globals.css` currently sets `--pink-accent: #ec4899;` and `--pink-accent-hover: #db2777;`. However, component files (such as `Button.tsx:40` and `Input.tsx:52`) utilize Tailwind classes `from-pink-500 via-rose-500 to-pink-600` and `rose-500`/`rose-600` (`#f43f5e`/`#e11d48`).

### Frosted Glass & 3D Utility Classes (`src/app/globals.css`, lines 67–143)
- `.glass-panel-white`: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.07)` (`src/app/globals.css:76–82`).
- `.glass-pill-white`: `background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid #e2e8f0;` (`src/app/globals.css:84–89`).
- `.perspective-1000`, `.preserve-3d`: 3D transform support for interactive card tilt (`src/app/globals.css:68–74`).
- Animation Utilities: `@keyframes shimmerLight`, `animate-shimmer`, `animate-float`, `animate-float-reverse` (`src/app/globals.css:92–134`).

### Tailwind Setup & Integration (`package.json`, `postcss.config.mjs`)
- `package.json:23,29`: Tailwind CSS v4 (`tailwindcss: "^4"`, `@tailwindcss/postcss: "^4"`).
- `postcss.config.mjs:1–8`: Uses `@tailwindcss/postcss` plugin.
- `src/app/globals.css:1`: Imports `@import "tailwindcss";` directly (CSS-native configuration, no `tailwind.config.js`).

### UI Component Library (`src/components/ui/`)
1. **Button (`src/components/ui/Button.tsx`)**:
   - Supports 7 variants: `primary` (Slate-900), `secondary` (White), `outline`, `ghost`, `pink` (gradient `from-pink-500 via-rose-500 to-pink-600`), `cyan` (`indigo-600 to blue-600`), `danger` (`rose-600`).
   - Supports 4 sizes: `sm`, `md`, `lg`, `icon`.
   - Includes loading state spinner (`Loader2`).
2. **Card (`src/components/ui/Card.tsx`)**:
   - Supports `glass` backdrop blur (`bg-white/80 backdrop-blur-md`) and `hoverable` lift animation (`hover:-translate-y-1 hover:shadow-xl`).
3. **Input (`src/components/ui/Input.tsx`)**:
   - Rounded-xl input with left/right icon slots, focus states (`focus:border-slate-900`), and error states (`border-rose-500`).
4. **Alert (`src/components/ui/Alert.tsx`)**:
   - Variants for `info`, `success`, `warning`, and `danger` (`bg-rose-50/80 border-rose-200 text-rose-900`).

---

## 2. Session State Management, Quotas & Exports

### User Session State Management (`src/components/providers/AuthProvider.tsx`)
- **Context Provider**: React Context (`AuthProvider`, `useAuth()`) wraps the application in `src/app/layout.tsx:20–28`.
- **Persistence Layer**: Reads and writes session state to `localStorage` under key `"insforge_session"` (`AuthProvider.tsx:33,43,56,71,87,93`).
- **Default State**: Automatically initializes to `DEMO_USER` (`email: "developer@insforge.io"`, `plan: "free"`, `projectCount: 1`) if no session is stored (`AuthProvider.tsx:17–25,41–44`).
- **Google Sign-In Mock**: Sets user plan to `"pro"` with `projectCount: 3` (`AuthProvider.tsx:75–89`).
- **InsForge BaaS Client**: `src/lib/insforge.ts` configures `InsForgeClient` using `NEXT_PUBLIC_INSFORGE_PROJECT_ID`, `NEXT_PUBLIC_INSFORGE_API_URL`, and `INSFORGE_API_KEY`.

### Project Quota Tracking & Enforcement
- **Quota Rules**:
  - Free Plan: Maximum 2 projects allowed (`Sidebar.tsx:87–89`, `BillingPage:42`, `page.tsx:121`).
  - Pro Plan: Unlimited projects (`plan === "pro"`).
- **Enforcement Points**:
  - **Sidebar Progress Indicator (`Sidebar.tsx:82–107`)**: Renders project count (`projectCount/2` or `Unlimited`) and usage percentage progress bar.
  - **Store Creation Gate (`src/app/page.tsx:121–124`)**: Checks `user.plan !== "pro" && (user.projectCount || 0) >= 2`. If exceeded, pops `showQuotaModal` directing user to `/billing`.
  - **Export Gate (`src/app/editor/[projectId]/page.tsx:120–123`)**: Checks `user.plan !== "pro" && (user.projectCount || 0) >= 2`. Blocks export with an alert message.

### Export Mechanisms Across the App
1. **Shopify Liquid Theme Compiler (`src/lib/shopify.ts:8–136`)**:
   - Invoked via `compileShopifyLiquidTheme(projectId, htmlContent, cssContent)` in `src/app/editor/[projectId]/page.tsx:140`.
   - Uses `JSZip` to generate a structured Shopify theme archive (`${projectId}-shopify-theme.zip`):
     - `layout/theme.liquid`: Master layout with Tailwind CDN script and asset stylesheet tags (`shopify.ts:16–34`).
     - `templates/index.json`: Template definition ordering sections (`hero`, `featured_products`) (`shopify.ts:39–50`).
     - `sections/hero.liquid`: Shopify liquid hero banner with Schema settings (`shopify.ts:53–79`).
     - `sections/featured-products.liquid`: Liquid featured products section with product card loop (`shopify.ts:81–103`).
     - `snippets/product-card.liquid`: Reusable product card liquid snippet (`shopify.ts:109–117`).
     - `assets/theme.css`: Compiled CSS stylesheet (`shopify.ts:122–126`).
     - `assets/raw_source.html`: Raw HTML backup (`shopify.ts:129`).
2. **Static Code ZIP Export (`src/app/editor/[projectId]/page.tsx:151–169`)**:
   - Uses `JSZip` to bundle all created page tabs (`home_page.html`, `product_page.html`, `cart_page.html`) along with `style.css`.
3. **PNG Mockup Export (`src/app/editor/[projectId]/page.tsx:171–182`)**:
   - Uses `html-to-image` (`htmlToImage.toPng`) to capture the iframe container as a PNG image file (`${projectId}-mockup.png`).

---

## 3. Build Requirements & Dependency Analysis

### Environment & Tools (`package.json`, `tsconfig.json`, `next.config.ts`)
- **Package Manager / Scripts (`package.json:5–10`)**:
  - `dev`: `next dev -p 3000`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `eslint`
- **Core Dependencies (`package.json:11–21`)**:
  - `next`: `16.2.12`
  - `react`: `19.2.4` & `react-dom`: `19.2.4`
  - `@google/generative-ai`: `^0.24.1` (Gemini API streaming in `src/app/api/generate/route.ts`)
  - `jszip`: `^3.10.1` & `@types/jszip`: `^3.4.0` (Client-side ZIP archiving)
  - `html-to-image`: `^1.11.13` (DOM to canvas/PNG capture)
  - `lucide-react`: `^1.27.0` (Icons)
  - `stripe`: `^22.3.2` (Stripe monetization API SDK)
- **Dev Dependencies (`package.json:22–31`)**:
  - `tailwindcss`: `^4` & `@tailwindcss/postcss`: `^4`
  - `typescript`: `^5` (Target: `ES2017`, Module: `esnext`, Resolution: `bundler`)
  - `eslint`: `^9`, `eslint-config-next`: `16.2.12`
- **TypeScript & Path Aliases (`tsconfig.json:21–23`)**:
  - Path mapping `@/* -> ./src/*`.
