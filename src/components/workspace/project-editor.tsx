"use client";

import { ChatPanel } from "@/components/playground/chat-panel";
import { PreviewCanvas } from "@/components/playground/preview-canvas";
import { PropertiesPanel } from "@/components/playground/properties-panel";
import { ImageToolbar } from "@/components/playground/image-toolbar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProjectEditorProps {
    initialHtml?: string;
    initialMessages?: any[];
    projectId: string;
}

export function ProjectEditor({ initialHtml, initialMessages, projectId }: ProjectEditorProps) {
    const [showProperties, setShowProperties] = useState(true);
    const [htmlCode, setHtmlCode] = useState(initialHtml || "");
    const [selectedElement, setSelectedElement] = useState<any>(null);

    // Listen for messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "ELEMENT_SELECTED") {
                setSelectedElement(event.data.payload);
                setShowProperties(true);
            }
            if (event.data.type === "ELEMENT_UPDATED") {
                // Update local state to reflect typing in iframe
                if (selectedElement && selectedElement.id === event.data.payload.id) {
                    setSelectedElement((prev: any) => ({ ...prev, textContent: event.data.payload.content }));
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [selectedElement]);

    const handleUpdateElement = (key: string, value: string) => {
        if (!selectedElement) return;

        // Update local state
        const updated = { ...selectedElement, [key]: value };
        setSelectedElement(updated);

        // Send update to iframe
        const iframe = document.querySelector("iframe");
        iframe?.contentWindow?.postMessage({
            type: "UPDATE_ELEMENT",
            payload: {
                id: selectedElement.id,
                [key]: value
            }
        }, "*");
    };

    const handleImageUpdate = (newSrc: string) => {
        if (!selectedElement) return;

        const updated = { ...selectedElement, attributes: { ...selectedElement.attributes, src: newSrc } };
        setSelectedElement(updated);

        const iframe = document.querySelector("iframe");
        iframe?.contentWindow?.postMessage({
            type: "UPDATE_ELEMENT",
            payload: {
                id: selectedElement.id,
                attributes: { src: newSrc }
            }
        }, "*");
    };

    const handleSaveCode = () => {
        const iframe = document.querySelector("iframe");
        if (!iframe?.contentWindow) return;
        iframe.contentWindow.postMessage({ type: "REQUEST_HTML" }, "*");
    };

    // Listen for HTML response (Saving)
    useEffect(() => {
        const handleHtmlResponse = async (event: MessageEvent) => {
            if (event.data.type === "HTML_RESPONSE") {
                const newHtml = event.data.payload;
                setHtmlCode(newHtml);

                // TODO: Save to DB via API
                // For now just alert or log
                console.log("Saving project...");
                // We'll implement actual save update in next step if needed
            }
        };
        window.addEventListener("message", handleHtmlResponse);
        return () => window.removeEventListener("message", handleHtmlResponse);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black selection:bg-emerald-500/30">
            {/* Background Video (Global) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-20">
                    <source src="/background.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Main Content Layer */}
            <div className="relative z-10 flex h-full">

                {/* Left: Chat Island (Floating) */}
                <div className="absolute left-6 top-6 bottom-6 w-[380px] z-30 pointer-events-none flex flex-col justify-center">
                    <div className="pointer-events-auto h-full max-h-[800px] w-full rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500 hover:border-white/20">
                        <ChatPanel
                            setHtmlCode={setHtmlCode}
                            initialMessages={initialMessages}
                            projectId={projectId}
                        />
                    </div>
                </div>

                {/* Center: Preview Canvas (Immersive) */}
                <div className="flex-1 h-full pl-[420px] pr-6 py-6 transition-all duration-500">
                    <div className="h-full w-full rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden shadow-2xl relative">
                        <PreviewCanvas htmlCode={htmlCode} />

                        {/* Image Toolbar Overlay */}
                        {selectedElement?.tagName === "IMG" && (
                            <ImageToolbar
                                elementId={selectedElement.id}
                                currentSrc={selectedElement.attributes?.src || ""}
                                onUpdate={handleImageUpdate}
                                onClose={() => setSelectedElement(null)}
                            />
                        )}
                    </div>
                </div>

                {/* Right: Properties Island (Conditional) */}
                {showProperties && selectedElement && selectedElement.tagName !== "IMG" && (
                    <div className="absolute right-6 top-6 bottom-6 w-[300px] z-30 pointer-events-none flex flex-col justify-center">
                        <div className="pointer-events-auto h-auto max-h-[600px] w-full rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
                            <PropertiesPanel
                                element={selectedElement}
                                onUpdate={handleUpdateElement}
                                onClose={() => setShowProperties(false)}
                            />
                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <Button
                                    onClick={handleSaveCode}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
