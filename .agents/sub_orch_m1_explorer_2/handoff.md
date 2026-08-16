# Handoff Report: Unified Project Repository & Event Sync Design

**Agent**: Explorer 2 (Milestone 1: Unified Project Repository & Event Sync)  
**Working Directory**: `d:\app\.agents\sub_orch_m1_explorer_2`  
**Handoff Type**: Hard (Investigation & Complete Architectural Design)  
**Target File**: `d:\app\.agents\sub_orch_m1_explorer_2\handoff.md`  

---

## 1. Observation

### 1.1 Existing Files Reading & Writing Project Storage

| File Path | Line Numbers | Current Storage Keys Used | Operations Performed |
|---|---|---|---|
| `src/app/projects/page.tsx` | 69, 78, 82, 91, 101, 105 | `insforge_projects`, `obsidian_website_projects` | Reads both keys; seeds 2 Shopify mocks and 2 Website mocks (total 4) if keys are missing; deletes from respective keys on click without triggering quota sync. |
| `src/app/builder/page.tsx` | 191, 192 | `insforge_projects` | Reads existing array, prepends new Shopify store project, writes back to `insforge_projects`, calls `refreshProjectCount()`. |
| `src/app/shopify/page.tsx` | 1 | Re-exports `builder/page.tsx` | Same behavior as `builder/page.tsx`. |
| `src/components/builder/InteractiveShopifyStudio.tsx` | 341, 342 | `insforge_projects` | Duplicates project creation logic from `builder/page.tsx` (unimported component). |
| `src/components/LandingPageClient.tsx` | 75, 76 | `obsidian_website_projects` | Reads existing array, prepends new Website project, writes back to `obsidian_website_projects`, calls `refreshProjectCount()`. |
| `src/components/providers/AuthProvider.tsx` | 48, 54, 110–121 | `insforge_projects`, `obsidian_website_projects` | Parses both keys separately in `getCounts()`; listens to native `window.addEventListener("storage")` which **only fires across other browser tabs/windows**, failing to capture same-tab mutations. |
| `src/components/Sidebar.tsx` | 45–48, 138–145 | `user?.projectCount` (via `useAuth()`) | Displays `projectCount / maxProjects`. Hardcodes `maxProjects = 2` (line 46) and `(projectCount / 2) * 100` (line 47). |
| `src/app/editor/[projectId]/page.tsx` | 81–134 | Does **not** read or write storage | Reads `projectId` and `searchParams.get("initialPrompt")`; does not load stored project data from storage or persist generated HTML/CSS/chat state back to storage. |
| `src/app/billing/page.tsx` | 109 | None | Hardcoded copy: `"Free Plan (2 Projects Max)"`. |
| `src/app/design-system/page.tsx` | 211 | None | Hardcoded copy: `"You are on the Free tier (2/2 projects used)."`. |

---

### 1.2 Schema Discrepancies & Fragmentation

1. **Storage Key Fragmentation**:
   - Shopify projects are stored in `localStorage.getItem("insforge_projects")`.
   - Website projects are stored in `localStorage.getItem("obsidian_website_projects")`.
   - No single source of truth exists.
2. **Schema Inconsistency Across Files**:
   - `src/lib/insforge.ts` (`ProjectRecord`):
     ```typescript
     export interface ProjectRecord {
       id: string;
       user_id: string;
       title: string;
       prompt: string;
       thumbnail_url?: string;
       created_at: string;
     }
     ```
     Uses snake_case (`user_id`, `thumbnail_url`, `created_at`), lacks `type` (`"shopify" | "website"`), lacks `updated_at` / `updatedAt`, and lacks a `data` field for pages, CSS, chat history, or preset metadata.
   - `PROJECT.md` Interface Contract:
     ```typescript
     export interface Project {
       id: string;
       title: string;
       type: "shopify" | "website";
       createdAt: string;
       updatedAt: string;
       thumbnail?: string;
       data?: any;
     }
     ```
     Uses camelCase (`createdAt`, `updatedAt`, `thumbnail`), defines `type`, and includes `data`.
   - `LandingPageClient.tsx` (line 67–74): Generates anonymous object with `id: proj-obsidian-${Date.now()}`, `user_id`, `title`, `prompt`, `thumbnail_url`, `created_at`. No `type` field is written.
   - `builder/page.tsx` (line 182–189): Generates `ProjectRecord` with `id: proj-shopify-${Date.now()}`. No `type` field is written.
3. **Mock Seeding Over-Quota Bug (`src/app/projects/page.tsx:29–95`)**:
   - First visit seeds 2 Shopify projects (`DEFAULT_SHOPIFY_MOCKS`) and 2 Website projects (`DEFAULT_WEBSITE_MOCKS`), totalling **4 projects**.
   - With `MAX_FREE_PROJECTS = 3`, first-time users are immediately blocked from creating new projects (`totalCount >= 3`).
4. **Deletion Desynchronization Bug (`src/app/projects/page.tsx:97–107`)**:
   - `handleDeleteProject` deletes from local state and writes to `localStorage`, but never invokes `refreshProjectCount()` or dispatches an event.
   - Quota meters in `Sidebar`, `AuthProvider`, `LandingPageClient`, and `builder/page.tsx` remain stale until a full browser reload.
5. **Native Storage Event Limitation**:
   - `AuthProvider.tsx:120` relies on `window.addEventListener("storage", ...)`. In standard browser DOM specifications, the `storage` event is **never fired in the tab that made the `localStorage` change**. Intra-tab mutations are silent without a `CustomEvent`.

---

## 2. Logic Chain

1. **From Observation 1.1 & 1.2 (Key Fragmentation)**: Because projects are divided into two disjoint storage keys with differing shapes and no `type` attribute, any component reading or counting projects must duplicate parsing logic and heuristic checks (`id.includes("shopify")`). Centralizing storage into a single canonical key `obsidian_projects` with a unified schema resolves this divergence.
2. **From Observation 1.2 (Legacy Data Loss Risk)**: Existing user data or previous test data stored under `insforge_projects` and `obsidian_website_projects` would be lost if the storage key is changed without an automated migration step. Therefore, `src/lib/projects.ts` must execute an idempotent migration upon initialization that merges legacy entries, assigns canonical types, standardizes camelCase/snake_case properties, and persists to `obsidian_projects`.
3. **From Observation 1.1 & 1.2 (Native Storage Event Limitation)**: Because `window.addEventListener("storage")` does not trigger within the same browsing context, any mutation in one component (e.g. deleting on `/projects` or creating on `/builder`) fails to notify other mounted components (e.g. `Sidebar`, `Header`, `AuthProvider`). Dispatching a window-level `CustomEvent("obsidian:projects-updated")` immediately on every project mutation guarantees zero-latency, cross-component reactivity.
4. **From Observation 1.1 (Quota Mismatch)**: The quota limits across `Sidebar.tsx` (2), `billing/page.tsx` (2), `design-system/page.tsx` (2), and `AuthProvider.tsx` (3) conflict. Harmonizing all components to `MAX_FREE_PROJECTS = 3` and initial mock seeding to `<= 1` project establishes a coherent user journey where free users start with 1 active project and 2 available creation slots.

---

## 3. Caveats

1. **SSR / Hydration Safety**: Next.js App Router renders initial HTML on the server where `window` and `localStorage` are undefined. All storage operations in `src/lib/projects.ts` must guard with `typeof window !== "undefined"` and return deterministic default values during SSR.
2. **Backwards Compatibility During Transition**: While migrating to `obsidian_projects`, existing third-party or legacy references that still read `insforge_projects` or `obsidian_website_projects` must not break. The repository functions will update the canonical store as primary, while optionally providing non-destructive backwards-compatible sync or clear deprecation paths.
3. **Editor State Persistence Scope**: While `src/lib/projects.ts` will support full `ProjectData` structures (pages, code, theme, chat history), `editor/[projectId]/page.tsx` can progressively adopt deep saving without breaking existing query-parameter fallbacks.
4. **Pro Plan Infinite Quota**: Quota calculations must check `isPro` status (`user?.plan === "pro"` or active Stripe subscription) to bypass the `MAX_FREE_PROJECTS = 3` limit.

---

## 4. Conclusion & Architectural Design

### 4.1 Canonical `src/lib/projects.ts` Specification

Below is the complete implementation architecture and TypeScript contract to be created at `src/lib/projects.ts`.

```typescript
/**
 * Canonical Project Repository & Custom Event Synchronization Engine
 * Location: src/lib/projects.ts
 */

export type ProjectType = "shopify" | "website";

export interface ProjectPageData {
  name: string;
  html: string;
  css: string;
}

export interface ProjectMessageData {
  role: "user" | "assistant" | "system";
  content: string;
  time?: string;
}

export interface ProjectData {
  prompt?: string;
  pages?: Record<string, ProjectPageData>;
  pageTabs?: string[];
  chatMessages?: ProjectMessageData[];
  theme?: {
    name: string;
    primary: string;
    bg: string;
    accent?: string;
    label?: string;
  };
  presetId?: string;
  storeName?: string;
  settings?: Record<string, any>;
  [key: string]: any;
}

export interface Project {
  id: string;
  userId?: string;
  user_id?: string; // Backwards compatibility for InsForge BaaS
  title: string;
  prompt?: string;
  type: ProjectType;
  createdAt: string;
  created_at?: string; // Backwards compatibility
  updatedAt: string;
  updated_at?: string; // Backwards compatibility
  thumbnail?: string;
  thumbnail_url?: string; // Backwards compatibility
  data?: ProjectData;
}

export interface ProjectStats {
  shopifyCount: number;
  websiteCount: number;
  totalCount: number;
  maxFreeProjects: number;
  isLimitReached: boolean;
  isPro: boolean;
}

export interface CreateProjectInput {
  id?: string;
  title: string;
  type: ProjectType;
  prompt?: string;
  thumbnail?: string;
  userId?: string;
  data?: ProjectData;
}

// ── Storage Keys & Event Constants ──
export const PROJECTS_STORAGE_KEY = "obsidian_projects";
export const LEGACY_SHOPIFY_KEY = "insforge_projects";
export const LEGACY_WEBSITE_KEY = "obsidian_website_projects";
export const PROJECTS_UPDATED_EVENT = "obsidian:projects-updated";
export const MAX_FREE_PROJECTS = 3;

// ── Initial Mock Seeding (1 Single Demo Project <= 1) ──
export const INITIAL_DEFAULT_MOCKS: Project[] = [
  {
    id: "proj-web-default-1",
    userId: "user-obsidian-prime",
    title: "SaaS Analytics Platform",
    prompt: "High-converting B2B SaaS landing page with dark monochrome luxury aesthetic, pricing table, and feature grid.",
    type: "website",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    data: {
      prompt: "High-converting B2B SaaS landing page with dark monochrome luxury aesthetic, pricing table, and feature grid.",
      pageTabs: ["Home Page", "Features", "Pricing"],
    },
  },
];

// ── Custom Event Dispatcher ──
export function notifyProjectsUpdated(): void {
  if (typeof window === "undefined") return;
  try {
    const projects = getProjects();
    const count = getProjectCount();
    const event = new CustomEvent(PROJECTS_UPDATED_EVENT, {
      detail: {
        timestamp: Date.now(),
        projects,
        count,
      },
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.error("[Projects Store] Failed to dispatch projects update event:", err);
  }
}

// ── Migration Helper ──
export function migrateLegacyProjects(): Project[] {
  if (typeof window === "undefined") return [];

  try {
    const canonicalRaw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (canonicalRaw) {
      const parsed = JSON.parse(canonicalRaw);
      if (Array.isArray(parsed)) return parsed;
    }

    // Check legacy storage keys
    const legacyShopifyRaw = localStorage.getItem(LEGACY_SHOPIFY_KEY);
    const legacyWebsiteRaw = localStorage.getItem(LEGACY_WEBSITE_KEY);

    const migrated: Project[] = [];
    const seenIds = new Set<string>();

    if (legacyShopifyRaw) {
      try {
        const shopifyList = JSON.parse(legacyShopifyRaw);
        if (Array.isArray(shopifyList)) {
          for (const item of shopifyList) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              migrated.push({
                id: item.id,
                userId: item.userId || item.user_id || "user-1",
                user_id: item.user_id || item.userId || "user-1",
                title: item.title || "Untitled Shopify Store",
                prompt: item.prompt || "",
                type: "shopify",
                createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                created_at: item.created_at || item.createdAt || new Date().toISOString(),
                updatedAt: item.updatedAt || item.updated_at || item.created_at || new Date().toISOString(),
                updated_at: item.updated_at || item.updatedAt || item.created_at || new Date().toISOString(),
                thumbnail: item.thumbnail || item.thumbnail_url,
                thumbnail_url: item.thumbnail_url || item.thumbnail,
                data: item.data || { prompt: item.prompt },
              });
            }
          }
        }
      } catch (e) {
        console.error("[Projects Store] Error parsing legacy Shopify projects:", e);
      }
    }

    if (legacyWebsiteRaw) {
      try {
        const websiteList = JSON.parse(legacyWebsiteRaw);
        if (Array.isArray(websiteList)) {
          for (const item of websiteList) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              migrated.push({
                id: item.id,
                userId: item.userId || item.user_id || "user-1",
                user_id: item.user_id || item.userId || "user-1",
                title: item.title || "Untitled Website Project",
                prompt: item.prompt || "",
                type: "website",
                createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                created_at: item.created_at || item.createdAt || new Date().toISOString(),
                updatedAt: item.updatedAt || item.updated_at || item.created_at || new Date().toISOString(),
                updated_at: item.updated_at || item.updatedAt || item.created_at || new Date().toISOString(),
                thumbnail: item.thumbnail || item.thumbnail_url,
                thumbnail_url: item.thumbnail_url || item.thumbnail,
                data: item.data || { prompt: item.prompt },
              });
            }
          }
        }
      } catch (e) {
        console.error("[Projects Store] Error parsing legacy Website projects:", e);
      }
    }

    // If nothing found in legacy, seed clean initial mock (1 project)
    const initialList = migrated.length > 0 ? migrated : INITIAL_DEFAULT_MOCKS;
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialList));
    return initialList;
  } catch (err) {
    console.error("[Projects Store] Migration failed:", err);
    return INITIAL_DEFAULT_MOCKS;
  }
}

// ── CRUD Functions ──

export function getProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      return migrateLegacyProjects();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return migrateLegacyProjects();
    }
    return parsed.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  } catch {
    return migrateLegacyProjects();
  }
}

export function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function getProjectsByType(type: ProjectType): Project[] {
  return getProjects().filter((p) => p.type === type);
}

export function saveProject(project: Partial<Project> & { id: string }): Project {
  if (typeof window === "undefined") {
    return project as Project;
  }

  const existing = getProjects();
  const index = existing.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  let updatedProject: Project;

  if (index >= 0) {
    updatedProject = {
      ...existing[index],
      ...project,
      updatedAt: now,
      updated_at: now,
      thumbnail: project.thumbnail || project.thumbnail_url || existing[index].thumbnail,
      thumbnail_url: project.thumbnail_url || project.thumbnail || existing[index].thumbnail_url,
    };
    existing[index] = updatedProject;
  } else {
    updatedProject = {
      id: project.id,
      title: project.title || "Untitled Project",
      type: project.type || (project.id.includes("shopify") ? "shopify" : "website"),
      prompt: project.prompt || "",
      userId: project.userId || project.user_id || "user-obsidian-prime",
      user_id: project.user_id || project.userId || "user-obsidian-prime",
      createdAt: project.createdAt || project.created_at || now,
      created_at: project.created_at || project.createdAt || now,
      updatedAt: now,
      updated_at: now,
      thumbnail: project.thumbnail || project.thumbnail_url,
      thumbnail_url: project.thumbnail_url || project.thumbnail,
      data: project.data || {},
    };
    existing.unshift(updatedProject);
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(existing));
  notifyProjectsUpdated();
  return updatedProject;
}

export function createProject(input: CreateProjectInput): Project {
  const id = input.id || `proj-${input.type}-${Date.now()}`;
  const now = new Date().toISOString();

  const newProject: Project = {
    id,
    title: input.title,
    type: input.type,
    prompt: input.prompt || "",
    userId: input.userId || "user-obsidian-prime",
    user_id: input.userId || "user-obsidian-prime",
    createdAt: now,
    created_at: now,
    updatedAt: now,
    updated_at: now,
    thumbnail: input.thumbnail,
    thumbnail_url: input.thumbnail,
    data: input.data || { prompt: input.prompt },
  };

  const existing = getProjects();
  const updatedList = [newProject, ...existing.filter((p) => p.id !== id)];
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedList));
  notifyProjectsUpdated();
  return newProject;
}

export function deleteProject(id: string): boolean {
  if (typeof window === "undefined") return false;
  const existing = getProjects();
  const filtered = existing.filter((p) => p.id !== id);
  if (filtered.length === existing.length) return false;

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
  notifyProjectsUpdated();
  return true;
}

export function duplicateProject(id: string): Project | undefined {
  const original = getProjectById(id);
  if (!original) return undefined;

  const newId = `proj-${original.type}-${Date.now()}`;
  return createProject({
    id: newId,
    title: `${original.title} (Copy)`,
    type: original.type,
    prompt: original.prompt,
    thumbnail: original.thumbnail,
    userId: original.userId,
    data: original.data ? JSON.parse(JSON.stringify(original.data)) : undefined,
  });
}

export function getProjectCount(): { totalCount: number; shopifyCount: number; websiteCount: number } {
  const projects = getProjects();
  const shopifyCount = projects.filter((p) => p.type === "shopify").length;
  const websiteCount = projects.filter((p) => p.type === "website").length;
  return {
    totalCount: projects.length,
    shopifyCount,
    websiteCount,
  };
}

export function canCreateProject(isPro: boolean = false): boolean {
  if (isPro) return true;
  return getProjectCount().totalCount < MAX_FREE_PROJECTS;
}

export function getProjectStats(isPro: boolean = false): ProjectStats {
  const { totalCount, shopifyCount, websiteCount } = getProjectCount();
  return {
    shopifyCount,
    websiteCount,
    totalCount,
    maxFreeProjects: MAX_FREE_PROJECTS,
    isLimitReached: !isPro && totalCount >= MAX_FREE_PROJECTS,
    isPro,
  };
}
```

---

### 4.2 CustomEvent `"obsidian:projects-updated"` Subscriber React Hook

To ensure clean subscription without boilerplate:

```typescript
import { useState, useEffect, useCallback } from "react";
import {
  Project,
  getProjects,
  createProject,
  saveProject,
  deleteProject,
  getProjectStats,
  PROJECTS_UPDATED_EVENT,
} from "@/lib/projects";

export function useProjects(isPro: boolean = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState(() => getProjectStats(isPro));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const list = getProjects();
    setProjects(list);
    setStats(getProjectStats(isPro));
    setLoading(false);
  }, [isPro]);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PROJECTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return {
    projects,
    shopifyProjects: projects.filter((p) => p.type === "shopify"),
    websiteProjects: projects.filter((p) => p.type === "website"),
    stats,
    loading,
    refresh,
    createProject,
    saveProject,
    deleteProject,
  };
}
```

---

### 4.3 Detailed Fixes for `src/app/projects/page.tsx`

The rewritten `src/app/projects/page.tsx` will:
1. Use `useProjects(user?.plan === "pro")` to load and bind project data reactively.
2. Filter active list based on `activeTab` (`"shopify"` vs `"website"`).
3. Connect `handleDeleteProject(id)` directly to `deleteProject(id)`.
4. Include a responsive Quota Meter banner (`{stats.totalCount} / 3 Free Projects Used`).
5. Render clean Luxury Monochrome Noir styling (#ffffff buttons, zinc borders, pure black backgrounds, zero green accents).

#### Exact Replacement Code Plan for `src/app/projects/page.tsx`:

```tsx
"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProjects, deleteProject } from "@/lib/projects";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { FolderKanban, ExternalLink, Calendar, Image as ImageIcon, Hexagon, Trash2, Loader2, Sparkles, AlertCircle } from "lucide-react";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

function ProjectsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isPro = user?.plan === "pro";
  const { projects, shopifyProjects, websiteProjects, stats, loading } = useProjects(isPro);

  const initialTab = searchParams?.get("tab") === "website" ? "website" : "shopify";
  const [activeTab, setActiveTab] = useState<"shopify" | "website">(initialTab);

  const handleDelete = (id: string) => {
    deleteProject(id);
    // CustomEvent automatically updates useProjects and AuthProvider quota meters immediately!
  };

  const currentList = activeTab === "shopify" ? shopifyProjects : websiteProjects;

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300">
      {/* Header & Category Tabs */}
      <div className="space-y-6 border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1 font-semibold">
              <FolderKanban className="w-4 h-4 text-white" />
              <span>UNIFIED WORKSPACE MANAGER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-zinc-100 tracking-tight flex items-center gap-3">
              Project Management Studio
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Centralized workspace for Obsidian Websites and Shopify Liquid Themes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {activeTab === "shopify" ? (
              <Link href="/builder">
                <Button className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md" leftIcon={<ShopifyIcon className="w-4 h-4 fill-zinc-950" />}>
                  Create Shopify Store
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-md" leftIcon={<Hexagon className="w-4 h-4" />}>
                  New Website Prompt
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quota & Plan Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {isPro ? "Obsidian Pro Subscription" : "Free Creator Plan"}
              </p>
              <p className="text-xs text-zinc-400">
                {isPro
                  ? `Unlimited projects active (${stats.totalCount} total)`
                  : `${stats.totalCount} of ${stats.maxFreeProjects} free project slots used`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPro && (
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <div className="w-24 sm:w-32 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stats.isLimitReached ? "bg-zinc-400" : "bg-white"
                    }`}
                    style={{ width: `${Math.min(100, (stats.totalCount / stats.maxFreeProjects) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">{stats.totalCount}/3</span>
              </div>
            )}
            {!isPro && (
              <Link href="/billing">
                <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 text-xs">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 bg-zinc-900/90 p-1.5 rounded-2xl w-fit border border-zinc-800 shadow-inner">
          <button
            onClick={() => setActiveTab("shopify")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
              activeTab === "shopify"
                ? "bg-zinc-800 text-white border-zinc-700 shadow-sm"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <ShopifyIcon className="w-4 h-4 fill-current text-white" />
            <span>Shopify Store Projects</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "shopify"
                  ? "bg-white text-zinc-950 font-bold"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {shopifyProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
              activeTab === "website"
                ? "bg-zinc-800 text-white border-zinc-700 shadow-sm"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <Hexagon className="w-4 h-4 text-zinc-200" />
            <span>Website Builder Projects</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "website"
                  ? "bg-white text-zinc-950 font-bold"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {websiteProjects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <Card glass={false} className="text-center py-16 px-6 space-y-4 bg-zinc-900 border-zinc-800 shadow-xl max-w-xl mx-auto rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
            {activeTab === "shopify" ? (
              <ShopifyIcon className="w-6 h-6 fill-white" />
            ) : (
              <Hexagon className="w-6 h-6 text-zinc-200" />
            )}
          </div>
          <CardTitle className="text-zinc-100 font-heading text-xl">No {activeTab === "shopify" ? "Shopify" : "Website"} Projects Found</CardTitle>
          <CardDescription className="text-zinc-400 text-sm max-w-md mx-auto">
            {activeTab === "shopify"
              ? "Build your first AI-powered Shopify Liquid store."
              : "Generate your first website using the dark Obsidian prompt studio."}
          </CardDescription>
          <Link href={activeTab === "shopify" ? "/builder" : "/"} className="inline-block pt-2">
            <Button
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold"
              size="sm"
            >
              {activeTab === "shopify" ? "Launch Shopify Builder" : "Open Website Builder"}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {currentList.map((proj) => (
            <Card
              key={proj.id}
              glass={false}
              hoverable
              className="group flex flex-col justify-between overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800 group">
                  {proj.thumbnail || proj.thumbnail_url ? (
                    <img
                      src={proj.thumbnail || proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 text-xs gap-2">
                      <ImageIcon className="w-6 h-6 text-zinc-500" />
                      <span>Preview Canvas</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border shadow-sm bg-zinc-900/90 text-zinc-200 border-zinc-700">
                      {proj.type === "shopify" ? "SHOPIFY LIQUID" : "WEBSITE HTML"}
                    </span>
                  </div>
                </div>

                <CardTitle className="group-hover:text-white transition-colors line-clamp-1 text-zinc-100 font-heading text-lg">
                  {proj.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1 text-zinc-400 text-xs leading-relaxed">
                  {proj.prompt}
                </CardDescription>
              </div>

              <CardFooter className="pt-4 border-t border-zinc-800 flex items-center justify-between mt-6">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {new Date(proj.createdAt || proj.created_at || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(proj.id)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={`/editor/${proj.id}?type=${proj.type}`}>
                    <Button
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-600"
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Open Studio
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-zinc-400 font-mono text-xs bg-zinc-950 min-h-screen">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" /> Loading Workspaces...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
```

---

### 4.4 Exact Integration Diffs for Related Components

#### 1. `src/components/providers/AuthProvider.tsx`
- Import `getProjectStats`, `PROJECTS_UPDATED_EVENT`, `MAX_FREE_PROJECTS` from `@/lib/projects`.
- Listen to both `PROJECTS_UPDATED_EVENT` and `storage` in `useEffect`.
- `refreshProjectCount()` simply calls `getProjectStats(user?.plan === "pro")` and updates state.

#### 2. `src/components/Sidebar.tsx`
- Update lines 45–48:
  ```typescript
  const projectCount = user?.projectCount ?? 1;
  const maxProjects = user?.plan === "pro" ? "∞" : "3";
  const usagePercentage = user?.plan === "pro" ? 20 : (projectCount / 3) * 100;
  ```
- Subscribes to `PROJECTS_UPDATED_EVENT` for live count updates when items are deleted/created.

#### 3. `src/components/LandingPageClient.tsx`
- Replace direct `localStorage.setItem("obsidian_website_projects", ...)` with `createProject({ title, type: "website", prompt, ... })`.

#### 4. `src/app/builder/page.tsx`
- Replace direct `localStorage.setItem("insforge_projects", ...)` with `createProject({ title, type: "shopify", prompt, ... })`.

#### 5. `src/app/billing/page.tsx`
- Update line 109 copy: `Free Plan (3 Projects Max)`.

#### 6. `src/app/design-system/page.tsx`
- Update line 211 copy: `You are on the Free tier (3/3 projects used).`.

---

## 5. Verification Method

Once implemented, the following verification commands and user flows validate the solution:

1. **Static Type Checking**:
   ```powershell
   npx tsc --noEmit
   ```
   Must pass with exit code 0.

2. **Storage Migration Verification**:
   - In browser DevTools Console, seed legacy items:
     ```javascript
     localStorage.setItem("insforge_projects", JSON.stringify([{ id: "test-shopify", title: "Test Store", prompt: "Store prompt" }]));
     localStorage.setItem("obsidian_website_projects", JSON.stringify([{ id: "test-web", title: "Test Web", prompt: "Web prompt" }]));
     ```
   - Load `/projects`.
   - Inspect `localStorage.getItem("obsidian_projects")`: both items must be migrated with valid `type: "shopify"` and `type: "website"`.

3. **Quota & Deletion Event Verification**:
   - Observe Sidebar shows `1/3` (or current count).
   - Create a new project on `/builder` -> count becomes `2/3` immediately on Sidebar and Header.
   - Go to `/projects` -> click Delete (Trash icon) -> project card disappears instantly and Sidebar meter drops from `2/3` to `1/3` **without page reload**.
   - Attempt to create 4 projects on Free tier -> Quota modal appears when count reaches 3.

4. **Production Build Validation**:
   ```powershell
   npm run build
   ```
   Must compile all routes (`/`, `/builder`, `/shopify`, `/projects`, `/billing`, `/editor/[projectId]`) with 0 errors.
