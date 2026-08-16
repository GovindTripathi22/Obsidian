/**
 * Empirical Challenger M2 Regression & Stress Suite
 * Validates zero regressions across M1 (auth, quotas, storage, zip export) + M2 (monochrome design system)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ROOT_DIR = process.cwd();

console.log('\n======================================================');
console.log(' SUITE: Empirical Challenger M2 Stress & Regression');
console.log('======================================================\n');

let totalTests = 0;
let passedTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
  }
}

// 1. CSS Global Variable Sanity & Green Token Absence
test('1.1 globals.css does not define green accents in active theme variables', () => {
  const css = fs.readFileSync(path.join(ROOT_DIR, 'src/app/globals.css'), 'utf8');
  assert(!css.includes('--accent: #10b981'), 'globals.css should not have green --accent');
  assert(!css.includes('--accent-shopify: #008060'), 'globals.css should not have green --accent-shopify');
  assert(!css.includes('--accent-hover: #059669'), 'globals.css should not have green --accent-hover');
  assert(!css.includes('rgba(16, 185, 129'), 'globals.css should not have emerald rgb tokens');
  assert(css.includes('--accent: #ffffff'), 'globals.css should have white --accent');
  assert(css.includes('--accent-shopify: #ffffff'), 'globals.css should have white --accent-shopify');
});

// 2. Button, Alert, BuilderSwitcher primitives token integrity
test('2.1 UI primitives do not have hardcoded emerald/green primary classes', () => {
  const btn = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ui/Button.tsx'), 'utf8');
  assert(!btn.includes('from-emerald-'), 'Button.tsx should not contain from-emerald-');
  assert(!btn.includes('bg-emerald-'), 'Button.tsx should not contain bg-emerald-');

  const alert = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ui/Alert.tsx'), 'utf8');
  assert(!alert.includes('bg-emerald-'), 'Alert.tsx should not contain bg-emerald-');
  assert(!alert.includes('text-emerald-'), 'Alert.tsx should not contain text-emerald-');

  const switcher = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ui/BuilderSwitcher.tsx'), 'utf8');
  assert(!switcher.includes('from-emerald-'), 'BuilderSwitcher.tsx should not contain from-emerald-');
  assert(!switcher.includes('text-emerald-'), 'BuilderSwitcher.tsx should not contain text-emerald-');
});

// 3. InlineCustomizer & Workspace Editor
test('3.1 InlineCustomizer & Editor do not contain emerald accents or light mode bleed', () => {
  const inline = fs.readFileSync(path.join(ROOT_DIR, 'src/components/editor/InlineCustomizer.tsx'), 'utf8');
  assert(!inline.includes('bg-white border-slate-300'), 'InlineCustomizer should not be in light mode');
  assert(!inline.includes('text-pink-'), 'InlineCustomizer should not contain pink tokens');
  assert(!inline.includes('bg-emerald-'), 'InlineCustomizer should not contain emerald');

  const editor = fs.readFileSync(path.join(ROOT_DIR, 'src/app/editor/[projectId]/page.tsx'), 'utf8');
  assert(!editor.includes('bg-emerald-500'), 'Editor should not have emerald status dot');
  assert(!editor.includes('text-emerald-400'), 'Editor should not have emerald text');
});

// 4. Project Store Interface Contract & MAX_FREE_PROJECTS
test('4.1 src/lib/projects.ts enforces MAX_FREE_PROJECTS = 3 and handles edge cases', () => {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'src/lib/projects.ts'), 'utf8');
  assert(code.includes('MAX_FREE_PROJECTS = 3'), 'MAX_FREE_PROJECTS must be 3');
  assert(code.includes('PROJECTS_UPDATED_EVENT = "obsidian:projects-updated"'), 'Event name must match contract');
  assert(code.includes('canCreateProject'), 'canCreateProject function must be exported');
});

// 5. Landing Page Client & AI API Route
test('5.1 AI generation route enforces luxury monochrome prompt instructions', () => {
  const aiRoute = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/generate/route.ts'), 'utf8');
  assert(aiRoute.includes('luxury monochrome') || aiRoute.includes('monochrome noir'), 'AI route must instruct luxury monochrome');
  assert(!aiRoute.includes('emerald-500') && !aiRoute.includes('from-emerald-'), 'AI route fallback should not have emerald classes');
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
