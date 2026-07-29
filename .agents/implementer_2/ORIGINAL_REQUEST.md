## 2026-07-29T12:26:40Z
You are Implementer 2 for the Obsidian Builder / StitchStore AI integration project.
Your working directory is d:\app\.agents\implementer_2 (create this directory if needed, write metadata/reports inside your folder under .agents/implementer_2).
Project root is d:\app.

Your task is to fix the 4 empirical findings reported by Challenger 2:

1. Fix JSX `className` in Liquid templates (`src/lib/shopify.ts`):
   - Replace all `className="..."` attributes in Liquid sections (`sections/hero.liquid`, `sections/featured-products.liquid`, `snippets/product-card.liquid`) with standard HTML `class="..."` so Shopify Liquid engines render Tailwind CSS styles correctly.

2. Add missing Liquid sections (`src/lib/shopify.ts`):
   - In `compileShopifyLiquidTheme` inside `src/lib/shopify.ts`, add `sections/header.liquid` and `sections/footer.liquid` to the `JSZip` output so that theme imports resolving `{% section 'header' %}` and `{% section 'footer' %}` from `layout/theme.liquid` do not throw missing section errors.

3. Sanitize project ID filename (`src/lib/shopify.ts`):
   - Sanitize `projectId` when generating the output filename (e.g. `const safeId = projectId.replace(/[^a-zA-Z0-9_-]/g, "_"); const fileName = `${safeId}-shopify-theme.zip`;`).

4. Sync User Session `projectCount` & Quotas (`src/components/providers/AuthProvider.tsx`, `src/app/page.tsx`, `src/app/builder/page.tsx`):
   - In `AuthProvider.tsx` (or `useAuth`), dynamically sync `user.projectCount` with `insforge_projects` in `localStorage` on mount and project changes.
   - Update project creation handlers in `src/app/page.tsx` and `src/app/builder/page.tsx` to update `projectCount` in session state so Free tier 2-project quota limits are strictly enforced and cannot be bypassed.

5. Build Verification:
   - Run `npm run build` in `d:\app` and verify 0 TypeScript, ESLint, or Next.js errors.

6. Handoff:
   - Write your report in `d:\app\.agents\implementer_2\handoff.md` and send a message to the orchestrator upon completion.

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
