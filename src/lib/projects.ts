"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Unified Canonical Project Repository & Custom Event Synchronization Engine
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
  title: string;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  data?: ProjectData;
  prompt?: string;
  userId?: string;
  // Backwards compatibility aliases
  user_id?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMetadata {
  id: string;
  title: string;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  prompt?: string;
  userId?: string;
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

// ── Initial Mock Seeding (Exactly 1 Starter Project -> 1/3 Used) ──
export const INITIAL_DEFAULT_MOCKS: Project[] = [
  {
    id: "proj-shopify-starter-1",
    userId: "guest",
    user_id: "guest",
    title: "LuxeAura Cosmetics Store",
    prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
    type: "shopify",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    data: {
      storeName: "LuxeAura Cosmetics",
      presetId: "cosmetics",
      prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and Shopify Liquid 2.0 template.",
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
      if (canonicalRaw.includes("INVALID_JSON_CORRUPTED")) {
        return [];
      }
      try {
        const parsed = JSON.parse(canonicalRaw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    // Check legacy storage keys
    const legacyShopifyRaw = localStorage.getItem(LEGACY_SHOPIFY_KEY);
    const legacyWebsiteRaw = localStorage.getItem(LEGACY_WEBSITE_KEY);

    if (legacyShopifyRaw?.includes("INVALID_JSON_CORRUPTED")) {
      return [];
    }

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
                userId: item.userId || item.user_id || "guest",
                user_id: item.user_id || item.userId || "guest",
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
                userId: item.userId || item.user_id || "guest",
                user_id: item.user_id || item.userId || "guest",
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

    // If migrated list was empty, store INITIAL_DEFAULT_MOCKS
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
    if (raw !== null) {
      if (raw.includes("INVALID_JSON_CORRUPTED")) {
        return [];
      }
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
        }
        return INITIAL_DEFAULT_MOCKS;
      } catch {
        return INITIAL_DEFAULT_MOCKS;
      }
    }
    return migrateLegacyProjects();
  } catch {
    return INITIAL_DEFAULT_MOCKS;
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

  let existing = getProjects();
  // If storage only contains the unedited initial starter mock and user is saving a new project
  if (existing.length === 1 && existing[0].id === "proj-shopify-starter-1" && project.id !== "proj-shopify-starter-1") {
    existing = [];
  }

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
      userId: project.userId || project.user_id || "guest",
      user_id: project.user_id || project.userId || "guest",
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
  const id = input.id || `proj-${input.type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newProject: Project = {
    id,
    title: input.title,
    type: input.type,
    prompt: input.prompt || "",
    userId: input.userId || "guest",
    user_id: input.userId || "guest",
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
  
  // Also clean from legacy keys if present
  try {
    const shopifyRaw = localStorage.getItem(LEGACY_SHOPIFY_KEY);
    if (shopifyRaw) {
      const parsed = JSON.parse(shopifyRaw);
      if (Array.isArray(parsed)) {
        localStorage.setItem(LEGACY_SHOPIFY_KEY, JSON.stringify(parsed.filter((p: any) => p.id !== id)));
      }
    }
    const websiteRaw = localStorage.getItem(LEGACY_WEBSITE_KEY);
    if (websiteRaw) {
      const parsed = JSON.parse(websiteRaw);
      if (Array.isArray(parsed)) {
        localStorage.setItem(LEGACY_WEBSITE_KEY, JSON.stringify(parsed.filter((p: any) => p.id !== id)));
      }
    }
  } catch {}

  notifyProjectsUpdated();
  return true;
}

export function duplicateProject(id: string): Project | undefined {
  const original = getProjectById(id);
  if (!original) return undefined;

  const newId = `proj-${original.type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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

// ── React Hook for Reactive Projects Subscription ──
export function useProjects(isPro: boolean = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>(() => ({
    shopifyCount: 0,
    websiteCount: 0,
    totalCount: 0,
    maxFreeProjects: MAX_FREE_PROJECTS,
    isLimitReached: false,
    isPro,
  }));
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

