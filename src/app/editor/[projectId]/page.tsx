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
  RotateCcw,
  Sliders,
  Palette,
  MessageSquare,
  Zap,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Wand2,
  SlidersHorizontal,
  Code2,
  Compass,
  X,
  FileText,
  Trash2,
} from "lucide-react";
import { compileShopifyLiquidTheme } from "@/lib/shopify";
import { UserButton } from "@/components/auth/UserButton";
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

const COLOR_THEMES = [
  { name: "Monochrome Noir", primary: "#ffffff", bg: "#000000", accent: "from-white via-neutral-200 to-neutral-400", label: "Pure Monochrome (Default)" },
  { name: "Silver Frost", primary: "#e4e4e7", bg: "#09090b", accent: "from-neutral-100 to-neutral-400", label: "Frosted Silver" },
  { name: "Titanium Slate", primary: "#a1a1aa", bg: "#09090b", accent: "from-neutral-300 to-neutral-600", label: "Brushed Titanium" },
  { name: "Obsidian Carbon", primary: "#71717a", bg: "#050505", accent: "from-neutral-400 to-neutral-800", label: "Deep Carbon" },
  { name: "Liquid Platinum", primary: "#f4f4f5", bg: "#0c0c0e", accent: "from-white to-neutral-500", label: "Liquid Platinum" },
];

const COMPONENT_BLOCKS = [
  { name: "Hero Section with CTA", desc: "Large bold headline, glowing action buttons, and social proof logos", icon: "🚀", prompt: "Add a high-converting hero section with large tracked typography, dual CTA buttons with ambient glow, and trusted company badges." },
  { name: "Bento Feature Grid", desc: "3x3 asymmetric feature layout with glassmorphic cards and micro-animations", icon: "⬡", prompt: "Add a modern bento box grid displaying 4 core product capabilities with frosted glass cards and subtle borders." },
  { name: "Pricing Comparison Table", desc: "3-tier pricing matrix with monthly/annual toggle and highlighted Pro plan", icon: "💳", prompt: "Add a clean 3-tier pricing table (Starter, Pro, Enterprise) with feature checkmarks and a recommended badge." },
  { name: "Customer Testimonials", desc: "Social proof cards with 5-star ratings, avatars, and verified badges", icon: "⭐", prompt: "Add a luxury testimonial slider or grid with client headshots, company names, and 5-star rating stars." },
  { name: "Interactive FAQ Accordion", desc: "Clean expandable questions and answers with smooth chevron toggle", icon: "❓", prompt: "Add an expandable FAQ accordion section covering pricing, deployment, and onboarding." },
  { name: "High-Impact Footer", desc: "Navigation links, newsletter subscription, copyright, and social icons", icon: "⚓", prompt: "Add a comprehensive dark theme footer with newsletter capture form, 4-column navigation, and social links." },
];

const PAGE_TEMPLATES = [
  { title: "About Us", desc: "Company story, team grid, mission statement & timeline", icon: "🏢" },
  { title: "Product Catalog", desc: "Filtered collection grid with quick-add cards & sorting", icon: "🛍️" },
  { title: "Contact & FAQ", desc: "Contact inquiry form, support channels & expandable FAQ", icon: "📞" },
  { title: "Lookbook Gallery", desc: "High-res editorial masonry photo grid & video showcase", icon: "📸" },
];

export function EditorContent({ projectId }: { projectId: string }) {
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

  // Add Page Modal
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [customPageName, setCustomPageName] = useState("");

  // Left Panel Sub-tab: 'chat' | 'blocks' | 'theme' | 'actions'
  const [sidebarTab, setSidebarTab] = useState<"chat" | "blocks" | "theme" | "actions">("chat");
  const [activeTheme, setActiveTheme] = useState(COLOR_THEMES[0]);

  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; time?: string }>>([
    {
      role: "assistant",
      content: `Welcome to ${isShopify ? "Shopify Liquid Studio" : "Obsidian Website Studio"}! Live workspace initialized for prompt: "${initialPrompt}"`,
      time: "Just now",
    },
  ]);
  const [inputInstruction, setInputInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState<number | null>(null);

  const [pageCodes, setPageCodes] = useState<Record<string, { html: string; css: string }>>({});
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  const [activeView, setActiveView] = useState<"preview" | "code" | "schema">("preview");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateInitialCode(initialPrompt, activePageTab);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isGenerating]);

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
            css: `body{background:${activeTheme.bg};color:#fafafa;font-family:sans-serif;}`,
          },
        }));
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✓ ${pageName} live layout synthesized and compiled successfully.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendInstruction = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputInstruction;
    if (!textToSend.trim() || isGenerating) return;

    setInputInstruction("");
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: textToSend,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setIsGenerating(true);
    await generateInitialCode(`${initialPrompt}. Additional refinement instruction for ${activePageTab}: ${textToSend}`, activePageTab);
  };

  const handleApplyTheme = async (theme: typeof COLOR_THEMES[0]) => {
    setActiveTheme(theme);
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `Apply ${theme.name} palette`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    await handleSendInstruction(
      undefined,
      `Update the color theme to ${theme.name} with primary accent ${theme.primary} and dark background ${theme.bg}.`
    );
  };

  const handleEnhancePrompt = async () => {
    if (!inputInstruction.trim() || isEnhancing) return;
    const original = inputInstruction;
    setIsEnhancing(true);
    setInputInstruction("✨ Enhancing instruction with AI...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Expand this design refinement instruction into a precise, high-impact web design requirement: "${original}"`,
          projectId: "enhance-instruction",
          pageName: "refine",
        }),
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let enhanced = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          enhanced += decoder.decode(value, { stream: true });
        }
        setInputInstruction(enhanced.trim() || original);
      } else {
        setInputInstruction(original);
      }
    } catch {
      setInputInstruction(original);
    } finally {
      setIsEnhancing(false);
    }
  };

  // ── Zero-Token Fast Page Creation ──
  const handleCreatePage = (title: string) => {
    const finalTitle = title.trim();
    if (!finalTitle || pageTabs.includes(finalTitle)) {
      setShowAddPageModal(false);
      return;
    }

    const defaultScaffold = `
<header class="bg-[#0a0a0a]/90 border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
  <div class="flex items-center gap-2 font-semibold text-white">
    <span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-glow-white"></span>
    <span>${finalTitle}</span>
  </div>
  <a href="#home" class="text-xs font-medium text-neutral-400 hover:text-white">← Return Home</a>
</header>
<section class="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-700 text-xs font-medium">
    ✨ ${finalTitle} Overview
  </span>
  <h1 class="text-4xl sm:text-5xl font-semibold text-white">${finalTitle}</h1>
  <p class="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
    This page was created with 0 tokens. Use the AI Assistant on the left panel to synthesize custom content, grids, or interactive forms whenever you are ready.
  </p>
  <div class="p-8 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 text-center space-y-3">
    <p class="text-xs text-neutral-500">Ready for AI Customization</p>
    <button onclick="window.parent.postMessage('openChat', '*')" class="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs transition-all shadow-md shadow-white/5">
      Prompt AI to Design This Page →
    </button>
  </div>
</section>
<footer class="py-12 px-6 border-t border-neutral-800 bg-[#0a0a0a] text-center text-xs text-neutral-500">
  <p>© 2026 Powered by Obsidian AI Studio.</p>
</footer>
`;

    setPageCodes((prev) => ({
      ...prev,
      [finalTitle]: {
        html: defaultScaffold,
        css: `body{background:${activeTheme.bg};color:#fafafa;font-family:sans-serif;}`,
      },
    }));

    setPageTabs((prev) => [...prev, finalTitle]);
    setActivePageTab(finalTitle);
    setShowAddPageModal(false);
    setCustomPageName("");

    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `✓ Added new page "${finalTitle}" with 0 token consumption. You can now prompt me on the left to synthesize its layout!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleDeletePageTab = (e: React.MouseEvent, tabName: string) => {
    e.stopPropagation();
    if (pageTabs.length <= 1) return;
    const remaining = pageTabs.filter((t) => t !== tabName);
    setPageTabs(remaining);
    if (activePageTab === tabName) {
      setActivePageTab(remaining[0]);
    }
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        role: "assistant",
        content: `Chat session reset. Ready for new design instructions for ${activePageTab}.`,
        time: "Just now",
      },
    ]);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(index);
    setTimeout(() => setCopiedMsg(null), 2000);
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

  const quickPillActions = isShopify
    ? [
        { label: "🛍️ Add Sticky Cart Drawer", prompt: "Add a modern sticky slide-out cart drawer with dynamic subtotal calculations and checkout button." },
        { label: "⚡ Add Announcement Ticker", prompt: "Add a high-contrast top announcement banner ticker with free shipping threshold and discount promo code." },
        { label: "⭐ Add Customer Reviews", prompt: "Add a luxury customer reviews grid with 5-star ratings, verified buyer badges, and avatar photos." },
        { label: "🏷️ Add Discount Badges", prompt: "Add prominent '20% OFF' and 'Best Seller' glowing badges to the featured product cards." },
        { label: "🔒 Add Trust & Security Bar", prompt: "Add a trust badges strip with 256-bit SSL encryption, 30-day money back guarantee, and free worldwide shipping." },
      ]
    : [
        { label: "🚀 Add Glowing Hero CTA", prompt: "Add an energetic pulsing glow animation to the primary hero call-to-action button." },
        { label: "💎 Add Frosted Glass Cards", prompt: "Convert feature containers to backdrop-blur frosted glass cards with subtle 1px borders." },
        { label: "📊 Add 3-Tier Pricing Table", prompt: "Add a responsive 3-column pricing comparison matrix with highlighted popular tier." },
        { label: "❓ Add FAQ Accordion", prompt: "Add a modern expandable FAQ accordion section covering pricing, security, and onboarding." },
        { label: "💬 Add Testimonials Grid", prompt: "Add social proof testimonials with customer quotes, company logos, and 5-star ratings." },
      ];

  const currentHtml = pageCodes[activePageTab]?.html || "";

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-neutral-100 flex flex-col z-50 overflow-hidden font-sans">
      {/* Top Header Action Bar */}
      <header className="h-14 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Link href={isShopify ? "/builder" : "/"}>
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {isShopify ? "Shopify Studio" : "Website Builder"}
            </Button>
          </Link>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs truncate">
            {isShopify ? (
              <ShopifyIcon className="w-4 h-4 fill-white text-white shrink-0" />
            ) : (
              <Hexagon className="w-4 h-4 fill-white text-white shrink-0" />
            )}
            <h1 className="text-xs sm:text-sm font-medium text-neutral-100 truncate">
              {initialPrompt.slice(0, 32)}...
            </h1>
          </div>
        </div>

        {/* Page Tabs with Zero-Token Adding */}
        <div className="hidden md:flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-xl border border-neutral-800">
          {pageTabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActivePageTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer group ${
                activePageTab === tab ? "bg-neutral-800 text-white shadow-sm font-medium" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>{tab}</span>
              {pageTabs.length > 1 && tab !== "Home Page" && (
                <button
                  onClick={(e) => handleDeletePageTab(e, tab)}
                  title={`Delete ${tab}`}
                  className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setShowAddPageModal(true)}
            title="Add Page (0 Tokens)"
            className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-1 px-2 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px]">Add Page</span>
          </button>
        </div>

        {/* Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center bg-[#0a0a0a] rounded-xl p-1 border border-neutral-800 mr-2">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "desktop" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "tablet" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${viewport === "mobile" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
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
              className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium shadow-md shadow-white/5"
            >
              Export Shopify (ZIP)
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleExportStaticCode}
              leftIcon={<FileCode className="w-3.5 h-3.5" />}
              className="bg-white text-neutral-950 hover:bg-neutral-200 font-medium"
            >
              Export Code (ZIP)
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

          <div className="ml-1 pl-2 border-l border-neutral-800 hidden sm:block">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Split Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Panel: Enhanced AI Workspace Assistant (32% Width) ── */}
        <div className="w-full md:w-[38%] lg:w-[32%] bg-[#0a0a0a] border-r border-neutral-800 flex flex-col justify-between shrink-0 font-sans">
          {/* Top Panel Bar */}
          <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">AI Assistant</h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-glow-white" />
                  Gemini 2.5
                </span>
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Minimalist Sub-Tabs */}
            <div className="grid grid-cols-4 bg-[#0a0a0a] p-0.5 rounded-xl border border-neutral-800 text-[10px] font-medium">
              <button
                onClick={() => setSidebarTab("chat")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "chat"
                    ? "bg-neutral-800 text-white shadow-xs font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <MessageSquare className={`w-3 h-3 ${sidebarTab === "chat" ? "text-white" : "text-neutral-400"}`} />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setSidebarTab("actions")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "actions"
                    ? "bg-neutral-800 text-white shadow-xs font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Zap className={`w-3 h-3 ${sidebarTab === "actions" ? "text-white" : "text-neutral-400"}`} />
                <span>Fixes</span>
              </button>
              <button
                onClick={() => setSidebarTab("blocks")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "blocks"
                    ? "bg-neutral-800 text-white shadow-xs font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Layers className={`w-3 h-3 ${sidebarTab === "blocks" ? "text-white" : "text-neutral-400"}`} />
                <span>Blocks</span>
              </button>
              <button
                onClick={() => setSidebarTab("theme")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  sidebarTab === "theme"
                    ? "bg-neutral-800 text-white shadow-xs font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Palette className={`w-3 h-3 ${sidebarTab === "theme" ? "text-white" : "text-neutral-400"}`} />
                <span>Theme</span>
              </button>
            </div>
          </div>

          {/* Sub-tab 1: Conversation Stream */}
          {sidebarTab === "chat" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 text-xs leading-relaxed ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 space-y-1.5 shadow-sm ${
                      msg.role === "user"
                        ? "bg-white text-black rounded-br-none"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] text-neutral-500">
                      <span>{msg.time || "Active"}</span>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopyMessage(msg.content, i)}
                          className="hover:text-white flex items-center gap-1"
                        >
                          {copiedMsg === i ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedMsg === i ? "Copied" : "Copy"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-xs text-neutral-200 font-medium">
                    Streaming live updates for {activePageTab}...
                  </span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}

          {/* Sub-tab 2: 1-Click Quick Fixes & Tweaks */}
          {sidebarTab === "actions" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium px-1">
                Quick Actions
              </p>
              {quickPillActions.map((action, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, action.prompt)}
                  className="w-full p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-left transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-white group-hover:text-neutral-200 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{action.prompt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Sub-tab 3: Section Library Blocks */}
          {sidebarTab === "blocks" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium px-1">
                Component Blocks
              </p>
              {COMPONENT_BLOCKS.map((block, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, block.prompt)}
                  className="w-full p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-left transition-all flex items-start gap-2.5 group cursor-pointer disabled:opacity-50"
                >
                  <span className="text-lg shrink-0 mt-0.5">{block.icon}</span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white group-hover:text-neutral-200 transition-colors">
                        {block.name}
                      </p>
                      <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{block.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Sub-tab 4: Theme Palette Tokens */}
          {sidebarTab === "theme" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium px-1">
                Color Themes
              </p>
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  disabled={isGenerating}
                  onClick={() => handleApplyTheme(theme)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                    activeTheme.name === theme.name
                      ? "bg-neutral-900 border-white ring-1 ring-white/20 shadow-md"
                      : "bg-[#0a0a0a]/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div>
                      <p className="text-xs font-medium text-white">{theme.name}</p>
                      <p className="text-[10px] text-neutral-400">{theme.label}</p>
                    </div>
                  </div>
                  {activeTheme.name === theme.name && (
                    <Check className="w-4 h-4 text-white shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quick Action Suggestion Chips Bar */}
          <div className="px-3 pt-2 pb-1 border-t border-neutral-800/80 bg-neutral-900/40">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              {quickPillActions.slice(0, 3).map((pill, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => handleSendInstruction(undefined, pill.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-[10px] font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Prompt Input Form */}
          <form onSubmit={(e) => handleSendInstruction(e)} className="p-3 border-t border-neutral-800 bg-neutral-900/90">
            <div className="relative">
              <textarea
                rows={2}
                placeholder={`Ask AI to refine this ${isShopify ? "store" : "page"} (e.g. 'Add a 3-tier pricing matrix')...`}
                value={inputInstruction}
                onChange={(e) => setInputInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendInstruction(e);
                  }
                }}
                className="w-full rounded-xl bg-[#0a0a0a] border border-neutral-800 p-3 pr-20 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-400 focus:ring-1 focus:ring-white/20 focus:outline-none resize-none font-medium"
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  title="Enhance prompt with AI"
                  disabled={!inputInstruction.trim() || isEnhancing}
                  onClick={handleEnhancePrompt}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                </button>

                <button
                  type="submit"
                  disabled={!inputInstruction.trim() || isGenerating}
                  className="p-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 disabled:opacity-40 transition-colors cursor-pointer shadow-md shadow-white/5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Right Panel: Live Canvas & Code Inspector (68% Width) ── */}
        <div className="flex-1 bg-neutral-900/40 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Multi-View Inspector Tabs */}
          <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 mb-4 self-center shadow-lg">
            <button
              onClick={() => setActiveView("preview")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeView === "preview" ? "bg-neutral-800 text-white shadow-xs font-medium" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              🖥️ Live Canvas
            </button>
            <button
              onClick={() => setActiveView("code")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeView === "code" ? "bg-neutral-800 text-white shadow-xs font-medium" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              📄 {isShopify ? "Liquid Code" : "HTML Code"}
            </button>
            {isShopify && (
              <button
                onClick={() => setActiveView("schema")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeView === "schema" ? "bg-neutral-800 text-white shadow-xs font-medium" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                ⚙️ Liquid Schema
              </button>
            )}
          </div>

          <div
            className={`flex-1 bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 relative flex flex-col ${
              viewport === "desktop"
                ? "w-full"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center px-3 gap-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-[#0a0a0a] rounded-md px-2 py-0.5 text-[10px] text-neutral-400 flex items-center justify-center gap-2 truncate border border-neutral-800">
                {isGenerating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-glow-white" />
                    <span className="text-white font-semibold">Streaming Code...</span>
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
                    srcDoc={`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;padding:0;background:${activeTheme.bg};color:#fafafa;font-family:sans-serif;}</style></head><body>${currentHtml}</body></html>`}
                    className="w-full h-full border-none"
                  />
                </div>
              )}
              {activeView === "code" && (
                <pre className="bg-[#0a0a0a] text-neutral-200 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-neutral-800">
                  <code>{currentHtml || "<!-- No code generated yet -->"}</code>
                </pre>
              )}
              {activeView === "schema" && isShopify && (
                <pre className="bg-[#0a0a0a] text-neutral-300 font-mono text-xs p-4 overflow-auto w-full h-full m-0 selection:bg-neutral-800">
                  <code>{JSON.stringify(
                    {
                      name: `${activePageTab} Shopify Template`,
                      tag: "section",
                      class: "shopify-section",
                      settings: [
                        { type: "text", id: "heading", label: "Hero Title", default: "Luxury Storefront" },
                        { type: "color", id: "bg_color", label: "Background", default: activeTheme.bg },
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

      {/* ── Add Page Modal (0 Tokens Consumed) ── */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-base text-white">Add New Page</h3>
              </div>
              <button
                onClick={() => setShowAddPageModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Create a new page tab with <strong>0 tokens consumed</strong>. Choose a template or enter a custom name.
            </p>

            {/* Ready Templates */}
            <div className="grid grid-cols-2 gap-2.5">
              {PAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => handleCreatePage(tmpl.title)}
                  className="p-3 rounded-xl border border-neutral-800 bg-[#0a0a0a]/80 hover:border-neutral-600 hover:bg-neutral-800 text-left transition-all group cursor-pointer space-y-1"
                >
                  <span className="text-xl">{tmpl.icon}</span>
                  <p className="text-xs font-medium text-white group-hover:text-neutral-200 transition-colors">
                    {tmpl.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 line-clamp-1">{tmpl.desc}</p>
                </button>
              ))}
            </div>

            {/* Custom Name */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-[11px] font-medium text-neutral-400">Custom Page Name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. FAQ, Lookbook, Case Studies..."
                  value={customPageName}
                  onChange={(e) => setCustomPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customPageName.trim()) {
                      handleCreatePage(customPageName);
                    }
                  }}
                  className="bg-[#0a0a0a] border-neutral-800 text-xs py-2 text-white"
                />
                <Button
                  size="sm"
                  disabled={!customPageName.trim()}
                  onClick={() => handleCreatePage(customPageName)}
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-4 shadow-md shadow-white/5"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopify Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-neutral-800 p-6 space-y-6 bg-neutral-900 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
                <ShopifyIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Shopify Liquid Compiler</h3>
                <p className="text-xs text-neutral-400">Building production Liquid 2.0 ZIP package</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-medium">
                  {exportStep === 1 && "1/3 Parsing sections & schema..."}
                  {exportStep === 2 && "2/3 Compiling layout/theme.liquid..."}
                  {exportStep === 3 && "3/3 Theme ZIP bundle generated!"}
                </span>
                <span className="text-white font-medium">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-neutral-600 via-neutral-300 to-white transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-400 bg-[#0a0a0a] p-3 rounded-xl border border-neutral-800">
              <p className={exportStep >= 1 ? "text-white font-medium" : ""}>✓ layout/theme.liquid compiled</p>
              <p className={exportStep >= 2 ? "text-white font-medium" : ""}>✓ templates/index.json configured</p>
              <p className={exportStep >= 3 ? "text-white font-medium" : ""}>✓ sections/*.liquid modularized</p>
            </div>

            {exportStep === 3 && (
              <Button
                variant="primary"
                className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-medium shadow-md shadow-white/5"
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
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center text-neutral-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
          Loading Workspace...
        </div>
      }
    >
      <EditorContent projectId={projectId} />
    </Suspense>
  );
}
