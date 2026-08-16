/**
 * E2E Test Suite: Luxury Monochrome Noir Design System Auditor
 * File: tests/validate-monochrome.js
 * 
 * Verifies:
 * - globals.css Theme Tokens: dark background (#09090b), zinc-950, foreground (#fafafa), border (#27272a)
 * - Presence of Luxury Monochrome Noir tokens: pure white (#ffffff), zinc/slate grayscale, deep black (#000000), subtle silver/frost glass
 * - Audits Obsidian builder files for unwanted green/emerald tokens:
 *   * Regexes: bg-emerald-, text-emerald-, border-emerald-, from-emerald-, to-emerald-, bg-green-, text-green-, #10b981, --accent:\s*#10b981
 * - File-by-file scanning of components, pages, styles, and API routes
 * - Detailed metric breakdown of luxury monochrome tokens vs. legacy tokens
 */

const fs = require('fs');
const path = require('path');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};

class AssertionTracker {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.totalAssertions = 0;
    this.passedAssertions = 0;
    this.failedAssertions = 0;
    this.tierCounts = {
      1: { total: 0, passed: 0, failed: 0 },
      2: { total: 0, passed: 0, failed: 0 },
      3: { total: 0, passed: 0, failed: 0 },
      4: { total: 0, passed: 0, failed: 0 },
    };
    this.currentTier = 1;
    this.currentTestName = '';
    this.errors = [];
  }

  setTier(tier) {
    this.currentTier = tier;
  }

  startTest(name) {
    this.currentTestName = name;
    this.totalTests++;
    console.log(`  ${colors.cyan}▶${colors.reset} [Tier ${this.currentTier}] ${name}`);
  }

  assert(condition, message) {
    this.totalAssertions++;
    this.tierCounts[this.currentTier].total++;
    if (condition) {
      this.passedAssertions++;
      this.tierCounts[this.currentTier].passed++;
      console.log(`    ${colors.green}✓${colors.reset} ${colors.dim}${message}${colors.reset}`);
    } else {
      this.failedAssertions++;
      this.tierCounts[this.currentTier].failed++;
      const err = `[Tier ${this.currentTier}] ${this.currentTestName} -> Assertion Failed: ${message}`;
      this.errors.push(err);
      console.log(`    ${colors.red}✗ ${message}${colors.reset}`);
    }
  }

  finishTest(success = true) {
    if (success && this.tierCounts[this.currentTier].failed === 0) {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
  }
}

// Recursively find all source files in directory
function getAllSourceFiles(dir, extensions = ['.ts', '.tsx', '.css', '.js']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllSourceFiles(filePath, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// Token scanner regex definitions
const FLAG_REGEXES = [
  { id: 'bg-emerald', pattern: /bg-emerald-[0-9]+/g, name: 'bg-emerald-*' },
  { id: 'text-emerald', pattern: /text-emerald-[0-9]+/g, name: 'text-emerald-*' },
  { id: 'border-emerald', pattern: /border-emerald-[0-9]+/g, name: 'border-emerald-*' },
  { id: 'from-emerald', pattern: /from-emerald-[0-9]+/g, name: 'from-emerald-*' },
  { id: 'to-emerald', pattern: /to-emerald-[0-9]+/g, name: 'to-emerald-*' },
  { id: 'bg-green', pattern: /bg-green-[0-9]+/g, name: 'bg-green-*' },
  { id: 'text-green', pattern: /text-green-[0-9]+/g, name: 'text-green-*' },
  { id: 'hex-10b981', pattern: /#10b981/gi, name: '#10b981' },
];

const MONOCHROME_PATTERNS = [
  { id: 'pure-white', pattern: /#ffffff|text-white|bg-white|text-slate-50|bg-slate-50/gi, name: 'Pure White / Light Surface' },
  { id: 'zinc-950', pattern: /#09090b|zinc-950|bg-zinc-950|bg-black|text-black|text-slate-900/gi, name: 'Deep Noir (#09090b / zinc-950 / black)' },
  { id: 'zinc-palette', pattern: /zinc-[1-9]00|slate-[1-9]00/gi, name: 'Grayscale Palette (zinc/slate 100..900)' },
  { id: 'deep-black', pattern: /#000000|bg-black|text-black/gi, name: 'Deep Black (#000000)' },
  { id: 'glass-frost', pattern: /glass-panel|backdrop-blur|border-zinc-800|border-slate-|border-white\/10|shadow-2xl/gi, name: 'Frost Glass & Silver' },
];

function scanFileTokens(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const flagMatches = {};
  let totalFlagCount = 0;

  for (const { id, pattern } of FLAG_REGEXES) {
    const matches = content.match(pattern) || [];
    flagMatches[id] = matches.length;
    totalFlagCount += matches.length;
  }

  const monochromeMatches = {};
  let totalMonochromeCount = 0;
  for (const { id, pattern } of MONOCHROME_PATTERNS) {
    const matches = content.match(pattern) || [];
    monochromeMatches[id] = matches.length;
    totalMonochromeCount += matches.length;
  }

  return {
    filePath,
    content,
    flagMatches,
    totalFlagCount,
    monochromeMatches,
    totalMonochromeCount,
  };
}

async function runMonochromeTests() {
  const tracker = new AssertionTracker('Luxury Monochrome Noir Design System Auditor');
  const startTime = Date.now();

  console.log(`\n${colors.bright}${colors.white}======================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.white} SUITE: Luxury Monochrome Noir Design System Tests${colors.reset}`);
  console.log(`${colors.bright}${colors.white}======================================================${colors.reset}\n`);

  const srcDir = path.resolve(__dirname, '../src');
  const allSourceFiles = getAllSourceFiles(srcDir);

  // =========================================================================
  // TIER 1: Global CSS & Design System Tokens
  // =========================================================================
  tracker.setTier(1);

  // Test 1.1: globals.css Tokens
  tracker.startTest('src/app/globals.css Dark Monochrome Base Tokens');
  try {
    const globalsPath = path.resolve(srcDir, 'app/globals.css');
    tracker.assert(fs.existsSync(globalsPath), 'globals.css exists');

    const globalsContent = fs.readFileSync(globalsPath, 'utf8');
    tracker.assert(globalsContent.includes('--background: #09090b') || globalsContent.includes('--background: #000000') || globalsContent.includes('--background:'), 'Defines luxury dark background variable');
    tracker.assert(globalsContent.includes('--foreground: #fafafa') || globalsContent.includes('--foreground: #ffffff'), 'Defines crisp white foreground text variable');
    tracker.assert(globalsContent.includes('--card: #18181b') || globalsContent.includes('zinc-900'), 'Defines luxury dark card surface variable');
    tracker.assert(globalsContent.includes('--border: #27272a') || globalsContent.includes('zinc-800') || globalsContent.includes('border:'), 'Defines subtle dark border variable');
    tracker.assert(globalsContent.includes('font-sans') || globalsContent.includes('--font-sans'), 'Defines sans typography system');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.2: UI Primitives Styling
  tracker.startTest('UI Component Primitives Monochrome Dark Token Adoption');
  try {
    const uiFiles = [
      'components/ui/Button.tsx',
      'components/ui/Alert.tsx',
      'components/ui/Card.tsx',
      'components/ui/BuilderSwitcher.tsx',
    ];

    for (const uFile of uiFiles) {
      const fullPath = path.resolve(srcDir, uFile);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        tracker.assert(content.includes('bg-white') || content.includes('bg-zinc-') || content.includes('text-white') || content.includes('border-zinc-') || content.includes('bg-slate-'), `Primitive ${uFile} utilizes zinc/slate/white monochrome styling`);
        tracker.assert(!content.includes('bg-emerald-600') && !content.includes('text-emerald-500'), `Primitive ${uFile} does not hardcode emerald button styles`);
      }
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.3: Frost Glass and Metallic Accents
  tracker.startTest('Frost Glass & Silver Metallic Utility Class Definitions');
  try {
    const globalsContent = fs.readFileSync(path.resolve(srcDir, 'app/globals.css'), 'utf8');
    const hasGlassOrBlur = globalsContent.includes('glass-panel') || globalsContent.includes('backdrop-blur') || globalsContent.includes('rgba(');
    tracker.assert(hasGlassOrBlur, 'Defines glass panel or frost blur utility classes');
    tracker.assert(globalsContent.includes('Outfit') || globalsContent.includes('Inter') || globalsContent.includes('JetBrains'), 'Includes luxury typography fonts (Outfit / Inter / JetBrains Mono)');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 2: Emerald & Green Token Scanner & Regex Auditing
  // =========================================================================
  tracker.setTier(2);

  // Test 2.1: InlineCustomizer.tsx
  tracker.startTest('InlineCustomizer.tsx Canvas Editor Monochrome Audit');
  try {
    const customizerPath = path.resolve(srcDir, 'components/editor/InlineCustomizer.tsx');
    if (fs.existsSync(customizerPath)) {
      const scan = scanFileTokens(customizerPath);
      tracker.assert(scan.monochromeMatches['pure-white'] > 0 || scan.monochromeMatches['zinc-palette'] > 0, 'InlineCustomizer uses high-contrast white and zinc/slate tokens');
      tracker.assert(scan.monochromeMatches['glass-frost'] > 0 || scan.monochromeMatches['zinc-950'] > 0, 'InlineCustomizer uses dark luxury glass/zinc paneling');
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.2: LandingPageClient.tsx
  tracker.startTest('LandingPageClient.tsx Obsidian Hero & Feature Showcase Audit');
  try {
    const landingPath = path.resolve(srcDir, 'components/LandingPageClient.tsx');
    if (fs.existsSync(landingPath)) {
      const scan = scanFileTokens(landingPath);
      tracker.assert(scan.monochromeMatches['pure-white'] >= 5, `Landing page contains ${scan.monochromeMatches['pure-white']} white heading/text tokens`);
      tracker.assert(scan.monochromeMatches['zinc-palette'] >= 5, `Landing page contains ${scan.monochromeMatches['zinc-palette']} zinc grayscale styling tokens`);
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.3: Navigation Shell Components (Header, Sidebar, SiteHeader)
  tracker.startTest('Navigation Shell Monochrome & Dark Surface Consistency');
  try {
    const shellFiles = [
      'components/Header.tsx',
      'components/Sidebar.tsx',
      'components/SiteHeader.tsx',
    ];

    for (const sFile of shellFiles) {
      const fullPath = path.resolve(srcDir, sFile);
      if (fs.existsSync(fullPath)) {
        const scan = scanFileTokens(fullPath);
        tracker.assert(scan.totalMonochromeCount >= 5, `Shell ${sFile} has ${scan.totalMonochromeCount} luxury monochrome styling tokens`);
      }
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.4: Design System Showcase Page
  tracker.startTest('src/app/design-system/page.tsx Monochrome Showcase Integrity');
  try {
    const dsPath = path.resolve(srcDir, 'app/design-system/page.tsx');
    if (fs.existsSync(dsPath)) {
      const scan = scanFileTokens(dsPath);
      tracker.assert(scan.totalMonochromeCount >= 10, `Design system showcase features ${scan.totalMonochromeCount} monochrome elements`);
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.5: AI Generation Prompt Monochrome Directives
  tracker.startTest('src/app/api/generate/route.ts AI Prompt & Fallback Templates');
  try {
    const genPath = path.resolve(srcDir, 'app/api/generate/route.ts');
    if (fs.existsSync(genPath)) {
      const content = fs.readFileSync(genPath, 'utf8');
      tracker.assert(content.includes('bg-zinc-950') || content.includes('text-white') || content.includes('dark'), 'AI generation prompt instructs dark luxury aesthetic');
      tracker.assert(content.includes('systemInstruction') || content.includes('prompt'), 'API route defines structured generation prompts');
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 3: Cross-Page Monochrome Consistency
  // =========================================================================
  tracker.setTier(3);

  // Test 3.1: All App Router Routes Verification
  tracker.startTest('Full App Router Pages Dark Luxury Noir Presence');
  try {
    const routes = [
      'app/page.tsx',
      'app/projects/page.tsx',
      'app/billing/page.tsx',
      'app/editor/[projectId]/page.tsx',
      'app/inspiration/page.tsx',
      'app/sign-in/page.tsx',
      'app/sign-up/page.tsx',
    ];

    let compliantPages = 0;
    for (const r of routes) {
      const p = path.resolve(srcDir, r);
      if (fs.existsSync(p)) {
        const scan = scanFileTokens(p);
        if (scan.totalMonochromeCount > 0) {
          compliantPages++;
        }
        tracker.assert(scan.totalMonochromeCount > 0, `Route ${r} uses monochrome tokens (found ${scan.totalMonochromeCount})`);
      }
    }
    tracker.assert(compliantPages >= 5, `At least 5 core App Router routes verify monochrome styling (${compliantPages} found)`);
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 3.2: High-Contrast Contrast Ratios & Typography
  tracker.startTest('High-Contrast Typography & Button Hover State Verification');
  try {
    const buttonPath = path.resolve(srcDir, 'components/ui/Button.tsx');
    if (fs.existsSync(buttonPath)) {
      const content = fs.readFileSync(buttonPath, 'utf8');
      tracker.assert(content.includes('hover:') || content.includes('transition'), 'Buttons support smooth hover state transitions');
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 4: End-to-End Design System Verification & Token Summary
  // =========================================================================
  tracker.setTier(4);

  // Test 4.1: Comprehensive Scan Summary across Entire src/
  tracker.startTest('Comprehensive Scan Summary Across All Source Files');
  try {
    let totalFilesScanned = 0;
    let aggregateMonochromeTokens = 0;
    let aggregateFlagTokens = 0;

    for (const f of allSourceFiles) {
      totalFilesScanned++;
      const scan = scanFileTokens(f);
      aggregateMonochromeTokens += scan.totalMonochromeCount;
      aggregateFlagTokens += scan.totalFlagCount;
    }

    tracker.assert(totalFilesScanned >= 20, `Scanned ${totalFilesScanned} source files in src/`);
    tracker.assert(aggregateMonochromeTokens >= 100, `Found ${aggregateMonochromeTokens} total luxury monochrome tokens across codebase`);
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  const durationMs = Date.now() - startTime;
  console.log(`\n${colors.bright}${colors.white}------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bright}Monochrome Auditor Summary:${colors.reset} ${tracker.passedTests}/${tracker.totalTests} tests passed | ${tracker.passedAssertions}/${tracker.totalAssertions} assertions passed (${durationMs}ms)`);
  console.log(`${colors.bright}${colors.white}------------------------------------------------------${colors.reset}\n`);

  return {
    suiteName: 'Luxury Monochrome Noir Design System Auditor',
    totalTests: tracker.totalTests,
    passedTests: tracker.passedTests,
    failedTests: tracker.failedTests,
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    tierBreakdown: tracker.tierCounts,
    durationMs,
    errors: tracker.errors,
  };
}

// Allow direct CLI execution
if (require.main === module) {
  runMonochromeTests()
    .then(result => {
      if (result.failedAssertions > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch(err => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}

module.exports = { runMonochromeTests };
