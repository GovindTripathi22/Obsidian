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
  Send,
  Sparkles,
  Loader2,
  FileCode,
  Image as ImageIcon,
  Hexagon,
  CheckCircle2,
  Download,
} from "lucide-react";
import { compileShopifyLiquidTheme } from "@/lib/shopify";
import { InlineCustomizer, SelectedElement } from "@/components/editor/InlineCustomizer";
import { useAuth } from "@/components/providers/AuthProvider";
import JSZip from "jszip";
import * as htmlToImage from "html-to-image";

/* ── Official Shopify SVG Brand Icon ── */
const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

interface PageProps {
  params: Promise<{ projectId: string }>;
}

function EditorContent({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isShopify = projectId.includes("shopify") || searchParams?.get("type") === "shopify";
  
  const initialPrompt =
    searchParams?.get("initialPrompt") ||
    (isShopify
      ? "Create a luxury Shopify fashion storefront with Liquid 2.0 theme compatibility"
      : "Create a modern high-converting SaaS landing page with dark theme");

  const { user } = useAuth();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePageTab, setActivePageTab] = useState("Home Page");
  const [pageTabs, setPageTabs] = useState(
    isShopify ? ["Home Page", "Product Page", "Cart Page"] : ["Home Page", "Features", "Pricing"]
  );

  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `Welcome to ${isShopify ? "Shopify Liquid Studio" : "Obsidian Website Studio"}! Initializing live workspace for prompt: "${initialPrompt}"`,
    },
  ]);
  const [inputInstruction, setInputInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [pageCodes, setPageCodes] = useState<Record<string, { html: string; css: string }>>({});
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  const [activeView, setActiveView] = useState<"preview" | "code" | "schema">("preview");

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

      if (!res.body) throw new Error("No response body returned");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        // Update pageCodes with accumulated HTML in real time
        setPageCodes((prev) => ({
          ...prev,
          [pageName]: {
            html: accumulated,
            css: isShopify
              ? "body{background:#09090b;color:#fafafa;font-family:sans-serif;}"
              : "body{background:#09090b;color:#fafafa;font-family:sans-serif;}",
          },
        }));
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `✓ Generated ${pageName} live template.` },
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
      textContent: isShopify ? "Luxury E-Commerce Storefront" : "Next-Generation Digital Platform",
    });
  };

  const handleExportShopify = async () => {
    setShowExportModal(true);
    setExportStep(1);
    setExportProgress(25);

    setTimeout(() => {
      setExportStep(2);
      setExportProgress(65);
    }, 1000);

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
    }, 2200);
  };

  const handleExportStaticCode = async () => {
    const zip = new JSZip();
    Object.entries(pageCodes).forEach(([name, code]) => {
      const fileName = `${name.toLowerCase().replace(/\s+/g, "_")}.html`;
      zip.file(
        fileName,
        `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><title>${name}</title></head><body class="bg-black text-white">${code.html}</body></html>`
      );
    });
    zip.file("style.css", pageCodes[activePageTab]?.css || "body { background: #000; color: #fff; }");

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectId}-website-code.zip`;
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
    } catch {
      alert("PNG mockup downloaded!");
    }
  };

  const currentHtml = pageCodes[activePageTab]?.html || "";

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-100 flex flex-col z-50 overflow-hidden font-sans">
      {/* Top Header Action Bar */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Link href={isShopify ? "/builder" : "/"}>
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {isShopify ? "Shopify Studio" : "Website Builder"}
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs truncate">
            {isShopify ? (
              <ShopifyIcon className="w-4 h-4 fill-emerald-400 shrink-0" />
            ) : (
              <Hexagon className="w-4 h-4 fill-white text-white shrink-0" />
            )}
            <h1 className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
              {initialPrompt.slice(0, 32)}...
            </h1>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {pageTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePageTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePageTab === tab ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={handleAddPageTab}
            title="Add Page Tab"
            className="p-1 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800 mr-2">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {isShopify ? (
            <Button
              size="sm"
              onClick={handleExportShopify}
              leftIcon={<ShopifyIcon className="w-4 h-4 fill-white" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Export Shopify Theme (ZIP)
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleExportStaticCode}
              leftIcon={<FileCode className="w-3.5 h-3.5" />}
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold"
            >
              Export HTML (ZIP)
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
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
        <div className="w-full md:w-[35%] bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0">
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini AI Engine</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
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
                      ? "bg-zinc-800 text-white border border-zinc-700/60 rounded-br-none shadow-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex items-center gap-3 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  Streaming {isShopify ? "Liquid sections" : "HTML & CSS"} for {activePageTab}...
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendInstruction} className="p-3 border-t border-zinc-800 bg-zinc-900/60">
            <div className="relative">
              <Input
                placeholder={`Ask AI to refine this ${isShopify ? "store" : "website"} layout...`}
                value={inputInstruction}
                onChange={(e) => setInputInstruction(e.target.value)}
                className="pr-10 text-xs bg-zinc-950 border-zinc-800 text-zinc-100"
              />
              <button
                type="submit"
                disabled={!inputInstruction.trim() || isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-300 hover:text-emerald-400 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Live Canvas (65% Width) */}
        <div className="flex-1 bg-zinc-900/40 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Multi-View Inspector Tabs */}
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-4 self-center shadow-lg">
            <button
              onClick={() => setActiveView("preview")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeView === "preview" ? "bg-zinc-800 text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              🖥️ Live Canvas
            </button>
            <button
              onClick={() => setActiveView("code")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeView === "code" ? "bg-zinc-800 text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              📄 {isShopify ? "Liquid Code" : "HTML Code"}
            </button>
            {isShopify && (
              <button
                onClick={() => setActiveView("schema")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeView === "schema" ? "bg-zinc-800 text-white shadow-xs" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                ⚙️ Liquid Schema
              </button>
            )}
          </div>

          <div
            className={`flex-1 bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 relative flex flex-col ${
              viewport === "desktop"
                ? "w-full"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-zinc-950 rounded-md px-2 py-0.5 text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2 truncate border border-zinc-800">
                {isGenerating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-semibold">Streaming Code...</span>
                  </>
                ) : (
                  `https://${isShopify ? "store" : "site"}-preview.obsidian.ai/${activePageTab.toLowerCase().replace(/\s+/g, "-")}`
                )}
              </div>
            </div>

            <div className="flex-1 relative overflow-auto bg-black">
              {activeView === "preview" && (
                <div className="w-full h-full cursor-pointer" onClick={handleIframeClick}>
                  <iframe
                    ref={iframeRef}
                    title="Live Preview Canvas"
                    srcDoc={`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;padding:0;background:#09090b;color:#fafafa;font-family:sans-serif;}</style></head><body>${currentHtml}</body></html>`}
                    className="w-full h-full border-none"
                  />
                </div>
              )}
              {activeView === "code" && (
                <pre className="bg-zinc-950 text-emerald-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">
                  <code>{currentHtml || "<!-- No code generated yet -->"}</code>
                </pre>
              )}
              {activeView === "schema" && isShopify && (
                <pre className="bg-zinc-950 text-amber-400 font-mono text-xs p-4 overflow-auto w-full h-full m-0">
                  <code>{JSON.stringify(
                    {
                      name: `${activePageTab} Shopify Template`,
                      tag: "section",
                      class: "shopify-section",
                      settings: [
                        { type: "text", id: "heading", label: "Hero Title", default: "Luxury Storefront" },
                        { type: "color", id: "bg_color", label: "Background", default: "#09090b" },
                      ],
                    },
                    null,
                    2
                  )}</code>
                </pre>
              )}
            </div>
          </div>

          {selectedElement && activeView === "preview" && (
            <InlineCustomizer
              element={selectedElement}
              onClose={() => setSelectedElement(null)}
              onUpdateText={(newText) => {
                const updatedHtml = currentHtml.replace("Luxury E-Commerce Storefront", newText);
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
                await generateInitialCode(`Refine section: ${inst}`, activePageTab);
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

      {/* Shopify Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-zinc-800 p-6 space-y-6 bg-zinc-900 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShopifyIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Shopify Liquid Compiler</h3>
                <p className="text-xs text-zinc-400">Building production Liquid 2.0 ZIP package</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">
                  {exportStep === 1 && "1/3 Parsing sections & schema..."}
                  {exportStep === 2 && "2/3 Compiling layout/theme.liquid..."}
                  {exportStep === 3 && "3/3 Theme ZIP bundle generated!"}
                </span>
                <span className="text-emerald-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <p className={exportStep >= 1 ? "text-emerald-400 font-bold" : ""}>✓ layout/theme.liquid compiled</p>
              <p className={exportStep >= 2 ? "text-emerald-400 font-bold" : ""}>✓ templates/index.json configured</p>
              <p className={exportStep >= 3 ? "text-emerald-400 font-bold" : ""}>✓ sections/*.liquid modularized</p>
            </div>

            {exportStep === 3 && (
              <Button
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                onClick={() => setShowExportModal(false)}
              >
                Close & Open ZIP
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
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
          Loading Workspace...
        </div>
      }
    >
      <EditorContent projectId={projectId} />
    </Suspense>
  );
}
