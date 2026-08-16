/**
 * Master E2E Test Runner
 * File: tests/run-all-tests.js
 * 
 * Orchestrates and executes all test suites:
 * 1. Shopify OS 2.0 Theme ZIP & Liquid Schema Validator (tests/validate-theme-zip.js)
 * 2. Auth & 3-Project Quota Contract Validator (tests/validate-auth-quota.js)
 * 3. Luxury Monochrome Noir Design System Auditor (tests/validate-monochrome.js)
 * 
 * Aggregates results, outputs formatted execution summary, and exits with 0 on pass.
 */

const { runThemeZipTests } = require('./validate-theme-zip');
const { runAuthQuotaTests } = require('./validate-auth-quota');
const { runMonochromeTests } = require('./validate-monochrome');

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

async function runAllTests() {
  const masterStart = Date.now();

  console.log(`${colors.bright}${colors.cyan}`);
  console.log(`╔══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║      OBSIDIAN WEBSITE BUILDER & SHOPIFY STUDIO E2E TEST SUITE        ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════════╝`);
  console.log(`${colors.reset}\n`);

  const suites = [
    { name: 'Shopify OS 2.0 Theme ZIP Validator', runner: runThemeZipTests },
    { name: 'Auth & 3-Project Quota Contract Validator', runner: runAuthQuotaTests },
    { name: 'Luxury Monochrome Noir Design System Auditor', runner: runMonochromeTests },
  ];

  const results = [];
  let totalTestsAll = 0;
  let passedTestsAll = 0;
  let failedTestsAll = 0;
  let totalAssertionsAll = 0;
  let passedAssertionsAll = 0;
  let failedAssertionsAll = 0;

  const tierAggregate = {
    1: { total: 0, passed: 0, failed: 0 },
    2: { total: 0, passed: 0, failed: 0 },
    3: { total: 0, passed: 0, failed: 0 },
    4: { total: 0, passed: 0, failed: 0 },
  };

  for (const suite of suites) {
    try {
      const res = await suite.runner();
      results.push(res);
      totalTestsAll += res.totalTests;
      passedTestsAll += res.passedTests;
      failedTestsAll += res.failedTests;
      totalAssertionsAll += res.totalAssertions;
      passedAssertionsAll += res.passedAssertions;
      failedAssertionsAll += res.failedAssertions;

      for (let t = 1; t <= 4; t++) {
        if (res.tierBreakdown && res.tierBreakdown[t]) {
          tierAggregate[t].total += res.tierBreakdown[t].total;
          tierAggregate[t].passed += res.tierBreakdown[t].passed;
          tierAggregate[t].failed += res.tierBreakdown[t].failed;
        }
      }
    } catch (err) {
      console.error(`Suite ${suite.name} encountered critical failure:`, err);
      results.push({
        suiteName: suite.name,
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        totalAssertions: 1,
        passedAssertions: 0,
        failedAssertions: 1,
        durationMs: 0,
        errors: [err.message],
      });
      totalTestsAll += 1;
      failedTestsAll += 1;
      totalAssertionsAll += 1;
      failedAssertionsAll += 1;
    }
  }

  const masterDuration = Date.now() - masterStart;

  // Print Formatted Summary Table
  console.log(`\n${colors.bright}${colors.white}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.white}                    MASTER TEST EXECUTION SUMMARY                     ${colors.reset}`);
  console.log(`${colors.bright}${colors.white}======================================================================${colors.reset}`);

  console.log(`\n${colors.dim}Suite Breakdown:${colors.reset}`);
  console.log(`┌───────────────────────────────────────────────┬───────────┬──────────────┬───────────┬─────────┐`);
  console.log(`│ Suite Name                                    │ Tests     │ Assertions   │ Time (ms) │ Status  │`);
  console.log(`├───────────────────────────────────────────────┼───────────┼──────────────┼───────────┼─────────┤`);

  for (const r of results) {
    const namePadded = r.suiteName.padEnd(45, ' ').substring(0, 45);
    const testsPadded = `${r.passedTests}/${r.totalTests}`.padStart(9, ' ');
    const assertionsPadded = `${r.passedAssertions}/${r.totalAssertions}`.padStart(12, ' ');
    const timePadded = `${r.durationMs || 0}ms`.padStart(9, ' ');
    const statusPadded = r.failedAssertions === 0 ? `${colors.green} PASS ${colors.reset} ` : `${colors.red} FAIL ${colors.reset} `;

    console.log(`│ ${namePadded} │ ${testsPadded} │ ${assertionsPadded} │ ${timePadded} │ ${statusPadded} │`);
  }
  console.log(`└───────────────────────────────────────────────┴───────────┴──────────────┴───────────┴─────────┘`);

  console.log(`\n${colors.dim}Tier Breakdown (Requirement Coverage):${colors.reset}`);
  console.log(`  • Tier 1 (Feature Coverage):        ${tierAggregate[1].passed}/${tierAggregate[1].total} assertions (${tierAggregate[1].failed === 0 ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset})`);
  console.log(`  • Tier 2 (Boundary & Corner Cases): ${tierAggregate[2].passed}/${tierAggregate[2].total} assertions (${tierAggregate[2].failed === 0 ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset})`);
  console.log(`  • Tier 3 (Cross-Engine Sync):       ${tierAggregate[3].passed}/${tierAggregate[3].total} assertions (${tierAggregate[3].failed === 0 ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset})`);
  console.log(`  • Tier 4 (Real-World Scenarios):    ${tierAggregate[4].passed}/${tierAggregate[4].total} assertions (${tierAggregate[4].failed === 0 ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset})`);

  console.log(`\n${colors.bright}Total Suites:${colors.reset}     ${suites.length}`);
  console.log(`${colors.bright}Total Tests:${colors.reset}      ${passedTestsAll}/${totalTestsAll} passed`);
  console.log(`${colors.bright}Total Assertions:${colors.reset} ${passedAssertionsAll}/${totalAssertionsAll} passed`);
  console.log(`${colors.bright}Total Duration:${colors.reset}   ${masterDuration}ms\n`);

  if (failedAssertionsAll === 0) {
    console.log(`${colors.green}${colors.bright}🎉 ALL E2E TEST SUITES PASSED CLEANLY (Exit code: 0)${colors.reset}\n`);
    return { success: true, results, totalTestsAll, passedTestsAll, totalAssertionsAll, passedAssertionsAll, masterDuration };
  } else {
    console.log(`${colors.red}${colors.bright}❌ SOME TESTS FAILED (${failedAssertionsAll} failed assertions)${colors.reset}\n`);
    return { success: false, results, totalTestsAll, passedTestsAll, totalAssertionsAll, passedAssertionsAll, masterDuration };
  }
}

if (require.main === module) {
  runAllTests()
    .then(summary => {
      if (!summary.success) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch(err => {
      console.error('Fatal execution error:', err);
      process.exit(1);
    });
}

module.exports = { runAllTests };
