# Scope: E2E Testing Track

## Architecture
The E2E Test Suite provides independent opaque-box validation for Obsidian Builder and Shopify Theme Studio without coupling to implementation internals.

## Test Suites & Modules
1. **Theme ZIP Integrity Validator (`tests/validate-theme-zip.js`)**:
   - Validates Shopify OS 2.0 theme ZIP hierarchy:
     - `layout/theme.liquid`
     - `templates/index.json` (sections, order)
     - `sections/hero.liquid`, `sections/featured-collection.liquid`, `sections/features.liquid`, `sections/reviews.liquid`, `sections/trust-badges.liquid`, `sections/cart-drawer.liquid`, `sections/footer.liquid`
     - `snippets/product-card.liquid`
     - `config/settings_data.json`
     - `locales/en.default.json`
   - Validates section schema definitions (name, tag, class, settings, blocks, presets).
   - Validates that dynamic store data (products, prices, tags, reviews) are properly populated in the generated ZIP.

2. **Auth & 3-Project Quota Validator (`tests/validate-auth-quota.js`)**:
   - Validates user auth session persistence and unified user profile across routes.
   - Validates `src/lib/projects.ts` storage engine interface: `getProjects`, `saveProject`, `deleteProject`, `getProjectCount`, `canCreateProject`.
   - Validates event dispatching (`obsidian:projects-updated`) on save and delete.
   - Validates strict blocking on creating a 4th project under the free tier.
   - Validates mock default state (<=1 project).

3. **Monochrome Styling Auditor (`tests/validate-monochrome.js`)**:
   - Scans all files in `src/` for emerald/green styling tokens (`bg-emerald-`, `text-emerald-`, `border-emerald-`, `from-emerald-`, `to-emerald-`, `bg-green-`, `text-green-`, `#10b981`, `--accent: #10b981`, etc.) in Obsidian builder components, templates, and layouts.
   - Verifies Obsidian styling uses pure black & white, zinc highlights, and silver/frost glass.

4. **Unified Test Runner (`tests/run-all-tests.js`)**:
   - Executes all test validators sequentially.
   - Aggregates test counts, assertions, passing/failing status.
   - Provides clear summary tables with exit code 0 on all passing.

## Milestones
| # | Work Item | Scope | Status |
|---|-----------|-------|--------|
| 1 | Test Suite Authoring | Create all 4 test scripts in `tests/` | DONE |
| 2 | Test Execution & Verification | Run tests, verify output, ensure robust assertion reporting | DONE |
| 3 | Publish TEST_READY.md | Document runner command and coverage breakdown | DONE |
