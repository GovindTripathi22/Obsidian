## 2026-08-17T10:47:55Z

You are worker_1 (teamwork_preview_worker).
Your working directory is `d:\app\.agents\teamwork_preview_worker_auth_1`.
Please read:
- `d:\app\.agents\ORIGINAL_REQUEST.md`
- `d:\app\PROJECT.md`
- `d:\app\.agents\orchestrator_2\DISPATCH.md`
- `d:\app\.agents\teamwork_preview_explorer_auth_1\handoff.md`
- `d:\app\.agents\teamwork_preview_explorer_auth_2\handoff.md`
- `d:\app\.agents\teamwork_preview_explorer_auth_3\handoff.md`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your exclusive write ownership:
- `src/middleware.ts`
- `src/app/layout.tsx`
- `src/components/providers/AuthProvider.tsx`
- `src/lib/auth.tsx`
- `src/lib/projects.ts`
- `src/app/builder/page.tsx`
- `src/components/auth/GoogleOneTap.tsx`
- `src/components/auth/UserButton.tsx`
- `src/components/auth/AuthModals.tsx`

Your implementation tasks:
1. Create `src/middleware.ts` using `@clerk/nextjs/server` `clerkMiddleware()` with a robust environment check: if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not present, gracefully pass through via `NextResponse.next()`. Include standard Next.js matcher for App Router routes.
2. In `src/app/layout.tsx`, wrap the application in `<ClerkProvider>` with dark/monochrome luxury appearance styling (`colorPrimary: "#ffffff"`, `colorBackground: "#09090b"`, `colorText: "#ffffff"`), properly paired with `<AuthProvider>`. If Clerk publishable key is missing, ensure `<ClerkProvider>` does not crash client or SSR builds.
3. In `src/components/providers/AuthProvider.tsx`:
   - Keep user starting in unauthenticated / signed-out state by default (`user: null`, `isSignedIn: false`).
   - Clean up any fallback email strings (`"creator@gmail.com"`).
   - Ensure real user name, real email, and real profile metadata persist cleanly across sessions in localStorage and sync smoothly with Clerk user objects.
4. In `src/lib/auth.tsx`:
   - Re-export Clerk components (`SignIn`, `SignUp`, `UserButton`, `SignedIn`, `SignedOut`) and hooks (`useAuth`, `useUser`) as well as unified auth modals.
5. In `src/app/builder/page.tsx`:
   - Replace `userId: user?.id || "user-architect"` with `userId: user?.id || "guest"`.
6. In `src/lib/projects.ts`:
   - Replace any `"user-obsidian-prime"` with `"guest"`.
   - In `migrateLegacyProjects()`, ensure that when storage is empty, it returns `INITIAL_DEFAULT_MOCKS` (1 starter store) so all unit test suites (`projects_store.test.mjs`, `adversarial_stress.test.mjs`, `empirical-challenger-m1.js`) pass cleanly.
7. In `src/components/auth/GoogleOneTap.tsx`:
   - Change button label from `"Sign In as Google Creator"` to `"Sign In with Google"`.
8. Run build and test verification:
   - `npm run build` (Must pass with 0 errors across all routes)
   - `node tests/run-all-tests.js` (Must pass 100% assertions)
   - `node --test tests/*.test.mjs` (All node test runner suites must pass)
   - `node tests/validate-auth-quota.js` (Must pass 100%)
9. Write `handoff.md` in `d:\app\.agents\teamwork_preview_worker_auth_1` detailing all changes made and all command verification results.
10. Send a concise completion message back to orchestrator_2.
