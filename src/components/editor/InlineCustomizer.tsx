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
  Sparkles,
  Image as ImageIcon,
  Wand2,
  X,
  Layers,
  Check,
} from "lucide-react";

export interface SelectedElement {
  sectionId: string;
  tagName: string;
  textContent: string;
  imgSrc?: string;
}

interface InlineCustomizerProps {
  element: SelectedElement;
  onClose: () => void;
  onUpdateText: (newText: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAIRefine: (instruction: string) => void;
  onImageTransform: (transformString: string, newSrc?: string) => void;
}

export const InlineCustomizer: React.FC<InlineCustomizerProps> = ({
  element,
  onClose,
  onUpdateText,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAIRefine,
  onImageTransform,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "style" | "image" | "ai">("text");
  const [textVal, setTextVal] = useState(element.textContent || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const isImage = element.tagName.toLowerCase() === "img" || !!element.imgSrc;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateText(textVal);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    await onAIRefine(aiPrompt);
    setIsAiLoading(false);
    setAiPrompt("");
  };

  const handleApplyImageTransform = (transform: string) => {
    onImageTransform(transform);
  };

  const handleGenerateNewImage = () => {
    if (!imagePrompt.trim()) return;
    const transformedUrl = `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80&prompt=${encodeURIComponent(imagePrompt)}`;
    onImageTransform("", transformedUrl);
  };

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-96 bg-white border-slate-300 shadow-2xl space-y-4 p-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-900" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Section Editor: <code className="text-pink-600 lowercase font-mono">{element.sectionId || element.tagName}</code>
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === "text" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === "style" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Style
        </button>
        {isImage && (
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === "image" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Image Kit
          </button>
        )}
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === "ai" ? "bg-white text-pink-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          AI Refine
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "text" && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-slate-500 font-semibold">Content Text</label>
          <textarea
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-none font-medium"
          />
          <Button type="submit" size="sm" variant="primary" className="w-full" leftIcon={<Check className="w-3.5 h-3.5" />}>
            Apply Text Update
          </Button>
        </form>
      )}

      {activeTab === "style" && (
        <div className="space-y-3 text-xs">
          <p className="font-mono text-slate-500 font-semibold">Section Reordering & Structure</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={onMoveUp} leftIcon={<ArrowUp className="w-3.5 h-3.5" />}>
              Move Up
            </Button>
            <Button size="sm" variant="outline" onClick={onMoveDown} leftIcon={<ArrowDown className="w-3.5 h-3.5" />}>
              Move Down
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button size="sm" variant="secondary" onClick={onDuplicate} leftIcon={<Copy className="w-3.5 h-3.5" />}>
              Duplicate
            </Button>
            <Button size="sm" variant="danger" onClick={onDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              Delete Block
            </Button>
          </div>
        </div>
      )}

      {activeTab === "image" && isImage && (
        <div className="space-y-3">
          <p className="text-xs font-mono text-slate-500 font-semibold">Image Kit AI Transformations</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:bg-remove")}
              leftIcon={<Wand2 className="w-3.5 h-3.5 text-pink-500" />}
            >
              Remove BG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:w-1200,h-1200,q-90")}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            >
              Upscale HD
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:drop-shadow")}
            >
              Drop Shadow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApplyImageTransform("tr:bg-sunset")}
            >
              Sunset Glow
            </Button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <label className="block text-[11px] font-mono text-slate-500 font-semibold">Generate Replacement Image</label>
            <Input
              placeholder="e.g. Luxury perfume bottle pink background..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="text-xs"
            />
            <Button
              size="sm"
              variant="pink"
              className="w-full"
              onClick={handleGenerateNewImage}
              leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
            >
              Replace with ImageKit AI
            </Button>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <form onSubmit={handleAiSubmit} className="space-y-3">
          <label className="block text-xs font-mono text-slate-500 font-semibold">Gemini Targeted Section Refinement</label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Make this section have rounded floating corners, soft shadow, and 3 review cards..."
            rows={3}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none resize-none font-medium"
          />
          <Button
            type="submit"
            size="sm"
            variant="pink"
            className="w-full"
            isLoading={isAiLoading}
            leftIcon={<Wand2 className="w-3.5 h-3.5" />}
          >
            Refine Section with Gemini
          </Button>
        </form>
      )}
    </Card>
  );
};
