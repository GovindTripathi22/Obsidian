# Comprehensive Analysis: Quota Synchronization, Project Storage & Test Suite Compatibility

**Target Workspace**: `d:\app`  
**Agent**: `teamwork_preview_explorer_auth_3` (explorer_3)  
**Date**: 2026-08-17  

---

## 1. Executive Summary

This investigation analyzed the Obsidian Website Builder & Shopify Theme Studio architecture with a focus on:
1. **Quota Tracking & 3-Project Free Limit Enforcement** across `src/lib/projects.ts`, `src/app/projects/page.tsx`, `src/app/billing/page.tsx`, `src/components/Sidebar.tsx`, `src/components/builder/InteractiveShopifyStudio.tsx`, and `src/components/LandingPageClient.tsx`.
2. **Project Storage & User ID Session Tying** across all routes (`/`, `/builder`, `/shopify`, `/projects`, `/editor/[projectId]`, `/billing`).
3. **E2E & Unit Test Suites** across `tests/run-all-tests.js`, `tests/validate-auth-quota.js`, `tests/validate-theme-zip.js`, `tests/validate-monochrome.js`, `tests/auth_flow.test.mjs`, `tests/projects_store.test.mjs`, `tests/adversarial_stress.test.mjs`, `tests/empirical-challenger-m1.js`, and `tests/empirical-challenger-m2-regression.js`.
4. **Build & Next.js 16 App Router Compatibility** (`npm run build`, TypeScript 5, Turbopack, static page generation).

---

## 2. Quota Tracking & 3-Project Free Limit Enforcement

### 2.1 Storage Contract (`src/lib/projects.ts`)
- **Constants**:
  - `MAX_FREE_PROJECTS = 3` (canonical limit for free plan).
  - `PROJECTS_STORAGE_KEY = "obsidian_projects"` (single source of truth).
  - `PROJECTS_UPDATED_EVENT = "obsidian:projects-updated"` (custom event for real-time reactivity).
- **Core Functions**:
  - `getProjectCount()`: Returns `{ totalCount, shopifyCount, websiteCount }`.
  - `canCreateProject(isPro: boolean = false)`: Returns `true` if `isPro === true`, or `totalCount < 3` if `isPro === false`.
  - `getProjectStats(isPro: boolean = false)`: Returns `{ shopifyCount, websiteCount, totalCount, maxFreeProjects: 3, isLimitReached: !isPro && totalCount >= 3, isPro }`.
  - `useProjects(isPro)`: React hook that subscribes to `PROJECTS_UPDATED_EVENT` and `window.storage` events, automatically keeping components synchronized across tabs and routes.

### 2.2 Route & Component Enforcement Analysis
| Route / Component | Quota Check Location | Behavior when Quota (3/3) is Reached | Status |
|---|---|---|---|
| `/projects` (`src/app/projects/page.tsx`) | `handleCreateNew` (lines 47-50) | Displays `QuotaLimitModal`, blocks router push to `/builder` or `/` | ✅ Verified |
| `/builder` (`src/app/builder/page.tsx`) | `handleLaunchBuilder` (lines 171-174) | Displays `QuotaLimitModal`, blocks project generation | ✅ Verified |
| `/shopify` (`src/components/builder/InteractiveShopifyStudio.tsx`) | `handleLaunchProject` (lines 336-339) | Displays `QuotaLimitModal`, blocks project launch | ✅ Verified |
| `/` (`src/components/LandingPageClient.tsx`) | `handleSubmit` (lines 49-52) | Displays `QuotaLimitModal`, blocks project generation | ✅ Verified |
| `src/components/Sidebar.tsx` | Lines 37-42, 109-124 | Displays `{projectCount}/{maxProjects}` (`3` for Free, `∞` for Pro) with progress meter | ✅ Verified |
| `src/app/billing/page.tsx` | Lines 45, 103-150 | Displays "Up to 3 free projects" on Free tier, allows Pro toggle | ✅ Verified |
| `src/components/auth/UserButton.tsx` | Lines 138-170 | Displays real-time `{stats.totalCount}/3` progress bar and upgrade link | ✅ Verified |
| `src/components/auth/AuthModals.tsx` | Lines 298-316 | User profile modal displays `{stats.totalCount} / 3 Free Projects Used` | ✅ Verified |

---

## 3. Project Storage & User Session Tying

### 3.1 Authentication State & Session Model (`AuthProvider.tsx`)
- **Default State**: Starts signed out (`user === null`, `isSignedIn === false`, `isLoaded === true`) when `localStorage` has no active session. No hardcoded mock user auto-login.
- **Session Keys**:
  - `localStorage["obsidian_auth_user"]`
  - `localStorage["insforge_session"]` (synced for backward compatibility)
- **User Profile Data**:
  ```typescript
  export interface AuthUser {
    id: string;          // e.g. "usr_178696..." or Clerk user ID
    email: string;       // User's authentic email
    name: string;        // User's authentic display name
    avatar_url?: string; // Dicebear initials SVG or OAuth avatar URL
    created_at: string;  // ISO timestamp
    plan: "free" | "pro";
    projectCount: number;
  }
  ```
- **Clerk Bridge Contract**:
  `useUser()` hook exports `{ isLoaded, isSignedIn, user }` where `user` conforms to `@clerk/nextjs` User shape (`id`, `fullName`, `primaryEmailAddress.emailAddress`, `imageUrl`, `publicMetadata.plan`).

### 3.2 Project Storage Schema & User Association
- **Project Interface**:
  ```typescript
  export interface Project {
    id: string;
    title: string;
    type: "shopify" | "website";
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
    data?: ProjectData;
    prompt?: string;
    userId?: string;
    // Backward compatibility aliases
    user_id?: string;
    thumbnail_url?: string;
    created_at?: string;
    updated_at?: string;
  }
  ```
- **User Association Across Routes**:
  - `LandingPageClient.tsx`: `userId: user?.id || "guest"`
  - `builder/page.tsx`: `userId: user?.id || "user-architect"` (recommended: align to `user?.id || "guest"`)
  - `InteractiveShopifyStudio.tsx`: `userId: user?.id || "guest"`
  - `projects.ts:saveProject()`: Defaults `userId` to `project.userId || project.user_id || "guest"`.

### 3.3 Editor Persistence Gap
- In `src/app/editor/[projectId]/page.tsx`, generated HTML/CSS and newly added page tabs (`pageCodes`, `pageTabs`) are maintained in local component state.
- **Recommendation**: Wire `saveProject({ id: projectId, data: { pages: pageCodes, pageTabs } })` inside `src/app/editor/[projectId]/page.tsx` on generation completion and page creation so project changes persist to `obsidian_projects`.

---

## 4. Test Suite Audit & Compatibility Analysis

### 4.1 Master Test Suite (`tests/run-all-tests.js`)
- Runs 3 major validation suites:
  1. **Shopify OS 2.0 Theme ZIP Validator (`tests/validate-theme-zip.js`)**:
     - Tests directory structure (`layout/`, `templates/`, `sections/`, `snippets/`, `config/`, `locales/`, `assets/`).
     - Tests `templates/index.json` section order and JSON validity.
     - Tests `config/settings_schema.json`, `config/settings_data.json`, `locales/en.default.json`.
     - Tests Liquid section `{% schema %}` parsing and presets.
     - Result: **20/20 tests, 137/137 assertions passed**.
  2. **Auth & 3-Project Quota Contract Validator (`tests/validate-auth-quota.js`)**:
     - Tests `src/lib/projects.ts` interface contracts (`getProjects`, `getProjectById`, `saveProject`, `deleteProject`, `getProjectCount`, `canCreateProject`, `MAX_FREE_PROJECTS === 3`, `PROJECTS_UPDATED_EVENT`).
     - Tests quota boundary (1/3 -> 2/3 -> 3/3 -> blocked), Pro bypass (10+ projects), event dispatching on save/delete, and corrupted JSON recovery.
     - Result: **17/17 tests, 70/70 assertions passed**.
  3. **Luxury Monochrome Noir Design System Auditor (`tests/validate-monochrome.js`)**:
     - Scans `globals.css` and 40 source files for absence of green/emerald accents (`bg-emerald-`, `text-emerald-`, `border-emerald-`, `#10b981`, etc.) and presence of monochrome tokens (`#ffffff`, `bg-zinc-950`, `neutral-900`, frost glass).
     - Result: **11/11 tests, 37/37 assertions passed**.

### 4.2 Individual Test Files & Unit Test Findings
| Test File | Test Runner | Status | Findings / Remediation |
|---|---|---|---|
| `tests/auth_flow.test.mjs` | `node --test` | ✅ 7/7 Pass | Verifies offline fallback mode, dual storage, sign-up display name, Google auth, plan toggling, sign out, `useUser()` bridge. |
| `tests/projects_store.test.mjs` | `node --test` | ⚠️ 1/4 Pass | 3 tests failed because `migrateLegacyProjects()` returned `[]` on empty storage instead of seeding `INITIAL_DEFAULT_MOCKS` (1 starter project). |
| `tests/adversarial_stress.test.mjs` | `node --test` | ⚠️ 3/6 Pass | 3 tests failed because corrupted JSON recovery in `getProjects()` returned `[]` instead of `INITIAL_DEFAULT_MOCKS`. |
| `tests/empirical-challenger-m1.js` | `node` | ⚠️ 3/19 Pass | Failed due to starter mock seeding expectation (`INITIAL_DEFAULT_MOCKS`) and two exact copy assertions in `Sidebar.tsx` and `billing/page.tsx`. |
| `tests/empirical-challenger-m2-regression.js` | `node` | ✅ 5/5 Pass | Zero regressions on monochrome design system tokens and project store constants. |

### 4.3 Root Cause of Test Discrepancy in `projects.ts`
- In `src/lib/projects.ts` lines 216-220:
  ```typescript
  // Current:
  const initialList = migrated;
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialList));
  return initialList;
  
  // Required for 100% test suite compatibility:
  const initialList = migrated.length > 0 ? migrated : INITIAL_DEFAULT_MOCKS;
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialList));
  return initialList;
  ```
- In `getProjects()` error handling:
  ```typescript
  // When raw storage is invalid/corrupted JSON:
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    if (Array.isArray(parsed) && parsed.length === 0) return [];
    return INITIAL_DEFAULT_MOCKS;
  } catch {
    return INITIAL_DEFAULT_MOCKS;
  }
  ```

---

## 5. Build Requirements & Next.js 16 Configuration

### 5.1 Build Verification Results
- **Command**: `npm run build` (`next build`)
- **Environment**: Next.js 16.2.12 (Turbopack), React 19.2.4, TypeScript 5, Tailwind CSS 4.
- **Output**:
  - `✓ Compiled successfully in 5.2s`
  - `✓ Running TypeScript in 5.0s (0 errors)`
  - `✓ Generating static pages using 15 workers (15/15) in 456ms`
  - Route compilation:
    - `○ /` (Static)
    - `○ /_not-found` (Static)
    - `ƒ /api/billing/checkout` (Dynamic)
    - `ƒ /api/billing/webhook` (Dynamic)
    - `ƒ /api/generate` (Dynamic)
    - `○ /billing` (Static)
    - `○ /builder` (Static)
    - `○ /design-system` (Static)
    - `ƒ /editor/[projectId]` (Dynamic)
    - `○ /inspiration` (Static)
    - `○ /projects` (Static)
    - `○ /shopify` (Static)
    - `○ /sign-in` (Static)
    - `○ /sign-up` (Static)

### 5.2 Potential Build Blockers & Mitigation Strategy
1. **Missing Clerk Publishable Key during Static Build**:
   - If `@clerk/nextjs` `<ClerkProvider>` is mounted unconditionally without `publishableKey`, static generation can fail in CI/CD or local offline environments.
   - **Mitigation**: Use conditional mounting or supply a safe fallback publishable key `pk_test_fallback` / dummy key when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not defined, or use the hybrid auth provider pattern.
2. **Next.js 16 `useSearchParams()` Suspense Boundary**:
   - Next.js 16 App Router requires any page utilizing `useSearchParams()` to be wrapped in `<Suspense>`.
   - Verified present in `src/app/projects/page.tsx` and `src/app/editor/[projectId]/page.tsx`.
3. **Client Directive (`"use client"`)**:
   - All interactive hooks (`useAuth`, `useProjects`, `useRouter`, `useState`) are properly isolated in `"use client"` files.

---

## 6. Recommended Implementation Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │               Root Layout                    │
                               │          (src/app/layout.tsx)                │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       │                                                             │
        ┌──────────────▼─────────────┐                                ┌──────────────▼─────────────┐
        │       Clerk Auth           │                                │    Hybrid / Fallback       │
        │  (When Clerk Key Present)  │                                │ (Offline / Local Dev Mode) │
        │  - <ClerkProvider>         │                                │  - AuthProvider (Context)  │
        │  - Google OAuth            │                                │  - Google One-Tap Modal    │
        │  - Real User Profile       │                                │  - Email / Password Login  │
        │  - useUser() / UserButton  │                                │  - useAuth() / UserButton  │
        └──────────────┬─────────────┘                                └──────────────┬─────────────┘
                       │                                                             │
                       └──────────────────────────────┬──────────────────────────────┘
                                                      │
                                       ┌──────────────▼─────────────┐
                                       │    Shared Project Store    │
                                       │    (src/lib/projects.ts)   │
                                       │   - MAX_FREE_PROJECTS = 3  │
                                       │   - Single Storage Key     │
                                       │   - Event Bus Notification │
                                       │   - getProjectStats()      │
                                       └──────────────┬─────────────┘
                                                      │
         ┌───────────────────┬────────────────────────┼───────────────────────┬───────────────────┐
         │                   │                        │                       │                   │
┌────────▼─────────┐ ┌───────▼────────┐      ┌────────▼─────────┐   ┌─────────▼────────┐  ┌───────▼────────┐
│  Obsidian Builder│ │ Shopify Studio │      │ Projects Dashboard│  │  Billing / Plan  │  │ Editor Studio  │
│       (/)        │ │(/builder,      │      │   (/projects)    │   │   (/billing)     │  │(/editor/*)     │
│ - 3 Quota Check  │ │ /shopify)      │      │ - Multi-Tab View │   │ - Plan Upgrade   │  │- Live Two-Way  │
│ - Single Session │ │ - 3 Quota Check│      │ - Reactive Sync  │   │ - Quota Status   │  │  Sync & Save   │
└──────────────────┘ └────────────────┘      └──────────────────┘   └──────────────────┘  └────────────────┘
```
