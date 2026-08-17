# BRIEFING — 2026-08-17T16:18:15+05:30

## Mission
Implement Clerk auth integration, middleware, provider setup, fallback and guest defaults, and project migration fixes while ensuring build passes and all test suites pass 100%.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: d:\app\.agents\teamwork_preview_worker_auth_1
- Original parent: d9dcd949-6173-4564-9081-f4bb4a70ca66
- Milestone: Clerk Auth Integration & Guest Defaults

## 🔒 Key Constraints
- Exclusive write ownership:
  - src/middleware.ts
  - src/app/layout.tsx
  - src/components/providers/AuthProvider.tsx
  - src/lib/auth.tsx
  - src/lib/projects.ts
  - src/app/builder/page.tsx
  - src/components/auth/GoogleOneTap.tsx
  - src/components/auth/UserButton.tsx
  - src/components/auth/AuthModals.tsx
- Minimal change principle. No cheating or hardcoded test values. Real functionality and state.
- Pass `npm run build`, `node tests/run-all-tests.js`, `node --test tests/*.test.mjs`, `node tests/validate-auth-quota.js`.

## Current Parent
- Conversation ID: d9dcd949-6173-4564-9081-f4bb4a70ca66
- Updated: 2026-08-17T16:18:15+05:30

## Task Summary
- **What to build**:
  1. src/middleware.ts with clerkMiddleware and env check
  2. src/app/layout.tsx wrapping ClerkProvider with luxury dark appearance
  3. src/components/providers/AuthProvider.tsx unauthenticated default, localStorage persist & Clerk sync
  4. src/lib/auth.tsx unified re-exports of Clerk components/hooks + auth modals
  5. src/app/builder/page.tsx replace default userId with "guest"
  6. src/lib/projects.ts replace user-obsidian-prime with "guest", migrateLegacyProjects returns INITIAL_DEFAULT_MOCKS on empty storage
  7. src/components/auth/GoogleOneTap.tsx label "Sign In with Google"
  8. Run build and full test suites
- **Success criteria**: 0 build errors, 100% test assertions pass.
- **Interface contracts**: PROJECT.md

## Change Tracker
- **Files modified**: None yet
- **Build status**: Pending
- **Pending issues**: None

## Quality Status
- **Build/test result**: Pending
- **Lint status**: Pending
- **Tests added/modified**: None

## Loaded Skills
- None

## Key Decisions Made
- Initialized briefing and progress tracking.

## Artifact Index
- d:\app\.agents\teamwork_preview_worker_auth_1\progress.md
- d:\app\.agents\teamwork_preview_worker_auth_1\handoff.md (pending)
