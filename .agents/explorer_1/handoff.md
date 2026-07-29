# Handoff Report — Navigation Shell & Route Discovery (Explorer 1)

## 1. Observation
Direct findings from inspecting the codebase at `d:\app`:

1. **Root Layout Component (`d:\app\src\app\layout.tsx`)**:
   - Lines 18–30:
     ```tsx
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
     ```
   - Offsets: `pt-16` compensates for fixed Header height (64px); `pl-64` compensates for fixed Sidebar width (256px).

2. **Header Component (`d:\app\src\components\Header.tsx`)**:
   - Lines 13: `header className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/90 z-30 flex items-center justify-between px-6 transition-all duration-200 shadow-xs"`
   - Lines 21–26:
     ```tsx
     <div className="flex items-center gap-3">
       <Link href="/design-system" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mr-2 flex items-center gap-1.5">
         <Sparkles className="w-3.5 h-3.5 text-pink-500" />
         <span>Design System</span>
       </Link>
     ```

3. **Sidebar Component (`d:\app\src\components\Sidebar.tsx`)**:
   - Lines 24–26:
     ```ts
     if (pathname?.startsWith("/editor")) {
       return null;
     }
     ```
   - Lines 28–34:
     ```ts
     const navItems = [
       { name: "Home", href: "/", icon: Home },
       { name: "Projects", href: "/projects", icon: FolderKanban },
       { name: "Inspiration", href: "/inspiration", icon: Sparkles },
       { name: "Billing & Plans", href: "/billing", icon: CreditCard },
       { name: "Design System", href: "/design-system", icon: Palette },
     ];
     ```
   - Line 41: `aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200/90 z-40 flex flex-col justify-between p-5 shadow-sm"`

4. **Existing Routes Inventory**:
   - `/` (`src/app/page.tsx`)
   - `/projects` (`src/app/projects/page.tsx`)
   - `/editor/[projectId]` (`src/app/editor/[projectId]/page.tsx`)
   - `/billing` (`src/app/billing/page.tsx`)
   - `/design-system` (`src/app/design-system/page.tsx`)
   - `/inspiration` (`src/app/inspiration/page.tsx`)
   - `/sign-in` (`src/app/sign-in/page.tsx`)
   - `/sign-up` (`src/app/sign-up/page.tsx`)
   - `/api/generate` (`src/app/api/generate/route.ts`)
   - `/api/billing/checkout` (`src/app/api/billing/checkout/route.ts`)
   - `/api/billing/webhook` (`src/app/api/billing/webhook/route.ts`)

5. **Package Configuration (`d:\app\package.json`)**:
   - Next.js 16.2.12, React 19.2.4, Lucide React 1.27.0, Tailwind CSS v4.

---

## 2. Logic Chain
1. **From Observation 1**: The root layout establishes fixed offsets (`pt-16`, `pl-64`) for the global `Header` (height 64px) and `Sidebar` (width 256px).
2. **From Observation 2**: `Header.tsx` renders top actions in a right-aligned flex container. Adding a `<Link href="/builder">` button with a `ShoppingBag` icon inside this container (lines 21-26) inserts the button prominently in the top bar without altering layout height or header positioning.
3. **From Observation 3**: `Sidebar.tsx` renders navigation items via the `navItems` array (lines 28–34). Adding `{ name: "Shopify Theme Builder", href: "/builder", icon: ShoppingBag }` automatically includes the link in the sidebar menu with active/inactive state styling.
4. **From Observation 3 & 4**: Currently, `/editor/[projectId]` is the only builder route and hides the global sidebar via `pathname?.startsWith("/editor")`. Creating a `/builder` route (`src/app/builder/page.tsx`) or linking directly to `/builder` provides a dedicated entry point for Shopify Theme Builder without disrupting existing Obsidian features or routes.
5. **Conclusion**: Modifying `Header.tsx` and `Sidebar.tsx` at the exact specified lines allows direct insertion of the Shopify Theme Builder navigation button and route cleanly and safely.

---

## 3. Caveats
- The project does not currently have a `/builder` route file; one should be created at `src/app/builder/page.tsx` or `/builder` should redirect to `/editor/new` depending on the implementer's routing strategy.
- If `/builder` uses a full-screen canvas (similar to `/editor/[projectId]`), line 24 of `Sidebar.tsx` must be updated to check `pathname?.startsWith("/builder")` as well.

---

## 4. Conclusion
The Navigation Shell components are located at `src/app/layout.tsx`, `src/components/Header.tsx`, and `src/components/Sidebar.tsx`. Inserting the "Shopify Theme Builder" navigation button and `/builder` route requires editing lines 21–26 in `Header.tsx` and lines 28–34 in `Sidebar.tsx`, and creating `src/app/builder/page.tsx`.

---

## 5. Verification Method
- **File Inspection**: Verify existence and content of:
  - `d:\app\.agents\explorer_1\analysis.md`
  - `d:\app\.agents\explorer_1\handoff.md`
- **Build / Lint Verification**:
  - Run `npm run lint` or `npm run build` in `d:\app` to confirm syntax validity.
- **Invalidation Condition**: If `navItems` in `Sidebar.tsx` or Header structure in `Header.tsx` are refactored or moved.
