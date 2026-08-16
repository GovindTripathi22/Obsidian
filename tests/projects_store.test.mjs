import test from "node:test";
import assert from "node:assert/strict";

// Mock localStorage and window CustomEvent for Node.js test environment
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

class MockEventTarget {
  constructor() {
    this.listeners = new Map();
  }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(listener);
  }
  removeEventListener(type, listener) {
    if (!this.listeners.has(type)) return;
    const filtered = this.listeners.get(type).filter((l) => l !== listener);
    this.listeners.set(type, filtered);
  }
  dispatchEvent(event) {
    if (!this.listeners.has(event.type)) return true;
    for (const listener of this.listeners.get(event.type)) {
      listener(event);
    }
    return true;
  }
}

class MockCustomEvent {
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.detail = eventInitDict.detail || null;
  }
}

// Setup Global Environment
const mockStorage = new MockLocalStorage();
const mockWindow = new MockEventTarget();
mockWindow.localStorage = mockStorage;

global.window = mockWindow;
global.localStorage = mockStorage;
global.CustomEvent = MockCustomEvent;

// Now import the module under test
const projectsModule = await import("../src/lib/projects.ts");
const {
  PROJECTS_STORAGE_KEY,
  LEGACY_SHOPIFY_KEY,
  LEGACY_WEBSITE_KEY,
  PROJECTS_UPDATED_EVENT,
  MAX_FREE_PROJECTS,
  INITIAL_DEFAULT_MOCKS,
  getProjects,
  getProjectById,
  getProjectsByType,
  saveProject,
  createProject,
  deleteProject,
  duplicateProject,
  getProjectCount,
  canCreateProject,
  getProjectStats,
  migrateLegacyProjects,
} = projectsModule;

test("1.1 Initial Mock Seeding should seed exactly 1 project with quota 1/3", () => {
  mockStorage.clear();
  assert.equal(mockStorage.getItem(PROJECTS_STORAGE_KEY), null);

  const projects = getProjects();
  assert.equal(projects.length, 1, "Should seed exactly 1 starter project");
  assert.equal(projects[0].id, "proj-shopify-starter-1");
  assert.equal(projects[0].title, "LuxeAura Cosmetics Store");
  assert.equal(projects[0].type, "shopify");

  const count = getProjectCount();
  assert.deepEqual(count, {
    totalCount: 1,
    shopifyCount: 1,
    websiteCount: 0,
  });

  const stats = getProjectStats(false);
  assert.equal(stats.totalCount, 1);
  assert.equal(stats.maxFreeProjects, 3);
  assert.equal(stats.isLimitReached, false, "1/3 should not reach limit");
  assert.equal(stats.isPro, false);
});

test("1.2 Strict Quota Limit Logic (canCreateProject) for Free vs Pro tiers", () => {
  mockStorage.clear();

  // 1 project (default)
  assert.equal(canCreateProject(false), true, "1 project: free user CAN create");
  assert.equal(canCreateProject(true), true, "1 project: pro user CAN create");

  // Add 2nd project
  createProject({ title: "Site 2", type: "website" });
  assert.equal(getProjectCount().totalCount, 2);
  assert.equal(canCreateProject(false), true, "2 projects: free user CAN create");
  assert.equal(canCreateProject(true), true, "2 projects: pro user CAN create");

  // Add 3rd project -> Limit Reached for Free
  createProject({ title: "Store 3", type: "shopify" });
  assert.equal(getProjectCount().totalCount, 3);
  assert.equal(canCreateProject(false), false, "3 projects: free user CANNOT create (capped at 3)");
  assert.equal(canCreateProject(true), true, "3 projects: pro user CAN create (unlimited)");

  const freeStats = getProjectStats(false);
  assert.equal(freeStats.isLimitReached, true, "isLimitReached must be true at 3 projects");

  const proStats = getProjectStats(true);
  assert.equal(proStats.isLimitReached, false, "isLimitReached must be false for Pro user");

  // Add 4th project under Pro
  createProject({ title: "Site 4", type: "website" });
  assert.equal(getProjectCount().totalCount, 4);
  assert.equal(canCreateProject(false), false, "4 projects: free user CANNOT create");
  assert.equal(canCreateProject(true), true, "4 projects: pro user CAN create");
});

test("1.3 CRUD & CustomEvent Dispatching", () => {
  mockStorage.clear();
  let eventFiredCount = 0;
  let lastEventDetail = null;

  const listener = (e) => {
    eventFiredCount++;
    lastEventDetail = e.detail;
  };
  mockWindow.addEventListener(PROJECTS_UPDATED_EVENT, listener);

  // 1. Create Project
  const created = createProject({
    title: "Cyberpunk Apparel",
    type: "shopify",
    prompt: "Futuristic neon apparel storefront",
    thumbnail: "https://example.com/cyber.jpg",
  });

  assert.ok(created.id.startsWith("proj-shopify-"));
  assert.equal(created.title, "Cyberpunk Apparel");
  assert.equal(created.type, "shopify");
  assert.equal(eventFiredCount, 1, "CustomEvent must fire on createProject");
  assert.equal(lastEventDetail.count.totalCount, 2);

  // 2. Read Project
  const fetched = getProjectById(created.id);
  assert.ok(fetched);
  assert.equal(fetched.title, "Cyberpunk Apparel");

  const shopifyList = getProjectsByType("shopify");
  assert.equal(shopifyList.length, 2); // default starter + new one

  const websiteList = getProjectsByType("website");
  assert.equal(websiteList.length, 0);

  // 3. Update Project
  const updated = saveProject({
    id: created.id,
    title: "Cyberpunk Apparel Pro Edition",
    data: { storeName: "Cyberpunk Luxury" },
  });
  assert.equal(updated.title, "Cyberpunk Apparel Pro Edition");
  assert.equal(updated.data.storeName, "Cyberpunk Luxury");
  assert.equal(eventFiredCount, 2, "CustomEvent must fire on saveProject");

  // 4. Duplicate Project
  const duplicated = duplicateProject(created.id);
  assert.ok(duplicated);
  assert.equal(duplicated.title, "Cyberpunk Apparel Pro Edition (Copy)");
  assert.notEqual(duplicated.id, created.id);
  assert.equal(eventFiredCount, 3, "CustomEvent must fire on duplicateProject");

  // 5. Delete Project
  const deleted = deleteProject(created.id);
  assert.equal(deleted, true);
  assert.equal(getProjectById(created.id), undefined);
  assert.equal(eventFiredCount, 4, "CustomEvent must fire on deleteProject");

  // Delete non-existent ID
  const deletedAgain = deleteProject("non-existent-id-999");
  assert.equal(deletedAgain, false);
  assert.equal(eventFiredCount, 4, "CustomEvent must NOT fire if delete target not found");

  mockWindow.removeEventListener(PROJECTS_UPDATED_EVENT, listener);
});

test("1.4 Legacy Project Migration from insforge_projects & obsidian_website_projects", () => {
  mockStorage.clear();

  // Populate legacy storage
  mockStorage.setItem(
    LEGACY_SHOPIFY_KEY,
    JSON.stringify([
      { id: "legacy-shop-1", title: "Legacy Shopify Store", prompt: "Shop prompt", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "legacy-shared-1", title: "Shared ID", prompt: "Store version" },
    ])
  );

  mockStorage.setItem(
    LEGACY_WEBSITE_KEY,
    JSON.stringify([
      { id: "legacy-web-1", title: "Legacy Website", prompt: "Web prompt" },
      { id: "legacy-shared-1", title: "Shared ID", prompt: "Website duplicate" }, // should be deduplicated
    ])
  );

  const migrated = migrateLegacyProjects();
  assert.equal(migrated.length, 3, "Should deduplicate and migrate 3 unique legacy items");

  const ids = migrated.map((p) => p.id);
  assert.ok(ids.includes("legacy-shop-1"));
  assert.ok(ids.includes("legacy-web-1"));
  assert.ok(ids.includes("legacy-shared-1"));

  // Check canonical storage key was populated
  const canonical = JSON.parse(mockStorage.getItem(PROJECTS_STORAGE_KEY));
  assert.equal(canonical.length, 3);
});
