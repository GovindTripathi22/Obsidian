import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface ChatPanelProps {
    setHtmlCode: (code: string) => void;
    initialPrompt?: string;
    initialMessages?: any[];
    projectId?: string;
}

export function ChatPanel({ setHtmlCode, initialPrompt, initialMessages, projectId }: ChatPanelProps) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages || [
        { role: "ai", content: "Hello! I'm Obsidian AI. Describe the website you want to build." }
    ]);
    const [hasRunInitial, setHasRunInitial] = useState(!!initialMessages?.length);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage = text;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userMessage }),
            });

            // Save User Message
            if (projectId) {
                fetch(`/api/projects/${projectId}/message`, {
                    method: "POST",
                    body: JSON.stringify({ role: "user", message: userMessage })
                }).catch(console.error);
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Generation failed: ${response.status} ${response.statusText}`, errorText);
                throw new Error(errorText);
            }
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let generatedCode = "";

            setMessages(prev => [...prev, { role: "ai", content: "Generating..." }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                generatedCode += chunk;

                // Clean markdown if present (client-side safety)
                const cleanCode = generatedCode.replace(/^```html\s * /, '').replace(/ ^ ```\s*/, '').replace(/```$ /, '');
                setHtmlCode(cleanCode);
            }

            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = "Code generated successfully!";
                return newMessages;
            });

            // Save AI Message
            if (projectId) {
                fetch(`/api/projects/${projectId}/message`, {
                    method: "POST",
                    body: JSON.stringify({ role: "ai", message: "Code generated successfully!" })
                }).catch(console.error);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    useEffect(() => {
        if (initialPrompt && !hasRunInitial) {
            setHasRunInitial(true);
            handleSend(initialPrompt);
        }
    }, [initialPrompt, hasRunInitial]);

    // Auto-scroll to bottom
    useEffect(() => {
        const bottom = document.getElementById("scroll-bottom");
        bottom?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex h-full flex-col bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-5 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-50" />
                    </div>
                    <h3 className="font-medium text-white text-sm tracking-wide uppercase font-mono">Obsidian AI</h3>
                </div>
                {/* Visual Tech Dots */}
                <div className="flex gap-1.5 opacity-50">
                    {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-zinc-500" />)}
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-5">
                <div className="space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${msg.role === "ai" ? "bg-black/50" : "bg-white text-black"}`}>
                                {msg.role === "ai" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4" />}
                            </div>
                            <div className={`rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] shadow-sm ${msg.role === "ai"
                                ? "bg-zinc-900/50 text-zinc-300 border border-white/5"
                                : "bg-white text-black"
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-white animate-pulse" />
                            </div>
                            <div className="rounded-2xl p-4 text-sm bg-zinc-900/50 text-zinc-400 border border-white/5 space-y-2 w-full max-w-[200px]">
                                <Skeleton className="h-4 w-32 bg-white/10" />
                                <Skeleton className="h-4 w-48 bg-white/10" />
                                <Skeleton className="h-4 w-24 bg-white/10" />
                            </div>
                        </div>
                    )}
                    <div id="scroll-bottom" />
                </div>
            </ScrollArea>

            <div className="p-4 bg-white/5 border-t border-white/10">
                {/* Quick Start Templates */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    {[
                        { label: "SaaS Landing", prompt: "Create a high-converting landing page for a SaaS product. Include a hero section with a clear value proposition, a features grid, social proof/testimonials, pricing tiers, and a strong call-to-action footer. Use a modern, clean aesthetic." },
                        { label: "Portfolio", prompt: "Design a minimalist portfolio website for a creative designer. Feature a masonry grid gallery of work, an 'About Me' section with a photo, a skills list, and a contact form. Use whitespace effectively and elegant typography." },
                        { label: "Coffee Shop", prompt: "Build a cozy and inviting website for a local coffee shop. Include a menu section with prices, a photo gallery of the interior and latte art, an 'Our Story' section, and location/hours information. Use warm, earthy tones." },
                        { label: "Waitlist", prompt: "Create a viral waitlist page for an upcoming product launch. Center the email capture form. Include a countdown timer (static placeholder), a 'Why Join?' section with benefits, and social sharing buttons. Use a futuristic or hype-driven design style." }
                    ].map((template) => (
                        <button
                            key={template.label}
                            onClick={() => setInput(template.prompt)}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                        >
                            {template.label}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "Building..." : "Ask Obsidian to build..."}
                            className="min-h-[60px] w-full resize-none rounded-2xl border-white/10 bg-zinc-900 pr-20 pt-4 text-sm focus-visible:ring-emerald-500/50"
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-xl text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                                title="AI Copywriter (Enhance Prompt)"
                                onClick={async () => {
                                    if (!input) return;
                                    const original = input;
                                    setInput("Enhancing...");
                                    try {
                                        const res = await fetch("/api/ai/rewrite", {
                                            method: "POST",
                                            body: JSON.stringify({ text: original, tone: "detailed, structural, and precise for an AI website builder prompt" })
                                        });
                                        const data = await res.json();
                                        if (data.text) setInput(data.text);
                                    } catch (e) {
                                        setInput(original); // Revert on error
                                    }
                                }}
                                disabled={!input || isLoading}
                            >
                                <Sparkles className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50"
                                onClick={() => handleSend(input)}
                                disabled={!input.trim() || isLoading}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
