"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export function LandingPageClient() {
    const [inputValue, setInputValue] = useState("");

    const SUGGESTIONS = [
        {
            label: "Landing Page for SaaS",
            prompt: "Create a high-converting landing page for a B2B SaaS product. Include a sticky glassmorphic navbar, a hero section with a strong value proposition and two call-to-action buttons, a 'Trusted By' logo strip, a 3-column feature grid with icons, social proof testimonials, and a pricing comparison table. Use a modern dark theme with emerald accents and Inter typography."
        },
        {
            label: "Portfolio for Designer",
            prompt: "Design a minimalist portfolio for a Product Designer. The hero section should have a large, bold introduction. Below that, create a masonry grid gallery of project case studies with hover effects. Include an 'About Me' section with a photo placeholder and a skills list. End with a clean contact form. Use plenty of whitespace and large typography."
        },
        {
            label: "Coffee Shop Website",
            prompt: "Build a cozy, inviting website for an artisanal coffee shop. Use a warm color palette (browns, creams, earthly greens). Include a hero section with a video background placeholder, a menu section with prices, an 'Our Story' section with image placeholders, and a footer with location and hours. Use a serif font for headings to give it a classic feel."
        },
        {
            label: "Waitlist Page",
            prompt: "Create a viral waitlist page for a stealth startup. The design should be hype-driven and futuristic. Center the email capture form and make it the focal point. Add a countdown timer placeholder. Include a 'Why Join?' section with exclusive benefits. Use a dark background with neon gradients and glow effects."
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            window.open(`/workspace/project/new?prompt=${encodeURIComponent(inputValue)}`, '_blank');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center px-4 pt-20 md:pt-32 pb-20">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    v1.0 Public Beta
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                    Craft Code from Chaos.
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Generate production-ready websites with a single prompt.
                    Edit visually. Export clean code.
                </p>
            </div>

            {/* Input Section */}
            <div className="w-full max-w-2xl mt-12 relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative">
                    <form onSubmit={handleSubmit}>
                        <Textarea
                            name="prompt"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Describe your dream website... (e.g., 'A minimalist portfolio for a photographer with a dark theme')"
                            className="min-h-[120px] w-full resize-none rounded-xl border-zinc-800 bg-zinc-950/80 p-6 text-lg text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:ring-0 focus:ring-offset-0 shadow-2xl backdrop-blur-xl"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (inputValue.trim()) {
                                        window.open(`/workspace/project/new?prompt=${encodeURIComponent(inputValue)}`, '_blank');
                                    }
                                }
                            }}
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                                type="button"
                                size="icon"
                                className="h-10 w-10 rounded-lg bg-zinc-800 text-emerald-400 hover:bg-zinc-700 hover:text-emerald-300 transition-all border border-emerald-500/20"
                                title="Enhance Prompt with AI"
                                onClick={async () => {
                                    if (!inputValue) return;
                                    const original = inputValue;
                                    setInputValue("Enhancing...");
                                    try {
                                        const res = await fetch("/api/ai/rewrite", {
                                            method: "POST",
                                            body: JSON.stringify({ text: original, tone: "detailed, structural, and precise for an AI website builder prompt" })
                                        });
                                        const data = await res.json();
                                        if (data.text) setInputValue(data.text);
                                    } catch (e) {
                                        setInputValue(original);
                                    }
                                }}
                                disabled={!inputValue}
                            >
                                <Sparkles className="h-5 w-5" />
                            </Button>
                            <Button type="submit" size="icon" className="h-10 w-10 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105">
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion.label}
                        onClick={() => setInputValue(suggestion.prompt)}
                        className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                        {suggestion.label}
                    </button>
                ))}
            </div>

            {/* Feature Grid */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                {[
                    { title: "AI Generation", desc: "Powered by Gemini 1.5 Pro for intelligent code synthesis.", icon: Sparkles },
                    { title: "Visual Editing", desc: "Click and edit any element directly on the canvas.", icon: ArrowRight }, // Placeholder icon
                    { title: "Clean Export", desc: "Get production-ready React + Tailwind code.", icon: ArrowRight }, // Placeholder icon
                ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
                        <feature.icon className="h-8 w-8 text-white mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-zinc-400">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
