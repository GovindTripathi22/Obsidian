"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Wand2, X } from "lucide-react";
import { useState } from "react";

interface ImageToolbarProps {
    elementId: string;
    currentSrc: string;
    onUpdate: (newSrc: string) => void;
    onClose: () => void;
}

export function ImageToolbar({ elementId, currentSrc, onUpdate, onClose }: ImageToolbarProps) {
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Get Auth Params
            const authRes = await fetch("/api/imagekit/auth");
            const authData = await authRes.json();

            // Create Form Data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
            formData.append("signature", authData.signature);
            formData.append("expire", authData.expire);
            formData.append("token", authData.token);

            // Upload to ImageKit
            const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                onUpdate(uploadData.url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setGenerating(true);
        try {
            // 1. Enhance prompt with Gemini
            const enhanceRes = await fetch("/api/enhance-prompt", {
                method: "POST",
                body: JSON.stringify({ prompt }),
            });
            const { enhancedPrompt } = await enhanceRes.json();

            // 2. Generate Image using Pollinations (free, no auth)
            const finalPrompt = enhancedPrompt || prompt;
            const seed = Math.floor(Math.random() * 1000);
            const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?seed=${seed}&width=800&height=600&nologo=true`;

            onUpdate(generatedUrl);
        } catch (error) {
            console.error("Generation failed:", error);
            alert("Generation failed");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[400px] bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Edit Image</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-white/5 mb-4">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="generate">Generate (AI)</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Image File</Label>
                        <Input id="picture" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="bg-white/5 border-white/10 text-white file:text-white" />
                    </div>
                    {uploading && <div className="text-xs text-emerald-400 flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</div>}
                </TabsContent>

                <TabsContent value="generate" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Prompt</Label>
                        <Input
                            placeholder="A futuristic city with neon lights..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>
                    <Button onClick={handleGenerate} disabled={generating || !prompt} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                        {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                        Generate
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
