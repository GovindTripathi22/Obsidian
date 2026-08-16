# Comprehensive Investigation & Architectural Analysis: Authentication, Project Quotas, & Route Control

**Explorer ID**: Survey Explorer 1  
**Target Repository**: `d:\app`  
**Date**: 2026-08-16  
**Scope**: Authentication, Session Management, 3-Project Quota Enforcement, User Profile State, Route Gating, and Dual-Engine Obsidian/Shopify Interoperability.

---

## Executive Summary

The existing codebase contains two intertwined generator applications:
1. **Obsidian Website Builder** (Root `/`, `/editor/[projectId]?type=website`)
2. **Shopify Theme Studio** (`/builder`, `/shopify`, `/editor/[projectId]?type=shopify`)

Currently, authentication is handled via a client-only mock context (`AuthProvider.tsx`) built on `localStorage`, with hardcoded default users, missing `@clerk/nextjs` dependencies, no `middleware.ts`, and no server-side route protection. Furthermore, project quota tracking is fractured across two separate `localStorage` keys (`"obsidian_website_projects"` and `"insforge_projects"`), exhibits critical synchronization bugs (e.g. deletion does not trigger quota refresh, default mock seeding loads 4 projects which immediately violates the 3-project free tier), and displays inconsistent quota numbers across UI components (e.g. 2 vs 3 projects in Sidebar and Billing).

---

## Section 1: Package Dependencies, Environment Variables & Auth Initialization

### 1.1 `package.json` & Dependency Analysis
- **Current State**:
  - `next`: `16.2.12`
  - `react`: `19.2.4`, `react-dom`: `19.2.4`
  - `tailwindcss`: `^4` (via `@tailwindcss/postcss`)
  - `@google/generative-ai`: `^0.24.1`
  - `stripe`: `^22.3.2`
  - `jszip`: `^3.10.1`, `html-to-image`: `^1.11.13`, `lucide-react`: `^1.27.0`
- **Finding**: `@clerk/nextjs` is **not present** in `dependencies` or `devDependencies`.
- **Finding**: There is no `@clerk/themes` or Clerk styling package installed.

### 1.2 Environment Variables Status
- **Finding**: No `.env`, `.env.local`, or `.env.example` file exists in the workspace root.
- **Finding**: `src/lib/insforge.ts` references:
  - `NEXT_PUBLIC_INSFORGE_PROJECT_ID` (defaults to `"insforge-project-default"`)
  - `NEXT_PUBLIC_INSFORGE_API_URL` (defaults to `"https://api.insforge.com/v1"`)
  - `INSFORGE_API_KEY` (defaults to `"insforge-api-key-default"`)
- **Finding**: `src/app/api/generate/route.ts` references `GEMINI_API_KEY` (defaults to dummy fallback key) and `GEMINI_MODEL_NAME` (defaults to `"gemini-2.5-flash"`).
- **Finding**: `src/lib/stripe.ts` and billing routes reference `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- **Clerk Requirements**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`

---

## Section 2: Current Auth Implementation, Layout, Middleware & Providers

### 2.1 `src/app/layout.tsx`
- **File**: `d:\app\src\app\layout.tsx` (Lines 17–25)
- **Observation**:
  ```tsx
  <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-900/40 selection:text-white">
    <AuthProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </AuthProvider>
  </body>
  ```
- **Observations**:
  - Direct root wrapping with `<AuthProvider>`.
  - Body contains green selection accent (`selection:bg-emerald-900/40`).
  - No `<ClerkProvider>` exists in the component tree.

### 2.2 `middleware.ts` Status
- **Finding**: **`middleware.ts` is completely absent** from the repository.
- **Impact**: No server-side route guards or edge session checks exist. Protected areas like `/projects` or `/editor/[projectId]` are accessible by unauthenticated requests.

### 2.3 `src/components/providers/AuthProvider.tsx`
- **File**: `d:\app\src\components\providers\AuthProvider.tsx`
- **Key Characteristics**:
  - **Mock Default User**:
    ```tsx
    const DEFAULT_USER: UserProfile = {
      id: "user-obsidian-prime",
      email: "developer@obsidian.ai",
      name: "Obsidian Creator",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: 1,
    };
    ```
  - **Auto-Login Behavior** (Lines 88–108): On mount, if no user exists in `localStorage`, it sets `user = DEFAULT_USER`, preventing true unauthenticated states in client views.
  - **Hardcoded Plan Granting**: `signInWithGoogle()` (Line 167) hardcodes `plan: "pro"`, whereas `signIn()` (Line 132) hardcodes `plan: "free"`.
  - **Project Counting Method** (Lines 42–61):
    ```tsx
    const shopify = JSON.parse(localStorage.getItem("insforge_projects") || "[]");
    const website = JSON.parse(localStorage.getItem("obsidian_website_projects") || "[]");
    return { shopifyCount, websiteCount, totalCount: shopifyCount + websiteCount };
    ```
  - **Storage Event Limitation** (Lines 110–121): The `window.addEventListener("storage", ...)` listener only receives events dispatched by **other tabs/windows**, not updates executed within the current active window.

### 2.4 Navbars and Headers
1. **`src/components/Header.tsx`** (Used in `RootLayoutContent` for `/projects`, `/billing`, `/design-system`, `/inspiration`):
   - Consumes `useAuth()`.
   - Displays user name / email and a Sign Out button if `user` is truthy, or links to `/sign-in` and `/sign-up`.
   - Contains green accents (`bg-emerald-400`, `text-emerald-400`).
2. **`src/components/SiteHeader.tsx`** (Used on `/`, `/builder`, `/shopify`):
   - Consumes `useAuth()`.
   - Displays user email/name and Sign Out button, or Sign In / Get Started buttons.
   - Contains green accents (`bg-emerald-600`, `bg-emerald-400`, `shadow-emerald-600/30`).
3. **`src/components/Sidebar.tsx`** (Used on non-fullscreen pages):
   - Displays quota card:
     - **Discrepancy**: Line 46 hardcodes `const maxProjects = user?.plan === "pro" ? "∞" : "2";` and `usagePercentage = (projectCount / 2) * 100;` (Conflicting with the canonical 3-project free limit!).

---

## Section 3: Project Lifecycle, Storage & Quota Enforcement Across Routes

| Route | Primary Component | Storage Key Used | Project Creation Mechanism | Quota Enforcement |
|---|---|---|---|---|
| **Root Website Builder** (`/`) | `src/components/LandingPageClient.tsx` | `"obsidian_website_projects"` | Form submit -> creates `proj-obsidian-${Date.now()}` -> prepends to array -> calls `refreshProjectCount()` -> redirects to `/editor/[id]?type=website` | `if (stats.isLimitReached) { setShowQuotaModal(true); return; }` (3 free limit) |
| **Shopify Studio** (`/builder`, `/shopify`) | `src/app/builder/page.tsx` | `"insforge_projects"` | Form submit -> creates `proj-shopify-${Date.now()}` -> prepends to array -> calls `refreshProjectCount()` -> redirects to `/editor/[id]?type=shopify` | `if (stats.isLimitReached) { setShowQuotaModal(true); return; }` (3 free limit) |
| **Shopify Studio (Unused Alternative)** | `src/components/builder/InteractiveShopifyStudio.tsx` | `"insforge_projects"` | `handleLaunchProject` creates `proj-shopify-${Date.now()}` -> prepends to array -> calls `refreshProjectCount()` | **None** (does not check `isLimitReached`) |
| **Projects Workspace** (`/projects`) | `src/app/projects/page.tsx` | Both `"insforge_projects"` & `"obsidian_website_projects"` | Renders tabs for Shopify & Website projects. Allows deleting items. | **Critical Seeding Bug**: Seeds 2 Shopify + 2 Website (total 4) on initial empty load, immediately exceeding 3 free projects! |
| **Editor** (`/editor/[projectId]`) | `src/app/editor/[projectId]/page.tsx` | State (`pageCodes`) & compile endpoints | Real-time code synthesis via `/api/generate`. Can add page tabs (0-token scaffold). | **None**: No quota or ownership validation on direct URL navigation. |
| **Billing & Plans** (`/billing`) | `src/app/billing/page.tsx` | Stripe API checkout | Calls `/api/billing/checkout` | Text incorrectly says "Up to 2 AI store projects" / "Free Plan (2 Projects Max)". |

---

## Section 4: Critical Bugs, Hydration Mismatches & Route Gating Gaps

### 4.1 Critical State Sync Bug on Project Deletion
- **Location**: `src/app/projects/page.tsx` (Lines 97–107)
- **Observation**:
  ```tsx
  const handleDeleteProject = (id: string, type: "shopify" | "website") => {
    if (type === "shopify") {
      const updated = shopifyProjects.filter((p) => p.id !== id);
      setShopifyProjects(updated);
      localStorage.setItem("insforge_projects", JSON.stringify(updated));
    } else {
      const updated = websiteProjects.filter((p) => p.id !== id);
      setWebsiteProjects(updated);
      localStorage.setItem("obsidian_website_projects", JSON.stringify(updated));
    }
  };
  ```
- **Bug**: `handleDeleteProject` updates local state and `localStorage`, but **fails to call `refreshProjectCount()`**. As a result, the `AuthProvider` state (`user.projectCount`, `stats.totalCount`, `stats.isLimitReached`) and the `Sidebar` quota meter remain stale until a hard reload.

### 4.2 Initial Project Seeding Violates 3-Project Limit
- **Location**: `src/app/projects/page.tsx` (Lines 29–95)
- **Bug**: When a new user opens `/projects`, the app populates `DEFAULT_SHOPIFY_MOCKS` (2 items) and `DEFAULT_WEBSITE_MOCKS` (2 items). The total project count immediately reaches 4, triggering the "Quota Limit Reached" lock for free users on their very first visit.

### 4.3 Quota Definition Inconsistencies (2 vs 3 Projects)
- `AuthProvider.tsx` (Line 36): `const MAX_FREE_PROJECTS = 3;`
- `LandingPageClient.tsx` (Line 144): `${stats.totalCount}/3 Free Projects`
- `builder/page.tsx` (Line 296): `${stats.totalCount}/3 Free Projects`
- `Sidebar.tsx` (Lines 46–47): `maxProjects = user?.plan === "pro" ? "∞" : "2"`, `(projectCount / 2) * 100`
- `billing/page.tsx` (Lines 42, 109): `"Up to 2 AI store projects"`, `"Free Plan (2 Projects Max)"`
- `design-system/page.tsx` (Line 211): `"You are on the Free tier (2/2 projects used)."`
- **Resolution**: Unify everywhere to **3 Free Projects Max**.

### 4.4 Hydration Mismatch Vulnerabilities
1. **`Sidebar.tsx`**: Renders `user?.projectCount` and `maxProjects` immediately on server/client. Server has no `localStorage`, causing mismatch with client hydrated state.
2. **`SiteHeader.tsx` and `Header.tsx`**: Auth button state renders `user ? (...) : (...)` which evaluates to `null` on server and populated object on client.
3. **`LandingPageClient.tsx` and `builder/page.tsx`**: Already use `suppressHydrationWarning` and `mounted` flags, but a unified project hook with clean client-side mounting is needed across all consumers.

### 4.5 Route Gating Gaps
- There is no server middleware protecting `/projects`, `/editor/*`, or API endpoints.
- `/sign-in` and `/sign-up` are static dummy forms connected to `AuthProvider.signIn()` rather than secure authentication flows.
- Anonymous visitors can directly access `/editor/any-id` without login or quota checks.

---

## Section 5: Concrete Architectural Blueprint for Clerk Auth & 3-Project Quota

### 5.1 Architecture Overview

```
                          ┌──────────────────────────────────────────────┐
                          │            Next.js App Router App            │
                          │          (React 19 / Next 16)                │
                          └──────────────────────┬───────────────────────┘
                                                 │
                     ┌───────────────────────────┴───────────────────────────┐
                     ▼                                                       ▼
      ┌─────────────────────────────┐                         ┌─────────────────────────────┐
      │   src/middleware.ts         │                         │   src/app/layout.tsx        │
      │   clerkMiddleware()         │                         │   <ClerkProvider>           │
      │   Public: /, /builder,      │                         │   appearance={{             │
      │           /shopify, /sign-in│                         │     baseTheme: dark,        │
      │   Protected: /projects,     │                         │     variables: monochrome   │
      │              /editor/*      │                         │   }}                        │
      └─────────────────────────────┘                         └──────────────┬──────────────┘
                                                                             │
                     ┌───────────────────────────────────────────────────────┴───────────────────────┐
                     ▼                                                                               ▼
      ┌─────────────────────────────┐                                                 ┌─────────────────────────────┐
      │  Obsidian Website Builder   │                                                 │  Shopify Theme Studio       │
      │  - Route: /                 │                                                 │  - Route: /builder, /shopify│
      │  - Editor: /editor/[id]     │                                                 │  - Editor: /editor/[id]     │
      │  - Output: HTML + Tailwind  │                                                 │  - Output: Liquid 2.0 ZIP   │
      └──────────────┬──────────────┘                                                 └──────────────┬──────────────┘
                     │                                                                               │
                     └───────────────────────────────┬───────────────────────────────────────────────┘
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │   Unified Project Store     │
                                      │   src/lib/projects.ts       │
                                      │   useProjects & useQuota    │
                                      ├─────────────────────────────┤
                                      │ - Obsidian Projects (0..3)  │
                                      │ - Shopify Projects (0..3)   │
                                      │ - Total Quota = Obs + Shop  │
                                      │ - Free Tier: Max 3 Total    │
                                      │ - Pro Tier: Unlimited (∞)   │
                                      │ - Atomic Custom Event Sync  │
                                      └─────────────────────────────┘
```

### 5.2 Step-by-Step Implementation Blueprint

#### 1. Dependencies & Package Installation
- Install `@clerk/nextjs` (supporting React 19 / Next 16):
  ```bash
  npm install @clerk/nextjs
  ```
- Configure environment variables in `.env.local` and create `.env.example`:
  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
  ```

#### 2. Root Layout Integration (`src/app/layout.tsx`)
- Wrap the entire application in `<ClerkProvider>` configured with a luxury monochrome dark theme:
  ```tsx
  import { ClerkProvider } from "@clerk/nextjs";
  import { dark } from "@clerk/themes";

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#ffffff",
            colorBackground: "#09090b",
            colorText: "#f4f4f5",
            colorInputBackground: "#18181b",
            colorInputText: "#ffffff",
            borderRadius: "0.75rem",
          },
        }}
      >
        <html lang="en" className="h-full antialiased">
          <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
            <RootLayoutContent>{children}</RootLayoutContent>
          </body>
        </html>
      </ClerkProvider>
    );
  }
  ```

#### 3. Edge Route Middleware (`src/middleware.ts`)
- Implement Next.js middleware with `clerkMiddleware()`:
  ```ts
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

  const isPublicRoute = createRouteMatcher([
    "/",
    "/builder(.*)",
    "/shopify(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/billing(.*)",
    "/inspiration(.*)",
    "/design-system(.*)",
    "/api/(.*)",
  ]);

  export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });

  export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };
  ```

#### 4. Unified Project & Quota Service (`src/lib/projects.ts`)
- Create a single source of truth for both Obsidian and Shopify projects:
  - Supports user-scoped persistence (e.g. `obsidian_projects_${userId}` or global fallback).
  - Maintains `ProjectItem` interface with `type: "website" | "shopify"`.
  - Dispatches a custom window event (`"obsidian:projects-updated"`) whenever projects are created or deleted, ensuring all components in the active tab update instantly.
  - Computes:
    - `websiteCount`
    - `shopifyCount`
    - `totalCount = websiteCount + shopifyCount`
    - `maxFreeProjects = 3`
    - `isLimitReached = !isPro && totalCount >= 3`
    - `isPro = user?.publicMetadata?.plan === "pro" || isProTier`

#### 5. User Profile, Header & Navigation Integration
- Replace custom auth buttons in `SiteHeader.tsx`, `Header.tsx`, and `Sidebar.tsx` with Clerk primitives:
  - `<SignedIn>` -> Displays `<UserButton afterSignOutUrl="/" />` or custom monochrome user card.
  - `<SignedOut>` -> Displays monochrome `<SignInButton mode="modal">` or links to `/sign-in`.
- Update `Sidebar.tsx` quota bar:
  - Display `${totalCount}/3` for free tier, and `∞` for Pro plan.
  - Accurate progress bar percentage `(totalCount / 3) * 100`.

#### 6. Sign-In & Sign-Up Pages (`/sign-in`, `/sign-up`)
- Replace mock forms with Clerk's `<SignIn />` and `<SignUp />` components centered in luxury monochrome containers matching the Obsidian aesthetic:
  ```tsx
  import { SignIn } from "@clerk/nextjs";

  export default function SignInPage() {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)] bg-zinc-950">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    );
  }
  ```

#### 7. Strict Quota Enforcement Across Engines
- **Obsidian Website Builder (`/`)**:
  - Check `isLimitReached` before project creation.
  - If reached, open monochrome Quota Exceeded Modal offering Pro upgrade or workspace cleanup.
- **Shopify Theme Studio (`/builder`, `/shopify`)**:
  - Check `isLimitReached` before generating new store.
  - If reached, display Quota Exceeded Modal.
- **Projects Page (`/projects`)**:
  - Remove initial 4-project default seeding so new accounts start with `0/3` or `1/3` projects.
  - Call `deleteProject(id)` from the unified store, which automatically refreshes all quota meters.
- **Billing Page (`/billing`)**:
  - Update all plan descriptions to state "Up to 3 AI projects" on the Free tier and "Unlimited projects" on Pro.

---

## Section 6: Summary of Actionable Items for Implementers

| Priority | Area | Action Required |
|---|---|---|
| **P0** | **Dependencies** | Add `@clerk/nextjs` to `package.json`. |
| **P0** | **Middleware** | Create `src/middleware.ts` with `clerkMiddleware()` protecting `/projects` and `/editor/*`. |
| **P0** | **Root Layout** | Wrap `src/app/layout.tsx` in `<ClerkProvider>`. |
| **P0** | **Quota Store** | Implement unified `src/lib/projects.ts` handling both Website & Shopify projects with 3-project limit. |
| **P1** | **Projects Seeding Bug** | Fix `src/app/projects/page.tsx` default seeding so it does not exceed the 3-project limit. |
| **P1** | **Delete Sync Bug** | Ensure project deletion triggers unified quota refresh across `Sidebar`, `Header`, and studio pages. |
| **P1** | **Headers & Navbars** | Integrate Clerk `<UserButton />`, `<SignedIn>`, `<SignedOut>` with monochrome styling. |
| **P1** | **Sign-In / Sign-Up** | Replace mock pages in `src/app/sign-in` and `src/app/sign-up` with Clerk components. |
| **P2** | **Billing Text** | Align `/billing` and `/design-system` text to consistently state 3 free projects. |
