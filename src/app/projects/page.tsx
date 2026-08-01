"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { FolderKanban, ExternalLink, Calendar, Image as ImageIcon, Hexagon, Trash2, Loader2 } from "lucide-react";
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
    <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300">
      {/* Header & Category Tabs */}
      <div className="space-y-6 border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1 font-semibold">
              <FolderKanban className="w-4 h-4" />
              <span>UNIFIED WORKSPACE MANAGER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-zinc-100 tracking-tight flex items-center gap-3">
              Project Management Studio
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Separate work environments for Website Builder and Shopify Theme Builder projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "shopify" ? (
              <Link href="/builder">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/20" leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}>
                  Create Shopify Store
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium" leftIcon={<Hexagon className="w-4 h-4" />}>
                  New Website Prompt
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Animated Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 bg-zinc-900/90 p-1.5 rounded-2xl w-fit border border-zinc-800 shadow-inner">
          <button
            onClick={() => setActiveTab("shopify")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
              activeTab === "shopify"
                ? "bg-zinc-800 text-white border-zinc-700 shadow-sm"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <ShopifyIcon className="w-4 h-4 fill-current text-emerald-400" />
            <span>Shopify Store Projects</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "shopify"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
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
            <Hexagon className="w-4 h-4 text-zinc-300" />
            <span>Website Builder Projects</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "website"
                  ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
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
              <ShopifyIcon className="w-6 h-6 text-emerald-400" />
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
              className={
                activeTab === "shopify"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  : "bg-white text-zinc-950 hover:bg-zinc-200 font-medium"
              }
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
                  {proj.thumbnail_url ? (
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 text-xs gap-2">
                      <ImageIcon className="w-6 h-6 text-zinc-500 animate-pulse" />
                      <span>Preview Canvas</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border shadow-sm ${
                        activeTab === "shopify"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700"
                      }`}
                    >
                      {activeTab === "shopify" ? "SHOPIFY LIQUID" : "WEBSITE HTML"}
                    </span>
                  </div>
                </div>

                <CardTitle className="group-hover:text-emerald-400 transition-colors line-clamp-1 text-zinc-100 font-heading text-lg">
                  {proj.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1 text-zinc-400 text-xs leading-relaxed">
                  {proj.prompt}
                </CardDescription>
              </div>

              <CardFooter className="pt-4 border-t border-zinc-800 flex items-center justify-between mt-6">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {new Date(proj.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteProject(proj.id, activeTab)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={`/editor/${proj.id}?type=${activeTab}`}>
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
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-emerald-400" /> Loading Workspaces...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
