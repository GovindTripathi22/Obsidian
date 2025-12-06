
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User } from "lucide-react";
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

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Generation failed: ${response.status} ${response.statusText}`, errorText);
                let errorData = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // Not JSON
                }
                throw new Error((errorData as any).error || (errorData as any).details || errorText || `Failed: ${response.status}`);
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
                const cleanCode = generatedCode.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
                setHtmlCode(cleanCode);
            }

            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = "Code generated successfully!";
                return newMessages;
            });

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialPrompt && !hasRunInitial) {
            setHasRunInitial(true);
            handleSend(initialPrompt);
        }
    }, [initialPrompt, hasRunInitial]);

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
                            <div className="rounded-2xl p-4 text-sm bg-zinc-900/50 text-zinc-400 border border-white/5">
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
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
                    <div className="relative flex items-end gap-2 bg-black/80 rounded-xl border border-white/10 p-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe changes..."
                            disabled={isLoading}
                            className="min-h-[40px] max-h-[120px] w-full resize-none bg-transparent border-0 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0 p-2"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(input);
                                }
                            }}
                        />
                        <Button
                            size="icon"
                            onClick={() => handleSend(input)}
                            disabled={isLoading || !input.trim()}
                            className="h-8 w-8 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-50 shrink-0 mb-1"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
