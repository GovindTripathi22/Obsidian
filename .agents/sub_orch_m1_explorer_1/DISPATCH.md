## 2026-08-16T13:51:31Z

You are Explorer 1 for Milestone 1: Clerk Auth Integration & Offline Dual Mode.
Working directory: d:\app\.agents\sub_orch_m1_explorer_1
Workspace root: d:\app

Read the following files carefully:
- d:\app\ORIGINAL_REQUEST.md
- d:\app\PROJECT.md
- d:\app\.agents\explorer_survey_1\handoff.md
- d:\app\.agents\sub_orch_m1\SCOPE.md

Your task:
1. Thoroughly investigate auth state across the codebase (package.json, layout.tsx, header/navbar, sidebar, /projects, /billing, /editor/[projectId], /builder, /shopify).
2. Check if `@clerk/nextjs` is installed, and how Next.js app router layout handles ClerkProvider.
3. Design a robust dual-mode Auth architecture:
   - When NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are provided, use Clerk (with dark luxury theme).
   - When Clerk keys are NOT provided (or offline / CI build), seamlessly fallback to a luxury mock/hybrid auth provider with local state, dark luxury Clerk-like UI modal (Email/Password, Google One-Tap simulated / instant sign-in, user profile dialog, sign-out, session persistence) so `npm run build` succeeds cleanly without network calls.
4. Specify exact file changes needed, component interfaces, hooks (e.g. `useAuth()`, `useUser()`), UserButton, SignInModal, and layout wrapper.

Write your detailed findings and implementation plan to d:\app\.agents\sub_orch_m1_explorer_1\handoff.md and report back when finished. DO NOT write or edit source code directly.
