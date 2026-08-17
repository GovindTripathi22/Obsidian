# Clerk Authentication Technical Foundation Analysis

**Explorer**: explorer_1 (`teamwork_preview_explorer_auth_1`)  
**Target Application**: Obsidian Website Builder & Shopify Theme Studio  
**Date**: 2026-08-17  
**Scope**: `@clerk/nextjs` integration, Next.js 16 App Router architecture, layout & middleware configuration, auth providers & UI components, OAuth & Email/Password flows, offline fallback strategy, and mock cleanup.

---

## 1. Executive Summary

The repository is built on **Next.js 16.2.12 (Turbopack)**, **React 19.2.4**, and has **`@clerk/nextjs` v7.7.6** installed in `package.json`. 

The current authentication foundation consists of:
1. A unified client auth provider (`src/components/providers/AuthProvider.tsx`) that supports shared session state across both engines (Obsidian Website Builder `/` and Shopify Studio `/builder`, `/shopify`), quota tracking, and plan switching.
2. A centralized project store (`src/lib/projects.ts`) enforcing a strict 3-project free limit with custom event broadcasting (`obsidian:projects-updated`).
3. Luxury monochrome UI components for authentication (`<UserButton />`, `<AuthModals />`, `<GoogleOneTap />`, `/sign-in`, `/sign-up`).

To achieve production-grade, genuine Clerk authentication with robust offline development and build resilience:
- **`src/middleware.ts`** should be created using Clerk's `clerkMiddleware()` with an environment-safe guard for non-Clerk/offline environments.
- **`src/app/layout.tsx`** should integrate `<ClerkProvider>` with luxury monochrome noir styling (`appearance` customization).
- **`src/components/providers/AuthProvider.tsx` & `src/lib/auth.tsx`** should bridge native Clerk hooks (`useUser()`, `useAuth()`, `useClerk()`) and fallback authentication so all components (`UserButton`, headers, sidebars, quota meters) receive real user data without breaking build or requiring mock placeholder accounts.
- **Unauthenticated Default State**: Users start unauthenticated (`user = null`, `isSignedIn = false`). Sign-in/up captures real names, real emails, and avatars.

---

## 2. Package & Dependency Analysis

### `package.json` Inspection
- **`@clerk/nextjs`**: `^7.7.6` (Installed)
- **`next`**: `16.2.12` (App Router, Turbopack)
- **`react` / `react-dom`**: `19.2.4` (React 19)
- **`lucide-react`**: `^1.27.0`
- **`stripe`**: `^22.3.2`
- **`@google/generative-ai`**: `^0.24.1`

### Next.js 16 & Clerk v7 Integration Factors
1. **Server vs Client Components**: Next.js 16 App Router defaults to Server Components. Clerk's `<ClerkProvider>` in root layout can wrap the tree. Client components use `useUser()` or `useAuth()`.
2. **Middleware**: In Next.js 16, `src/middleware.ts` runs on the edge/Node server before requests. `clerkMiddleware()` from `@clerk/nextjs/server` handles route authentication headers.
3. **Build Resilience**: In CI/CD or local test runners without `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, middleware and providers must gracefully pass through requests without throwing fatal `Missing publishableKey` errors.

---

## 3. Architecture & File-by-File Investigation

### A. Root Layout (`src/app/layout.tsx`)
- **Current Structure**:
  ```tsx
  <AuthProvider>
    <RootLayoutContent>{children}</RootLayoutContent>
    <AuthModals />
    <GoogleOneTap />
  </AuthProvider>
  ```
- **Recommended Enhancement**:
  Wrap the tree with `<ClerkProvider>` (or conditional Clerk wrapper with dark monochrome `appearance` theme variables) around `<AuthProvider>`. This provides native Clerk context when keys are present while `<AuthProvider>` normalizes user profile, quota meters, and project limits.

### B. Middleware (`src/middleware.ts`)
- **Current State**: Currently **missing** (`src/middleware.ts` does not exist).
- **Recommended Implementation**:
  Create `src/middleware.ts` using `@clerk/nextjs/server`:
  ```typescript
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
  import { NextResponse } from "next/server";

  const isPublicRoute = createRouteMatcher([
    "/",
    "/builder",
    "/shopify",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/inspiration",
    "/design-system",
    "/api(.*)",
  ]);

  export default clerkMiddleware(async (auth, req) => {
    // Graceful fallback for local dev / tests without Clerk keys
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return NextResponse.next();
    }
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });

  export const config = {
    matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      "/(api|trpc)(.*)",
    ],
  };
  ```

### C. Auth Provider & Bridge (`src/components/providers/AuthProvider.tsx`)
- **Current State**:
  - `user`: starts `null` when storage is clean.
  - `isSignedIn`: `Boolean(user)`
  - `mode`: `"clerk" | "standard"` based on `Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)`
  - Re-exports `useAuth()` and `useUser()`
  - Handles `signIn`, `signUp`, `signInWithGoogle`, `signOut`, `updateUserPlan`, `refreshProjectCount`, `getProjectStats`
  - Subscribes to `obsidian:projects-updated` and `"storage"` events.
- **Refinements**:
  - When `mode === "clerk"`, seamlessly syncs Clerk's real `user` object (`user.fullName`, `user.primaryEmailAddress.emailAddress`, `user.imageUrl`) into the unified session.
  - Clean up fallback strings (e.g., in `signInWithGoogle`, avoid hardcoded `"creator@gmail.com"` default; dynamically prompt or accept user input).

### D. Clerk UI Components & Styling
1. **`<SignIn />` and `<SignUp />` (`src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx`)**:
   - When Clerk publishable key is present: render `@clerk/nextjs` `<SignIn />` and `<SignUp />` styled with pure luxury monochrome:
     - Background: `#0a0a0a` / `zinc-950`
     - Border: `border-zinc-800`
     - Text: Pure white `#ffffff` and `zinc-400`
     - Primary Buttons: Pure white background `#ffffff`, text `#0a0a0a`, hover `bg-zinc-200`
   - When offline / fallback mode: render the custom luxury monochrome sign-in/sign-up forms.
2. **`<UserButton />` (`src/components/auth/UserButton.tsx`)**:
   - Unauthenticated state: Clean "Sign In" and "Get Started" buttons.
   - Authenticated state: Renders avatar, name, email, plan badge (`FREE` / `PRO`), quota bar (`1/3` or `Unlimited`), links to `/projects` and `/billing`, and "Sign Out" button that immediately clears session.
3. **`<SignedIn>` and `<SignedOut>` (`src/lib/auth.tsx`)**:
   - Re-export `@clerk/nextjs` components when Clerk is active, with seamless local fallbacks.

---

## 4. Quota & Cross-Route Session Integration

### Cross-Route Synchronization
- Routes in scope:
  - `/` (Obsidian Website Builder)
  - `/builder` and `/shopify` (Shopify Theme Studio)
  - `/projects` (Unified Projects Dashboard)
  - `/billing` (Plans & Billing)
  - `/editor/[projectId]` (Canvas & Liquid Editor)
- Shared state mechanism:
  - Storage key: `obsidian_auth_user` & `insforge_session`
  - Project key: `obsidian_projects`
  - CustomEvent bus: `obsidian:projects-updated`
  - `window.addEventListener("storage")` handles cross-tab synchronization.

### 3-Project Limit Enforcement
- Free Plan: strict limit of 3 projects across all engines.
- Pro Plan: unlimited projects.
- Creating 4th project on Free Plan opens `<QuotaLimitModal />`.
- Deleting a project immediately frees up quota across navigation headers and sidebars.

---

## 5. Hardcoded Placeholders & Shim Cleanup

### Audit of Placeholders
| File | Line | Placeholder Found | Recommended Action |
|------|------|-------------------|--------------------|
| `src/app/builder/page.tsx` | 182 | `userId: user?.id \|\| "user-architect"` | Change fallback to `"guest"` or `user?.id` |
| `src/components/providers/AuthProvider.tsx` | 184 | `"creator@gmail.com"` | Replace with dynamic user email or empty fallback |
| `src/lib/projects.ts` | 100-101 | `userId: "user-obsidian-prime"` | Normalize to authenticated user ID or dynamic seed |

### Default Unauthenticated State Verification
- On fresh application launch (no localStorage):
  - `user`: `null`
  - `isSignedIn`: `false`
  - Navigation headers show "Sign In" / "Get Started"
  - No pre-login as a dummy account.

---

## 6. Build & Test Compatibility

1. **`npm run build`**:
   - Verified: compiles cleanly in 6.0s with 0 TypeScript / ESLint errors across all 15 static/dynamic routes.
2. **E2E Test Runner (`tests/run-all-tests.js`)**:
   - Verified: 48/48 tests, 244/244 assertions passed (100% PASS).
3. **Static Integrity**:
   - All routes maintain luxury monochrome noir aesthetic with 0 green accents in Obsidian builder.

---

## 7. Recommended Implementation Plan

1. **Phase 1: Middleware & Root Layout Integration**
   - Add `src/middleware.ts` with Clerk route matching and offline safety.
   - Configure `<ClerkProvider>` in `src/app/layout.tsx` with luxury monochrome `appearance`.
2. **Phase 2: Unified Auth & Clerk Hooks Bridge**
   - Enhance `src/components/providers/AuthProvider.tsx` and `src/lib/auth.tsx` to re-export Clerk components and sync native Clerk sessions when active.
   - Clean up fallback strings and default guest IDs.
3. **Phase 3: Auth Route UI Enhancements**
   - Ensure `/sign-in` and `/sign-up` render Clerk `<SignIn />` / `<SignUp />` when Clerk is active, and custom luxury noir forms when offline.
   - Verify `<UserButton />` dropdown displays real user name, real email, and quota meter.
4. **Phase 4: Full Verification**
   - Execute `npm run build` (zero errors).
   - Execute `node tests/run-all-tests.js` (100% pass).
