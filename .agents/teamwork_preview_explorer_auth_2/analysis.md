# User Profile Handling, UI Components & Mock Elimination Analysis

**Agent**: explorer_2 (`teamwork_preview_explorer_auth_2`)  
**Scope**: Obsidian Website Builder (`/`, `/editor/*`, `/projects`, `/billing`, `/design-system`, `/inspiration`) & Shopify Theme Studio (`/builder`, `/shopify`)  
**Timestamp**: 2026-08-17T10:48:00Z  

---

## 1. Executive Summary

This investigation analyzes the user profile architecture, UI components, navigation shells, signed-out vs. signed-in states, and mock elimination across Obsidian Website Builder and Shopify Theme Studio.

### Core Discoveries
1. **Absence of Legacy Names**: In the active `src/` application code, legacy names ("Alex Johnson", "Alex Morgan", "developer@obsidian.ai") have already been completely removed.
2. **Residual Mock IDs & Fallbacks Identified**:
   - `src/lib/projects.ts` (lines 100, 101, 165, 166, 195, 196): Uses `"user-obsidian-prime"`.
   - `src/app/builder/page.tsx` (line 182): Uses `userId: user?.id || "user-architect"`.
   - `src/components/providers/AuthProvider.tsx` (line 184): Uses fallback email `"creator@gmail.com"`.
   - `src/components/auth/GoogleOneTap.tsx` (line 68): Hardcodes button text `"Sign In as Google Creator"`.
3. **Navigation Shell Architecture**:
   - Full-width immersive routes (`/`, `/builder`, `/shopify`, `/editor/[projectId]`): Controlled by `SiteHeader.tsx` or editor topbars, embedding `<UserButton />`.
   - Management & account routes (`/projects`, `/billing`, `/design-system`, `/inspiration`, `/sign-in`, `/sign-up`): Wrapped in `RootLayoutContent.tsx` with `<Sidebar />` and `<Header />`, both embedding `<UserButton showDetails />`.
4. **Default Unauthenticated State**:
   - `AuthProvider.tsx` initializes `user` state to `null` if no active session exists in localStorage.
   - When signed out, `<UserButton />` cleanly displays two actionable buttons: `"Sign In"` (opens Sign In modal) and `"Get Started"` (opens Sign Up modal).
5. **Dynamic Real Profile Integration**:
   - Real credentials (name, email, avatar image or capitalized initial letter) dynamically flow into `<UserButton />`, the dropdown menu, and the `<AuthModals />` User Profile modal.
   - `useUser()` hook alias conforms to Clerk's `User` object format (`id`, `fullName`, `primaryEmailAddress.emailAddress`, `imageUrl`, `publicMetadata.plan`).
6. **Immediate Sign-Out State Reset**:
   - `signOut()` removes session keys and sets `user` to `null`, instantly resetting all headers, sidebars, and modals to the signed-out state across all routes.

---

## 2. Hardcoded User Profile Placeholders & Mock Elimination Audit

| Location | Line # | Current Code / String | Problem | Proposed Solution |
|---|---|---|---|---|
| `src/app/builder/page.tsx` | 182 | `userId: user?.id \|\| "user-architect"` | Hardcoded placeholder `"user-architect"` leaks into project records when guest saves a Shopify store | Change to `userId: user?.id \|\| "guest"` |
| `src/lib/projects.ts` | 100, 101 | `userId: "user-obsidian-prime"`, `user_id: "user-obsidian-prime"` | Hardcoded mock ID in `INITIAL_DEFAULT_MOCKS` | Change to `userId: "guest"`, `user_id: "guest"` |
| `src/lib/projects.ts` | 165, 166, 195, 196 | `userId: item.userId \|\| item.user_id \|\| "user-obsidian-prime"` | Legacy migration fallback sets `"user-obsidian-prime"` | Change to `userId: item.userId \|\| item.user_id \|\| "guest"` |
| `src/components/providers/AuthProvider.tsx` | 184 | `const email = customEmail?.trim() \|\| "creator@gmail.com";` | Mock email string in Google authentication fallback | Use `customEmail?.trim() \|\| "user@gmail.com"` or prompt/session-derived email |
| `src/components/auth/GoogleOneTap.tsx` | 68 | `Sign In as Google Creator` | Hardcoded label refers to "Google Creator" placeholder persona | Update button text to `Sign In with Google` |

---

## 3. Navigation Headers, Sidebars & Topbars Inspection

### 3.1 Route-by-Route Navigation Matrix

| Route | Layout Container | Navigation Header | Sidebar Present? | Auth Component Used |
|---|---|---|---|---|
| `/` (Obsidian Landing) | `RootLayoutContent` (Full width) | `SiteHeader.tsx` | No | `<UserButton />` |
| `/builder` (Shopify Studio) | `RootLayoutContent` (Full width) | `SiteHeader.tsx` | No | `<UserButton />` |
| `/shopify` (Shopify Studio Alias) | `RootLayoutContent` (Full width) | `SiteHeader.tsx` | No | `<UserButton />` |
| `/editor/[projectId]` (Editor) | `RootLayoutContent` (Full width) | Custom Editor Header (`page.tsx:480-540`) | No (Has left collapsible AI assistant panel) | `<UserButton />` |
| `/projects` (Project Repository) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |
| `/billing` (Plans & Billing) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |
| `/design-system` (Tokens & Showcase) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |
| `/inspiration` (Template Gallery) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |
| `/sign-in` (Auth Login) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |
| `/sign-up` (Auth Registration) | `RootLayoutContent` (Standard shell) | `Header.tsx` | Yes (`Sidebar.tsx`) | `<UserButton showDetails />` (Header & Sidebar) |

### 3.2 Component Details

#### A. `SiteHeader.tsx` (`src/components/SiteHeader.tsx`)
- **Position**: Sticky top (`sticky top-0 z-50`), max-width 6xl, backdrop blur noir (`bg-[#0a0a0a]/90`).
- **Left**: Obsidian brand logo + "Obsidian" text.
- **Center**: `<BuilderSwitcher active={isShopify ? "shopify" : "website"} size="md" />`.
- **Right**:
  - Link to `/projects?tab=shopify` or `/projects?tab=website`.
  - Link to `/billing` ("Pricing").
  - `<UserButton />` (compact mode).

#### B. `Header.tsx` (`src/components/Header.tsx`)
- **Position**: Fixed top bar offset by sidebar (`fixed top-0 right-0 left-64 h-14`), backdrop blur noir (`bg-[#0a0a0a]/90`).
- **Left**: `<BuilderSwitcher size="sm" />`, Gemini model badge (`Gemini 2.5 Flash`).
- **Right**: Link to `/design-system` ("Design Tokens"), `<UserButton showDetails />`.

#### C. `Sidebar.tsx` (`src/components/Sidebar.tsx`)
- **Position**: Fixed left bar (`fixed top-0 left-0 bottom-0 w-64`), dark background (`bg-[#0a0a0a]`).
- **Top**: Obsidian brand logo, "Active Engine" widget with one-click switcher.
- **Nav Links**: Website Builder (`/`), Shopify Studio (`/builder`), Projects (`/projects`), Inspiration (`/inspiration`), Billing (`/billing`), Design System (`/design-system`).
- **Footer**:
  - Live Quota progress bar with percentage fill (`${projectCount}/${maxProjects}`).
  - Upgrade to Pro link (for free users).
  - User container with `<UserButton showDetails />`.

#### D. Editor Topbar (`src/app/editor/[projectId]/page.tsx:480-540`)
- **Position**: Sticky top bar inside workspace editor.
- **Left**: Back to home arrow, project title, page tab selector.
- **Center**: Responsive Viewport Switcher (Desktop 100%, Tablet 768px, Mobile 375px).
- **Right**: Export buttons (ZIP, PNG Mockup) and `<UserButton />`.

---

## 4. Default Signed-Out State Specification

When a visitor loads the application for the first time with an empty browser session:

1. **Auth Context Initialization**:
   - `AuthProvider.tsx` attempts to read `obsidian_auth_user` and `insforge_session` from `localStorage`.
   - If not found or empty, `user` is set to `null`.
   - `loading` resolves to `false`, `isLoaded: true`, `isSignedIn: false`.
   - **No automatic mock login occurs.**

2. **UI Component Rendering in Signed-Out State**:
   - In `<UserButton />`:
     ```tsx
     if (!user) {
       return (
         <div className="flex items-center gap-2">
           <button
             type="button"
             onClick={openSignIn}
             className="text-xs font-medium text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-neutral-900 cursor-pointer"
           >
             Sign In
           </button>
           <button
             type="button"
             onClick={openSignUp}
             className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-neutral-200 font-medium text-xs transition-colors cursor-pointer shadow-sm"
           >
             Get Started
           </button>
         </div>
       );
     }
     ```
   - In `<GoogleOneTap />`:
     - After 2 seconds, displays a sleek floating card in bottom-right corner offering "Continue with Google".
     - Dismissible via "X" or "Not now". Does not force modal blocking.

3. **Quota & Action Enforcement for Unauthenticated Visitors**:
   - Guests can interact with the prompt inputs on `/` and `/builder`.
   - Creating a project assigns `userId: "guest"`.
   - The 3-project free limit is strictly enforced via `canCreateProject(false)`.

---

## 5. Dynamic Real Profile, `<UserButton />` & Modal Specification

### 5.1 Real User Profile Schema

```typescript
export interface AuthUser {
  id: string;             // e.g. "usr_1723891234567" or Clerk user id
  email: string;          // Real email, e.g. "sarah.chen@example.com"
  name: string;           // Real name, e.g. "Sarah Chen"
  avatar_url?: string;    // Real avatar URL or DiceBear initials generator
  created_at: string;     // ISO timestamp
  plan: "free" | "pro";   // Plan tier
  projectCount: number;   // Live synchronized project count
}
```

### 5.2 Dynamic Elements in `<UserButton />`

1. **Trigger Button**:
   - Avatar icon: `<img src={user.avatar_url} />` or uppercase first initial (`user.name.charAt(0)`).
   - If `showDetails === true`:
     - Line 1: `user.name || user.email` (truncated).
     - Line 2: `isPro ? "Pro Plan" : "Free Plan"`.
   - Chevron dropdown icon.

2. **Dropdown Menu (`isOpen === true`)**:
   - **User Header**: 36px avatar, Real Full Name, Real Email, Plan Badge (`PRO` with white border, or `FREE` with neutral border).
   - **Quota Progress Card**:
     - `Projects Quota: ${stats.totalCount}/3` (or `Unlimited` for Pro).
     - Progress bar filled with pure white indicator.
     - "Switch to Free / Pro" quick toggle.
     - "Upgrade →" shortcut to `/billing` (if on Free plan).
   - **Navigation Section**:
     - Projects (`/projects`) with `FolderKanban` icon.
     - Billing (`/billing`) with `CreditCard` icon.
     - Account Settings (`openUserProfile()`) with `User` icon.
   - **Sign Out Action**: Calls `signOut()`, instantly clearing session and closing dropdown.

### 5.3 User Profile Modal (`AuthModals.tsx:261`)

- Triggered via UserButton dropdown ("Account Settings") or direct modal action.
- Displays 48px luxury avatar, Real Name, Real Email, Plan Badge.
- Detailed Workspace Quota status card with progress bar.
- Direct plan switcher ("Switch to Free / Pro").
- Direct navigation buttons for `/projects` and `/billing`.
- "Sign Out" button and "Close" button.

---

## 6. Sign-Out Behavior & Immediate Reactive Reset

1. **Sign-Out Execution Flow**:
   ```typescript
   const signOut = async () => {
     setUser(null);
     try {
       localStorage.removeItem("insforge_session");
       localStorage.removeItem("obsidian_auth_user");
     } catch {}
   };
   ```
2. **Immediate Reactive Updates**:
   - `setUser(null)` triggers instant React re-render of all subscribing components (`Header`, `Sidebar`, `SiteHeader`, `EditorContent`, `ProjectsContent`, `BillingPage`).
   - `<UserButton />` immediately switches from dropdown avatar to `"Sign In"` / `"Get Started"`.
   - `Sidebar` footer immediately replaces user details with signed-out buttons.
   - Any open auth modals or dropdowns are closed immediately.
   - Session keys in `localStorage` are erased atomically.

---

## 7. Concrete Code Snippet Proposals

### Snippet 1: `src/app/builder/page.tsx:182`
**Before:**
```tsx
    createProject({
      id: newProjectId,
      userId: user?.id || "user-architect",
      title: projectTitle,
      prompt: promptText,
      type: "shopify",
      thumbnail: activePreset.products[0].image,
    });
```
**After:**
```tsx
    createProject({
      id: newProjectId,
      userId: user?.id || "guest",
      title: projectTitle,
      prompt: promptText,
      type: "shopify",
      thumbnail: activePreset.products[0].image,
    });
```

### Snippet 2: `src/lib/projects.ts:97-117`
**Before:**
```tsx
export const INITIAL_DEFAULT_MOCKS: Project[] = [
  {
    id: "proj-shopify-starter-1",
    userId: "user-obsidian-prime",
    user_id: "user-obsidian-prime",
    title: "LuxeAura Cosmetics Store",
    prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    type: "shopify",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    data: {
      storeName: "LuxeAura Cosmetics",
      presetId: "cosmetics",
      prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    },
  },
];
```
**After:**
```tsx
export const INITIAL_DEFAULT_MOCKS: Project[] = [
  {
    id: "proj-shopify-starter-1",
    userId: "guest",
    user_id: "guest",
    title: "LuxeAura Cosmetics Store",
    prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    type: "shopify",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    data: {
      storeName: "LuxeAura Cosmetics",
      presetId: "cosmetics",
      prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    },
  },
];
```

### Snippet 3: `src/components/auth/GoogleOneTap.tsx:68`
**Before:**
```tsx
        <button
          onClick={handleSignIn}
          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-colors text-center"
        >
          Sign In as Google Creator
        </button>
```
**After:**
```tsx
        <button
          onClick={handleSignIn}
          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md transition-colors text-center"
        >
          Sign In with Google
        </button>
```

---

## 8. Verification & Validation Protocol

1. **Static Build Validation**:
   - Command: `npm run build`
   - Target: All 15 routes compile cleanly with 0 TypeScript/ESLint errors.
2. **E2E Test Suite Validation**:
   - Command: `node tests/run-all-tests.js`
   - Target: 100% assertions pass across Shopify Theme ZIP Validator, Auth & 3-Project Quota Contract Validator, and Luxury Monochrome Design System Auditor.
3. **Auth Flow & Storage Tests**:
   - Command: `node --test tests/auth_flow.test.mjs`
   - Target: All sign-in, sign-up, Google auth, plan toggling, sign-out, and Clerk bridge tests pass.
