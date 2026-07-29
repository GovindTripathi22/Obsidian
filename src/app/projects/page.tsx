"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { FolderKanban, Plus, ExternalLink, Calendar, Sparkles, Image as ImageIcon } from "lucide-react";
import { ProjectRecord } from "@/lib/insforge";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProjects = localStorage.getItem("insforge_projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        setProjects(DEFAULT_MOCK_PROJECTS);
      }
    } else {
      setProjects(DEFAULT_MOCK_PROJECTS);
      localStorage.setItem("insforge_projects", JSON.stringify(DEFAULT_MOCK_PROJECTS));
    }
    setLoading(false);
  }, []);

  const DEFAULT_MOCK_PROJECTS: ProjectRecord[] = [
    {
      id: "proj-demo-1",
      user_id: user?.id || "user-1",
      title: "LuxeAura Cosmetics Store",
      prompt: "Create a luxurious cosmetics store with pastel pink accents and Shopify Liquid template.",
      thumbnail_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
    },
    {
      id: "proj-demo-2",
      user_id: user?.id || "user-1",
      title: "Minimalist Apparel Boutique",
      prompt: "Design a minimalist streetwear apparel store with clean theme.",
      thumbnail_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-600 mb-1 font-semibold">
            <FolderKanban className="w-4 h-4" />
            <span>PROJECT MANAGEMENT DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Shopify Projects</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage, edit, and export your AI-generated Shopify Liquid theme workspaces.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Store
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-16 space-y-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <CardTitle>No Projects Found</CardTitle>
          <CardDescription>Start by creating your first AI-generated Shopify Liquid store.</CardDescription>
          <Link href="/" className="inline-block">
            <Button variant="primary" size="sm">Create Store Prompt</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} hoverable className="group flex flex-col justify-between overflow-hidden bg-white">
              <div>
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4 relative border border-slate-200">
                  {proj.thumbnail_url ? (
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs gap-2">
                      <ImageIcon className="w-6 h-6 text-slate-400 animate-pulse" />
                      <span>Generating Preview...</span>
                    </div>
                  )}
                </div>

                <CardTitle className="group-hover:text-pink-600 transition-colors line-clamp-1">
                  {proj.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {proj.prompt}
                </CardDescription>
              </div>

              <CardFooter className="pt-4 border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(proj.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <Link href={`/editor/${proj.id}`}>
                  <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Edit Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
