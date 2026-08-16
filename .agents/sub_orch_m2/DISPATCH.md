## 2026-08-16T14:09:32Z
You are the Sub-Orchestrator for Milestone 2: Obsidian Strict Luxury Monochrome Noir Aesthetic Overhaul.
Your working directory is d:\app\.agents\sub_orch_m2 (write only here for your metadata/reports).
The workspace root is d:\app.
Your parent is 6e73f93c-f740-4d39-b525-5252e53283f4.

Scope & Mission:
Complete removal of ALL green/emerald/teal/lime accents, badges, glows, borders, and variables across the entire Obsidian Website Builder and workspace editor, replacing them with a strict luxury monochrome noir aesthetic (pure white #ffffff, zinc highlights, deep black #000000 / bg-zinc-950, silver/frost glass accents).

Read:
- d:\app\ORIGINAL_REQUEST.md (Requirement 2)
- d:\app\PROJECT.md
- d:\app\.agents\explorer_survey_2\analysis.md (contains exact file-by-file replacement matrix)
- d:\app\.agents\explorer_survey_2\handoff.md

Core Deliverables:
1. `src/app/globals.css` & `src/app/layout.tsx`:
   - Replace `--accent: #10b981`, `--accent-shopify: #008060`, `--accent-hover: #059669`, `--accent-glow`, `--success` with monochrome tokens (`#ffffff`, zinc-400, pure white glows, silver frost borders).
   - Replace emerald selection highlights in `layout.tsx`.
2. `src/app/editor/[projectId]/page.tsx` & `src/components/editor/InlineCustomizer.tsx`:
   - Set "Monochrome Noir" as default theme `COLOR_THEMES[0]`, accompanied by metallic swatches (Silver Frost, Titanium Slate, Obsidian Carbon).
   - Overhaul `InlineCustomizer.tsx` from light mode (`bg-white border-slate-300`, `text-pink-600`, `variant="pink"`) to dark luxury zinc-950 glass (`bg-zinc-950/95 border-zinc-800 backdrop-blur-xl shadow-2xl`) and pure white buttons.
   - Replace AI streaming pulses, assistant badges, code viewer syntax styling, and export modals with high-contrast monochrome noir.
3. `LandingPageClient.tsx`, `Header.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`:
   - Convert all emerald logos, active dots, quota bars, prompt glows, and action buttons to pure white and zinc highlights.
4. `projects/page.tsx`, `billing/page.tsx`, `design-system/page.tsx`, `inspiration/page.tsx`, `sign-in/page.tsx`, `sign-up/page.tsx`:
   - Replace all emerald badges, focus rings, plan highlight rings, and submit buttons with monochrome noir.
5. UI Primitives (`Alert.tsx`, `BuilderSwitcher.tsx`, `Button.tsx`, `VideoBackground.tsx`):
   - Replace emerald variants with pure white and zinc styles.
6. `src/app/api/generate/route.ts`:
   - Update Gemini system instructions and fallback HTML from emerald classes to strict luxury monochrome noir.
7. Iteration Loop:
   - Worker implementation with mandatory integrity warning.
   - Reviewer, Challenger, and Forensic Auditor verification.
   - Verification: `node tests/run-all-tests.js` passes 100%, `npm run build` exits 0 with 0 errors.

When complete, write handoff.md in your working directory and notify parent via send_message.
