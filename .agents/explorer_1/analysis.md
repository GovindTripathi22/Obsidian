# Navigation & Shell Components Analysis — Obsidian Builder / StitchStore AI

## Executive Summary
This analysis details the Navigation Shell architecture, existing routing system, and precise insertion points for integrating the "Shopify Theme Builder" navigation button and route into the Obsidian Builder / StitchStore AI codebase at `d:\app`.

---

## 1. Codebase & Layout Shell Architecture

### 1.1 Root Layout Wrapper
- **File Location**: `d:\app\src\app\layout.tsx`
- **Role**: Main layout wrapper for the entire application.
- **Code Structure**:
  ```tsx
  export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <html lang="en" className="h-full antialiased light">
        <body className="min-h-full flex bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
          <AuthProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 pt-16 pl-64 min-h-screen flex flex-col">
                {children}
              </main>
            </div>
          </AuthProvider>
        </body>
      </html>
    );
  }
  ```
- **Layout Offset Constraints**:
  - Header is fixed at top: height `h-16` (64px).
  - Sidebar is fixed at left: width `w-64` (256px).
  - `<main>` tag enforces `pt-16` and `pl-64` padding to clear Header and Sidebar positioning.

---

### 1.2 Header Component
- **File Location**: `d:\app\src\components\Header.tsx`
- **Type**: Client Component (`"use client"`)
- **Dimensions & Positioning**: `fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/90 z-30 flex items-center justify-between px-6 transition-all duration-200 shadow-xs`
- **Component Breakdown**:
  - **Left Section (Lines 14–19)**: Engine status badge:
    ```tsx
    <div className="flex items-center gap-3">
      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-mono text-slate-500">
        Engine: <strong className="text-slate-900 font-semibold">Gemini 2.5 Flash</strong> • Shopify Liquid Ready
      </span>
    </div>
    ```
  - **Right Section (Lines 21–58)**: Navigation links and user authentication status:
    - Design System link (`/design-system`) with `Sparkles` icon.
    - Auth state conditional rendering: user details + Sign Out button, or Sign In (`/sign-in`) & Sign Up (`/sign-up`) buttons.

---

### 1.3 Sidebar Component
- **File Location**: `d:\app\src\components\Sidebar.tsx`
- **Type**: Client Component (`"use client"`)
- **Dimensions & Positioning**: `fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200/90 z-40 flex flex-col justify-between p-5 shadow-sm`
- **Key Behavior**:
  - Line 24 hides global Sidebar when visiting editor routes:
    ```ts
    if (pathname?.startsWith("/editor")) {
      return null;
    }
    ```
- **Navigation Configuration (Lines 28–34)**:
  ```ts
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Inspiration", href: "/inspiration", icon: Sparkles },
    { name: "Billing & Plans", href: "/billing", icon: CreditCard },
    { name: "Design System", href: "/design-system", icon: Palette },
  ];
  ```
- **Footer Section**:
  - Quota Usage Card showing account plan (`Free Plan` / `Pro Subscription`) and project usage bar.
  - User Profile Section with avatar, name, email, and sign-out trigger.

---

### 1.4 Local Editor Workspace Navigation
- **File Location**: `d:\app\src\app\editor\[projectId]\page.tsx`
- **Type**: Fullscreen workspace takeover (`fixed inset-0 z-50`).
- **Header Bar (Lines 189–277)**:
  - Height: `h-14 bg-white border-b border-slate-200 px-4`
  - Navigation back button: `Back to Projects` (`/projects`)
  - Page Tabs: `Home Page`, `Product Page`, `Cart Page`
  - Viewport Switcher: Desktop, Tablet, Mobile
  - Action Controls: `Export to Shopify`, `Code (ZIP)`, `PNG Mockup`

---

## 2. Existing Routes Inventory

| Route Path | File Path | Type | Description |
| flex | --- | --- | --- |
| `/` | `src/app/page.tsx` | Page | Main homepage with prompt input, 3D tilt card, template suggestions, and subsystem feature grid. |
| `/projects` | `src/app/projects/page.tsx` | Page | Project Management Dashboard listing saved/mock projects, prompt details, and create buttons. |
| `/editor/[projectId]` | `src/app/editor/[projectId]/page.tsx` | Page | Interactive AI Store Builder & Live Canvas Editor with split chat/preview interface. |
| `/inspiration` | `src/app/inspiration/page.tsx` | Page | Curated Shopify store concept gallery with pre-configured template triggers. |
| `/billing` | `src/app/billing/page.tsx` | Page | Subscription tier management (Free, Pro Monthly, Pro Annual) and Stripe billing portal. |
| `/design-system` | `src/app/design-system/page.tsx` | Page | Component library showcase (colors, typography, buttons, inputs, cards, alerts). |
| `/sign-in` | `src/app/sign-in/page.tsx` | Page | Authentication Sign-In page. |
| `/sign-up` | `src/app/sign-up/page.tsx` | Page | Authentication Sign-Up page. |
| `/api/generate` | `src/app/api/generate/route.ts` | API Route | Gemini AI layout generation endpoint. |
| `/api/billing/checkout` | `src/app/api/billing/checkout/route.ts` | API Route | Stripe checkout session initialization endpoint. |
| `/api/billing/webhook` | `src/app/api/billing/webhook/route.ts` | API Route | Stripe payment event webhook listener. |

*Note*: There is currently no dedicated `/builder` or `/shopify-builder` route file in the repository. `/editor/[projectId]` currently acts as the single builder instance route.

---

## 3. Shopify Theme Builder Navigation Insertion Blueprint

To seamlessly insert the "Shopify Theme Builder" navigation button and route into the Header and Sidebar without disrupting any existing layouts or Obsidian features, the following exact file locations and code structures are specified.

### 3.1 Sidebar Insertion (`src/components/Sidebar.tsx`)
- **Target File**: `d:\app\src\components\Sidebar.tsx`
- **Import Changes**: Add `ShoppingBag` or `Wand2` from `lucide-react`.
- **Target Location**: `navItems` array (Lines 28–34).
- **Code Insertion**:
  ```tsx
  import {
    Home,
    FolderKanban,
    Sparkles,
    Zap,
    LogOut,
    Crown,
    CreditCard,
    Palette,
    ShoppingBag, // Added
  } from "lucide-react";

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shopify Theme Builder", href: "/builder", icon: ShoppingBag }, // Inserted direct builder route
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Inspiration", href: "/inspiration", icon: Sparkles },
    { name: "Billing & Plans", href: "/billing", icon: CreditCard },
    { name: "Design System", href: "/design-system", icon: Palette },
  ];
  ```
- **Optional Fullscreen Guard Adjustment (Line 24)**:
  ```ts
  if (pathname?.startsWith("/editor") || pathname?.startsWith("/builder")) {
    return null;
  }
  ```

### 3.2 Header Insertion (`src/components/Header.tsx`)
- **Target File**: `d:\app\src\components\Header.tsx`
- **Target Location**: Right action container (Lines 21–26).
- **Code Insertion**:
  ```tsx
  import { LogIn, UserPlus, LogOut, Sparkles, ShoppingBag } from "lucide-react";

  // Inside the right flex container:
  <div className="flex items-center gap-3">
    <Link
      href="/builder"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
    >
      <ShoppingBag className="w-3.5 h-3.5 text-white" />
      <span>Shopify Theme Builder</span>
    </Link>

    <Link href="/design-system" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mr-2 flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
      <span>Design System</span>
    </Link>
    ...
  ```

### 3.3 Target Route Creation (`src/app/builder/page.tsx`)
- **Target File**: `d:\app\src\app\builder\page.tsx`
- **Purpose**: Direct entry point for the Shopify Theme Builder.
- **Behavior**:
  - Initializes a new project (e.g. `proj-${Date.now()}`) and redirects to `/editor/[projectId]` or presents an instant builder launcher workspace.
  - Inherits `RootLayout` seamlessly.

---

## 4. Impact & Layout Verification Matrix
- **Layout Safety**: Neither `Header.tsx` nor `Sidebar.tsx` edits require changes to `layout.tsx` grid sizes (`pt-16`, `pl-64`).
- **Obsidian Feature Preservation**: All existing pages (`/`, `/projects`, `/billing`, `/design-system`, `/inspiration`, `/editor/[projectId]`) remain 100% operational.
