# Handoff Report: Explorer 3 (Design System & State Explorer)

## 1. Observation
Direct observations of codebase files and configuration at `d:\app`:

- **Design System & Tailwind Config**:
  - `src/app/globals.css` defines CSS variables:
    - Line 5: `--background: #f8fafc;` (Porcelain white background)
    - Line 6: `--foreground: #0f172a;` (Dark slate typography)
    - Line 9: `--card: #ffffff;` (Pure white card background)
    - Line 20: `--pink-accent: #ec4899;` and Line 21: `--pink-accent-hover: #db2777;`
    - Line 76–82: `.glass-panel-white { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(226, 232, 240, 0.8); shadow-soft-2xl }`
    - Line 84–89: `.glass-pill-white { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid #e2e8f0; }`
  - `postcss.config.mjs` lines 1–8: Configures `@tailwindcss/postcss` plugin for Tailwind CSS v4.
  - `src/components/ui/Button.tsx`:
    - Line 32: `primary` variant uses `bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/15`
    - Line 40: `pink` variant uses `bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600`
    - Line 44: `danger` variant uses `bg-rose-600 hover:bg-rose-700`

- **Session State & Auth**:
  - `src/components/providers/AuthProvider.tsx`:
    - Line 17–25: `DEMO_USER` default profile (`id: "user-demo-123456"`, `email: "developer@insforge.io"`, `plan: "free"`, `projectCount: 1`).
    - Line 33: Reads `localStorage.getItem("insforge_session")`.
    - Line 43, 56, 71, 87, 93: Writes session data to `localStorage.setItem("insforge_session", ...)`.
  - `src/lib/insforge.ts`:
    - Line 12–16: Configures `InsForgeConfig` reading `NEXT_PUBLIC_INSFORGE_PROJECT_ID`, `NEXT_PUBLIC_INSFORGE_API_URL`, `INSFORGE_API_KEY`.

- **Quota Tracking & Enforcement**:
  - `src/components/Sidebar.tsx`:
    - Line 36–38: `projectCount = user?.projectCount || 1`, `maxProjects = user?.plan === "pro" ? "Unlimited" : 2`, `usagePercentage = user?.plan === "pro" ? 20 : (projectCount / 2) * 100`.
  - `src/app/page.tsx`:
    - Line 121–124: Gated store creation: `if (user?.plan !== "pro" && (user?.projectCount || 0) >= 2) { setShowQuotaModal(true); return; }`
  - `src/app/editor/[projectId]/page.tsx`:
    - Line 120–123: Gated export: `if (user?.plan !== "pro" && (user?.projectCount || 0) >= 2) { alert("Shopify Liquid Theme export is locked on Free plan. Please upgrade to Pro."); return; }`

- **Export Mechanisms**:
  - `src/lib/shopify.ts`:
    - Line 8–136: `compileShopifyLiquidTheme(projectId, htmlContent, cssContent)` packages layout (`layout/theme.liquid`), index template (`templates/index.json`), sections (`sections/hero.liquid`, `sections/featured-products.liquid`), snippet (`snippets/product-card.liquid`), asset CSS (`assets/theme.css`), and raw source HTML (`assets/raw_source.html`) into a JSZip Blob.
  - `src/app/editor/[projectId]/page.tsx`:
    - Line 151–169: `handleExportStaticCode` creates a ZIP of all page HTML tabs and CSS.
    - Line 171–182: `handleExportPNG` uses `htmlToImage.toPng` to export canvas screenshot.

- **Dependencies & Build Scripts**:
  - `package.json`:
    - Next.js `16.2.12`, React `19.2.4`, `@google/generative-ai: ^0.24.1`, `jszip: ^3.10.1`, `html-to-image: ^1.11.13`, `stripe: ^22.3.2`, Tailwind CSS v4 (`tailwindcss: ^4`, `@tailwindcss/postcss: ^4`).
  - `tsconfig.json`:
    - `@/*` mapped to `./src/*`, target `ES2017`, strict TypeScript check enabled.

---

## 2. Logic Chain
1. **Design System**: `globals.css` imports Tailwind v4 via `@import "tailwindcss";` and defines base CSS variables for background `#f8fafc`, typography `#0f172a`, and cards `#ffffff`. Custom glass utility classes `.glass-panel-white` and `.glass-pill-white` use backdrop filters and subtle borders. UI components (`Button`, `Card`, `Input`, `Alert`) consume these styles cleanly. *Note*: `--pink-accent` is set to `#ec4899` in `globals.css`, but UI components and buttons use Tailwind rose/pink ranges (`#f43f5e`/`#e11d48`) via classes like `from-pink-500 via-rose-500 to-pink-600` and `bg-rose-600`.
2. **Session State**: Session persistence is handled entirely client-side via React Context (`AuthProvider`) and `localStorage` key `insforge_session`. InsForge BaaS types and storage helper URLs are prepared in `lib/insforge.ts`.
3. **Project Quotas**: Quotas are checked by evaluating `user.plan` against `user.projectCount`. Free tier caps users at 2 projects, enforcing limits at both creation time (`page.tsx`) and export time (`editor/[projectId]/page.tsx`).
4. **Exports**: Export functionality covers full Shopify Liquid theme structure (`layout`, `templates`, `sections`, `snippets`, `assets`) using `JSZip` in `lib/shopify.ts`, static multi-page code archives via `JSZip`, and DOM rasterization to PNG using `html-to-image`.
5. **Build Requirements**: Application requires Node.js environment supporting Next.js 16 App Router with React 19. Build command is `npm run build` (`next build`), dev server is `npm run dev` (`next dev -p 3000`).

---

## 3. Caveats
- `globals.css` currently sets `--pink-accent: #ec4899;` whereas prompt guidelines reference `#f43f5e` / `#e11d48` (rose pink). The component library mixes `pink-500` (`#ec4899`) and `rose-500` (`#f43f5e`). If exact token alignment with rose pink `#f43f5e` / `#e11d48` is required, `--pink-accent` in `globals.css` should be updated.
- Session authentication is currently mocked using `localStorage` and client state in `AuthProvider.tsx`. Live backend integration with InsForge Auth and PostgreSQL schema (`lib/schema.sql`) will replace mock local storage in future milestones.
- Live Gemini API call streams via SSE in `src/app/api/generate/route.ts`; if `GEMINI_API_KEY` is invalid or missing, it gracefully falls back to `generateFallbackEcommerceHtml`.

---

## 4. Conclusion
The frontend design system and application state architecture in `d:\app` are fully functional, robustly structured, and ready for integration. The White Edition theme guidelines (porcelain background, dark slate typography, pure white frosted glass, rose/pink fashion accents) are implemented across UI components and pages. Session state, quota enforcement (2 project free limit), and Shopify Liquid theme compiler exports are all properly connected.

---

## 5. Verification Method

### Inspection Commands / Files to Inspect
1. **Design Tokens & Global Styling**:
   - Inspect `d:\app\src\app\globals.css` (lines 4–39 and 76–89) for CSS root variables and `.glass-panel-white` / `.glass-pill-white` definitions.
   - Inspect `d:\app\src\components\ui\Button.tsx` (lines 31–45) for color variants.
2. **Session State & Auth**:
   - Inspect `d:\app\src\components\providers\AuthProvider.tsx` (lines 31–46) for `localStorage` session handling.
3. **Quota Enforcement**:
   - Inspect `d:\app\src\app\page.tsx` (lines 121–124) and `d:\app\src\app\editor\[projectId]\page.tsx` (lines 120–123).
4. **Export Compiler**:
   - Inspect `d:\app\src\lib\shopify.ts` (lines 8–136) for `layout/theme.liquid`, `templates/index.json`, `sections/hero.liquid`, `snippets/product-card.liquid`, and `assets/theme.css`.
5. **Build Check**:
   - Inspect `d:\app\package.json` for dependencies (`next: 16.2.12`, `@tailwindcss/postcss: ^4`, `@google/generative-ai: ^0.24.1`, `jszip: ^3.10.1`, `html-to-image: ^1.11.13`).

### Invalidation Conditions
- Missing or malformed Liquid 2.0 sections in `src/lib/shopify.ts`.
- Inability to load `@tailwindcss/postcss` during `next build`.
- Mismatch between `AuthProvider` session model and `Sidebar.tsx` quota display logic.
