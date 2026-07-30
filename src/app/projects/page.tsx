"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { FolderKanban, ExternalLink, Calendar, Sparkles, Image as ImageIcon, Hexagon, Trash2, Loader2 } from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

function ProjectsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const initialTab = searchParams?.get("tab") === "website" ? "website" : "shopify";
  const [activeTab, setActiveTab] = useState<"shopify" | "website">(initialTab);

  const [shopifyProjects, setShopifyProjects] = useState<ProjectRecord[]>([]);
  const [websiteProjects, setWebsiteProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Shopify Projects
    const savedShopify = localStorage.getItem("insforge_projects");
    if (savedShopify) {
      try {
        setShopifyProjects(JSON.parse(savedShopify));
      } catch {
        setShopifyProjects(DEFAULT_SHOPIFY_MOCKS);
      }
    } else {
      setShopifyProjects(DEFAULT_SHOPIFY_MOCKS);
      localStorage.setItem("insforge_projects", JSON.stringify(DEFAULT_SHOPIFY_MOCKS));
    }

    // Load Website Builder Projects
    const savedWebsite = localStorage.getItem("obsidian_website_projects");
    if (savedWebsite) {
      try {
        setWebsiteProjects(JSON.parse(savedWebsite));
      } catch {
        setWebsiteProjects(DEFAULT_WEBSITE_MOCKS);
      }
    } else {
      setWebsiteProjects(DEFAULT_WEBSITE_MOCKS);
      localStorage.setItem("obsidian_website_projects", JSON.stringify(DEFAULT_WEBSITE_MOCKS));
    }

    setLoading(false);
  }, []);

  const DEFAULT_SHOPIFY_MOCKS: ProjectRecord[] = [
    {
      id: "proj-shopify-1",
      user_id: user?.id || "user-1",
      title: "LuxeAura Cosmetics Store",
      prompt: "Create a luxurious cosmetics store with pastel pink accents and Shopify Liquid template.",
      thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    },
    {
      id: "proj-shopify-2",
      user_id: user?.id || "user-1",
      title: "Minimalist Apparel Boutique",
      prompt: "Design a minimalist streetwear apparel store with clean theme.",
      thumbnail_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const DEFAULT_WEBSITE_MOCKS: ProjectRecord[] = [
    {
      id: "proj-web-1",
      user_id: user?.id || "user-1",
      title: "SaaS Analytics Landing Page",
      prompt: "High-converting B2B SaaS landing page with sticky navbar, pricing table, and testimonials.",
      thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "proj-web-2",
      user_id: user?.id || "user-1",
      title: "Product Designer Portfolio",
      prompt: "Minimalist portfolio with dark theme, masonry grid gallery, and case study detail views.",
      thumbnail_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const handleDeleteProject = (id: string, type: "shopify" | "website") => {
    if (type === "shopify") {
      const updated = shopifyProjects.filter((p) => p.id !== id);
      setShopifyProjects(updated);
      localStorage.setItem("insforge_projects", JSON.stringify(updated));
    } else {
      const updated = websiteProjects.filter((p) => p.id !== id);
      setWebsiteProjects(updated);
      localStorage.setItem("obsidian_website_projects", JSON.stringify(updated));
    }
  };

  const currentList = activeTab === "shopify" ? shopifyProjects : websiteProjects;

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">
      {/* Header & Category Tabs */}
      <div className="space-y-6 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 mb-1 font-semibold">
              <FolderKanban className="w-4 h-4" />
              <span>UNIFIED WORKSPACE MANAGER</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Project Management Studio
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Separate work environments for Website Builder and Shopify Theme Builder projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "shopify" ? (
              <Link href="/builder">
                <Button variant="pink" leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}>
                  Create Shopify Store
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 font-bold" leftIcon={<Hexagon className="w-4 h-4" />}>
                  New Website Prompt
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Animated Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit border border-slate-300/80 shadow-inner">
          <button
            onClick={() => setActiveTab("shopify")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "shopify"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30 scale-102"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/60"
            }`}
          >
            <ShopifyIcon className="w-4 h-4 fill-current" />
            <span>Shopify Store Projects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === "shopify" ? "bg-white/20 text-white" : "bg-slate-300 text-slate-700"}`}>
              {shopifyProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "website"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/30 scale-102"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/60"
            }`}
          >
            <Hexagon className="w-4 h-4" />
            <span>Website Builder Projects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === "website" ? "bg-white/20 text-white" : "bg-slate-300 text-slate-700"}`}>
              {websiteProjects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <Card className="text-center py-16 space-y-4 bg-white border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            {activeTab === "shopify" ? (
              <ShopifyIcon className="w-6 h-6 text-emerald-600" />
            ) : (
              <Hexagon className="w-6 h-6 text-slate-900" />
            )}
          </div>
          <CardTitle>No {activeTab === "shopify" ? "Shopify" : "Website"} Projects Found</CardTitle>
          <CardDescription>
            {activeTab === "shopify"
              ? "Build your first AI-powered Shopify Liquid store."
              : "Generate your first website using the dark Obsidian prompt studio."}
          </CardDescription>
          <Link href={activeTab === "shopify" ? "/builder" : "/"} className="inline-block">
            <Button variant={activeTab === "shopify" ? "pink" : "primary"} size="sm">
              {activeTab === "shopify" ? "Launch Shopify Builder" : "Open Website Builder"}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {currentList.map((proj) => (
            <Card
              key={proj.id}
              hoverable
              className="group flex flex-col justify-between overflow-hidden bg-white border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4 relative border border-slate-200 group">
                  {proj.thumbnail_url ? (
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs gap-2">
                      <ImageIcon className="w-6 h-6 text-slate-400 animate-pulse" />
                      <span>Preview Canvas</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                        activeTab === "shopify"
                          ? "bg-emerald-500 text-white border-emerald-400"
                          : "bg-slate-900 text-white border-slate-700"
                      }`}
                    >
                      {activeTab === "shopify" ? "SHOPIFY LIQUID" : "WEBSITE HTML"}
                    </span>
                  </div>
                </div>

                <CardTitle className="group-hover:text-emerald-600 transition-colors line-clamp-1 text-slate-900">
                  {proj.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1 text-slate-500 text-xs">
                  {proj.prompt}
                </CardDescription>
              </div>

              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(proj.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteProject(proj.id, activeTab)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={`/editor/${proj.id}?type=${activeTab}`}>
                    <Button size="sm" variant={activeTab === "shopify" ? "pink" : "outline"} rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
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
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Workspaces...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
