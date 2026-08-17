# Dispatch — Orchestrator (orchestrator_2)

## Mission
Implement real, working Clerk authentication across both Obsidian Website Builder and Shopify Theme Studio, supporting genuine Google OAuth, email verification, real user profile synchronization, and session persistence without mock placeholders.

## Working Directory
- Workspace Directory: `d:\app`
- Agent Working Directory: `d:\app\.agents\orchestrator_2`
- Original Request Reference: `d:\app\.agents\ORIGINAL_REQUEST.md`

## Key Requirements
1. **R1. Complete Clerk Authentication Integration**:
   - Integrate `@clerk/nextjs` with standard `<ClerkProvider>` and Clerk components (`<SignIn />`, `<SignUp />`, `<UserButton />`, `<SignedIn>`, `<SignedOut>`).
   - Support genuine Google OAuth and Email/Password registration/login.
   - Allow seamless fallback when running in local development mode without breaking builds or requiring hardcoded mock accounts.

2. **R2. Real User Profile & Session Persistence**:
   - Ensure users start in an unauthenticated / signed-out state by default.
   - When signed in, accurately capture and display the user's real name, email address, and profile avatar across both Obsidian (`/`) and Shopify (`/builder`, `/shopify`) navigation headers and sidebars.
   - Remove all hardcoded placeholders ("Alex Johnson", "Alex Morgan", "Obsidian Creator", "developer@obsidian.ai").

3. **R3. Cross-Route Quota & Project Integration**:
   - Maintain single-session synchronization across all routes (`/`, `/builder`, `/shopify`, `/projects`, `/editor/*`, `/billing`).
   - Synchronize active project count and enforce the 3-project limit on the Free Plan tied to the user's authenticated ID.

4. **Verification & Quality**:
   - `npm run build` succeeds with 0 errors across all routes.
   - E2E test suites in `tests/run-all-tests.js` pass cleanly (100% assertions).
   - 0 breaking changes to Shopify Studio or Obsidian Website Builder features.

Please maintain your `BRIEFING.md` and `progress.md` in `d:\app\.agents\orchestrator_2`, thoroughly coordinate implementation, test suite verification, build checks, and notify the sentinel when complete.
