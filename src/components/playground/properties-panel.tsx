import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Type, Palette, Layout, Box, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertiesPanelProps {
    element: {
        tagName: string;
        textContent: string;
        classes: string;
        id: string;
        styles?: any;
    };
    onUpdate: (key: string, value: string) => void;
    onClose: () => void;
}

export function PropertiesPanel({ element, onUpdate, onClose }: PropertiesPanelProps) {
    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <span className="text-xs font-mono text-emerald-400 font-bold">{element.tagName}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-300">Properties</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-zinc-500 hover:text-white">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <Tabs defaultValue="visual" className="flex-1 flex flex-col">
                <div className="px-4 border-b border-white/10">
                    <TabsList className="w-full bg-transparent p-0 h-9">
                        <TabsTrigger value="visual" className="flex-1 bg-transparent data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 transition-all">Visual</TabsTrigger>
                        <TabsTrigger value="code" className="flex-1 bg-transparent data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 transition-all">Code</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="visual" className="p-4 space-y-6 m-0">
                        {/* Content Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Content
                                </div>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    className="h-5 gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-1.5"
                                    onClick={async () => {
                                        const original = element.textContent;
                                        if (!original) return;
                                        // Simple optimistic UI could happen here or loading state
                                        try {
                                            const res = await fetch("/api/ai/rewrite", {
                                                method: "POST",
                                                body: JSON.stringify({ text: original })
                                            });
                                            const data = await res.json();
                                            if (data.text) {
                                                onUpdate("content", data.text);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                >
                                    <Sparkles className="h-3 w-3" /> AI Rewrite
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Text</Label>
                                <Textarea
                                    value={element.textContent}
                                    onChange={(e) => onUpdate("content", e.target.value)}
                                    className="bg-black/50 border-white/10 text-xs min-h-[80px] focus-visible:ring-emerald-500/50"
                                />
                            </div>
                        </div>

                        {/* Typography Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                <Type className="h-3 w-3" /> Typography
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Size</Label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-md text-xs h-8 px-2 text-white"
                                        onChange={(e) => {
                                            const size = e.target.value;
                                            const newClasses = element.classes.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/g, '').trim() + ` ${size}`;
                                            onUpdate("classes", newClasses);
                                        }}
                                    >
                                        <option value="text-sm">Small</option>
                                        <option value="text-base">Base</option>
                                        <option value="text-lg">Large</option>
                                        <option value="text-xl">XL</option>
                                        <option value="text-2xl">2XL</option>
                                        <option value="text-4xl">4XL</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Weight</Label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-md text-xs h-8 px-2 text-white"
                                        onChange={(e) => {
                                            const weight = e.target.value;
                                            const newClasses = element.classes.replace(/font-(light|normal|medium|semibold|bold)/g, '').trim() + ` ${weight}`;
                                            onUpdate("classes", newClasses);
                                        }}
                                    >
                                        <option value="font-normal">Normal</option>
                                        <option value="font-medium">Medium</option>
                                        <option value="font-semibold">Semibold</option>
                                        <option value="font-bold">Bold</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Colors Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                <Palette className="h-3 w-3" /> Colors
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Background</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                                            onChange={(e) => onUpdate("styles", JSON.stringify({ ...element.styles, backgroundColor: e.target.value }))}
                                        />
                                        <div className="h-8 flex-1 bg-black/50 border border-white/10 rounded text-xs flex items-center px-2 text-zinc-400">
                                            {element.styles?.backgroundColor || 'None'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Text Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                                            onChange={(e) => onUpdate("styles", JSON.stringify({ ...element.styles, color: e.target.value }))}
                                        />
                                        <div className="h-8 flex-1 bg-black/50 border border-white/10 rounded text-xs flex items-center px-2 text-zinc-400">
                                            {element.styles?.color || 'Inherit'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spacing Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                <Layout className="h-3 w-3" /> Spacing
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Padding</Label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-md text-xs h-8 px-2 text-white"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const newClasses = element.classes.replace(/p-\d+/g, '').trim() + ` ${val}`;
                                            onUpdate("classes", newClasses);
                                        }}
                                    >
                                        <option value="p-0">0</option>
                                        <option value="p-2">Small</option>
                                        <option value="p-4">Medium</option>
                                        <option value="p-8">Large</option>
                                        <option value="p-12">Huge</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Margin</Label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-md text-xs h-8 px-2 text-white"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const newClasses = element.classes.replace(/m-\d+/g, '').trim() + ` ${val}`;
                                            onUpdate("classes", newClasses);
                                        }}
                                    >
                                        <option value="m-0">0</option>
                                        <option value="m-2">Small</option>
                                        <option value="m-4">Medium</option>
                                        <option value="m-8">Large</option>
                                        <option value="m-12">Huge</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="code" className="p-4 space-y-6 m-0">
                        {/* Classes Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                <CodeIcon className="h-3 w-3" /> Tailwind Classes
                            </div>
                            <Textarea
                                value={element.classes}
                                onChange={(e) => onUpdate("classes", e.target.value)}
                                className="bg-black/50 border-white/10 text-xs font-mono min-h-[120px] focus-visible:ring-emerald-500/50"
                            />
                            <p className="text-[10px] text-zinc-500">
                                Edit Tailwind classes directly. Changes apply immediately.
                            </p>
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
}

function CodeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    )
}
