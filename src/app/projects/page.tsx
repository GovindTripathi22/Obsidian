"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProjects, deleteProject, canCreateProject } from "@/lib/projects";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { QuotaLimitModal } from "@/components/ui/QuotaLimitModal";
import {
  FolderKanban,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Hexagon,
  Trash2,
  Loader2,
  Sparkles,
  Shield,
  Plus,
} from "lucide-react";

const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

function ProjectsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isPro = user?.plan === "pro";
  const { projects, shopifyProjects, websiteProjects, stats, loading } = useProjects(isPro);

  const initialTab = searchParams?.get("tab") === "website" ? "website" : "shopify";
  const [activeTab, setActiveTab] = useState<"shopify" | "website">(initialTab);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  const handleDelete = (id: string) => {
    deleteProject(id);
    // CustomEvent automatically updates useProjects and AuthProvider quota meters immediately
  };

  const handleCreateNew = (target: "shopify" | "website") => {
    if (!canCreateProject(isPro)) {
      setShowQuotaModal(true);
      return;
    }
    if (target === "shopify") {
      router.push("/builder");
    } else {
      router.push("/");
    }
  };

  const currentList = activeTab === "shopify" ? shopifyProjects : websiteProjects;

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 min-h-screen bg-[#0a0a0a] text-neutral-100 transition-colors duration-300 font-sans">
      {/* Header & Action Controls */}
      <div className="space-y-6 border-b border-neutral-800/80 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-100 tracking-tight flex items-center gap-3">
              Projects
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Unified repository for Obsidian Websites and Shopify Liquid Themes.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {activeTab === "shopify" ? (
              <Button
                onClick={() => handleCreateNew("shopify")}
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium shadow-sm"
                leftIcon={<ShopifyIcon className="w-4 h-4 fill-neutral-950" />}
              >
                Create Shopify Store
              </Button>
            ) : (
              <Button
                onClick={() => handleCreateNew("website")}
                className="bg-white text-neutral-950 hover:bg-neutral-200 font-medium shadow-sm"
                leftIcon={<Hexagon className="w-4 h-4 text-neutral-950" />}
              >
                New Website Prompt
              </Button>
            )}
          </div>
        </div>

        {/* Quota & Plan Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 gap-3 shadow-sm">
          <div>
            <p className="text-xs font-medium text-white">
              {isPro ? "Obsidian Pro Subscription" : "Free Creator Plan"}
            </p>
            <p className="text-xs text-neutral-400">
              {isPro
                ? `Unlimited projects active (${stats.totalCount} total stores & sites)`
                : `${stats.totalCount} of ${stats.maxFreeProjects} free project slots used`}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPro && (
              <div className="flex items-center gap-2.5 flex-1 sm:flex-none">
                <div className="w-24 sm:w-32 h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stats.isLimitReached ? "bg-neutral-400" : "bg-white"
                    }`}
                    style={{
                      width: `${Math.min(100, (stats.totalCount / stats.maxFreeProjects) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  {stats.totalCount}/3
                </span>
              </div>
            )}
            {!isPro && (
              <Link href="/billing">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 text-xs font-medium"
                >
                  Upgrade ($9.99/mo)
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-1.5 rounded-xl w-fit border border-neutral-800">
          <button
            onClick={() => setActiveTab("shopify")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-xs font-medium border transition-all duration-300 cursor-pointer ${
              activeTab === "shopify"
                ? "bg-neutral-800 text-white border-neutral-700 shadow-sm"
                : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
            }`}
          >
            <ShopifyIcon className="w-4 h-4 fill-white" />
            <span>Shopify</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                activeTab === "shopify"
                  ? "bg-white text-neutral-950"
                  : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {shopifyProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-xs font-medium border transition-all duration-300 cursor-pointer ${
              activeTab === "website"
                ? "bg-neutral-800 text-white border-neutral-700 shadow-sm"
                : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
            }`}
          >
            <Hexagon className="w-4 h-4 text-neutral-200" />
            <span>Websites</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                activeTab === "website"
                  ? "bg-white text-neutral-950"
                  : "bg-neutral-800 text-neutral-400"
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
            <div
              key={n}
              className="h-72 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse shadow-sm"
            />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <Card
          glass={false}
          className="text-center py-16 px-6 space-y-4 bg-neutral-900 border-neutral-800 shadow-sm max-w-xl mx-auto rounded-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-300">
            {activeTab === "shopify" ? (
              <ShopifyIcon className="w-6 h-6 fill-white" />
            ) : (
              <Hexagon className="w-6 h-6 text-neutral-200" />
            )}
          </div>
          <CardTitle className="text-neutral-100 font-semibold text-xl">
            No {activeTab === "shopify" ? "Shopify" : "Website"} Projects Found
          </CardTitle>
          <CardDescription className="text-neutral-400 text-sm max-w-md mx-auto">
            {activeTab === "shopify"
              ? "Build your first AI-powered Shopify Liquid store."
              : "Generate your first website using the dark Obsidian prompt studio."}
          </CardDescription>
          <Button
            onClick={() => handleCreateNew(activeTab)}
            className="bg-white text-neutral-950 hover:bg-neutral-200 font-medium mt-2"
            size="sm"
          >
            {activeTab === "shopify" ? "Launch Shopify Builder" : "Open Website Builder"}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {currentList.map((proj) => (
            <Card
              key={proj.id}
              glass={false}
              hoverable
              className="group flex flex-col justify-between overflow-hidden bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-xl"
            >
              <div>
                <div className="aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden mb-4 relative border border-neutral-800 group">
                  {proj.thumbnail || proj.thumbnail_url ? (
                    <img
                      src={proj.thumbnail || proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a] text-neutral-500 text-xs gap-2">
                      <ImageIcon className="w-6 h-6 text-neutral-500" />
                      <span>Preview Canvas</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full border shadow-sm bg-neutral-900/90 text-neutral-200 border-neutral-700">
                      {proj.type === "shopify" ? "SHOPIFY LIQUID" : "WEBSITE HTML"}
                    </span>
                  </div>
                </div>

                <CardTitle className="group-hover:text-white transition-colors line-clamp-1 text-neutral-100 font-semibold text-lg">
                  {proj.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1 text-neutral-400 text-xs leading-relaxed">
                  {proj.prompt}
                </CardDescription>
              </div>

              <CardFooter className="pt-4 border-t border-neutral-800 flex items-center justify-between mt-6">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {new Date(proj.createdAt || proj.created_at || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(proj.id)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800/80 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={`/editor/${proj.id}?type=${proj.type}`}>
                    <Button
                      size="sm"
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 hover:border-neutral-600 text-xs font-medium"
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

      {/* Quota Limit Modal Guard */}
      <QuotaLimitModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        currentCount={stats.totalCount}
        maxCount={3}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-neutral-500 bg-[#0a0a0a] min-h-screen">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-neutral-400" /> Loading Workspaces...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
