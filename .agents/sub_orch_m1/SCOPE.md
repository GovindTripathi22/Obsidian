# Scope: Milestone 1 - Clerk Authentication & Quota System

## Architecture & Boundaries
- **Auth Layer**: Clerk authentication integration (`@clerk/nextjs` / hybrid fallback auth provider) with dark luxury styling, user profile, Google One-Tap, and session sharing across all routes (`/`, `/projects`, `/billing`, `/editor/[projectId]`, `/builder`, `/shopify`). Offline/CI build safe (no build breakage when Clerk env vars are unset or offline).
- **Unified Project Repository (`src/lib/projects.ts`)**:
  - Unify storage keys (`insforge_projects` vs `obsidian_website_projects`) into a single canonical API (`getProjects()`, `getProjectById()`, `saveProject()`, `deleteProject()`, `createProject()`, etc.).
  - Dispatch `"obsidian:projects-updated"` CustomEvent on `window` upon any create, save, delete, or update operation.
  - Project deletion must immediately reflect in UI and quota meter.
- **Strict 3-Project Free Tier Quota**:
  - Enforce free tier project count <= 3.
  - UI copy across all pages (`Sidebar.tsx`, `billing/page.tsx`, `design-system/page.tsx`, `LandingPageClient.tsx`) must uniformly state "3 Free Projects" (not 4 or unlimited).
  - Initial project seeding in `/projects` must seed 0 or 1 project (never 4 demo projects exceeding limit).
  - Show upgrade modal when free user attempts to create a 4th project.

## Feature Inventory (Milestone 1)
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Clerk Auth Setup | `@clerk/nextjs` & hybrid provider supporting offline build fallback, dark theme, profile dialog, sign in/up | M1 | ORIGINAL_REQUEST |
| 2 | Unified Project Store | `src/lib/projects.ts` unified API, custom event `"obsidian:projects-updated"` | M1 | ORIGINAL_REQUEST / PROJECT.md |
| 3 | Quota System (3-Project Limit) | Max 3 free projects enforcement, quota meter synchronization, upgrade modal | M1 | ORIGINAL_REQUEST / PROJECT.md |
| 4 | UI Copy Harmonization | Harmonize all copy in Sidebar, Billing, Design System, Landing page to "3 Free Projects" | M1 | ORIGINAL_REQUEST / PROJECT.md |
| 5 | Initial Seeding Fix | Ensure default state seeds <= 1 project so user starts with available quota | M1 | ORIGINAL_REQUEST |

## Code Layout Ownership
- `src/lib/projects.ts` - Canonical project repository
- `src/lib/auth.tsx` or `src/components/auth/*` - Auth context, Clerk wrapper, user button/profile modal
- `src/components/Sidebar.tsx` - Sidebar quota indicator & navigation
- `src/app/projects/page.tsx` - Projects dashboard, deletion handler, quota check
- `src/app/billing/page.tsx` - Billing tiers & 3-project plan copy
- `src/app/design-system/page.tsx` - Design system copy
- `src/components/LandingPageClient.tsx` - Landing page copy & CTA
