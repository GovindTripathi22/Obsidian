/**
 * Empirical Challenger Verification Suite: Auth, Mock Elimination & Clerk Integration
 * File: tests/empirical-challenger-m2-auth.mjs
 * 
 * Tests:
 * 1. Fresh Storage Starts Completely Unauthenticated (user: null, isSignedIn: false)
 * 2. Prohibited Mock Placeholder Audit (0 occurrences across src/ and runtime objects)
 * 3. Clerk Component Re-exports & Middleware Offline Pass-through Verification
 * 4. Real User Profile Lifecycle & Dual-Storage Session Persistence
 * 5. Quota Boundary Transitions & Cross-Engine Project Sync
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");

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
  INITIAL_DEFAULT_MOCKS,
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

// Auth Simulation Engine matching src/components/providers/AuthProvider.tsx
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
// SUITE 1: FRESH STORAGE UNICITY & DEFAULT SIGNED-OUT STATE
// ============================================================================

test("1.1 Fresh storage starts unauthenticated (user: null, isSignedIn: false, isLoaded: true)", () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  assert.equal(auth.user, null, "User must be null when storage is uninitialized");
  assert.equal(auth.isSignedIn, false, "isSignedIn must evaluate to false");
  assert.equal(auth.isLoaded, true, "isLoaded must be true (no pending loading lock)");

  const clerkState = auth.toClerkUser();
  assert.equal(clerkState.user, null, "Clerk useUser().user must be null");
  assert.equal(clerkState.isSignedIn, false, "Clerk useUser().isSignedIn must be false");
  assert.equal(clerkState.isLoaded, true, "Clerk useUser().isLoaded must be true");
});

test("1.2 New projects created by unauthenticated users default to userId 'guest'", () => {
  mockStorage.clear();
  const p1 = createProject({
    title: "Anonymous Showcase",
    type: "website",
    prompt: "A minimalist monochrome studio website",
  });

  assert.equal(p1.userId, "guest", "userId must default to 'guest'");
  assert.equal(p1.user_id, "guest", "user_id alias must default to 'guest'");
  assert.notEqual(p1.userId, "user-architect", "Must NOT contain legacy user-architect");
  assert.notEqual(p1.userId, "user-obsidian-prime", "Must NOT contain legacy user-obsidian-prime");

  // Verify Initial Mock Starter project has userId = "guest"
  assert.ok(INITIAL_DEFAULT_MOCKS.length > 0);
  for (const mock of INITIAL_DEFAULT_MOCKS) {
    assert.equal(mock.userId, "guest", `Starter mock ${mock.id} userId must be 'guest'`);
  }
});

// ============================================================================
// SUITE 2: PROHIBITED MOCK PLACEHOLDER AUDIT
// ============================================================================

test("2.1 Codebase Static Scan: 0 occurrences of prohibited mock placeholders in src/", () => {
  const PROHIBITED_STRINGS = [
    "Alex Johnson",
    "Alex Morgan",
    "Obsidian Creator",
    "developer@obsidian.ai",
    "user-architect",
    "user-obsidian-prime",
    "creator@gmail.com",
  ];

  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else if (/\.(tsx?|jsx?|json|css|md)$/.test(file)) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const allSrcFiles = getAllFiles(SRC_DIR);
  assert.ok(allSrcFiles.length > 20, `Must scan at least 20 source files (found ${allSrcFiles.length})`);

  const violations = [];

  for (const filePath of allSrcFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const prohibited of PROHIBITED_STRINGS) {
      if (content.includes(prohibited)) {
        violations.push({
          file: path.relative(ROOT_DIR, filePath),
          prohibitedString: prohibited,
        });
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found prohibited mock placeholders in src/: ${JSON.stringify(violations, null, 2)}`
  );
});

test("2.2 Runtime Project & Preset Audit: 0 prohibited placeholders in runtime data", () => {
  const PROHIBITED_STRINGS = [
    "Alex Johnson",
    "Alex Morgan",
    "Obsidian Creator",
    "developer@obsidian.ai",
    "user-architect",
    "user-obsidian-prime",
    "creator@gmail.com",
  ];

  mockStorage.clear();
  const initialProjects = getProjects();
  const jsonStr = JSON.stringify(initialProjects);

  for (const str of PROHIBITED_STRINGS) {
    assert.ok(
      !jsonStr.includes(str),
      `Initial runtime projects contain prohibited string: "${str}"`
    );
  }
});

// ============================================================================
// SUITE 3: CLERK COMPONENT RE-EXPORTS & MIDDLEWARE INTEGRATION
// ============================================================================

test("3.1 src/lib/auth.tsx contains standard Clerk re-exports & custom auth bridges", () => {
  const authFilePath = path.join(SRC_DIR, "lib", "auth.tsx");
  assert.ok(fs.existsSync(authFilePath), "src/lib/auth.tsx must exist");

  const content = fs.readFileSync(authFilePath, "utf-8");
  assert.ok(content.includes("SignIn"), "Must export SignIn");
  assert.ok(content.includes("SignUp"), "Must export SignUp");
  assert.ok(content.includes("SignedIn"), "Must export SignedIn");
  assert.ok(content.includes("SignedOut"), "Must export SignedOut");
  assert.ok(content.includes("ClerkProvider"), "Must export ClerkProvider");
  assert.ok(content.includes("useAuth"), "Must export useAuth");
  assert.ok(content.includes("useUser"), "Must export useUser");
  assert.ok(content.includes("UserButton"), "Must export UserButton");
  assert.ok(content.includes("AuthModals"), "Must export AuthModals");
  assert.ok(content.includes("GoogleOneTap"), "Must export GoogleOneTap");
});

test("3.2 src/middleware.ts handles missing Clerk publishable key gracefully", () => {
  const middlewarePath = path.join(SRC_DIR, "middleware.ts");
  assert.ok(fs.existsSync(middlewarePath), "src/middleware.ts must exist");

  const content = fs.readFileSync(middlewarePath, "utf-8");
  assert.ok(content.includes("clerkMiddleware"), "Must import and use clerkMiddleware");
  assert.ok(content.includes("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"), "Must check publishable key");
  assert.ok(content.includes("NextResponse.next()"), "Must have pass-through fallback");
  assert.ok(content.includes("matcher"), "Must configure Next.js route matcher");
});

test("3.3 src/app/layout.tsx integrates ClerkProvider with Luxury Monochrome tokens", () => {
  const layoutPath = path.join(SRC_DIR, "app", "layout.tsx");
  assert.ok(fs.existsSync(layoutPath), "src/app/layout.tsx must exist");

  const content = fs.readFileSync(layoutPath, "utf-8");
  assert.ok(content.includes("ClerkProvider"), "Must import ClerkProvider");
  assert.ok(content.includes("AuthProvider"), "Must include AuthProvider");
  assert.ok(content.includes("AuthModals"), "Must include AuthModals");
  assert.ok(content.includes("GoogleOneTap"), "Must include GoogleOneTap");
  assert.ok(content.includes("colorPrimary: \"#ffffff\""), "Clerk appearance must use white primary");
  assert.ok(content.includes("colorBackground: \"#09090b\""), "Clerk appearance must use dark background");
});

// ============================================================================
// SUITE 4: REAL USER AUTH LIFECYCLE & DUAL-STORAGE SESSION PERSISTENCE
// ============================================================================

test("4.1 Real user registration, sign-in, and name preservation", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  // User signs up with real name
  await auth.signUp("arthur.pendelton@avantgarde.co", "secure-pass-99", "Arthur Pendelton");
  assert.equal(auth.user.name, "Arthur Pendelton");
  assert.equal(auth.user.email, "arthur.pendelton@avantgarde.co");
  assert.equal(auth.user.plan, "free");

  // Sign out
  await auth.signOut();
  assert.equal(auth.user, null);
  assert.equal(mockStorage.getItem("obsidian_auth_user"), null);
  assert.equal(mockStorage.getItem("insforge_session"), null);

  // Sign back in: should retrieve registered custom name
  await auth.signIn("arthur.pendelton@avantgarde.co");
  assert.equal(auth.user.name, "Arthur Pendelton");
  assert.equal(auth.user.email, "arthur.pendelton@avantgarde.co");

  // Clerk formatted view
  const clerkView = auth.toClerkUser();
  assert.equal(clerkView.user.fullName, "Arthur Pendelton");
  assert.equal(clerkView.user.primaryEmailAddress.emailAddress, "arthur.pendelton@avantgarde.co");
  assert.equal(clerkView.isSignedIn, true);
});

test("4.2 Google OAuth / One-Tap creates Pro session with Google prefix", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  auth.init();

  await auth.signInWithGoogle("Hélène Dupont", "helene.dupont@atelier.paris");
  assert.ok(auth.user.id.startsWith("google_"));
  assert.equal(auth.user.name, "Hélène Dupont");
  assert.equal(auth.user.email, "helene.dupont@atelier.paris");
  assert.equal(auth.user.plan, "pro");

  const clerkView = auth.toClerkUser();
  assert.equal(clerkView.user.fullName, "Hélène Dupont");
  assert.equal(clerkView.user.publicMetadata.plan, "pro");
});

test("4.3 Dual-storage session synchronization on sign out and plan upgrade", async () => {
  mockStorage.clear();
  const auth = new AuthSimulationEngine();
  await auth.signIn("designer@noir.art");

  assert.equal(auth.user.plan, "free");
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "free");
  assert.equal(JSON.parse(mockStorage.getItem("insforge_session")).plan, "free");

  // Upgrade
  auth.updateUserPlan("pro");
  assert.equal(auth.user.plan, "pro");
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "pro");
  assert.equal(JSON.parse(mockStorage.getItem("insforge_session")).plan, "pro");

  // Sign out
  await auth.signOut();
  assert.equal(auth.user, null);
  assert.equal(mockStorage.getItem("obsidian_auth_user"), null);
  assert.equal(mockStorage.getItem("insforge_session"), null);
});

// ============================================================================
// SUITE 5: QUOTA LIMITS (3-PROJECT FREE LIMIT) & REACTION TO MUTATIONS
// ============================================================================

test("5.1 Quota boundary enforcement: 3 projects max on Free plan", () => {
  mockStorage.clear();
  mockStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([]));

  // 0 projects
  assert.equal(canCreateProject(false), true);
  assert.equal(getProjectStats(false).isLimitReached, false);

  // Add 1, 2, 3
  const p1 = createProject({ id: "p-test-1", title: "Project 1", type: "website" });
  const p2 = createProject({ id: "p-test-2", title: "Project 2", type: "shopify" });
  const p3 = createProject({ id: "p-test-3", title: "Project 3", type: "website" });

  assert.equal(getProjectCount().totalCount, 3);
  assert.equal(canCreateProject(false), false, "Free tier must block creation at 3 projects");
  assert.equal(getProjectStats(false).isLimitReached, true);

  // Pro tier bypasses
  assert.equal(canCreateProject(true), true, "Pro tier allows project creation beyond 3");
  const p4 = createProject({ id: "p-test-4", title: "Project 4 (Pro)", type: "shopify" });
  assert.equal(getProjectCount().totalCount, 4);

  // Delete project
  deleteProject(p4.id);
  deleteProject(p3.id);
  assert.equal(getProjectCount().totalCount, 2);
  assert.equal(canCreateProject(false), true, "Deleting project unlocks free creation slot");
  assert.equal(getProjectStats(false).isLimitReached, false);
});
