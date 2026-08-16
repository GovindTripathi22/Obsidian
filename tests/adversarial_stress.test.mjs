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

const mockStorage = new MockLocalStorage();
const mockWindow = new MockEventTarget();
mockWindow.localStorage = mockStorage;

global.window = mockWindow;
global.localStorage = mockStorage;
global.CustomEvent = MockCustomEvent;

const projectsModule = await import("../src/lib/projects.ts");
const {
  PROJECTS_STORAGE_KEY,
  LEGACY_SHOPIFY_KEY,
  LEGACY_WEBSITE_KEY,
  PROJECTS_UPDATED_EVENT,
  MAX_FREE_PROJECTS,
  getProjects,
  getProjectById,
  saveProject,
  createProject,
  deleteProject,
  duplicateProject,
  getProjectCount,
  canCreateProject,
  getProjectStats,
  migrateLegacyProjects,
} = projectsModule;

test("3.1 Corrupted JSON recovery in localStorage", () => {
  // Test invalid / non-JSON strings in PROJECTS_STORAGE_KEY
  mockStorage.setItem(PROJECTS_STORAGE_KEY, "{ broken json corrupt !@#$ ");
  
  const recovered = getProjects();
  assert.ok(Array.isArray(recovered), "Must return array despite corrupt JSON");
  assert.equal(recovered.length, 1, "Must fall back to 1 starter project");

  // Test non-array JSON
  mockStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify({ not: "an array" }));
  const recoveredNonArray = getProjects();
  assert.ok(Array.isArray(recoveredNonArray));
  assert.equal(recoveredNonArray.length, 1);

  // Test corrupted legacy keys
  mockStorage.clear();
  mockStorage.setItem(LEGACY_SHOPIFY_KEY, "invalid json");
  mockStorage.setItem(LEGACY_WEBSITE_KEY, "invalid json");
  const recoveredLegacy = migrateLegacyProjects();
  assert.ok(Array.isArray(recoveredLegacy));
  assert.equal(recoveredLegacy.length, 1);
});

test("3.2 Sequential project creation with distinct IDs", () => {
  mockStorage.clear();

  // Create projects with explicit unique IDs or with slight pause
  const projectIds = [];
  for (let i = 0; i < 10; i++) {
    const p = createProject({
      id: `proj-test-seq-${i}`,
      title: `Project #${i + 1}`,
      type: i % 2 === 0 ? "shopify" : "website",
      prompt: `Prompt for project ${i + 1}`,
      data: { iteration: i },
    });
    projectIds.push(p.id);
  }

  assert.equal(getProjectCount().totalCount, 11); // 1 default seed + 10 created
  assert.equal(canCreateProject(false), false, "Over quota must prevent free creation");
  assert.equal(canCreateProject(true), true, "Pro user can create beyond limit");

  // Verify list order: newest should be first
  const all = getProjects();
  assert.equal(all[0].id, projectIds[9], "Newest created project must appear first");

  // Delete created projects
  for (let i = 0; i < 5; i++) {
    deleteProject(projectIds[i]);
  }
  assert.equal(getProjectCount().totalCount, 6);
});

test("3.3 Strict Quota Boundary State Transitions & Plan Reversals", () => {
  mockStorage.clear();
  assert.equal(getProjectCount().totalCount, 1); // starter seed

  // State 1: 1 project (Free) -> allowed
  assert.equal(canCreateProject(false), true);
  assert.equal(getProjectStats(false).isLimitReached, false);

  // State 2: 2 projects (Free) -> allowed
  const p2 = createProject({ id: "proj-boundary-2", title: "Site 2", type: "website" });
  assert.equal(canCreateProject(false), true);
  assert.equal(getProjectStats(false).isLimitReached, false);

  // State 3: 3 projects (Free) -> Capped!
  const p3 = createProject({ id: "proj-boundary-3", title: "Store 3", type: "shopify" });
  assert.equal(canCreateProject(false), false);
  assert.equal(getProjectStats(false).isLimitReached, true);

  // State 4: User deletes a project -> Unlocks 1 slot immediately
  deleteProject(p2.id);
  assert.equal(getProjectCount().totalCount, 2);
  assert.equal(canCreateProject(false), true, "Quota must immediately unlock upon deletion");
  assert.equal(getProjectStats(false).isLimitReached, false);

  // State 5: User fills 3rd slot again
  const p4 = createProject({ id: "proj-boundary-4", title: "Site 4", type: "shopify" });
  assert.equal(canCreateProject(false), false);

  // State 6: User upgrades to PRO -> Can create project 4, 5, 6
  assert.equal(canCreateProject(true), true);
  const p5 = createProject({ id: "proj-boundary-5", title: "Site 5 (Pro)", type: "website" });
  const p6 = createProject({ id: "proj-boundary-6", title: "Site 6 (Pro)", type: "shopify" });
  assert.equal(getProjectCount().totalCount, 5);
  assert.equal(canCreateProject(true), true);
  assert.equal(getProjectStats(true).isLimitReached, false);

  // State 7: User cancels Pro / reverts to Free -> quota is now over limit (5/3)
  assert.equal(canCreateProject(false), false, "Downgraded free tier must block creation if >= 3");
  assert.equal(getProjectStats(false).isLimitReached, true);
});

test("3.4 Project Duplication Deep Clone & Data Isolation", () => {
  mockStorage.clear();

  const original = createProject({
    id: "proj-orig-isolate-1",
    title: "Original Luxury Studio",
    type: "shopify",
    data: {
      theme: { primary: "#ffffff", bg: "#000000" },
      settings: { nested: { val: 42 } },
    },
  });

  const duplicate = duplicateProject(original.id);
  assert.ok(duplicate);
  assert.equal(duplicate.title, "Original Luxury Studio (Copy)");

  // Mutate duplicate's nested data
  duplicate.data.settings.nested.val = 999;
  saveProject(duplicate);

  // Verify original data remained isolated and intact
  const refetchedOriginal = getProjectById(original.id);
  assert.equal(refetchedOriginal.data.settings.nested.val, 42, "Deep clone must isolate original project data");
});

test("3.5 Special Characters & XSS payload resilience in Project Store", () => {
  mockStorage.clear();

  const maliciousPayloads = [
    '<script>alert("xss")</script>',
    '"><img src=x onerror=alert(1)>',
    "'; DROP TABLE users; --",
    "✨ 💎 🖤 🔥 Multi-byte Unicode Emoji & Symbols",
    "Line 1\nLine 2\r\nLine 3\tTabbed",
  ];

  for (let idx = 0; idx < maliciousPayloads.length; idx++) {
    const payload = maliciousPayloads[idx];
    const project = createProject({
      id: `proj-xss-${idx}`,
      title: payload,
      prompt: payload,
      type: "website",
      data: { notes: payload },
    });

    const retrieved = getProjectById(project.id);
    assert.ok(retrieved);
    assert.equal(retrieved.title, payload);
    assert.equal(retrieved.prompt, payload);
    assert.equal(retrieved.data.notes, payload);
  }
});

test("3.6 Multi-tab Storage Event Synchronization & Event Listener cleanup", () => {
  let syncCount = 0;
  const listener = () => {
    syncCount++;
  };

  mockWindow.addEventListener(PROJECTS_UPDATED_EVENT, listener);

  createProject({ id: "proj-sync-1", title: "Tab 1 Project", type: "website" });
  assert.equal(syncCount, 1);

  deleteProject("proj-sync-1");
  assert.equal(syncCount, 2);

  mockWindow.removeEventListener(PROJECTS_UPDATED_EVENT, listener);

  // After removing listener, events must not trigger it
  createProject({ id: "proj-sync-2", title: "Another Project", type: "shopify" });
  assert.equal(syncCount, 2);
});
