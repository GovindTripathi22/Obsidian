/**
 * Milestone 1 Empirical Challenger Verification & Stress Test Suite
 * File: tests/empirical-challenger-m1.js
 * 
 * Challenger: Challenger 2 (Empirical Challenger)
 * Working Directory: d:\app\.agents\sub_orch_m1_challenger_2
 * Target: src/lib/projects.ts and UI Quota Contracts
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Color formatting
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
    this.categoryCounts = {};
    this.currentCategory = 'General';
    this.currentTestName = '';
    this.errors = [];
  }

  setCategory(cat) {
    this.currentCategory = cat;
    if (!this.categoryCounts[cat]) {
      this.categoryCounts[cat] = { total: 0, passed: 0, failed: 0 };
    }
  }

  startTest(name) {
    this.currentTestName = name;
    this.totalTests++;
    console.log(`\n  ${colors.cyan}▶${colors.reset} [${this.currentCategory}] ${colors.bright}${name}${colors.reset}`);
  }

  assert(condition, message, details = '') {
    this.totalAssertions++;
    if (!this.categoryCounts[this.currentCategory]) {
      this.categoryCounts[this.currentCategory] = { total: 0, passed: 0, failed: 0 };
    }
    this.categoryCounts[this.currentCategory].total++;
    
    if (condition) {
      this.passedAssertions++;
      this.categoryCounts[this.currentCategory].passed++;
      console.log(`    ${colors.green}✓${colors.reset} ${colors.dim}${message}${colors.reset}`);
    } else {
      this.failedAssertions++;
      this.categoryCounts[this.currentCategory].failed++;
      const err = `[${this.currentCategory}] ${this.currentTestName} -> FAILED: ${message} ${details ? '(' + details + ')' : ''}`;
      this.errors.push(err);
      console.log(`    ${colors.red}✗ FAILED: ${message}${colors.reset} ${details ? colors.yellow + details + colors.reset : ''}`);
    }
  }

  finishTest(success = true) {
    if (success && this.categoryCounts[this.currentCategory].failed === 0) {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
  }
}

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

class MockCustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init ? init.detail : null;
  }
}

function createMockEnvironment() {
  const mockLocalStorage = new MockLocalStorage();
  const listeners = {};

  const mockWindow = {
    localStorage: mockLocalStorage,
    addEventListener(type, handler) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(handler);
    },
    removeEventListener(type, handler) {
      if (!listeners[type]) return;
      listeners[type] = listeners[type].filter(h => h !== handler);
    },
    dispatchEvent(event) {
      const handlers = listeners[event.type] || [];
      for (const h of handlers) {
        try {
          h(event);
        } catch (e) {
          console.error("Handler error:", e);
        }
      }
      return true;
    },
  };

  return {
    window: mockWindow,
    localStorage: mockLocalStorage,
    CustomEvent: MockCustomEvent,
    listeners,
  };
}

function loadProjectsTs(env) {
  const pPath = path.resolve(__dirname, '../src/lib/projects.ts');
  const tsContent = fs.readFileSync(pPath, 'utf8');
  const jsContent = ts.transpileModule(tsContent, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  const fn = new Function('require', 'module', 'exports', 'window', 'localStorage', 'CustomEvent', jsContent);
  fn(require, mod, mod.exports, env.window, env.localStorage, env.CustomEvent);
  return mod.exports;
}

async function runEmpiricalVerification() {
  const tracker = new AssertionTracker('Milestone 1 Empirical Challenger Verification');
  const startTime = Date.now();

  console.log(`\n${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}   MILESTONE 1: EMPIRICAL VERIFICATION & STRESS TEST REPORT           ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);

  const env = createMockEnvironment();
  const store = loadProjectsTs(env);

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 1: Initial Default Seeding & Quota Ground State
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Initial Seeding & Ground State');

  tracker.startTest('1.1 Fresh Load Initial Seeding Contract');
  try {
    env.localStorage.clear();
    tracker.assert(env.localStorage.getItem(store.PROJECTS_STORAGE_KEY) === null, 'Storage is completely empty before initialization');
    
    // Call getProjects() on empty storage
    const initialProjects = store.getProjects();
    tracker.assert(Array.isArray(initialProjects), 'getProjects() returns an array');
    tracker.assert(initialProjects.length === 1, `Exactly 1 starter project seeded (actual: ${initialProjects.length})`);
    
    const starter = initialProjects[0];
    tracker.assert(starter.id === 'proj-shopify-starter-1', `Starter project ID is 'proj-shopify-starter-1' (actual: ${starter.id})`);
    tracker.assert(starter.title === 'LuxeAura Cosmetics Store', `Starter project title is 'LuxeAura Cosmetics Store' (actual: ${starter.title})`);
    tracker.assert(starter.type === 'shopify', `Starter project type is 'shopify' (actual: ${starter.type})`);
    tracker.assert(starter.userId === 'user-obsidian-prime', `Starter project userId is 'user-obsidian-prime'`);
    tracker.assert(typeof starter.createdAt === 'string', 'Starter project has valid createdAt timestamp');
    tracker.assert(starter.data && starter.data.storeName === 'LuxeAura Cosmetics', 'Starter project includes storeName in data payload');

    // Verify localStorage persistence
    const rawStored = env.localStorage.getItem(store.PROJECTS_STORAGE_KEY);
    tracker.assert(rawStored !== null, 'Seeded projects are persistently saved to localStorage["obsidian_projects"]');
    const parsed = JSON.parse(rawStored || '[]');
    tracker.assert(parsed.length === 1 && parsed[0].id === 'proj-shopify-starter-1', 'LocalStorage contains identical starter project');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('1.2 Initial Quota Breakdown & Availability');
  try {
    const count = store.getProjectCount();
    tracker.assert(count.totalCount === 1, `getProjectCount().totalCount is 1 (actual: ${count.totalCount})`);
    tracker.assert(count.shopifyCount === 1, `getProjectCount().shopifyCount is 1 (actual: ${count.shopifyCount})`);
    tracker.assert(count.websiteCount === 0, `getProjectCount().websiteCount is 0 (actual: ${count.websiteCount})`);

    const canCreateFree = store.canCreateProject(false);
    tracker.assert(canCreateFree === true, 'Free user CAN create new projects from starter state (1/3 slots used)');

    const stats = store.getProjectStats(false);
    tracker.assert(stats.totalCount === 1, 'stats.totalCount is 1');
    tracker.assert(stats.maxFreeProjects === 3, 'stats.maxFreeProjects is 3');
    tracker.assert(stats.isLimitReached === false, 'stats.isLimitReached is false');
    tracker.assert(stats.isPro === false, 'stats.isPro is false');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 2: Progressive Project Creation & Free Tier Limit Enforcement
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Project Creation & Quota Saturation');

  tracker.startTest('2.1 Free User Creates Project 2 (2/3 Quota)');
  try {
    const proj2 = store.createProject({
      title: 'Obsidian Minimal Portfolio',
      type: 'website',
      prompt: 'Minimalist designer portfolio with dark monochrome grid',
    });

    tracker.assert(typeof proj2.id === 'string' && proj2.id.length > 0, `Project 2 created with ID: ${proj2.id}`);
    tracker.assert(proj2.type === 'website', 'Project 2 type is website');

    const count2 = store.getProjectCount();
    tracker.assert(count2.totalCount === 2, `Total project count is 2/3 (actual: ${count2.totalCount})`);
    tracker.assert(count2.shopifyCount === 1, `shopifyCount is 1 (actual: ${count2.shopifyCount})`);
    tracker.assert(count2.websiteCount === 1, `websiteCount is 1 (actual: ${count2.websiteCount})`);

    const canCreateAfter2 = store.canCreateProject(false);
    tracker.assert(canCreateAfter2 === true, 'Free user CAN still create project 3 (2/3 slots used)');

    const stats2 = store.getProjectStats(false);
    tracker.assert(stats2.isLimitReached === false, 'stats.isLimitReached is false at 2/3');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('2.2 Free User Creates Project 3 (3/3 Quota - Max Reached)');
  try {
    const proj3 = store.createProject({
      title: 'KINETIC Streetwear Store',
      type: 'shopify',
      prompt: 'High-contrast monochrome streetwear store with hoodie catalog',
    });

    tracker.assert(typeof proj3.id === 'string', `Project 3 created with ID: ${proj3.id}`);
    
    const count3 = store.getProjectCount();
    tracker.assert(count3.totalCount === 3, `Total project count is exactly 3/3 (actual: ${count3.totalCount})`);
    tracker.assert(count3.shopifyCount === 2, `shopifyCount is 2 (actual: ${count3.shopifyCount})`);
    tracker.assert(count3.websiteCount === 1, `websiteCount is 1 (actual: ${count3.websiteCount})`);

    const canCreateAfter3 = store.canCreateProject(false);
    tracker.assert(canCreateAfter3 === false, 'Free user CANNOT create 4th project when at 3/3 capacity (canCreateProject(false) === false)');

    const stats3 = store.getProjectStats(false);
    tracker.assert(stats3.isLimitReached === true, 'stats.isLimitReached is TRUE at 3/3');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('2.3 Verification of UI Route Quota Limit Guards');
  try {
    // Check projects page guard logic
    const projectsPagePath = path.resolve(__dirname, '../src/app/projects/page.tsx');
    const projectsPageSrc = fs.readFileSync(projectsPagePath, 'utf8');
    tracker.assert(projectsPageSrc.includes('canCreateProject(isPro)'), 'projects/page.tsx guards creation with canCreateProject(isPro)');
    tracker.assert(projectsPageSrc.includes('setShowQuotaModal(true)'), 'projects/page.tsx triggers QuotaLimitModal on quota exhaustion');
    tracker.assert(projectsPageSrc.includes('<QuotaLimitModal'), 'projects/page.tsx mounts <QuotaLimitModal /> component');

    // Check builder page guard logic
    const builderPagePath = path.resolve(__dirname, '../src/app/builder/page.tsx');
    const builderPageSrc = fs.readFileSync(builderPagePath, 'utf8');
    tracker.assert(builderPageSrc.includes('canCreateProject(stats.isPro)'), 'builder/page.tsx guards launch with canCreateProject(stats.isPro)');
    tracker.assert(builderPageSrc.includes('setShowQuotaModal(true)'), 'builder/page.tsx triggers QuotaLimitModal on quota exhaustion');

    // Check landing page guard logic
    const landingClientPath = path.resolve(__dirname, '../src/components/LandingPageClient.tsx');
    const landingClientSrc = fs.readFileSync(landingClientPath, 'utf8');
    tracker.assert(landingClientSrc.includes('canCreateProject(stats.isPro)'), 'LandingPageClient guards generation with canCreateProject(stats.isPro)');
    tracker.assert(landingClientSrc.includes('setShowQuotaModal(true)'), 'LandingPageClient triggers QuotaLimitModal on quota exhaustion');

    // Check InteractiveShopifyStudio guard logic
    const shopifyStudioPath = path.resolve(__dirname, '../src/components/builder/InteractiveShopifyStudio.tsx');
    const shopifyStudioSrc = fs.readFileSync(shopifyStudioPath, 'utf8');
    tracker.assert(shopifyStudioSrc.includes('canCreateProject(isPro)'), 'InteractiveShopifyStudio guards project launch with canCreateProject(isPro)');
    tracker.assert(shopifyStudioSrc.includes('setShowQuotaModal(true)'), 'InteractiveShopifyStudio triggers QuotaLimitModal on quota exhaustion');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 3: Pro User Quota Bypass & Scalability
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Pro User Quota Bypass');

  tracker.startTest('3.1 Pro User Bypasses 3-Project Limit');
  try {
    // Current count is 3/3
    const canCreateProAt3 = store.canCreateProject(true);
    tracker.assert(canCreateProAt3 === true, 'Pro user can create project at count = 3');

    const statsProAt3 = store.getProjectStats(true);
    tracker.assert(statsProAt3.isLimitReached === false, 'stats.isLimitReached is FALSE for Pro user at count = 3');
    tracker.assert(statsProAt3.isPro === true, 'stats.isPro is TRUE');

    // Create 4th through 10th projects (7 more projects on top of existing 3 = 10 projects)
    for (let i = 4; i <= 10; i++) {
      store.createProject({
        id: `pro-p-${i}`,
        title: `Pro Project ${i}`,
        type: i % 2 === 0 ? 'shopify' : 'website',
        prompt: `Scalability stress prompt ${i}`,
      });
    }

    const countAt10 = store.getProjectCount();
    tracker.assert(countAt10.totalCount === 10, `Pro user successfully scaled to 10 projects (actual: ${countAt10.totalCount})`);
    tracker.assert(store.canCreateProject(true) === true, 'Pro user can continue creating at count = 10');
    tracker.assert(store.canCreateProject(false) === false, 'Free user is strictly blocked at count = 10');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('3.2 Dynamic Plan Switch Simulation (Pro -> Free -> Pro)');
  try {
    // When user downgrades to Free with 10 projects:
    const freeStats = store.getProjectStats(false);
    tracker.assert(freeStats.isLimitReached === true, 'Downgraded user has isLimitReached: true with 10 projects');
    tracker.assert(store.canCreateProject(false) === false, 'Downgraded user cannot create new projects until under 3');

    // When user upgrades back to Pro:
    const proStats = store.getProjectStats(true);
    tracker.assert(proStats.isLimitReached === false, 'Re-upgraded user has isLimitReached: false');
    tracker.assert(store.canCreateProject(true) === true, 'Re-upgraded user can create unlimited projects');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 4: Project Deletion & Reactive Event Bus Synchronization
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Project Deletion & Event Synchronization');

  tracker.startTest('4.1 Project Deletion Decrements Count & Restores Free Quota');
  try {
    // Start fresh: 1 default starter project
    env.localStorage.clear();
    const init = store.getProjects(); // seeds starter
    tracker.assert(init.length === 1, 'Initial seeded state: 1 starter project');

    // Add 2 more projects to reach exactly 3/3
    store.createProject({ id: 'del-p2', title: 'Delete Test 2', type: 'website' });
    store.createProject({ id: 'del-p3', title: 'Delete Test 3', type: 'shopify' });

    tracker.assert(store.getProjectCount().totalCount === 3, 'Pre-condition: 3 projects in storage');
    tracker.assert(store.canCreateProject(false) === false, 'Pre-condition: Free quota is saturated (canCreate === false)');

    // Delete 1 project
    const deleteResult = store.deleteProject('del-p2');
    tracker.assert(deleteResult === true, 'deleteProject("del-p2") returned true');

    const countAfterDel = store.getProjectCount();
    tracker.assert(countAfterDel.totalCount === 2, `Total count immediately decremented to 2 (actual: ${countAfterDel.totalCount})`);
    tracker.assert(countAfterDel.websiteCount === 0, `websiteCount decremented to 0 (actual: ${countAfterDel.websiteCount})`);
    tracker.assert(countAfterDel.shopifyCount === 2, `shopifyCount is 2 (actual: ${countAfterDel.shopifyCount})`);

    // Verify quota is restored
    tracker.assert(store.canCreateProject(false) === true, 'Deleting project immediately restores free creation quota (canCreate === true)');
    tracker.assert(store.getProjectById('del-p2') === undefined, 'getProjectById("del-p2") returns undefined');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('4.2 Event Bus Dispatch: "obsidian:projects-updated" on Delete & Create');
  try {
    let capturedEvents = [];
    const eventHandler = (e) => {
      capturedEvents.push(e);
    };

    env.window.addEventListener(store.PROJECTS_UPDATED_EVENT, eventHandler);

    // Trigger Creation -> Should fire event
    const newProj = store.createProject({ id: 'event-p4', title: 'Event Test Proj', type: 'website' });
    tracker.assert(capturedEvents.length === 1, 'CustomEvent fired on createProject');
    tracker.assert(capturedEvents[0].type === 'obsidian:projects-updated', 'Event type is "obsidian:projects-updated"');
    tracker.assert(capturedEvents[0].detail && typeof capturedEvents[0].detail.timestamp === 'number', 'Event detail has timestamp');
    tracker.assert(Array.isArray(capturedEvents[0].detail.projects), 'Event detail includes updated projects array');
    tracker.assert(capturedEvents[0].detail.count.totalCount === 3, 'Event detail includes accurate totalCount (3)');

    // Trigger Update via saveProject -> Should fire event
    store.saveProject({ id: 'event-p4', title: 'Renamed Event Proj', type: 'website' });
    tracker.assert(capturedEvents.length === 2, 'CustomEvent fired on saveProject (update)');

    // Trigger Deletion -> Should fire event
    store.deleteProject('event-p4');
    tracker.assert(capturedEvents.length === 3, 'CustomEvent fired on deleteProject');
    tracker.assert(capturedEvents[2].detail.count.totalCount === 2, 'Delete event detail includes decremented totalCount (2)');

    env.window.removeEventListener(store.PROJECTS_UPDATED_EVENT, eventHandler);
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('4.3 Deletion of Non-Existent ID & Legacy Key Cleanup');
  try {
    // Populate legacy keys with old dummy data
    env.localStorage.setItem(store.LEGACY_SHOPIFY_KEY, JSON.stringify([{ id: 'legacy-del-1', title: 'Legacy Del' }]));
    env.localStorage.setItem(store.LEGACY_WEBSITE_KEY, JSON.stringify([{ id: 'legacy-del-1', title: 'Legacy Del Web' }]));

    // Delete non-existent ID in canonical store
    const nonExistentResult = store.deleteProject('non-existent-random-id-999');
    tracker.assert(nonExistentResult === false, 'deleteProject(unknownId) returns false safely');

    // Save in canonical so it's tracked
    store.saveProject({ id: 'legacy-del-1', title: 'Legacy Del', type: 'shopify' });
    tracker.assert(store.getProjectById('legacy-del-1') !== undefined, 'Project saved in canonical');

    store.deleteProject('legacy-del-1');
    tracker.assert(store.getProjectById('legacy-del-1') === undefined, 'Project deleted from canonical');

    // Check legacy keys
    const shopifyRaw = JSON.parse(env.localStorage.getItem(store.LEGACY_SHOPIFY_KEY) || '[]');
    const websiteRaw = JSON.parse(env.localStorage.getItem(store.LEGACY_WEBSITE_KEY) || '[]');
    tracker.assert(shopifyRaw.find(p => p.id === 'legacy-del-1') === undefined, 'Legacy shopify key purged deleted project');
    tracker.assert(websiteRaw.find(p => p.id === 'legacy-del-1') === undefined, 'Legacy website key purged deleted project');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 5: Legacy Project Migration Engine
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Legacy Storage Migration');

  tracker.startTest('5.1 Migration from Legacy insforge_projects & obsidian_website_projects');
  try {
    env.localStorage.clear();

    const legacyShopifyData = [
      {
        id: 'legacy-shop-101',
        title: 'Legacy Aura Botanicals',
        prompt: 'Clean skincare store with pastel accents',
        user_id: 'user-legacy-1',
        thumbnail_url: 'https://images.unsplash.com/photo-skincare',
        created_at: '2025-12-01T10:00:00.000Z',
        data: { storeName: 'Aura Botanicals' },
      },
      {
        id: 'legacy-shop-102',
        title: 'Legacy Streetwear Drop',
        prompt: 'Oversized hoodie shop',
        userId: 'user-legacy-2',
        thumbnail: 'https://images.unsplash.com/photo-hoodie',
        createdAt: '2025-12-05T12:00:00.000Z',
      },
    ];

    const legacyWebsiteData = [
      {
        id: 'legacy-web-201',
        title: 'Legacy Cybernetic Landing',
        prompt: 'Futuristic AI SaaS platform',
        user_id: 'user-legacy-1',
        created_at: '2025-12-10T15:00:00.000Z',
      },
    ];

    env.localStorage.setItem(store.LEGACY_SHOPIFY_KEY, JSON.stringify(legacyShopifyData));
    env.localStorage.setItem(store.LEGACY_WEBSITE_KEY, JSON.stringify(legacyWebsiteData));

    // Ensure canonical key does NOT exist yet
    tracker.assert(env.localStorage.getItem(store.PROJECTS_STORAGE_KEY) === null, 'obsidian_projects is null before migration');

    // Trigger migration by calling getProjects()
    const migrated = store.getProjects();
    tracker.assert(Array.isArray(migrated), 'getProjects() returns an array of migrated projects');
    tracker.assert(migrated.length === 3, `Migrated exactly 3 projects from legacy keys (actual: ${migrated.length})`);

    const shop1 = migrated.find(p => p.id === 'legacy-shop-101');
    tracker.assert(shop1 !== undefined, 'Migrated legacy-shop-101');
    tracker.assert(shop1.type === 'shopify', 'shop1 type normalized to shopify');
    tracker.assert(shop1.title === 'Legacy Aura Botanicals', 'shop1 title preserved');
    tracker.assert(shop1.userId === 'user-legacy-1' && shop1.user_id === 'user-legacy-1', 'shop1 userId & user_id normalized');
    tracker.assert(shop1.thumbnail === 'https://images.unsplash.com/photo-skincare', 'shop1 thumbnail normalized from thumbnail_url');
    tracker.assert(shop1.createdAt === '2025-12-01T10:00:00.000Z', 'shop1 createdAt normalized from created_at');

    const web1 = migrated.find(p => p.id === 'legacy-web-201');
    tracker.assert(web1 !== undefined, 'Migrated legacy-web-201');
    tracker.assert(web1.type === 'website', 'web1 type normalized to website');
    tracker.assert(web1.title === 'Legacy Cybernetic Landing', 'web1 title preserved');

    // Check count breakdown
    const stats = store.getProjectCount();
    tracker.assert(stats.totalCount === 3, 'stats.totalCount is 3');
    tracker.assert(stats.shopifyCount === 2, 'stats.shopifyCount is 2');
    tracker.assert(stats.websiteCount === 1, 'stats.websiteCount is 1');

    // Check canonical storage write
    tracker.assert(env.localStorage.getItem(store.PROJECTS_STORAGE_KEY) !== null, 'Migrated list written to canonical storage');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('5.2 Migration Deduplication with Overlapping IDs');
  try {
    env.localStorage.clear();

    const shopifyOverlap = [
      { id: 'shared-id-1', title: 'Overlap Store 1', prompt: 'Prompt 1' },
      { id: 'unique-shop-2', title: 'Unique Shop 2', prompt: 'Prompt 2' },
    ];
    const websiteOverlap = [
      { id: 'shared-id-1', title: 'Overlap Duplicate', prompt: 'Prompt 1 Duplicate' },
      { id: 'unique-web-3', title: 'Unique Web 3', prompt: 'Prompt 3' },
    ];

    env.localStorage.setItem(store.LEGACY_SHOPIFY_KEY, JSON.stringify(shopifyOverlap));
    env.localStorage.setItem(store.LEGACY_WEBSITE_KEY, JSON.stringify(websiteOverlap));

    const migrated = store.migrateLegacyProjects();
    tracker.assert(migrated.length === 3, `Deduplicated list has 3 items (actual: ${migrated.length})`);
    const sharedItems = migrated.filter(p => p.id === 'shared-id-1');
    tracker.assert(sharedItems.length === 1, 'Duplicate ID "shared-id-1" appeared exactly once');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('5.3 Migration Idempotency (Does not overwrite new projects)');
  try {
    // Storage has canonical projects now
    const beforeList = store.getProjects();
    store.createProject({ id: 'brand-new-p4', title: 'Brand New After Migration', type: 'website' });

    // Re-invoking migrateLegacyProjects should NOT destroy new project
    const reMigrated = store.migrateLegacyProjects();
    tracker.assert(reMigrated.some(p => p.id === 'brand-new-p4'), 'migrateLegacyProjects preserves newly created projects in canonical store');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 6: Adversarial Robustness, Corrupted Storage & Edge Cases
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('Adversarial & Edge Cases');

  tracker.startTest('6.1 Corrupted JSON Handling in Canonical Storage');
  try {
    // Inject unparseable JSON in obsidian_projects
    env.localStorage.setItem(store.PROJECTS_STORAGE_KEY, '<<INVALID_CORRUPT_JSON_DATA>>{[');

    const recovered = store.getProjects();
    tracker.assert(Array.isArray(recovered), 'getProjects() returns array despite corrupted JSON without throwing');
    tracker.assert(recovered.length >= 1, 'Safely recovered with starter project seeding');
    tracker.assert(recovered[0].id === 'proj-shopify-starter-1', 'Fallback starter project present');

    const count = store.getProjectCount();
    tracker.assert(typeof count.totalCount === 'number' && count.totalCount >= 1, 'getProjectCount() returns valid numbers');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('6.2 Non-Array Value Handling in Storage');
  try {
    // Inject non-array JSON (e.g. number or object)
    env.localStorage.setItem(store.PROJECTS_STORAGE_KEY, JSON.stringify({ notAnArray: true, total: 99 }));

    const recovered = store.getProjects();
    tracker.assert(Array.isArray(recovered), 'getProjects() recovers from non-array object in storage');
    tracker.assert(recovered.length >= 1, 'Re-seeded starter project');

    env.localStorage.setItem(store.PROJECTS_STORAGE_KEY, JSON.stringify(12345));
    const recoveredNumber = store.getProjects();
    tracker.assert(Array.isArray(recoveredNumber), 'getProjects() recovers from number in storage');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('6.3 duplicateProject() Cloning & Deep Copy Semantics');
  try {
    env.localStorage.clear();
    const orig = store.createProject({
      id: 'clone-orig-1',
      title: 'Original Project',
      type: 'shopify',
      prompt: 'Original prompt for testing',
      thumbnail: 'https://images.unsplash.com/photo-test',
      data: {
        storeName: 'Original Store',
        presetId: 'streetwear',
        settings: { currency: 'USD', tax: true },
      },
    });

    const clone = store.duplicateProject('clone-orig-1');
    tracker.assert(clone !== undefined, 'duplicateProject returned clone');
    tracker.assert(clone.id !== 'clone-orig-1', `Clone has new unique ID (${clone.id})`);
    tracker.assert(clone.title === 'Original Project (Copy)', `Clone title has "(Copy)" suffix (actual: ${clone.title})`);
    tracker.assert(clone.type === 'shopify', 'Clone type matches original');
    tracker.assert(clone.prompt === 'Original prompt for testing', 'Clone prompt matches original');
    tracker.assert(clone.data && clone.data.storeName === 'Original Store', 'Clone deep copied data');

    // Mutate original data to ensure deep copy
    orig.data.storeName = 'MUTATED ORIGINAL';
    store.saveProject(orig);
    const freshClone = store.getProjectById(clone.id);
    tracker.assert(freshClone.data.storeName === 'Original Store', 'Mutating original data did not affect deep copied clone');

    // Duplicating non-existent ID
    const nullClone = store.duplicateProject('non-existent-id-404');
    tracker.assert(nullClone === undefined, 'duplicateProject(unknownId) returns undefined');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('6.4 getProjectsByType() Filtering Accuracy');
  try {
    env.localStorage.clear();
    // Starter project is seeded: 1 shopify project
    store.createProject({ id: 'filter-s1', title: 'Shop 1', type: 'shopify' });
    store.createProject({ id: 'filter-s2', title: 'Shop 2', type: 'shopify' });
    store.createProject({ id: 'filter-w1', title: 'Web 1', type: 'website' });
    store.createProject({ id: 'filter-w2', title: 'Web 2', type: 'website' });
    store.createProject({ id: 'filter-w3', title: 'Web 3', type: 'website' });

    // Total: 3 shopify (1 starter + 2 created), 3 website
    const shopifyList = store.getProjectsByType('shopify');
    const websiteList = store.getProjectsByType('website');

    tracker.assert(shopifyList.length === 3, `getProjectsByType("shopify") returns 3 items (1 starter + 2 created, actual: ${shopifyList.length})`);
    tracker.assert(websiteList.length === 3, `getProjectsByType("website") returns 3 items (actual: ${websiteList.length})`);
    tracker.assert(shopifyList.every(p => p.type === 'shopify'), 'All items in shopifyList have type "shopify"');
    tracker.assert(websiteList.every(p => p.type === 'website'), 'All items in websiteList have type "website"');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  tracker.startTest('6.5 High Frequency Sequential Stress Test (100 Operations)');
  try {
    env.localStorage.clear();
    const stressCount = 50;

    // 50 sequential creations (1 starter + 50 created = 51 total)
    for (let i = 0; i < stressCount; i++) {
      store.createProject({
        id: `stress-proj-${i}`,
        title: `Stress Project ${i}`,
        type: i % 2 === 0 ? 'shopify' : 'website',
        prompt: `Stress iteration ${i}`,
      });
    }
    const count50 = store.getProjectCount().totalCount;
    tracker.assert(count50 === stressCount + 1, `Successfully created ${stressCount} sequential projects (total: ${count50})`);

    // 50 sequential updates
    for (let i = 0; i < stressCount; i++) {
      store.saveProject({
        id: `stress-proj-${i}`,
        title: `Updated Stress Project ${i}`,
      });
    }
    tracker.assert(store.getProjectCount().totalCount === stressCount + 1, '50 in-place updates preserved total count without duplication');
    const sampleUpdated = store.getProjectById('stress-proj-25');
    tracker.assert(sampleUpdated.title === 'Updated Stress Project 25', 'Sample project title accurately updated');

    // 25 sequential deletions
    for (let i = 0; i < 25; i++) {
      store.deleteProject(`stress-proj-${i}`);
    }
    const countAfterDel = store.getProjectCount().totalCount;
    tracker.assert(countAfterDel === (stressCount + 1) - 25, `25 deletions accurately reduced count to ${countAfterDel}`);

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 7: UI Copy Harmonization & Build Verification
  // ─────────────────────────────────────────────────────────────────────────
  tracker.setCategory('UI Copy Harmonization & Static Integrity');

  tracker.startTest('7.1 Copy Verification: "3 Free Projects" across all UI components');
  try {
    const checkFileContains = (filePath, expectedSubstrings, forbiddenSubstrings) => {
      const fullPath = path.resolve(__dirname, '..', filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const exp of expectedSubstrings) {
        tracker.assert(content.includes(exp), `${filePath} contains expected: "${exp}"`);
      }
      for (const forb of forbiddenSubstrings) {
        tracker.assert(!content.includes(forb), `${filePath} does NOT contain outdated: "${forb}"`);
      }
    };

    // Sidebar
    checkFileContains(
      'src/components/Sidebar.tsx',
      ['3 Free Projects', 'maxProjects = isPro ? "∞" : "3"'],
      ['2 Free Projects', '2/2']
    );

    // Billing page
    checkFileContains(
      'src/app/billing/page.tsx',
      ['Up to 3 free projects', '$9.99', 'Free Plan (3 Projects Max)'],
      ['2 Free Projects', '$19/mo', '2 Projects']
    );

    // QuotaLimitModal
    checkFileContains(
      'src/components/ui/QuotaLimitModal.tsx',
      ['3 free projects', '$9.99/mo', 'Free Quota Limit Reached'],
      ['2 free projects', '$19/mo']
    );

    // Design System
    checkFileContains(
      'src/app/design-system/page.tsx',
      ['3/3 projects used'],
      ['2/2 free project limit', '2/2']
    );

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  const durationMs = Date.now() - startTime;

  // ─────────────────────────────────────────────────────────────────────────
  // Final Execution Summary
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`\n${colors.bright}${colors.white}========================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.white}                     FINAL CHALLENGER VERIFICATION SUMMARY             ${colors.reset}`);
  console.log(`${colors.bright}${colors.white}========================================================================${colors.reset}`);

  console.log(`\n${colors.dim}Category Breakdown:${colors.reset}`);
  console.log(`┌───────────────────────────────────────────────────────────────┬──────────────┬─────────┐`);
  console.log(`│ Category                                                      │ Assertions   │ Status  │`);
  console.log(`├───────────────────────────────────────────────────────────────┼──────────────┼─────────┤`);

  for (const [cat, counts] of Object.entries(tracker.categoryCounts)) {
    const catPadded = cat.padEnd(61, ' ').substring(0, 61);
    const assertPadded = `${counts.passed}/${counts.total}`.padStart(12, ' ');
    const status = counts.failed === 0 ? `${colors.green} PASS ${colors.reset}` : `${colors.red} FAIL ${colors.reset}`;
    console.log(`│ ${catPadded} │ ${assertPadded} │ ${status} │`);
  }
  console.log(`└───────────────────────────────────────────────────────────────┴──────────────┴─────────┘`);

  console.log(`\n${colors.bright}Total Tests:${colors.reset}      ${tracker.passedTests}/${tracker.totalTests} passed`);
  console.log(`${colors.bright}Total Assertions:${colors.reset} ${tracker.passedAssertions}/${tracker.totalAssertions} passed`);
  console.log(`${colors.bright}Total Duration:${colors.reset}   ${durationMs}ms\n`);

  if (tracker.failedAssertions === 0) {
    console.log(`${colors.green}${colors.bright}🏆 ALL EMPIRICAL CHALLENGER VERIFICATION TESTS PASSED (100% SUCCESS)${colors.reset}\n`);
    console.log(`${colors.green}${colors.bright}VERDICT: APPROVE${colors.reset}\n`);
    return { success: true, tracker, durationMs };
  } else {
    console.log(`${colors.red}${colors.bright}❌ EMPIRICAL VERIFICATION FAILED WITH ${tracker.failedAssertions} ERRORS${colors.reset}\n`);
    console.log(`${colors.red}${colors.bright}VERDICT: REQUEST_CHANGES${colors.reset}\n`);
    return { success: false, tracker, durationMs };
  }
}

if (require.main === module) {
  runEmpiricalVerification()
    .then((res) => {
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}

module.exports = { runEmpiricalVerification };
