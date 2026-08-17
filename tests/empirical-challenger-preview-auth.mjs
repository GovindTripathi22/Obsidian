/**
 * Empirical Challenger Verification & Stress Harness: Preview Auth & Quota Synchronization
 * File: tests/empirical-challenger-preview-auth.mjs
 * 
 * Objective: Rigorous stress testing of:
 * 1. Session Lifecycle (Guest -> Sign In -> Profile Sync -> Plan Upgrade -> Sign Out -> State Reset)
 * 2. Quota Bounds (0, 1, 2, 3 projects, 4th project blocked on Free, Pro upgrade allows, downgrade enfored)
 * 3. Multi-Route Synchronization (CustomEvent bus, storage events, starter mock replacement, concurrency)
 */

import test from "node:test";
import assert from "node:assert/strict";

// ── Mock DOM / Storage Infrastructure ──
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

// Import Project Store Engine
const projectsModule = await import("../src/lib/projects.ts");
const {
  PROJECTS_STORAGE_KEY,
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

// ── Auth Engine Simulation Matching src/components/providers/AuthProvider.tsx ──
class AuthSimulationEngine {
  constructor() {
    this.user = null;
    this.loading = false;
    this.activeModal = null;
  }

  init() {
    try {
      const savedUser =
        mockStorage.getItem("obsidian_auth_user") || mockStorage.getItem("insforge_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.email || parsed.name)) {
          const { totalCount } = getProjectCount();
          this.user = {
            id: parsed.id || `usr_${Date.now()}`,
            email: parsed.email || "",
            name: parsed.name || parsed.email?.split("@")[0] || "User",
            avatar_url: parsed.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parsed.name || parsed.email || "U")}`,
            created_at: parsed.created_at || new Date().toISOString(),
            plan: parsed.plan === "pro" ? "pro" : "free",
            projectCount: totalCount,
          };
          mockStorage.setItem("insforge_session", JSON.stringify(this.user));
          mockStorage.setItem("obsidian_auth_user", JSON.stringify(this.user));
        } else {
          this.user = null;
        }
      } else {
        this.user = null;
      }
    } catch {
      this.user = null;
    }
  }

  refreshProjectCount() {
    const { totalCount } = getProjectCount();
    if (!this.user) return;
    this.user = { ...this.user, projectCount: totalCount };
    mockStorage.setItem("insforge_session", JSON.stringify(this.user));
    mockStorage.setItem("obsidian_auth_user", JSON.stringify(this.user));
  }

  get isSignedIn() {
    return Boolean(this.user);
  }

  get isLoaded() {
    return !this.loading;
  }

  async signIn(email, _pass) {
    this.loading = true;
    const { totalCount } = getProjectCount();
    const cleanEmail = email.trim();

    let registeredName = "";
    try {
      const regList = JSON.parse(mockStorage.getItem("obsidian_registered_users") || "[]");
      if (Array.isArray(regList)) {
        const found = regList.find((u) => u && u.email?.toLowerCase() === cleanEmail.toLowerCase());
        if (found && found.name) {
          registeredName = found.name;
        }
      }
    } catch {}

    const displayName = registeredName || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: displayName,
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
    };
    this.user = newUser;
    mockStorage.setItem("insforge_session", JSON.stringify(newUser));
    mockStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    this.loading = false;
    this.activeModal = null;
  }

  async signUp(email, _pass, name) {
    this.loading = true;
    const { totalCount } = getProjectCount();
    const cleanEmail = email.trim();
    const cleanName = name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const newUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      created_at: new Date().toISOString(),
      plan: "free",
      projectCount: totalCount,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    };

    try {
      const regList = JSON.parse(mockStorage.getItem("obsidian_registered_users") || "[]");
      const updatedList = Array.isArray(regList) ? [...regList.filter((u) => u?.email !== cleanEmail), newUser] : [newUser];
      mockStorage.setItem("obsidian_registered_users", JSON.stringify(updatedList));
      mockStorage.setItem("insforge_session", JSON.stringify(newUser));
      mockStorage.setItem("obsidian_auth_user", JSON.stringify(newUser));
    } catch {}

    this.user = newUser;
    this.loading = false;
    this.activeModal = null;
  }

  async signInWithGoogle(customName, customEmail) {
    this.loading = true;
    const { totalCount } = getProjectCount();
    const email = customEmail?.trim() || (customName ? `${customName.trim().toLowerCase().replace(/\s+/g, ".")}@gmail.com` : "google.creator@obsidian.ai");
    const name = customName?.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const googleUser = {
      id: `google_${Date.now()}`,
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString(),
      plan: "pro",
      projectCount: totalCount,
    };
    this.user = googleUser;
    mockStorage.setItem("insforge_session", JSON.stringify(googleUser));
    mockStorage.setItem("obsidian_auth_user", JSON.stringify(googleUser));
    this.loading = false;
    this.activeModal = null;
  }

  async signOut() {
    this.user = null;
    mockStorage.removeItem("insforge_session");
    mockStorage.removeItem("obsidian_auth_user");
  }

  updateUserPlan(plan) {
    if (!this.user) return;
    this.user = { ...this.user, plan };
    mockStorage.setItem("insforge_session", JSON.stringify(this.user));
    mockStorage.setItem("obsidian_auth_user", JSON.stringify(this.user));
  }

  toClerkUser() {
    return {
      isLoaded: this.isLoaded,
      isSignedIn: this.isSignedIn,
      user: this.user
        ? {
            id: this.user.id,
            fullName: this.user.name,
            primaryEmailAddress: { emailAddress: this.user.email },
            imageUrl: this.user.avatar_url,
            publicMetadata: { plan: this.user.plan },
          }
        : null,
    };
  }
}

// ============================================================================
// 1. SESSION LIFECYCLE & PROFILE SYNCHRONIZATION TESTS
// ============================================================================

test("1.1 Guest State: Starts unauthenticated without mock placeholders", () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  assert.equal(auth.user, null, "User must be null by default");
  assert.equal(auth.isSignedIn, false, "isSignedIn must be false");
  assert.equal(auth.isLoaded, true, "isLoaded must be true");

  const clerkView = auth.toClerkUser();
  assert.equal(clerkView.user, null, "Clerk useUser() must return null user");
  assert.equal(clerkView.isSignedIn, false);

  // When a guest creates a project, default userId must be "guest" (no legacy "user-architect" or "user-obsidian-prime")
  const project = createProject({
    title: "Guest Portfolio",
    type: "website",
  });
  assert.equal(project.userId, "guest", "Guest project userId must be 'guest'");
  assert.equal(project.user_id, "guest");
});

test("1.2 Email Sign In: Real profile derivation and dual storage persistence", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  await auth.signIn("victoria.sterling@luxechamber.io");

  assert.ok(auth.user, "User must be non-null after signIn");
  assert.equal(auth.user.email, "victoria.sterling@luxechamber.io");
  assert.equal(auth.user.name, "Victoria Sterling", "Derived proper capitalization from email");
  assert.equal(auth.user.plan, "free", "New email login defaults to free plan");
  assert.ok(auth.user.avatar_url.includes("Victoria%20Sterling") || auth.user.avatar_url.includes("initials"));

  // Check storage keys
  const saved1 = JSON.parse(mockStorage.getItem("obsidian_auth_user"));
  const saved2 = JSON.parse(mockStorage.getItem("insforge_session"));
  assert.equal(saved1.email, "victoria.sterling@luxechamber.io");
  assert.equal(saved2.email, "victoria.sterling@luxechamber.io");
  assert.equal(saved1.name, "Victoria Sterling");
});

test("1.3 Sign Up & Re-login: Preserves custom display name across sessions", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  // Sign up with custom display name
  await auth.signUp("founder@matrix-cyber.io", "securepass123", "Elena Rostova");
  assert.equal(auth.user.name, "Elena Rostova");
  assert.equal(auth.user.email, "founder@matrix-cyber.io");

  // Sign out
  await auth.signOut();
  assert.equal(auth.user, null);
  assert.equal(mockStorage.getItem("obsidian_auth_user"), null);
  assert.equal(mockStorage.getItem("insforge_session"), null);

  // Sign back in: should retrieve registered custom name "Elena Rostova"
  await auth.signIn("founder@matrix-cyber.io");
  assert.equal(auth.user.name, "Elena Rostova", "Sign in must retrieve custom name from registered users");
  assert.equal(auth.user.email, "founder@matrix-cyber.io");
});

test("1.4 Google One-Tap / OAuth Sign In: Generates Pro tier with Google prefix ID", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  await auth.signInWithGoogle("Diana Prince", "diana.prince@amazonian.art");
  assert.ok(auth.user.id.startsWith("google_"), "Google user ID must start with google_");
  assert.equal(auth.user.name, "Diana Prince");
  assert.equal(auth.user.email, "diana.prince@amazonian.art");
  assert.equal(auth.user.plan, "pro", "Google One-Tap assigns Pro tier");

  const clerkView = auth.toClerkUser();
  assert.equal(clerkView.user.fullName, "Diana Prince");
  assert.equal(clerkView.user.primaryEmailAddress.emailAddress, "diana.prince@amazonian.art");
  assert.equal(clerkView.user.publicMetadata.plan, "pro");
});

test("1.5 Plan Transitions: Free <-> Pro toggling updates state and localStorage", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  await auth.signIn("user@test.org");

  assert.equal(auth.user.plan, "free");

  // Upgrade to Pro
  auth.updateUserPlan("pro");
  assert.equal(auth.user.plan, "pro");
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "pro");
  assert.equal(JSON.parse(mockStorage.getItem("insforge_session")).plan, "pro");

  // Downgrade to Free
  auth.updateUserPlan("free");
  assert.equal(auth.user.plan, "free");
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "free");
  assert.equal(JSON.parse(mockStorage.getItem("insforge_session")).plan, "free");
});

test("1.6 Sign Out: Complete state and session reset", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  await auth.signIn("test-logout@studio.ai");

  assert.ok(auth.isSignedIn);
  assert.ok(mockStorage.getItem("obsidian_auth_user"));

  await auth.signOut();

  assert.equal(auth.user, null);
  assert.equal(auth.isSignedIn, false);
  assert.equal(mockStorage.getItem("obsidian_auth_user"), null);
  assert.equal(mockStorage.getItem("insforge_session"), null);

  const clerkView = auth.toClerkUser();
  assert.equal(clerkView.user, null);
  assert.equal(clerkView.isSignedIn, false);
});

// ============================================================================
// 2. QUOTA BOUNDS & TIER TRANSITIONS EMPIRICAL STRESS TESTS
// ============================================================================

test("2.1 Quota Bounds on Free Plan: 0, 1, 2, 3, 4th blocked", () => {
  mockStorage.clear();
  // Clear projects explicitly
  mockStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([]));

  // Quota: 0 projects
  assert.equal(getProjectCount().totalCount, 0);
  assert.equal(canCreateProject(false), true, "0/3: Can create project");
  assert.equal(getProjectStats(false).isLimitReached, false);

  // Quota: 1 project
  const p1 = createProject({ id: "proj-quota-1", title: "Project 1", type: "website" });
  assert.equal(getProjectCount().totalCount, 1);
  assert.equal(canCreateProject(false), true, "1/3: Can create project");
  assert.equal(getProjectStats(false).isLimitReached, false);

  // Quota: 2 projects
  const p2 = createProject({ id: "proj-quota-2", title: "Project 2", type: "shopify" });
  assert.equal(getProjectCount().totalCount, 2);
  assert.equal(canCreateProject(false), true, "2/3: Can create project");
  assert.equal(getProjectStats(false).isLimitReached, false);

  // Quota: 3 projects (Max free quota reached)
  const p3 = createProject({ id: "proj-quota-3", title: "Project 3", type: "website" });
  assert.equal(getProjectCount().totalCount, 3);
  assert.equal(canCreateProject(false), false, "3/3: Creation blocked for Free tier");
  assert.equal(getProjectStats(false).isLimitReached, true);
  assert.equal(getProjectStats(false).maxFreeProjects, 3);

  // Attempt to check if 4th can be created under Free
  assert.equal(canCreateProject(false), false, "4th project creation must be blocked for Free plan");
});

test("2.2 Pro Upgrade: Unlocks unbounded project creation", () => {
  // Continuing with 3 projects in store
  assert.equal(getProjectCount().totalCount, 3);
  assert.equal(canCreateProject(true), true, "Pro plan permits creation at 3/3");
  assert.equal(getProjectStats(true).isLimitReached, false, "Pro plan isLimitReached is false");

  // Create 4th, 5th, 6th project
  createProject({ id: "proj-quota-4", title: "Project 4", type: "shopify" });
  createProject({ id: "proj-quota-5", title: "Project 5", type: "website" });
  createProject({ id: "proj-quota-6", title: "Project 6", type: "shopify" });

  assert.equal(getProjectCount().totalCount, 6);
  assert.equal(canCreateProject(true), true, "Pro plan allows 6 projects");
  assert.equal(getProjectStats(true).isLimitReached, false);
});

test("2.3 Pro Downgrade & Deletion: Re-enforces 3-project limit and re-unlocks upon deletion", () => {
  assert.equal(getProjectCount().totalCount, 6);

  // Downgrade to Free plan
  assert.equal(canCreateProject(false), false, "Downgraded Free plan blocks creation when count (6) >= 3");
  assert.equal(getProjectStats(false).isLimitReached, true);

  // Delete 4 projects to bring count down to 2
  deleteProject("proj-quota-6");
  deleteProject("proj-quota-5");
  deleteProject("proj-quota-4");
  deleteProject("proj-quota-3");

  assert.equal(getProjectCount().totalCount, 2);
  assert.equal(canCreateProject(false), true, "Deleting down to 2 projects re-unlocks free slot");
  assert.equal(getProjectStats(false).isLimitReached, false);

  // Fill the 3rd slot
  createProject({ id: "proj-quota-final-3", title: "Project Final 3", type: "shopify" });
  assert.equal(getProjectCount().totalCount, 3);
  assert.equal(canCreateProject(false), false, "3rd slot filled, creation blocked again");
  assert.equal(getProjectStats(false).isLimitReached, true);
});

// ============================================================================
// 3. MULTI-ROUTE & CROSS-COMPONENT SYNCHRONIZATION TESTS
// ============================================================================

test("3.1 CustomEvent Dispatching: Verified across all mutation methods", () => {
  mockStorage.clear();
  let receivedEvents = [];

  const handleUpdate = (e) => {
    receivedEvents.push(e.detail);
  };

  mockWindow.addEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);

  // 1. saveProject
  const saved = saveProject({ id: "proj-sync-save", title: "Save Test", type: "website" });
  assert.equal(receivedEvents.length, 1);
  assert.ok(receivedEvents[0].timestamp);
  assert.equal(receivedEvents[0].count.totalCount, 1);

  // 2. createProject
  const created = createProject({ id: "proj-sync-create", title: "Create Test", type: "shopify" });
  assert.equal(receivedEvents.length, 2);
  assert.equal(receivedEvents[1].count.totalCount, 2);

  // 3. duplicateProject
  const duplicated = duplicateProject(created.id);
  assert.equal(receivedEvents.length, 3);
  assert.equal(receivedEvents[2].count.totalCount, 3);

  // 4. deleteProject
  deleteProject(duplicated.id);
  assert.equal(receivedEvents.length, 4);
  assert.equal(receivedEvents[3].count.totalCount, 2);

  mockWindow.removeEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);
});

test("3.2 Starter Mock Auto-Replacement when saving first custom project", () => {
  mockStorage.clear();
  // Fresh storage returns initial default mock
  const initial = getProjects();
  assert.equal(initial.length, 1);
  assert.equal(initial[0].id, "proj-shopify-starter-1");

  // User saves a brand new custom project
  const customProj = saveProject({
    id: "proj-custom-store-100",
    title: "My Custom Luxury Watch Store",
    type: "shopify",
    data: { storeName: "Chronos" },
  });

  const updated = getProjects();
  assert.equal(updated.length, 1, "Starter mock was replaced by custom project");
  assert.equal(updated[0].id, "proj-custom-store-100");
  assert.equal(updated[0].title, "My Custom Luxury Watch Store");
});

test("3.3 High-frequency sequential project creation (concurrency & collision test)", () => {
  mockStorage.clear();
  mockStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([]));

  const createdProjects = [];
  const start = Date.now();

  for (let i = 0; i < 30; i++) {
    const p = createProject({
      title: `Rapid Project #${i + 1}`,
      type: i % 2 === 0 ? "shopify" : "website",
      prompt: `Rapid prompt ${i}`,
    });
    createdProjects.push(p);
  }

  const duration = Date.now() - start;
  assert.equal(createdProjects.length, 30);

  // Verify all 30 IDs are strictly unique
  const idSet = new Set(createdProjects.map((p) => p.id));
  assert.equal(idSet.size, 30, "All 30 rapidly created projects must have distinct IDs");

  const stored = getProjects();
  assert.equal(stored.length, 30);
  assert.equal(stored[0].id, createdProjects[29].id, "Most recently created project is at head of list");
});

test("3.4 Multi-Route / Cross-Tab Auth Synchronization with Project Count", async () => {
  mockStorage.clear();
  mockStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([]));

  const auth = new AuthSimulationEngine();
  await auth.signIn("developer@obsidian.io");
  assert.equal(auth.user.projectCount, 0);

  // Simulate project created on another route/tab
  createProject({ id: "proj-cross-tab-1", title: "Cross Tab Store", type: "shopify" });
  auth.refreshProjectCount();

  assert.equal(auth.user.projectCount, 1, "Auth state updated with latest project count");

  // Create 2 more
  createProject({ id: "proj-cross-tab-2", title: "Cross Tab Site 2", type: "website" });
  createProject({ id: "proj-cross-tab-3", title: "Cross Tab Site 3", type: "website" });
  auth.refreshProjectCount();

  assert.equal(auth.user.projectCount, 3);
  assert.equal(auth.user.plan, "free");

  // Auth user quota limit calculation
  const stats = getProjectStats(auth.user.plan === "pro");
  assert.equal(stats.totalCount, 3);
  assert.equal(stats.isLimitReached, true);
});
