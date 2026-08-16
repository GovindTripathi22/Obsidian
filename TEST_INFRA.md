# E2E Test Infra: Obsidian Builder & Shopify Studio

## Test Philosophy
- Opaque-box, requirement-driven. Derived directly from `ORIGINAL_REQUEST.md`.
- Systematic 4-tier testing: Feature Coverage, Boundary & Corner Cases, Cross-Engine Combinations, Real-World Workload Scenarios.

## Feature Inventory & Test Coverage
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | Clerk Auth Integration | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ | ✓ |
| 2 | Shared Session & Quota Meters | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ | ✓ |
| 3 | Unified Project Store (`projects.ts`) | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ | ✓ |
| 4 | Strict 3-Project Limit Enforcement | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ | ✓ |
| 5 | Monochrome Tokens in globals.css | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ | ✓ |
| 6 | Workspace Editor Monochrome Noir | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ | ✓ |
| 7 | Floating Customizer Dark Restyling | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ | ✓ |
| 8 | Core Pages Monochrome Overhaul | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ | ✓ |
| 9 | AI Generation Monochrome Prompts | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ | ✓ |
| 10| Shopify Studio Viewports & Presets | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |
| 11| Liquid 2.0 Theme ZIP Integrity | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |
| 12| Interactive Schema Inspector | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |
| 13| Simulated Checkout Journey | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |
| 14| Clutter & Bug Elimination | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |
| 15| Zero Build & Typecheck Errors | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test Runner: Node.js / Playwright / Jest integration verification scripts in `tests/`.
- Validations:
  - Theme ZIP archive validator (`tests/validate-theme-zip.js`): unpacks generated ZIPs and validates Shopify OS 2.0 schema, sections, templates/index.json, and layout files.
  - Quota and Auth consistency checker (`tests/validate-auth-quota.js`): validates session sync, project count across routes, and deletion events.
  - Monochrome color auditor (`tests/validate-monochrome.js`): scans all `src/` files for unwanted green/emerald tokens in Obsidian elements.
  - Production build validator: executes `npm run build` to ensure 0 errors.

## Coverage Thresholds
- Tier 1: ≥5 per feature (75+ assertions)
- Tier 2: ≥5 per feature (75+ assertions)
- Tier 3: Pairwise combinations across Obsidian & Shopify Studio
- Tier 4: Real-world merchant and designer workflows
- Production build: exit code 0
