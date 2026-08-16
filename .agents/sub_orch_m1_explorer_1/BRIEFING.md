# BRIEFING — 2026-08-16T13:54:00Z

## Mission
Investigate Auth state, Clerk integration requirements, and design a seamless dual-mode (Clerk + offline mock fallback) auth architecture for Milestone 1.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: d:\app\.agents\sub_orch_m1_explorer_1
- Original parent: 8809c5c1-094e-4025-97db-7718b87f13c7
- Milestone: Milestone 1 - Clerk Auth Integration & Offline Dual Mode

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or edit source code directly
- Must support dual mode: Real Clerk when keys are provided; offline mock luxury auth when keys are absent or during CI build
- Zero build failures on `npm run build`
- Deliver detailed findings, file changes, component interfaces, hooks, and handoff report

## Current Parent
- Conversation ID: 8809c5c1-094e-4025-97db-7718b87f13c7
- Updated: 2026-08-16T13:54:00Z

## Investigation State
- **Explored paths**:
  - `package.json`: verified absence of `@clerk/nextjs`
  - `src/app/layout.tsx`: inspected provider hierarchy
  - `src/components/providers/AuthProvider.tsx`: analyzed state and storage logic
  - `src/components/Header.tsx`, `SiteHeader.tsx`, `Sidebar.tsx`: analyzed user button and quota meter
  - `src/app/projects/page.tsx`: analyzed initial mock seeding (4 projects bug) and deletion logic
  - `src/app/billing/page.tsx`, `design-system/page.tsx`: identified quota copy discrepancies (2 vs 3)
  - `src/app/builder/page.tsx`, `LandingPageClient.tsx`, `editor/[projectId]/page.tsx`: analyzed project creation and quota guards
- **Key findings**:
  - Dual-mode wrapper is required to prevent SSR static generation errors when Clerk keys are missing.
  - Canonical `src/lib/projects.ts` needed with custom event `"obsidian:projects-updated"` for real-time quota sync.
  - Initial project seeding in `/projects` must be reduced to 1 project to stay within the 3-project limit.
  - All copy must be harmonized to "3 Free Projects".
- **Unexplored areas**: None for M1 auth investigation scope.

## Key Decisions Made
- Designed dual-mode provider architecture with unified `useAuth()` and `useUser()` hooks.
- Designed luxury dark modal components (`UserButton`, `AuthModals`, `GoogleOneTap`).
- Created complete implementation roadmap and interface contracts in `handoff.md`.

## Artifact Index
- `DISPATCH.md` — Dispatch instructions
- `progress.md` — Liveness & step progress
- `handoff.md` — Final investigation report
