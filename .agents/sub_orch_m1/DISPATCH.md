## 2026-08-16T13:51:07Z

You are the Sub-Orchestrator for Milestone 1: Clerk Authentication & Quota System.
Your working directory is d:\app\.agents\sub_orch_m1 (write only here for your metadata/reports).
The workspace root is d:\app.
Your parent is 6e73f93c-f740-4d39-b525-5252e53283f4.

Scope & Mission:
Implement complete Clerk Authentication Integration & Shared Session/Quota Management across both Obsidian Website Builder and Shopify Theme Studio.
Read d:\app\ORIGINAL_REQUEST.md, d:\app\PROJECT.md, and d:\app\.agents\explorer_survey_1\handoff.md.

Core Deliverables:
1. Clerk Auth Integration:
   - Configure Clerk authentication support (install `@clerk/nextjs` or ensure safe dual mode: robust fallback hybrid auth with dark luxury Clerk UI styling, Google One-Tap, and email sign-in).
   - Ensure build succeeds cleanly without requiring live network calls in CI/CD / offline builds.
   - Provide user profile dialog, sign-in, sign-up, and shared session across `/`, `/projects`, `/billing`, `/editor/[projectId]`, `/builder`, `/shopify`.
2. Unified Project Repository (`src/lib/projects.ts`):
   - Unify `"insforge_projects"` and `"obsidian_website_projects"` into a clean repository matching interface contracts in PROJECT.md.
   - Implement `"obsidian:projects-updated"` custom event dispatching on save/delete/update so all tabs and components refresh in real-time.
   - Fix project deletion in `/projects` to immediately trigger quota meter refresh.
3. Strict 3-Project Free Limit:
   - Harmonize all UI copy across `Sidebar.tsx`, `billing/page.tsx`, `design-system/page.tsx`, and `LandingPageClient.tsx` to "3 Free Projects".
   - Fix initial seeding in `/projects` (seed 0 or 1 project, never 4).
   - Enforce quota guard on creating 4th project for free users with upgrade modal.
4. Execute Iteration Loop:
   - Worker implementation with mandatory integrity warnings.
   - Reviewer, Challenger, and Forensic Auditor verification.
   - Pass build and tests (`npm run build`).

When complete, write handoff.md in your working directory and notify parent via send_message.
