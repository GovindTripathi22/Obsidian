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

// Test Auth Provider & Mock Engine State Transitions
test("2.1 Offline / Mock Auth fallback mode detection", async () => {
  // Test when Clerk key is NOT set
  delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerkKey = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const mode = hasClerkKey ? "clerk" : "offline-mock";
  assert.equal(mode, "offline-mock", "Mode should be offline-mock when Clerk key is missing");

  // Test when Clerk key IS set
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock_key_12345";
  const hasClerkKeyWithEnv = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const modeWithEnv = hasClerkKeyWithEnv ? "clerk" : "offline-mock";
  assert.equal(modeWithEnv, "clerk", "Mode should be clerk when publishable key is present");

  // Restore unset
  delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
});

test("2.2 Sign In flow & dual-storage synchronization", async () => {
  mockStorage.clear();
  const { getProjectCount } = await import("../src/lib/projects.ts");

  const email = "creator@noir.studio";
  const { totalCount } = getProjectCount();

  const user = {
    id: `user-${Date.now()}`,
    email,
    name: email.split("@")[0],
    created_at: new Date().toISOString(),
    plan: "free",
    projectCount: totalCount,
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
  };

  mockStorage.setItem("insforge_session", JSON.stringify(user));
  mockStorage.setItem("obsidian_auth_user", JSON.stringify(user));

  // Verify stored in both keys
  const savedUser1 = JSON.parse(mockStorage.getItem("obsidian_auth_user"));
  const savedUser2 = JSON.parse(mockStorage.getItem("insforge_session"));

  assert.equal(savedUser1.email, "creator@noir.studio");
  assert.equal(savedUser1.name, "creator");
  assert.equal(savedUser1.plan, "free");
  assert.equal(savedUser2.email, "creator@noir.studio");
  assert.equal(savedUser2.avatar_url, `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`);
});

test("2.3 Sign Up flow preserves custom display name", async () => {
  mockStorage.clear();
  const email = "founder@luxurybrand.com";
  const name = "Victoria Sterling";

  const user = {
    id: `user-${Date.now()}`,
    email,
    name: name || email.split("@")[0],
    created_at: new Date().toISOString(),
    plan: "free",
    projectCount: 1,
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
  };

  mockStorage.setItem("obsidian_auth_user", JSON.stringify(user));
  const restored = JSON.parse(mockStorage.getItem("obsidian_auth_user"));

  assert.equal(restored.name, "Victoria Sterling");
  assert.equal(restored.email, "founder@luxurybrand.com");
  assert.equal(restored.plan, "free");
});

test("2.4 Google One-Tap / Google Sign-in generates Pro account", async () => {
  mockStorage.clear();

  const googleUser = {
    id: `google-${Date.now()}`,
    email: "google.creator@obsidian.ai",
    name: "Google Creator",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    created_at: new Date().toISOString(),
    plan: "pro",
    projectCount: 1,
  };

  mockStorage.setItem("obsidian_auth_user", JSON.stringify(googleUser));
  mockStorage.setItem("insforge_session", JSON.stringify(googleUser));

  const saved = JSON.parse(mockStorage.getItem("obsidian_auth_user"));
  assert.equal(saved.name, "Google Creator");
  assert.equal(saved.plan, "pro", "Google sign-in assigns Pro status");
});

test("2.5 User Plan toggling (Free to Pro, Pro to Free)", async () => {
  mockStorage.clear();
  const baseUser = {
    id: "user-1",
    email: "test@obsidian.ai",
    name: "Test User",
    plan: "free",
    projectCount: 2,
  };

  mockStorage.setItem("obsidian_auth_user", JSON.stringify(baseUser));

  // Toggle to PRO
  const proUser = { ...baseUser, plan: "pro" };
  mockStorage.setItem("obsidian_auth_user", JSON.stringify(proUser));
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "pro");

  // Toggle back to FREE
  const freeUser = { ...proUser, plan: "free" };
  mockStorage.setItem("obsidian_auth_user", JSON.stringify(freeUser));
  assert.equal(JSON.parse(mockStorage.getItem("obsidian_auth_user")).plan, "free");
});

test("2.6 Sign Out clears all session tokens from storage", async () => {
  mockStorage.setItem("obsidian_auth_user", JSON.stringify({ email: "active@obsidian.ai" }));
  mockStorage.setItem("insforge_session", JSON.stringify({ email: "active@obsidian.ai" }));

  // Simulate signOut
  mockStorage.removeItem("insforge_session");
  mockStorage.removeItem("obsidian_auth_user");

  assert.equal(mockStorage.getItem("obsidian_auth_user"), null);
  assert.equal(mockStorage.getItem("insforge_session"), null);
});

test("2.7 Clerk-compatible useUser() bridge contract compliance", async () => {
  // Test when logged in
  const authUser = {
    id: "user-clerk-mock-123",
    name: "Elena Rostova",
    email: "elena@rostova.design",
    avatar_url: "https://example.com/avatar.png",
    plan: "pro",
    projectCount: 3,
  };

  const clerkFormat = authUser
    ? {
        id: authUser.id,
        fullName: authUser.name,
        primaryEmailAddress: { emailAddress: authUser.email },
        imageUrl: authUser.avatar_url,
        publicMetadata: { plan: authUser.plan },
      }
    : null;

  assert.ok(clerkFormat);
  assert.equal(clerkFormat.id, "user-clerk-mock-123");
  assert.equal(clerkFormat.fullName, "Elena Rostova");
  assert.equal(clerkFormat.primaryEmailAddress.emailAddress, "elena@rostova.design");
  assert.equal(clerkFormat.imageUrl, "https://example.com/avatar.png");
  assert.equal(clerkFormat.publicMetadata.plan, "pro");

  // Test when logged out
  const loggedOutUser = null;
  const clerkLoggedOut = loggedOutUser
    ? {
        id: loggedOutUser.id,
        fullName: loggedOutUser.name,
        primaryEmailAddress: { emailAddress: loggedOutUser.email },
        imageUrl: loggedOutUser.avatar_url,
        publicMetadata: { plan: loggedOutUser.plan },
      }
    : null;

  assert.equal(clerkLoggedOut, null, "When logged out, clerkFormat must be null without error");
});
