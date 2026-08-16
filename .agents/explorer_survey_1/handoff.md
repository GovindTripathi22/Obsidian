# Handoff Report: Authentication, Session Management, & 3-Project Quota Survey

**Agent**: Survey Explorer 1  
**Working Directory**: `d:\app\.agents\explorer_survey_1`  
**Handoff Type**: Hard (Investigation & Architectural Survey Complete)  
**Target File**: `d:\app\.agents\explorer_survey_1\handoff.md`  

---

## 1. Observation

1. **Package Dependencies (`package.json`)**:
   - `package.json` contains `next: 16.2.12`, `react: 19.2.4`, `react-dom: 19.2.4`, `tailwindcss: ^4`, `@google/generative-ai: ^0.24.1`, `stripe: ^22.3.2`.
   - `@clerk/nextjs` is **not installed** in `dependencies`.

2. **Environment Variables**:
   - There are no `.env`, `.env.local`, or `.env.example` files present in the root directory `d:\app`.

3. **Layout & Provider Architecture (`src/app/layout.tsx`)**:
   - Lines 20–22: Wraps `<AuthProvider><RootLayoutContent>{children}</RootLayoutContent></AuthProvider>`.
   - Line 19: Contains `selection:bg-emerald-900/40 selection:text-white` (green accent).
   - No `<ClerkProvider>` is present.

4. **Middleware (`middleware.ts`)**:
   - No `middleware.ts` exists in `src/` or `d:\app`. Server-side route protection is absent.

5. **Existing Auth Provider (`src/components/providers/AuthProvider.tsx`)**:
   - Lines 26–34: Hardcoded `DEFAULT_USER` with `id: "user-obsidian-prime"`, `email: "developer@obsidian.ai"`, `plan: "free"`, `projectCount: 1`.
   - Lines 88–108: Auto-logins with `DEFAULT_USER` on mount if localStorage is empty.
   - Lines 42–61: Counts projects by separately parsing `localStorage.getItem("insforge_projects")` and `localStorage.getItem("obsidian_website_projects")`.
   - Lines 110–121: `storage` event listener only triggers for cross-window/cross-tab events.

6. **Projects Workspace (`src/app/projects/page.tsx`)**:
   - Lines 29–95: If `localStorage` is empty, it seeds 2 Shopify projects (`DEFAULT_SHOPIFY_MOCKS`) and 2 Website projects (`DEFAULT_WEBSITE_MOCKS`), totalling **4 projects**, which immediately exceeds the 3-project free limit on first visit.
   - Lines 97–107 (`handleDeleteProject`): Deletes item from state and localStorage, but **does not call `refreshProjectCount()`**, causing out-of-sync quota meters in `Sidebar` and `AuthProvider`.

7. **Quota Discrepancy Across UI**:
   - `AuthProvider.tsx` (Line 36): `MAX_FREE_PROJECTS = 3`
   - `LandingPageClient.tsx` (Line 144): `${stats.totalCount}/3 Free Projects`
   - `builder/page.tsx` (Line 296): `${stats.totalCount}/3 Free Projects`
   - `Sidebar.tsx` (Line 46): `maxProjects = user?.plan === "pro" ? "∞" : "2"`
   - `billing/page.tsx` (Line 109): `"Free Plan (2 Projects Max)"`
   - `design-system/page.tsx` (Line 211): `"You are on the Free tier (2/2 projects used)."`

8. **Shopify Studio Duplication**:
   - `src/app/builder/page.tsx` implements store generation and live cart drawer.
   - `src/app/shopify/page.tsx` re-exports `src/app/builder/page.tsx`.
   - `src/components/builder/InteractiveShopifyStudio.tsx` is an unimported duplicate studio component (1069 lines) that is never rendered by any route.

9. **Build & Type Check**:
   - Executed `npx tsc --noEmit` which completed successfully with exit code 0.

---

## 2. Logic Chain

1. **From Observations 1, 2, 3, and 4**: Because `@clerk/nextjs` is not installed, no `.env` credentials exist, and no `middleware.ts` is implemented, the existing auth system is purely a mock client-side simulation (`AuthProvider.tsx`) storing mock user records in `localStorage`.
2. **From Observations 5 and 6**: Because projects are split across two separate `localStorage` keys (`"insforge_projects"` for Shopify and `"obsidian_website_projects"` for Obsidian websites) and `handleDeleteProject` omits `refreshProjectCount()`, any deletion leaves the `user.projectCount` state out of sync until a page reload.
3. **From Observation 6**: Seeding 2 Shopify and 2 Website mock projects on initial load results in 4 active projects. When combined with the 3-project free limit logic (`totalCount >= 3`), a first-time user is immediately blocked from creating new projects unless they manually delete 2 or more projects.
4. **From Observation 7**: Inconsistent quota numbers (2 vs 3 projects) create user confusion across Billing, Sidebar, and Builder views.
5. **From Observation 8**: `InteractiveShopifyStudio.tsx` is dead code that can cause developer confusion or duplicate logic.

---

## 3. Caveats

- **External Clerk Account**: Implementing active live Clerk authentication will require actual Clerk API credentials (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) or mock-safe defaults in development/build environments to ensure `next build` passes in CI/CD without required live network calls.
- **Server Database**: Currently, projects are persisted in browser `localStorage`. A future cloud persistence layer (e.g. Postgres / InsForge) can replace `localStorage` once backend API endpoints are wired, but the client store abstraction (`src/lib/projects.ts`) will maintain identical interface semantics.

---

## 4. Conclusion

1. **Clerk Auth Integration**: Install `@clerk/nextjs`, wrap `src/app/layout.tsx` in `<ClerkProvider>` with dark/monochrome variables, create `src/middleware.ts` protecting `/projects` and `/editor/*`, and replace custom sign-in/up forms with Clerk components.
2. **Unified Project Store**: Centralize project creation, deletion, and counting in `src/lib/projects.ts` with custom event dispatching (`"obsidian:projects-updated"`) to guarantee real-time quota synchronization without page reloads.
3. **Strict 3-Project Free Limit**: Fix initial seeding in `/projects` (seed 0 or 1 project max), align all UI text across `/billing`, `/design-system`, and `Sidebar` to "3 Free Projects", and enforce the quota guard across `/`, `/builder`, `/shopify`, and `/editor`.
4. **Hydration & Sync Safety**: Ensure user quota meters and Clerk auth buttons use clean client mounting patterns without SSR mismatch.

---

## 5. Verification Method

To verify these findings independently:

1. **Check Clerk Package**:
   ```powershell
   # In d:\app
   npm list @clerk/nextjs
   # Output: (empty)
   ```
2. **Verify Middleware Absence**:
   ```powershell
   Get-ChildItem -Path d:\app -Filter "*middleware*" -Recurse -File
   # Confirms 0 matches in project source
   ```
3. **Verify Quota Discrepancies**:
   Inspect line 46 in `d:\app\src\components\Sidebar.tsx` and line 109 in `d:\app\src\app\billing\page.tsx` against line 36 in `d:\app\src\components\providers\AuthProvider.tsx`.
4. **Verify Type Check Status**:
   ```powershell
   npx tsc --noEmit
   # Exit code: 0
   ```
