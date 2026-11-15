"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Image as ImageIcon,
  Wand2,
  X,
  Layers,
  Check,
  Film,
  Undo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
} from "lucide-react";

export interface SelectedElement {
  sectionId: string;
  tagName: string;
  textContent: string;
  imgSrc?: string;
  nodeIndex?: number;
  sectionIndex?: number;
  href?: string;
  inlineStyle?: {
    color?: string;
    backgroundColor?: string;
    textAlign?: string;
    fontSize?: string;
  };
}

interface InlineCustomizerProps {
  element: SelectedElement;
  canUndo?: boolean;
  onUndo?: () => void;
  onClose: () => void;
  onLivePatch?: (patch: { text?: string; styles?: Record<string, string> }) => void;
  onUpdateText: (newText: string, href?: string) => void;
  onUpdateStyle: (styles: Record<string, string>, href?: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAIRefine: (instruction: string) => void;
  onImageTransform: (transformString: string, newSrc?: string) => void;
}

const TEXT_COLOR_SWATCHES = [
  { label: "White", value: "#ffffff" },
  { label: "Silver", value: "#d4d4d8" },
  { label: "Violet", value: "#c084fc" },
  { label: "Cyan", value: "#22d3ee" },
  { label: "Emerald", value: "#34d399" },
  { label: "Amber", value: "#fbbf24" },
  { label: "Rose", value: "#fb7185" },
  { label: "Dark", value: "#09090b" },
];

const BG_FILL_SWATCHES = [
  { label: "Clear", value: "" },
  { label: "Obsidian", value: "#09090b" },
  { label: "Slate", value: "#18181b" },
  { label: "Violet Tint", value: "rgba(139, 92, 246, 0.16)" },
  { label: "Cyan Tint", value: "rgba(6, 182, 212, 0.16)" },
  { label: "Emerald Tint", value: "rgba(16, 185, 129, 0.16)" },
];

const STUDIO_IMAGES = [
  { label: "Tokyo 3D", url: "/images/parallax-tokyo.jpg" },
  { label: "NYC Skyline", url: "/images/parallax-nyc.jpg" },
  { label: "Swiss Alps", url: "/images/parallax-alps.jpg" },
  { label: "Skincare", url: "/images/product-skincare.jpg" },
  { label: "Streetwear", url: "/images/product-streetwear.jpg" },
  { label: "Audio", url: "/images/product-audio.jpg" },
  { label: "Roastery", url: "/images/product-coffee.jpg" },
];

export const InlineCustomizer: React.FC<InlineCustomizerProps> = ({
  element,
  canUndo = false,
  onUndo,
  onClose,
  onLivePatch,
  onUpdateText,
  onUpdateStyle,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAIRefine,
  onImageTransform,
}) => {
  const isClickedImage = element.tagName.toLowerCase() === "img";
  const [activeTab, setActiveTab] = useState<"text" | "style" | "image" | "block">(
    isClickedImage ? "image" : "text"
  );
  const [textVal, setTextVal] = useState(element.textContent || "");
  const [linkVal, setLinkVal] = useState(element.href || "");
  const [customImgUrl, setCustomImgUrl] = useState(element.imgSrc || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const elementSignature = `${element.sectionId}|${element.sectionIndex ?? 0}|${element.tagName}|${element.nodeIndex ?? 0}|${element.textContent}|${element.imgSrc || ""}|${element.href || ""}`;
  const [prevSignature, setPrevSignature] = useState(elementSignature);

  // Sync internal form state whenever user clicks a different element or commits inline canvas edits
  if (elementSignature !== prevSignature) {
    setPrevSignature(elementSignature);
    setTextVal(element.textContent || "");
    setLinkVal(element.href || "");
    setCustomImgUrl(element.imgSrc || "");
    if (element.tagName.toLowerCase() === "img") {
      setActiveTab("image");
    }
  }

  const flashNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const handleTextChange = (next: string) => {
    setTextVal(next);
    onLivePatch?.({ text: next });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVal.trim()) return;
    onUpdateText(textVal, linkVal || undefined);
    flashNotice("✓ Text saved to page HTML");
  };

  const handleApplyInlineStyle = (styles: Record<string, string>) => {
    onLivePatch?.({ styles });
    onUpdateStyle(styles, linkVal || undefined);
    flashNotice("✓ Style applied");
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    await onAIRefine(aiPrompt);
    setIsAiLoading(false);
    setAiPrompt("");
    flashNotice("✓ Section refined with AI");
  };

  const handleApplyImageTransform = (transform: string) => {
    onImageTransform(transform);
    flashNotice("✓ Image effect applied");
  };

  const handleGenerateNewImage = async () => {
    if (!imagePrompt.trim() || isMediaLoading) return;
    setIsMediaLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/media/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      if (res.ok) {
        const data = (await res.json()) as { imageUrl?: string };
        if (data.imageUrl) {
          onImageTransform("", data.imageUrl);
          setCustomImgUrl(data.imageUrl);
          flashNotice("✓ Studio asset synthesized & applied");
        }
      }
    } catch {
      onImageTransform("", "/images/parallax-tokyo.jpg");
    } finally {
      setIsMediaLoading(false);
    }
  };

  const handleGenerateVideoLayer = async () => {
    setIsMediaLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/media/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt || element.textContent || "Atmospheric parallax motion",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { videoUrl?: string };
        if (data.videoUrl) {
          await onAIRefine(
            `Embed a cinematic ambient background video reel (${data.videoUrl}) into this section.`
          );
          flashNotice("✓ 60fps motion video layer embedded");
        }
      }
    } finally {
      setIsMediaLoading(false);
    }
  };

  return (
    <Card
      data-testid="inline-customizer-panel"
      className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-zinc-950/95 border border-zinc-700/80 backdrop-blur-2xl text-zinc-100 shadow-2xl rounded-2xl ring-1 ring-white/15 space-y-3.5 p-4 animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="w-4 h-4 text-violet-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Inline Editor:</span>
              <code className="text-violet-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[10px] lowercase truncate max-w-[110px]">
                {element.sectionId}
              </code>
              <code className="text-cyan-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[10px] lowercase">
                &lt;{element.tagName}&gt;
              </code>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canUndo && onUndo && (
            <button
              type="button"
              onClick={onUndo}
              data-testid="inline-undo-btn"
              title="Undo last inline edit"
              className="text-zinc-300 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inline editor"
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px] font-semibold">
        {(
          [
            { id: "text", label: "Text" },
            { id: "style", label: "Style" },
            { id: "image", label: "Media" },
            { id: "block", label: "Block & AI" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-testid={`inline-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TEXT & LINK */}
      {activeTab === "text" && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-zinc-400 font-semibold">
              Live Element Text
            </label>
            <span className="text-[10px] text-zinc-500">Double-click canvas text to type directly</span>
          </div>
          <textarea
            data-testid="inline-text-input"
            value={textVal}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 focus:outline-none resize-none font-medium"
          />

          {(element.tagName.toLowerCase() === "a" || typeof element.href === "string") && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                <span>Link Target URL (href)</span>
              </label>
              <Input
                data-testid="inline-href-input"
                value={linkVal}
                onChange={(e) => setLinkVal(e.target.value)}
                placeholder="https://... or #pricing"
                className="bg-zinc-900 border-zinc-800 text-xs text-white"
              />
            </div>
          )}

          <Button
            type="submit"
            size="sm"
            variant="primary"
            data-testid="inline-apply-text-btn"
            className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/5"
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Apply Text Update
          </Button>
        </form>
      )}

      {/* TAB 2: INLINE STYLE & COLOR CONTROLS */}
      {activeTab === "style" && (
        <div className="space-y-3 text-xs">
          {/* Text Color Swatches */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Text Color</span>
            <div className="flex flex-wrap gap-1.5">
              {TEXT_COLOR_SWATCHES.map((sw) => (
                <button
                  key={sw.label}
                  type="button"
                  title={sw.label}
                  data-testid={`inline-color-${sw.label.toLowerCase()}`}
                  onClick={() => handleApplyInlineStyle({ color: sw.value })}
                  className="w-6 h-6 rounded-full border border-zinc-600 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: sw.value }}
                />
              ))}
            </div>
          </div>

          {/* Background Fill */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Element / Section Fill</span>
            <div className="flex flex-wrap gap-1.5">
              {BG_FILL_SWATCHES.map((bg) => (
                <button
                  key={bg.label}
                  type="button"
                  onClick={() => handleApplyInlineStyle({ "background-color": bg.value })}
                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-white text-[10px] text-zinc-200 cursor-pointer flex items-center gap-1"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-zinc-600"
                    style={{ backgroundColor: bg.value || "transparent" }}
                  />
                  <span>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alignment + Font Scale */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/70">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Align</span>
              <div className="flex gap-1">
                {(
                  [
                    { val: "left", icon: AlignLeft },
                    { val: "center", icon: AlignCenter },
                    { val: "right", icon: AlignRight },
                  ] as const
                ).map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.val}
                      type="button"
                      onClick={() => handleApplyInlineStyle({ "text-align": a.val })}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-500 flex items-center justify-center text-zinc-200 cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Size</span>
              <div className="flex gap-1">
                {[
                  { label: "S", val: "0.875rem" },
                  { label: "M", val: "1.125rem" },
                  { label: "L", val: "2rem" },
                  { label: "XL", val: "3.25rem" },
                ].map((sz) => (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => handleApplyInlineStyle({ "font-size": sz.val })}
                    className="flex-1 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-[10px] font-mono text-zinc-200 cursor-pointer"
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spacing & Reset */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/70">
            <div className="flex gap-1">
              {[
                { label: "Compact", val: "8px 16px" },
                { label: "Roomy", val: "24px 32px" },
              ].map((pd) => (
                <button
                  key={pd.label}
                  type="button"
                  onClick={() => handleApplyInlineStyle({ padding: pd.val })}
                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-[10px] text-zinc-300 cursor-pointer"
                >
                  {pd.label} Pad
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                handleApplyInlineStyle({
                  color: "",
                  "background-color": "",
                  "text-align": "",
                  "font-size": "",
                  padding: "",
                })
              }
              className="px-2 py-1 rounded-lg text-[10px] text-zinc-400 hover:text-white cursor-pointer"
            >
              Reset Styles
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STUDIO MEDIA & AI IMAGE SWAP (Always functional on any section) */}
      {activeTab === "image" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">
              Quick Studio Image Swap / Insert
            </span>
            <div className="flex flex-wrap gap-1">
              {STUDIO_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    onImageTransform("", img.url);
                    setCustomImgUrl(img.url);
                    flashNotice(`✓ Applied ${img.label} photo`);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] border cursor-pointer transition-colors ${
                    customImgUrl === img.url
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Image URL + Visual Effects */}
          <div className="flex gap-1.5">
            <Input
              placeholder="Image URL (/images/... or https://...)"
              value={customImgUrl}
              onChange={(e) => setCustomImgUrl(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-xs text-white"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (customImgUrl.trim()) {
                  onImageTransform("", customImgUrl.trim());
                  flashNotice("✓ Image URL updated");
                }
              }}
            >
              Set
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:bg-remove")}
              className="text-[10px] px-2"
            >
              Contrast
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:drop-shadow")}
              className="text-[10px] px-2"
            >
              Glow Shadow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:reset")}
              className="text-[10px] px-2"
            >
              Reset FX
            </Button>
          </div>

          <div className="border-t border-zinc-800/80 pt-2.5 space-y-2">
            <Input
              placeholder="AI Generate image or video (e.g. cyber watch, neon sky)..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-zinc-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="primary"
                isLoading={isMediaLoading}
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold"
                onClick={handleGenerateNewImage}
                leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
              >
                Gen Image
              </Button>
              <Button
                size="sm"
                variant="outline"
                isLoading={isMediaLoading}
                className="w-full"
                onClick={handleGenerateVideoLayer}
                leftIcon={<Film className="w-3.5 h-3.5" />}
              >
                Gen Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECTION STRUCTURE & GEMINI AI REFINEMENT */}
      {activeTab === "block" && (
        <div className="space-y-3.5 text-xs">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase text-zinc-400 font-semibold">
              Section Ordering & Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                data-testid="inline-move-up-btn"
                onClick={() => {
                  onMoveUp();
                  flashNotice("✓ Section moved up");
                }}
                leftIcon={<ArrowUp className="w-3.5 h-3.5" />}
              >
                Move Up
              </Button>
              <Button
                size="sm"
                variant="outline"
                data-testid="inline-move-down-btn"
                onClick={() => {
                  onMoveDown();
                  flashNotice("✓ Section moved down");
                }}
                leftIcon={<ArrowDown className="w-3.5 h-3.5" />}
              >
                Move Down
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="secondary"
                data-testid="inline-duplicate-btn"
                onClick={() => {
                  onDuplicate();
                  flashNotice("✓ Section duplicated");
                }}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Duplicate
              </Button>
              <Button
                size="sm"
                variant="danger"
                data-testid="inline-delete-btn"
                onClick={onDelete}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Block
              </Button>
            </div>
          </div>

          <form onSubmit={handleAiSubmit} className="space-y-2 pt-2.5 border-t border-zinc-800/80">
            <label className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold">
              AI Targeted Section Refinement
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Add 3 glowing glassmorphic metric cards or rewrite headline..."
              rows={2}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none resize-none"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold"
              isLoading={isAiLoading}
              leftIcon={<Wand2 className="w-3.5 h-3.5" />}
            >
              Refine Section with AI
            </Button>
          </form>
        </div>
      )}

      {notice && (
        <p data-testid="inline-editor-notice" className="text-[11px] font-mono text-emerald-400 text-center pt-1">
          {notice}
        </p>
      )}
    </Card>
  );
};
