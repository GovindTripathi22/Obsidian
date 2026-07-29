# Project: Obsidian Builder / StitchStore AI Integration

## Architecture
- **Framework**: Next.js (React, TypeScript, Tailwind CSS)
- **Modules**:
  - Obsidian Builder Core (editor workspace, projects, billing, design-system, inspiration)
  - StitchStore AI Module (Shopify Liquid Theme Generator)
  - Navigation Shell (Header, Sidebar)
  - Design Tokens (White Stitch theme palette: porcelain #f8fafc, pure white frosted glass #ffffff, dark slate #0f172a, rose pink accents)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Codebase Exploration | Map layout, components, routes, state management, design tokens | None | IN_PROGRESS |
| 2 | Navigation Shell & Design System | Add Shopify Store Builder button in Header & Sidebar; White Stitch styling | M1 | PLANNED |
| 3 | Routes & State Sync | Ensure routes resolve cleanly; session & quota state preservation | M2 | PLANNED |
| 4 | Build Hardening & Audit | `npm run build` zero-error validation & forensic audit | M3 | PLANNED |

## Interface Contracts
- **Header Component**: Must export launcher button trigger for Shopify Store Builder linking to Shopify Theme Builder interface.
- **Sidebar Component**: Must contain dedicated navigation entry for Shopify Store Builder with active route styling.
- **Routes**: `/`, `/editor/[projectId]`, `/projects`, `/billing`, `/design-system`, `/inspiration`, and Shopify Theme Builder route(s).
- **Theme Palette**:
  - Porcelain Background: `#f8fafc` / `bg-slate-50`
  - Frosted Glass Panels: `#ffffff` with glass/blur backdrop
  - Typography: Dark slate `#0f172a` / `text-slate-900`
  - Accents: Rose pink `#f43f5e` / `#e11d48` / `text-rose-500` / `bg-rose-500`

## Code Layout
- `d:\app` (Project root)
