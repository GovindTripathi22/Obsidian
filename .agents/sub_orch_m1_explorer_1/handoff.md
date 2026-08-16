# Handoff Report: Milestone 1 — Clerk Auth Integration & Offline Dual-Mode Architecture

**Agent**: Explorer 1 (`sub_orch_m1_explorer_1`)  
**Working Directory**: `d:\app\.agents\sub_orch_m1_explorer_1`  
**Milestone**: Milestone 1 — Clerk Authentication & Quota System  
**Handoff Type**: Hard (Comprehensive Architectural Investigation & Implementation Blueprint)  
**Target File**: `d:\app\.agents\sub_orch_m1_explorer_1\handoff.md`  

---

## 1. Observation

A systematic inspection of the entire codebase (`d:\app`) revealed the following exact facts:

### 1.1 Dependency & Environment Status
1. **`package.json`**:
   - `next: 16.2.12`, `react: 19.2.4`, `react-dom: 19.2.4`, `tailwindcss: ^4`, `@google/generative-ai: ^0.24.1`, `stripe: ^22.3.2`.
   - `@clerk/nextjs` is currently **not listed** in `dependencies`.
2. **Environment Configuration**:
   - No `.env`, `.env.local`, or `.env.example` files are present in `d:\app`.
   - If `@clerk/nextjs` `<ClerkProvider>` is mounted unconditionally without valid `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`, `next build` / static generation throws a runtime error (`Missing publishableKey`) and fails.

### 1.2 Layout & Provider Tree
1. **`src/app/layout.tsx` (Lines 17–25)**:
   - Wraps children in `<AuthProvider><RootLayoutContent>{children}</RootLayoutContent></AuthProvider>`.
   - Line 19 contains green selection styling: `selection:bg-emerald-900/40 selection:text-white`.
   - No ClerkProvider or Clerk theme configuration exists.
2. **`src/components/providers/RootLayoutContent.tsx` (Lines 10–28)**:
   - Treats `/`, `/builder`, `/shopify`, `/editor/*` as full-width studios without layout sidebar/header.
   - Renders `<Sidebar />`, `<Header />`, and `<main className="pt-16 pl-64 ...">` for management pages (`/projects`, `/billing`, `/inspiration`, `/design-system`).

### 1.3 Existing Auth Provider (`src/components/providers/AuthProvider.tsx`)
1. **Mock User & Storage (Lines 26–35, 88–108)**:
   - Default user is hardcoded: `id: "user-obsidian-prime"`, `email: "developer@obsidian.ai"`, `name: "Obsidian Creator"`, `plan: "free"`, `projectCount: 1`.
   - Project count is computed by manually parsing two disjoint localStorage keys (`"insforge_projects"` and `"obsidian_website_projects"`).
2. **Missing In-Memory / Cross-Component Event Sync (Lines 110–121)**:
   - Listens to native window `storage` events, which in browsers only fire across *different* tabs/windows, NOT within the same window when `localStorage.setItem()` is executed.
3. **No Dual Mode / No Clerk Hooks**:
   - Only exports custom `useAuth()`. Does not support `@clerk/nextjs` hooks (`useUser()`, `useClerk()`, `<UserButton />`, `<SignedIn />`, `<SignedOut />`).

### 1.4 Route & Component Auth Touchpoints
1. **`src/components/Header.tsx` (Lines 41–70)**:
   - Renders user name, email, and a `<button onClick={() => signOut()}>` or Sign In / Sign Up buttons.
   - Styled with emerald pulse dot on Gemini streaming indicator (Line 26).
2. **`src/components/SiteHeader.tsx` (Lines 53–83)**:
   - Renders user name or Sign In / Get Started buttons with emerald logo glow and badge (Lines 22, 28).
3. **`src/components/Sidebar.tsx` (Lines 45–48, 131–177)**:
   - Quota card displays `projectCount / maxProjects`.
   - Line 46 hardcodes: `maxProjects = user?.plan === "pro" ? "∞" : "2"` (contradicting the 3-project rule).
   - User footer shows single-letter avatar, name, email, and Sign Out button.
4. **`src/app/sign-in/page.tsx` & `src/app/sign-up/page.tsx`**:
   - Custom forms calling `signIn`, `signUp`, and `signInWithGoogle` from `useAuth()`.
   - Uses emerald buttons (`bg-emerald-600`), icons, and glow effects.
5. **`src/app/projects/page.tsx`**:
   - Lines 29–66: Seeds 2 Shopify mock projects and 2 Website mock projects (total 4 projects), immediately exceeding the 3-project free limit on initial page load.
   - Lines 97–107 (`handleDeleteProject`): Deletes project from local component state and localStorage, but does not notify `AuthProvider` or other components.
6. **`src/app/billing/page.tsx`**:
   - Line 42 states: `"Up to 2 AI store projects"`, inconsistent with the 3-project limit.
7. **`src/app/builder/page.tsx` & `src/components/LandingPageClient.tsx`**:
   - Checks `stats.isLimitReached` and opens quota upgrade modal when free user attempts to create more than `MAX_FREE_PROJECTS`.

---

## 2. Logic Chain

1. **Why Direct Clerk Installation Is Fragile**:
   - In production environments where real Clerk keys are set (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`), Clerk provides authentication, session cookies, OAuth, and user management.
   - However, during CI/CD pipelines, automated testing, offline local development, or environments where Clerk keys are missing or unconfigured, wrapping Next.js App Router in `<ClerkProvider>` causes static page pre-rendering to crash (`Missing publishableKey`).
2. **Why an Offline Dual-Mode Architecture Is Essential**:
   - A dual-mode provider checks if a valid Clerk Publishable Key (`pk_...`) is configured in the environment.
   - If present, it initializes Clerk with a dark monochrome luxury theme.
   - If absent or running offline, it gracefully falls back to an in-memory & `localStorage`-persisted Luxury Mock Provider that implements identical method signatures, user profiles, and dark modal UI components (Email/Password, Google One-Tap, Plan Toggle, User Profile Dialog).
   - This guarantees that `npm run build` passes 100% cleanly without external network calls or missing environment errors.
3. **Unified Project Repository (`src/lib/projects.ts`)**:
   - Project storage must be abstracted into a single canonical API (`getProjects()`, `getProjectById()`, `saveProject()`, `deleteProject()`, `getProjectCount()`, `canCreateProject()`).
   - Every mutation in `src/lib/projects.ts` dispatches a `window.dispatchEvent(new CustomEvent("obsidian:projects-updated"))`.
   - `AuthProvider` subscribes to `"obsidian:projects-updated"`, updating `user.projectCount` and `getProjectStats()` in real-time across all components (Sidebar, Billing, Projects, Builder, Editor) without needing full page reloads.
4. **Quota Alignment & Initial Seeding**:
   - `MAX_FREE_PROJECTS` is set to `3`.
   - Initial project seeding in `/projects` is reduced to 1 project (`LuxeAura Cosmetics Store`), giving new users an immediate status of `1/3 Free Projects Used` (2 available slots).
   - All UI copy across `Sidebar.tsx`, `billing/page.tsx`, `design-system/page.tsx`, and `LandingPageClient.tsx` is harmonized to "3 Free Projects".

---

## 3. Caveats

1. **React 19 & Next.js 16 Package Compatibility**:
   - If `@clerk/nextjs` is installed with `@clerk/nextjs@latest`, npm peer-dependency flags might be needed (`--legacy-peer-deps` or `--force`) if Clerk's peer dependencies for React 19 are strictly bound. The dual-mode architecture ensures that whether `@clerk/nextjs` is installed or not, the application compiles and functions cleanly.
2. **Server-Side Route Middleware**:
   - If `src/middleware.ts` uses `clerkMiddleware()`, it must be guarded with fallback handling so requests are not blocked or errored when Clerk keys are absent.
3. **SSR Hydration Safety**:
   - Client-side storage (`localStorage`) access must occur inside `useEffect` or behind a `mounted` state guard to avoid React 19 hydration mismatches.

---

## 4. Conclusion & Detailed Implementation Plan

### 4.1 Architecture Diagram: Dual-Mode Auth & Quota Engine

```
                               ┌────────────────────────────────────────────────────────┐
                               │                 src/app/layout.tsx                     │
                               │                <RootLayoutContent>                     │
                               └────────────────────────┬───────────────────────────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │      <AuthProvider>       │
                                          │  (src/lib/auth-context)   │
                                          └─────────────┬─────────────┘
                                                        │
                         ┌──────────────────────────────┴──────────────────────────────┐
                         │                                                             │
           [If NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY]                        [If Clerk Keys Absent / Offline]
                         ▼                                                             ▼
           ┌────────────────────────────┐                                ┌────────────────────────────┐
           │      <ClerkProvider>       │                                │   <OfflineAuthProvider>    │
           │  • Dark Monochrome Theme   │                                │  • LocalStorage Session    │
           │  • Clerk User Sync Bridge  │                                │  • Luxury Dark Modals      │
           │  • Live Clerk Auth Hooks   │                                │  • Google One-Tap Sim      │
           └─────────────┬──────────────┘                                └─────────────┬──────────────┘
                         │                                                             │
                         └──────────────────────────────┬──────────────────────────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │     Unified Auth API      │
                                          │  • useAuth()              │
                                          │  • useUser()              │
                                          │  • <UserButton />         │
                                          │  • <AuthModals />         │
                                          └─────────────┬─────────────┘
                                                        │
                                   ┌────────────────────┴────────────────────┐
                                   ▼                                         ▼
                     ┌───────────────────────────┐             ┌───────────────────────────┐
                     │    UI Consumer Layer      │             │   src/lib/projects.ts     │
                     │ • Header / SiteHeader     │ ◄────────── │ • Unified Project Storage │
                     │ • Sidebar (3-project bar) │  "obsidian: │ • MAX_FREE_PROJECTS = 3   │
                     │ • /projects, /billing     │  projects-  │ • canCreateProject()      │
                     │ • /editor, /builder       │   updated"  │ • Event Bus Dispatcher    │
                     └───────────────────────────┘             └───────────────────────────┘
```

---

### 4.2 Detailed Component & Interface Specifications

#### 1. Core Auth Interfaces (`src/lib/auth-types.ts` or inside `src/components/providers/AuthProvider.tsx`)

```typescript
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  plan: "free" | "pro";
  projectCount: number;
}

export interface ProjectStats {
  shopifyCount: number;
  websiteCount: number;
  totalCount: number;
  maxFreeProjects: number;
  isLimitReached: boolean;
  isPro: boolean;
}

export interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthUser | null;
  mode: "clerk" | "offline-mock";
  // Auth operations
  signIn: (email: string, pass?: string) => Promise<void>;
  signUp: (email: string, pass?: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  // Modal controllers
  openSignIn: () => void;
  openSignUp: () => void;
  openUserProfile: () => void;
  closeModals: () => void;
  activeModal: "sign-in" | "sign-up" | "user-profile" | null;
  // Plan switch helper (for preview & testing)
  updateUserPlan: (plan: "free" | "pro") => void;
  // Quota helpers
  refreshProjectCount: () => void;
  getProjectStats: () => ProjectStats;
}
```

#### 2. Unified Project Repository (`src/lib/projects.ts`)

```typescript
export interface Project {
  id: string;
  title: string;
  type: "shopify" | "website";
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  data?: any;
  prompt?: string;
  user_id?: string;
}

export const MAX_FREE_PROJECTS = 3;
export const PROJECTS_UPDATED_EVENT = "obsidian:projects-updated";

const STORAGE_KEY_SHOPIFY = "insforge_projects";
const STORAGE_KEY_WEBSITE = "obsidian_website_projects";

export function getProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const shopifyRaw = JSON.parse(localStorage.getItem(STORAGE_KEY_SHOPIFY) || "[]");
    const websiteRaw = JSON.parse(localStorage.getItem(STORAGE_KEY_WEBSITE) || "[]");
    
    const shopifyList: Project[] = Array.isArray(shopifyRaw) ? shopifyRaw.map(p => ({
      id: p.id,
      title: p.title || "Untitled Store",
      type: "shopify" as const,
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || p.created_at || new Date().toISOString(),
      thumbnail: p.thumbnail_url || p.thumbnail,
      prompt: p.prompt,
      user_id: p.user_id,
      data: p.data
    })) : [];

    const websiteList: Project[] = Array.isArray(websiteRaw) ? websiteRaw.map(p => ({
      id: p.id,
      title: p.title || "Untitled Website",
      type: "website" as const,
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || p.created_at || new Date().toISOString(),
      thumbnail: p.thumbnail_url || p.thumbnail,
      prompt: p.prompt,
      user_id: p.user_id,
      data: p.data
    })) : [];

    return [...shopifyList, ...websiteList].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (e) {
    console.error("Error reading projects:", e);
    return [];
  }
}

export function getProjectById(id: string): Project | undefined {
  const all = getProjects();
  return all.find(p => p.id === id);
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;
  const isShopify = project.type === "shopify";
  const key = isShopify ? STORAGE_KEY_SHOPIFY : STORAGE_KEY_WEBSITE;
  
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = existing.filter((p: any) => p.id !== project.id);
    
    // Store in normalized format
    const itemToStore = {
      id: project.id,
      title: project.title,
      prompt: project.prompt || project.title,
      thumbnail_url: project.thumbnail,
      created_at: project.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: project.user_id || "guest",
      data: project.data,
    };
    
    localStorage.setItem(key, JSON.stringify([itemToStore, ...filtered]));
    notifyProjectsUpdated();
  } catch (e) {
    console.error("Error saving project:", e);
  }
}

export function deleteProject(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const shopifyExisting = JSON.parse(localStorage.getItem(STORAGE_KEY_SHOPIFY) || "[]");
    const updatedShopify = shopifyExisting.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_SHOPIFY, JSON.stringify(updatedShopify));

    const websiteExisting = JSON.parse(localStorage.getItem(STORAGE_KEY_WEBSITE) || "[]");
    const updatedWebsite = websiteExisting.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_WEBSITE, JSON.stringify(updatedWebsite));

    notifyProjectsUpdated();
  } catch (e) {
    console.error("Error deleting project:", e);
  }
}

export function getProjectCount(): { totalCount: number; shopifyCount: number; websiteCount: number } {
  if (typeof window === "undefined") return { totalCount: 0, shopifyCount: 0, websiteCount: 0 };
  try {
    const shopify = JSON.parse(localStorage.getItem(STORAGE_KEY_SHOPIFY) || "[]");
    const website = JSON.parse(localStorage.getItem(STORAGE_KEY_WEBSITE) || "[]");
    const sCount = Array.isArray(shopify) ? shopify.length : 0;
    const wCount = Array.isArray(website) ? website.length : 0;
    return { shopifyCount: sCount, websiteCount: wCount, totalCount: sCount + wCount };
  } catch {
    return { shopifyCount: 0, websiteCount: 0, totalCount: 0 };
  }
}

export function canCreateProject(isPro: boolean): boolean {
  if (isPro) return true;
  const { totalCount } = getProjectCount();
  return totalCount < MAX_FREE_PROJECTS;
}

export function notifyProjectsUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
  }
}
```

#### 3. Luxury User Profile & Auth Modals (`src/components/auth/AuthModals.tsx` & `UserButton.tsx`)

- **`UserButton.tsx`**:
  - Interactive avatar button displaying user image or monogram.
  - Dropdown popover with:
    - User name, email, and subscription plan badge (`Free Starter` / `Pro Plan`).
    - Quota meter bar showing `X / 3 Free Projects Used` (or `Unlimited` for Pro).
    - Quick "Toggle Pro / Free Tier" button for instant offline quota testing.
    - Direct link to `/projects`, `/billing`, and `/design-system`.
    - Sign Out button with subtle hover animation.
- **`AuthModals.tsx`**:
  - **Sign-In Modal**:
    - High-contrast noir design: `bg-zinc-950/95 border border-zinc-800 text-zinc-100 backdrop-blur-2xl`.
    - One-click Google Sign-in simulation button.
    - Quick-fill demo account pills: `[Demo Free User]`, `[Pro Studio Admin]`.
    - Email/password input fields with clean zinc focus rings.
  - **Sign-Up Modal**:
    - Full Name, Email, Password inputs.
    - Immediate activation into session.
  - **User Profile Modal**:
    - Account details: Email, Name, Joined Date, Current Plan.
    - Plan upgrade button redirecting to `/billing`.
    - Project history summary.
- **`GoogleOneTap.tsx`**:
  - Smooth floating prompt in the lower-right corner for first-time / logged-out visitors.
  - Allows 1-click instant login as `Google Creator` with Pro plan.

---

### 4.3 Exact File Changes & Action Matrix

| Target File | Changes Required | Rationale |
|-------------|------------------|-----------|
| `src/lib/projects.ts` | **Create new file**: Implement canonical project repository, unified CRUD operations, `MAX_FREE_PROJECTS = 3`, and `"obsidian:projects-updated"` CustomEvent dispatcher. | Single source of truth for project counts, storage, and quota enforcement. |
| `src/components/providers/AuthProvider.tsx` | **Refactor**: Support dual mode (Clerk when keys exist, Luxury Offline Mock when keys are missing), unified `useAuth()` & `useUser()` hooks, modal controllers, listen to `"obsidian:projects-updated"`. | Seamless auth across online & offline environments without breaking `npm run build`. |
| `src/components/auth/UserButton.tsx` | **Create new file**: Monochrome luxury UserButton with avatar dropdown, quota meter, plan badge, quick plan toggle, and Sign Out. | Replaces raw sign out buttons with a polished luxury profile widget. |
| `src/components/auth/AuthModals.tsx` | **Create new file**: Dark luxury modal dialogs for SignIn, SignUp, and UserProfile with Google 1-tap simulation and demo accounts. | Provides Clerk-like modal authentication experience in offline fallback mode. |
| `src/components/auth/GoogleOneTap.tsx` | **Create new file**: Floating Google One-Tap simulated widget for quick 1-click sign-in. | Enhances UX on landing and builder pages. |
| `src/components/Header.tsx` | **Update**: Replace plain text & raw logout button with `<UserButton />`, remove green streaming dot in favor of zinc monochrome indicator. | Visual polish and unified user session control. |
| `src/components/SiteHeader.tsx` | **Update**: Replace raw buttons with `<UserButton />` and `<AuthModals />` triggers, replace emerald logo badge with pure monochrome noir logo. | Consistency with Obsidian luxury noir design. |
| `src/components/Sidebar.tsx` | **Update**: Fix quota display to `3` projects max (`maxProjects = user?.plan === "pro" ? "∞" : "3"`), replace raw footer with `<UserButton />`. | Resolves quota mismatch bug and harmonizes free tier limits. |
| `src/app/projects/page.tsx` | **Update**: Use `src/lib/projects.ts` for all reads/deletes. Seed max 1 mock project (`LuxeAura Cosmetics`) instead of 4 projects. Call `deleteProject(id)` which automatically fires event and updates quota. | Fixes quota breach on first load and guarantees real-time quota sync upon deletion. |
| `src/app/billing/page.tsx` | **Update**: Correct Free plan description to `"Up to 3 AI store projects (Obsidian & Shopify)"`. Connect tier upgrade to `updateUserPlan("pro")`. | Fixes copy mismatch and enables interactive plan toggling. |
| `src/app/design-system/page.tsx` | **Update**: Correct copy from `"2/2 projects used"` to `"3/3 projects used"`. | Copy harmonization across all pages. |
| `src/app/builder/page.tsx` & `src/components/LandingPageClient.tsx` | **Update**: Use `saveProject` from `src/lib/projects.ts` when creating new stores/websites, enforcing `stats.isLimitReached` guard. | Ensures consistent storage format and quota event propagation. |
| `src/app/sign-in/page.tsx` & `src/app/sign-up/page.tsx` | **Update**: Restyle forms to pure monochrome noir (removing emerald buttons and glows in favor of white/zinc luxury styling). | Removes all green accents and aligns with design system. |

---

## 5. Verification Method

To verify the dual-mode auth architecture and quota enforcement:

### 5.1 Verification Commands
1. **TypeScript Type Checking**:
   ```powershell
   npx tsc --noEmit
   ```
   *Pass Criteria*: Exit code 0, 0 type errors.

2. **Next.js Production Build Validation**:
   ```powershell
   npm run build
   ```
   *Pass Criteria*: Clean build with 0 prerender errors, 0 missing Clerk key errors, and all routes (`/`, `/builder`, `/shopify`, `/projects`, `/billing`, `/editor/[projectId]`, `/sign-in`, `/sign-up`, `/design-system`, `/inspiration`) compiled successfully.

### 5.2 Functional Validation Scenarios
1. **Offline Dual-Mode Fallback**:
   - Verify that without `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, the application loads with `<OfflineAuthProvider>`.
   - Verify clicking "Sign In" opens the luxury dark Sign-In modal.
   - Verify clicking "Continue with Google" signs in as `Google Creator (Pro Plan)`.
   - Verify clicking "Sign Out" returns user to guest state.
2. **Strict 3-Project Quota Enforcement**:
   - Navigate to `/projects`. Verify initial state shows **1 project** (`LuxeAura Cosmetics Store`).
   - In `Sidebar.tsx`, verify quota meter displays `1/3` (Free Tier).
   - Create 2 additional projects from `/` or `/builder`. Verify quota meter updates to `3/3`.
   - Attempt to create a 4th project on Free Tier: verify the Upgrade Quota Modal appears and prevents project creation.
   - Delete 1 project in `/projects`: verify `Sidebar.tsx` and `AuthProvider` immediately update to `2/3` without page reload.
3. **Copy Harmonization**:
   - Check `Sidebar.tsx`, `billing/page.tsx`, `design-system/page.tsx`, `LandingPageClient.tsx` all consistently read `3 Free Projects` (never 2 or 4).
