## 2026-08-16T13:46:32Z
You are Survey Explorer 3.
Your working directory is d:\app\.agents\explorer_survey_3 (write only here for your metadata/reports).
The workspace root is d:\app.

Objective:
Read d:\app\ORIGINAL_REQUEST.md and audit the entire Shopify Theme Studio (/builder, /shopify, and related components).

Specifically:
1. Examine all components, routes, and utilities under Shopify Studio:
   - Simulated storefront views, viewport switchers, responsive previewers.
   - Theme presets, section library (Hero, Featured Collection, Cart Drawer, Trust Badges, Section Schema, etc.).
   - Product quick-add interactions, cart drawer state, price calculations, inventory mock.
   - Liquid section inspector, live schema editor, settings form bindings.
   - Liquid 2.0 code export & ZIP generation utility.
2. Identify all cluttered, non-functional, illogical, dummy, or error-prone components and code paths.
3. Run or check TypeScript types, imports, and build health to identify any existing or potential build/lint/type errors (`npm run build`).
4. Detail exactly what needs cleanup, refactoring, and practical enhancement to make Shopify Studio a high-utility, production-grade tool.

Write your findings to d:\app\.agents\explorer_survey_3\analysis.md and a structured handoff to d:\app\.agents\explorer_survey_3\handoff.md.
Send a message back to parent when complete with summary and artifact paths.
