# Handoff Report: Milestone 1 — Quota System, Seeding & UI Copy Harmonization

**Agent**: Explorer 3 (`sub_orch_m1_explorer_3`)  
**Working Directory**: `d:\app\.agents\sub_orch_m1_explorer_3`  
**Milestone**: Milestone 1 — Clerk Authentication & Quota System  
**Handoff Type**: Hard (Complete Investigation & Architectural Blueprint)  
**Target File**: `d:\app\.agents\sub_orch_m1_explorer_3\handoff.md`  

---

## 1. Observation

A full survey across `d:\app\src` identified all occurrences of project quotas, tier limits, pricing copy, and initial mock seeding.

### 1.1 Complete Inventory of Project Limits & Quota Copy

| # | File Path | Exact Line(s) | Current Verbatim Code / Text | Issue / Inconsistency Identified |
|---|---|---|---|---|
| 1 | `src/components/Sidebar.tsx` | 46 | `const maxProjects = user?.plan === "pro" ? "∞" : "2";` | **Hardcodes "2"** max projects instead of "3". |
| 2 | `src/components/Sidebar.tsx` | 47 | `const usagePercentage = user?.plan === "pro" ? 20 : (projectCount / 2) * 100;` | Divides by **2** instead of `MAX_FREE_PROJECTS` (3). |
| 3 | `src/components/Sidebar.tsx` | 138 | `<span className="font-mono text-zinc-500">{projectCount}/{maxProjects}</span>` | Renders `X/2` instead of `X/3` for Free users. |
| 4 | `src/app/billing/page.tsx` | 42 | `"Up to 2 AI store projects"` | Free tier feature list claims limit is **2 projects**. |
| 5 | `src/app/billing/page.tsx` | 40 | `description: "Ideal for exploring AI store generation."` | Omits website builder generation scope. |
| 6 | `src/app/billing/page.tsx` | 109 | `{currentPlan === "pro" ? "Pro Unlimited Subscription" : "Free Plan (2 Projects Max)"}` | Header banner claims **2 Projects Max**. |
| 7 | `src/app/billing/page.tsx` | 53–54, 69–70 | `$9.99 / month` and `$79.99 / year` | Defines pricing as **$9.99/mo** (conflicts with $19/mo in modals). |
| 8 | `src/app/design-system/page.tsx` | 210–212 | `You are on the Free tier (2/2 projects used). Upgrade to Pro for unlimited exports.` | Quota alert badge hardcodes **2/2 projects**. |
| 9 | `src/components/LandingPageClient.tsx` | 60–64 | `if (stats.isLimitReached) { setShowQuotaModal(true); return; }` | Checks quota correctly but uses inline modal definition. |
| 10 | `src/components/LandingPageClient.tsx` | 144–145 | `${stats.totalCount}/3 Free Projects` | Correctly displays `/3 Free Projects`. |
| 11 | `src/components/LandingPageClient.tsx` | 303, 308 | `3/3 Free projects currently used`, `maximum limit of 3 free projects` | Correct limit text in modal. |
| 12 | `src/components/LandingPageClient.tsx` | 319 | `Upgrade to Pro ($19/mo) →` | **Pricing discrepancy**: states `$19/mo` while `billing/page.tsx` states `$9.99/mo`. |
| 13 | `src/app/builder/page.tsx` | 172–176 | `if (stats.isLimitReached) { setShowQuotaModal(true); return; }` | Checks quota correctly but uses duplicate inline modal. |
| 14 | `src/app/builder/page.tsx` | 295–296 | `${stats.totalCount}/3 Free Projects` | Correctly displays `/3 Free Projects`. |
| 15 | `src/app/builder/page.tsx` | 533, 538 | `3/3 Free projects currently used`, `maximum limit of 3 free projects` | Correct limit text in modal. |
| 16 | `src/app/builder/page.tsx` | 549 | `Upgrade to Pro ($19/mo) →` | **Pricing discrepancy**: states `$19/mo` while `billing/page.tsx` states `$9.99/mo`. |
| 17 | `src/components/builder/InteractiveShopifyStudio.tsx` | 331–345 | `handleLaunchProject = () => { ... }` | **No quota check**: creates project and navigates to editor without testing quota limit. |
| 18 | `src/app/projects/page.tsx` | 29–65 | `DEFAULT_SHOPIFY_MOCKS` (2 items) & `DEFAULT_WEBSITE_MOCKS` (2 items) | **Seeds 4 demo projects** on initial visit. |
| 19 | `src/app/projects/page.tsx` | 68–93 | `localStorage.setItem("insforge_projects", ...); localStorage.setItem("obsidian_website_projects", ...);` | Persists 4 items to storage on mount, **instantly breaching the 3-project quota**. |
| 20 | `src/app/projects/page.tsx` | 97–107 | `handleDeleteProject = (id, type) => { ... }` | **No sync notification**: deletes from storage but omits event dispatch / count refresh. |
| 21 | `src/app/projects/page.tsx` | 131, 137 | `<Link href="/builder">`, `<Link href="/">` | Header create buttons lack quota limit interception or warning badge. |
| 22 | `src/components/providers/AuthProvider.tsx` | 36 | `const MAX_FREE_PROJECTS = 3;` | Free limit set to 3. |
| 23 | `src/components/providers/AuthProvider.tsx` | 42–61 | `getCounts()` parses `insforge_projects` and `obsidian_website_projects` | Reads disjoint storage keys. |
| 24 | `src/components/providers/AuthProvider.tsx` | 74–86 | `isLimitReached = !isPro && totalCount >= MAX_FREE_PROJECTS;` | Correct calculation logic. |
| 25 | `src/components/providers/AuthProvider.tsx` | 110–121 | `window.addEventListener("storage", handleStorageChange);` | **Cross-tab only**: does not capture mutations occurring in the same tab. |
| 26 | `src/app/api/billing/checkout/route.ts` | 8–11 | `planTier === "yearly" ? "price_yearly_7999" : "price_monthly_999"` | Confirms canonical monthly price is $9.99. |

---

### 1.2 Initial Seeding Mechanism Breakdown

In `src/app/projects/page.tsx`:
- Lines 29–46 define `DEFAULT_SHOPIFY_MOCKS` containing 2 projects (`proj-shopify-1`: LuxeAura Cosmetics Store, `proj-shopify-2`: Minimalist Apparel Boutique).
- Lines 48–65 define `DEFAULT_WEBSITE_MOCKS` containing 2 projects (`proj-web-1`: SaaS Analytics Landing Page, `proj-web-2`: Product Designer Portfolio).
- Lines 68–95 check if `insforge_projects` or `obsidian_website_projects` exist in `localStorage`. If absent, it writes both mock arrays (4 projects total) to storage.
- **Immediate Quota Lockout**: Because 4 projects > `MAX_FREE_PROJECTS` (3), a new visitor who opens `/projects` is immediately flagged as `isLimitReached = true` (`4/3 Free Projects Used`), preventing them from generating any new website or Shopify store without first deleting at least 2 demo projects.

---

## 2. Logic Chain

1. **Root Cause of Quota Lockout**: The mock initialization in `projects/page.tsx` was authored assuming 2 projects per category without calculating the aggregate limit across categories (2 + 2 = 4 > 3). Reducing initial mock seeding to `<= 1` project (or 0 projects) ensures the starting state has `totalCount <= 1`, providing the user with at least 2 available free creation slots.
2. **Root Cause of Quota Inconsistencies**: Individual pages were authored with disparate assumptions (`Sidebar.tsx` and `billing/page.tsx` assumed 2 projects; `AuthProvider.tsx`, `LandingPageClient.tsx`, and `builder/page.tsx` assumed 3 projects). Unifying all references to import `MAX_FREE_PROJECTS` from `src/lib/projects.ts` eliminates all divergent constants.
3. **Root Cause of Out-of-Sync Quota Meters**: Deletion in `projects/page.tsx` mutated `localStorage` directly without notifying `AuthProvider` or other mounted components. Standard browser `storage` events only dispatch cross-tab. Emitting a custom event (`"obsidian:projects-updated"`) whenever a project is created, saved, or deleted triggers immediate state updates in `AuthProvider`, `Sidebar`, and workspace views within the same tab.
4. **Pricing Discrepancy**: The checkout endpoint (`/api/billing/checkout/route.ts`) and `billing/page.tsx` use `$9.99/mo` (`price_monthly_999`), whereas modal CTA buttons in `LandingPageClient.tsx` and `builder/page.tsx` hardcoded `$19/mo`. Updating all modal copy to `$9.99/mo` aligns UI expectations with Stripe billing configuration.

---

## 3. Caveats

1. **Existing User LocalStorage Migration**: Users with existing `insforge_projects` (2 items) and `obsidian_website_projects` (2 items) in their browser storage will have 4 projects on migration. The migration helper must safely import existing items into `obsidian_projects` without deleting user-created data. If the count exceeds 3, the user simply sees `4/3 Free Projects Used` and can choose to upgrade or delete old projects.
2. **SSR & Hydration Discrepancies**: SSR renders deterministic markup (e.g. `0/3 Free Projects`). Client hydration reads `localStorage`. To avoid React 19 hydration mismatch warnings, dynamic quota numbers must be guarded with `suppressHydrationWarning` or rendered after `mounted = true`.
3. **Pro Plan Exemption**: All quota checks must evaluate `isPro` (`user?.plan === "pro"`). When `isPro === true`, `canCreateProject()` returns `true`, and quota displays show `∞` or `Pro (Unlimited)`.

---

## 4. Conclusion & Complete Implementation Design

### 4.1 Initial Seeding Specification

We evaluate two seeding options and establish the recommended architecture:

#### Recommended Strategy: 1 Curated Starter Project (Option B)
Seed exactly **1** high-quality starter project (`proj-shopify-1`: LuxeAura Cosmetics Store or `proj-web-default-1`: SaaS Analytics Platform).
- **Initial State**: `1/3 Free Projects Used` (2 available free creation slots).
- **User Experience**: First-time visitors have immediate access to an interactive project to open in `/editor/[projectId]`, explore Liquid schemas, or export code, while retaining 2 free slots to generate their own projects.

```typescript
export const INITIAL_DEFAULT_MOCKS: Project[] = [
  {
    id: "proj-shopify-starter-1",
    userId: "user-obsidian-prime",
    title: "LuxeAura Cosmetics Store",
    prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    type: "shopify",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    data: {
      storeName: "LuxeAura Cosmetics",
      presetId: "cosmetics",
    },
  },
];
```

#### Alternative Strategy: 0 Projects / Clean Slate (Option A)
Seed an empty array `[]`.
- **Initial State**: `0/3 Free Projects Used` (3 available free creation slots).
- **User Experience**: `/projects` renders the clean empty state card with action buttons ("Launch Shopify Builder" / "Open Website Builder").

---

### 4.2 Strict Quota Logic & Calculation Engine (`src/lib/projects.ts`)

```typescript
export const MAX_FREE_PROJECTS = 3;
export const PROJECTS_UPDATED_EVENT = "obsidian:projects-updated";

export interface ProjectQuota {
  current: number;
  max: number;
  remaining: number;
  isPro: boolean;
  isLimitReached: boolean;
  percentage: number;
}

/**
 * Evaluates whether a user can create a new project.
 * Pro users have unlimited creation. Free users are capped at MAX_FREE_PROJECTS (3).
 */
export function canCreateProject(isPro: boolean = false): boolean {
  if (isPro) return true;
  const count = getProjectCount();
  return count.totalCount < MAX_FREE_PROJECTS;
}

/**
 * Returns comprehensive quota statistics for meters, sidebars, and modals.
 */
export function getProjectQuota(isPro: boolean = false): ProjectQuota {
  const { totalCount } = getProjectCount();
  const max = isPro ? Infinity : MAX_FREE_PROJECTS;
  const isLimitReached = !isPro && totalCount >= MAX_FREE_PROJECTS;
  const remaining = isPro ? Infinity : Math.max(0, MAX_FREE_PROJECTS - totalCount);
  const percentage = isPro ? 20 : Math.min(100, (totalCount / MAX_FREE_PROJECTS) * 100);

  return {
    current: totalCount,
    max,
    remaining,
    isPro,
    isLimitReached,
    percentage,
  };
}
```

---

### 4.3 Reusable Quota Limit Modal (`src/components/ui/QuotaLimitModal.tsx`)

To avoid duplicating 60+ lines of modal markup across `LandingPageClient.tsx`, `builder/page.tsx`, `projects/page.tsx`, and `InteractiveShopifyStudio.tsx`, create a reusable component:

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, CreditCard, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuotaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount?: number;
  maxCount?: number;
  manageProjectsHref?: string;
}

export const QuotaLimitModal: React.FC<QuotaLimitModalProps> = ({
  isOpen,
  onClose,
  currentCount = 3,
  maxCount = 3,
  manageProjectsHref = "/projects",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Free Quota Limit Reached</h3>
            <p className="text-xs font-mono text-zinc-400">
              {currentCount}/{maxCount} Free projects currently used
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          You have reached the maximum limit of <strong className="text-white">3 free projects</strong> on your current tier.
          Upgrade to <strong className="text-white">Obsidian Pro ($9.99/mo)</strong> for unlimited Shopify Liquid & Website generations, or delete old projects in your workspace.
        </p>

        {/* Pro Benefits Box */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-[11px] text-zinc-300">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Obsidian Pro includes:
          </p>
          <ul className="space-y-1 list-disc list-inside text-zinc-400 pl-1">
            <li>Unlimited Website & Shopify Theme projects</li>
            <li>Full Shopify Liquid 2.0 ZIP package compiler</li>
            <li>Priority Gemini 2.5 Flash streaming pipeline</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <Link href="/billing" className="block w-full" onClick={onClose}>
            <Button
              size="md"
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs shadow-lg"
            >
              Upgrade to Pro ($9.99/mo) →
            </Button>
          </Link>

          <div className="flex gap-2">
            <Link href={manageProjectsHref} className="flex-1" onClick={onClose}>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs"
              >
                Manage Projects
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 4.4 UI Copy Harmonization Plan Matrix

| File Path | Location | Current Copy | Proposed Replacement Copy | Rationale |
|---|---|---|---|---|
| `src/components/Sidebar.tsx` | Line 46 | `maxProjects = user?.plan === "pro" ? "∞" : "2"` | `maxProjects = user?.plan === "pro" ? "∞" : "3"` | Enforce 3 free project ceiling in sidebar. |
| `src/components/Sidebar.tsx` | Line 47 | `(projectCount / 2) * 100` | `(projectCount / 3) * 100` | Fix quota percentage meter math. |
| `src/app/billing/page.tsx` | Line 42 | `"Up to 2 AI store projects"` | `"Up to 3 free projects (Obsidian & Shopify)"` | Correct feature matrix copy for Free Starter tier. |
| `src/app/billing/page.tsx` | Line 40 | `description: "Ideal for exploring AI store generation."` | `description: "Ideal for exploring AI website & Shopify theme generation."` | Clarify dual-engine scope. |
| `src/app/billing/page.tsx` | Line 109 | `"Free Plan (2 Projects Max)"` | `"Free Plan (3 Projects Max)"` | Synchronize active plan badge in billing dashboard. |
| `src/app/design-system/page.tsx` | Line 211 | `"You are on the Free tier (2/2 projects used). Upgrade to Pro for unlimited exports."` | `"You are on the Free tier (3/3 projects used). Upgrade to Pro for unlimited exports."` | Update design system alert example to match 3-project rule. |
| `src/components/LandingPageClient.tsx` | Line 319 | `Upgrade to Pro ($19/mo) →` | `Upgrade to Pro ($9.99/mo) →` | Align upgrade modal button with billing rate ($9.99/mo). |
| `src/app/builder/page.tsx` | Line 549 | `Upgrade to Pro ($19/mo) →` | `Upgrade to Pro ($9.99/mo) →` | Align upgrade modal button with billing rate ($9.99/mo). |
| `src/app/projects/page.tsx` | Quota Status Banner | (None currently) | `"Free Creator Plan: ${stats.totalCount} of 3 free project slots used"` | Provide clear usage feedback directly on project manager dashboard. |
| `src/components/builder/InteractiveShopifyStudio.tsx` | `handleLaunchProject` | (No guard) | Check `canCreateProject(isPro)` and open `QuotaLimitModal` | Guard against unconstrained project creation in studio. |

---

### 4.5 Quota Guard Integration Across All User Creation Entry Points

```
                                  User Action
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
 [Landing Page Prompt]      [Shopify Studio Launch]       [Projects "New Project"]
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       │
                                       ▼
                       canCreateProject(user?.plan === "pro")
                                       │
                      ┌────────────────┴────────────────┐
                      │                                 │
                   [ true ]                          [ false ]
                      │                                 │
                      ▼                                 ▼
             createProject(...)               Open <QuotaLimitModal />
             Redirect to /editor              • Show "3/3 Free Projects Used"
                                              • "Upgrade to Pro ($9.99/mo)" CTA
                                              • "Manage Projects" CTA
```

---

## 5. Verification Method

To independently verify quota calculations, initial seeding, and copy harmonization:

### 5.1 Verification Commands
1. **TypeScript Static Check**:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected*: Exit code 0, 0 compilation or interface errors.

2. **Next.js Production Build**:
   ```powershell
   npm run build
   ```
   *Expected*: Exit code 0 across all routes (`/`, `/builder`, `/projects`, `/billing`, `/design-system`, `/editor/[projectId]`).

3. **Grep Search Verification for Stale "2 Projects" Copy**:
   ```powershell
   # Search for any remaining references to 2 projects max
   Select-String -Path src\**\*.tsx,src\**\*.ts -Pattern "2 project", "2/2", "\(2 Projects"
   ```
   *Expected*: 0 matches found in codebase.

### 5.2 Test Scenarios & Invalidation Conditions
1. **Initial Seeding Quota Check**:
   - Clear `localStorage` (`localStorage.clear()`).
   - Navigate to `/projects`.
   - Verify `totalCount === 1` and quota meter displays `1/3 Free Projects Used`.
   - Invalidation: If quota shows `4/3` or `4 projects`, initial seeding failed.
2. **Quota Barrier Enforcement**:
   - Create 2 additional projects from `/` and `/builder` until `totalCount === 3`.
   - Attempt to create a 4th project from `/` or `/builder`.
   - Verify `<QuotaLimitModal />` appears and router navigation to `/editor` is blocked.
3. **Instant Deletion Sync**:
   - On `/projects`, delete 1 project.
   - Without refreshing the page, verify `Sidebar.tsx` immediately transitions from `3/3` to `2/3`.
   - Verify user can now create another project without error.
