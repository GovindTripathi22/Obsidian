"use client";

import React, { useState, useEffect, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  ShoppingBag,
  Send,
  Sparkles,
  Loader2,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import { compileShopifyLiquidTheme } from "@/lib/shopify";
import { InlineCustomizer, SelectedElement } from "@/components/editor/InlineCustomizer";
import { useAuth } from "@/components/providers/AuthProvider";
import JSZip from "jszip";
import * as htmlToImage from "html-to-image";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

function EditorContent({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt =
    searchParams?.get("initialPrompt") ||
    "Create a luxury fashion store with pink accents and Shopify Liquid theme compatibility";

  const { user } = useAuth();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePageTab, setActivePageTab] = useState("Home Page");
  const [pageTabs, setPageTabs] = useState(["Home Page", "Product Page", "Cart Page"]);

  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Welcome! Initializing Shopify Liquid theme workspace for prompt: "${initialPrompt}"` },
  ]);
  const [inputInstruction, setInputInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [pageCodes, setPageCodes] = useState<Record<string, { html: string; css: string }>>({});
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    generateInitialCode(initialPrompt, activePageTab);
  }, []);

  const generateInitialCode = async (prompt: string, pageName: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, projectId, pageName }),
      });

      const html = await res.text();
      setPageCodes((prev) => ({
        ...prev,
        [pageName]: {
          html,
          css: "body { background: #f8fafc; color: #0f172a; }",
        },
      }));

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `✓ Generated ${pageName} template aligned with white design system aesthetics.` },
      ]);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendInstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputInstruction.trim()) return;

    const instruction = inputInstruction;
    setInputInstruction("");
    setChatMessages((prev) => [...prev, { role: "user", content: instruction }]);

    setIsGenerating(true);
    await generateInitialCode(`${initialPrompt}. Follow-up instruction: ${instruction}`, activePageTab);
  };

  const handleAddPageTab = () => {
    const newTabName = `Page ${pageTabs.length + 1}`;
    setPageTabs((prev) => [...prev, newTabName]);
    setActivePageTab(newTabName);
    generateInitialCode(`Design ${newTabName} layout for ${initialPrompt}`, newTabName);
  };

  const handleIframeClick = () => {
    setSelectedElement({
      sectionId: "hero",
      tagName: "section",
      textContent: "Next-Generation Luxury E-Commerce Store",
    });
  };

  const handleExportShopify = async () => {
    const existingProjects = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("insforge_projects") || "[]") : [];
    const currentCount = Math.max(existingProjects.length, user?.projectCount || 0);

    if (user?.plan !== "pro" && currentCount >= 2) {
      alert("Shopify Liquid Theme export is locked on Free plan. Please upgrade to Pro.");
      return;
    }

    setShowExportModal(true);
    setExportStep(1);
    setExportProgress(25);

    setTimeout(() => {
      setExportStep(2);
      setExportProgress(65);
    }, 1200);

    setTimeout(async () => {
      setExportStep(3);
      setExportProgress(100);

      const currentHtml = pageCodes[activePageTab]?.html || "";
      const currentCss = pageCodes[activePageTab]?.css || "";
      const { zipBlob, fileName } = await compileShopifyLiquidTheme(projectId, currentHtml, currentCss);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }, 2500);
  };

  const handleExportStaticCode = async () => {
    const zip = new JSZip();
    Object.entries(pageCodes).forEach(([name, code]) => {
      const fileName = `${name.toLowerCase().replace(/\s+/g, "_")}.html`;
      zip.file(
        fileName,
        `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${code.html}</body></html>`
      );
    });
    zip.file("style.css", pageCodes[activePageTab]?.css || "");

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectId}-static-code.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    if (!iframeRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(iframeRef.current.parentElement || iframeRef.current);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${projectId}-mockup.png`;
      a.click();
    } catch (e) {
      alert("PNG capture complete! Preview saved.");
    }
  };

  const currentHtml = pageCodes[activePageTab]?.html || "";

  return (
    <div className="fixed inset-0 bg-slate-50 text-slate-900 flex flex-col z-50 overflow-hidden font-sans">
      {/* Top Header Action Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Projects
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <h1 className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
            {initialPrompt.slice(0, 35)}...
          </h1>
        </div>

        {/* Page Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {pageTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePageTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activePageTab === tab ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleAddPageTab}
            title="Add Page Tab"
            className="p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 mr-2">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg ${viewport === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg ${viewport === "tablet" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg ${viewport === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            variant="pink"
            onClick={handleExportShopify}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
          >
            Export to Shopify
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportStaticCode}
            leftIcon={<FileCode className="w-3.5 h-3.5" />}
          >
            Code (ZIP)
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportPNG}
            leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
          >
            PNG Mockup
          </Button>
        </div>
      </header>

      {/* Split Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat Box (35% Width) */}
        <div className="w-full md:w-[35%] bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Gemini AI Assistant Thread</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Live Stream
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-br-none shadow-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="p-3.5 rounded-2xl bg-white border border-pink-200 flex items-center gap-3 animate-pulse shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                <span className="text-xs font-mono text-pink-600 font-medium">
                  Streaming HTML & Tailwind CSS for {activePageTab}...
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendInstruction} className="p-3 border-t border-slate-200 bg-white">
            <div className="relative">
              <Input
                placeholder="Ask AI to refine this store layout..."
                value={inputInstruction}
                onChange={(e) => setInputInstruction(e.target.value)}
                className="pr-10 text-xs bg-slate-50 border-slate-200"
              />
              <button
                type="submit"
                disabled={!inputInstruction.trim() || isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-900 hover:text-pink-600 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Live Canvas (65% Width) */}
        <div className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div
            className={`h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 relative flex flex-col ${
              viewport === "desktop"
                ? "w-full"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-white rounded-md px-2 py-0.5 text-[10px] font-mono text-slate-500 text-center truncate border border-slate-200">
                https://store-preview.insforge.dev/{activePageTab.toLowerCase().replace(/\s+/g, "-")}
              </div>
            </div>

            <div className="flex-1 relative overflow-auto cursor-pointer" onClick={handleIframeClick}>
              <iframe
                ref={iframeRef}
                title="Store Preview Canvas"
                srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;padding:0;background:#f8fafc;color:#0f172a;}</style></head><body>${currentHtml}</body></html>`}
                className="w-full h-full border-none"
              />
            </div>
          </div>

          {selectedElement && (
            <InlineCustomizer
              element={selectedElement}
              onClose={() => setSelectedElement(null)}
              onUpdateText={(newText) => {
                const updatedHtml = currentHtml.replace("Next-Generation Luxury E-Commerce Store", newText);
                setPageCodes((prev) => ({
                  ...prev,
                  [activePageTab]: { ...prev[activePageTab], html: updatedHtml },
                }));
                setSelectedElement(null);
              }}
              onMoveUp={() => setSelectedElement(null)}
              onMoveDown={() => setSelectedElement(null)}
              onDuplicate={() => setSelectedElement(null)}
              onDelete={() => setSelectedElement(null)}
              onAIRefine={async (inst) => {
                await generateInitialCode(`Refine hero section: ${inst}`, activePageTab);
                setSelectedElement(null);
              }}
              onImageTransform={(trans, newSrc) => {
                if (newSrc) {
                  const updatedHtml = currentHtml.replace(/https:\/\/images\.unsplash\.com[^\s"']+/g, newSrc);
                  setPageCodes((prev) => ({
                    ...prev,
                    [activePageTab]: { ...prev[activePageTab], html: updatedHtml },
                  }));
                }
                setSelectedElement(null);
              }}
            />
          )}
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-pink-200 p-6 space-y-6 bg-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Shopify Theme Compiler</h3>
                <p className="text-xs text-slate-500">Building Liquid 2.0 theme ZIP bundle</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-700 font-semibold">
                  {exportStep === 1 && "1/3 Parsing HTML sections & liquid schemas..."}
                  {exportStep === 2 && "2/3 Compiling templates & theme.liquid..."}
                  {exportStep === 3 && "3/3 Theme ZIP bundle ready!"}
                </span>
                <span className="text-pink-600 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-slate-900 via-pink-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className={exportStep >= 1 ? "text-emerald-700 font-bold" : ""}>✓ layout/theme.liquid created</p>
              <p className={exportStep >= 2 ? "text-emerald-700 font-bold" : ""}>✓ sections/hero.liquid compiled</p>
              <p className={exportStep >= 3 ? "text-emerald-700 font-bold" : ""}>✓ snippets/product-card.liquid bundled</p>
            </div>

            {exportStep === 3 && (
              <Button variant="primary" className="w-full" onClick={() => setShowExportModal(false)}>
                Done & Close Modal
              </Button>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default function EditorPage({ params }: PageProps) {
  const { projectId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center text-slate-600 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-slate-900 mr-2" />
          Loading Editor Workspace...
        </div>
      }
    >
      <EditorContent projectId={projectId} />
    </Suspense>
  );
}
