"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Sparkles, Search, Mail, Lock, Send } from "lucide-react";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  const colors = [
    { name: "Pure White", class: "bg-white border border-neutral-200 text-neutral-950", hex: "#FFFFFF" },
    { name: "Silver Frost", class: "bg-neutral-200 border border-neutral-300 text-neutral-900", hex: "#E5E5E5" },
    { name: "Titanium Slate", class: "bg-neutral-700 border border-neutral-600", hex: "#404040" },
    { name: "Dark Surface", class: "bg-neutral-800 border border-neutral-700", hex: "#262626" },
    { name: "Dark Background", class: "bg-neutral-950 border border-neutral-800", hex: "#0A0A0A" },
    { name: "Card Background", class: "bg-neutral-900 border border-neutral-800", hex: "#171717" },
    { name: "Warning", class: "bg-amber-500", hex: "#F59E0B" },
    { name: "Danger", class: "bg-red-600", hex: "#DC2626" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-8 space-y-12">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
            Design System
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
          Design System & Components
        </h1>
        <p className="text-neutral-400 text-sm">
          Color tokens, typography scale, and reusable UI components.
        </p>
      </div>

      {/* 1. Color Palette */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-100">Color Tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
              <div className={`h-16 rounded-lg ${c.class}`} />
              <div>
                <p className="text-xs font-semibold text-neutral-100">{c.name}</p>
                <p className="text-xs text-neutral-500">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Aesthetic Typography Combinations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">Aesthetic Typography Combinations</h2>
          <span className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            Fontshare & Google Fonts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Modern Minimal</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Obsidian Default</span>
            </div>
            <p className="text-2xl font-bold font-display text-white">Clash Display & Satoshi</p>
            <p className="text-xs font-sans text-neutral-400 leading-relaxed">
              Geometric Swiss grotesk paired with clean architectural sans-serif for high-contrast digital products.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Editorial Luxury</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Beauty & Fashion</span>
            </div>
            <p className="text-2xl font-editorial italic text-white">Cormorant & Instrument</p>
            <p className="text-xs font-sans text-neutral-400 leading-relaxed">
              High-fashion Kinfolk/Vogue editorial typography with elegant high-contrast serif headlines.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Swiss Brutalist</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Streetwear & Apparel</span>
            </div>
            <p className="text-2xl font-brutalist uppercase text-white">Cabinet Grotesk</p>
            <p className="text-xs font-sans text-neutral-400 leading-relaxed">
              Heavy structured grotesk title impact engineered for high-energy modern streetwear storefronts.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Cyber Tech</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Hardware & Audio</span>
            </div>
            <p className="text-2xl font-cyber uppercase text-white">Syne & Space Grotesk</p>
            <p className="text-xs font-sans text-neutral-400 leading-relaxed">
              Futuristic industrial precision typography paired with technical monospace specification tokens.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Artisanal Warmth</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Specialty Coffee</span>
            </div>
            <p className="text-2xl font-editorial font-serif text-white">Playfair & Jakarta</p>
            <p className="text-xs font-jakarta text-neutral-400 leading-relaxed">
              Warm editorial serif headings balanced with contemporary humanist body copy for artisanal brands.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Technical Mono</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Code & Liquid</span>
            </div>
            <p className="text-xl font-mono text-white font-semibold">IBM Plex Mono</p>
            <p className="text-xs font-mono text-neutral-400 leading-relaxed">
              Precise, high-legibility monospaced typeface for Liquid 2.0 schemas and code trees.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-100">Buttons</h2>
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium" leftIcon={<Send className="w-4 h-4" />}>
              Primary
            </Button>
            <Button variant="secondary" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700">Secondary</Button>
            <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">Outline</Button>
            <Button variant="ghost" className="text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200">Ghost</Button>
            <Button variant="outline" className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700" leftIcon={<Sparkles className="w-4 h-4" />}>
              Metallic
            </Button>
            <Button variant="danger">Danger</Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm" className="bg-white text-neutral-950 hover:bg-neutral-200">Small</Button>
            <Button variant="primary" size="md" className="bg-white text-neutral-950 hover:bg-neutral-200">Medium</Button>
            <Button variant="primary" size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200">Large</Button>
            <Button variant="primary" size="icon" className="bg-white text-neutral-950 hover:bg-neutral-200"><Search className="w-4 h-4" /></Button>
            <Button variant="primary" isLoading className="bg-white text-neutral-950">Loading</Button>
            <Button variant="primary" disabled className="bg-neutral-800 text-neutral-500 border-neutral-700">Disabled</Button>
          </div>
        </div>
      </section>

      {/* 4. Input Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-100">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl border border-neutral-800 bg-neutral-900">
          <Input
            label="Search"
            placeholder="Search stores..."
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-white focus:ring-white/20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
            className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-white focus:ring-white/20"
            helperText="We will never share your email."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
            className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:border-white focus:ring-white/20"
            error="Password must be at least 8 characters."
          />
        </div>
      </section>

      {/* 5. Card Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-100">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable glass={false} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 rounded-xl">
            <CardHeader>
              <CardTitle className="text-neutral-100">Interactive Card</CardTitle>
              <CardDescription className="text-neutral-400">Hover over this card to preview elevation and shadow effects.</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-300">
              Built using InsForge database, Gemini AI engine, and Image Kit transformations.
            </CardContent>
            <CardFooter className="border-neutral-800">
              <span className="text-xs text-neutral-300 font-medium">Status: Active</span>
              <Button size="sm" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">Explore</Button>
            </CardFooter>
          </Card>

          <Card glass={false} className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-neutral-100">Frosted Glass Panel</CardTitle>
              <CardDescription className="text-neutral-400">Backdrop-blur glass panel with subtle neutral border.</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-300">
              Used for floating toolbars, chat box messages, and settings dialogs.
            </CardContent>
            <CardFooter className="border-neutral-800">
              <span className="text-xs text-neutral-300 font-medium">Dark Glass</span>
              <Button size="sm" variant="secondary" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700">Details</Button>
            </CardFooter>
          </Card>

          <Card glass={false} className="border-neutral-700 bg-neutral-900/90 shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Monochrome Theme</CardTitle>
              <CardDescription className="text-neutral-400">High-contrast pure white and dark luxury aesthetic.</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-300">
              Engineered for ultra-premium digital architecture and high contrast readability.
            </CardContent>
            <CardFooter className="border-neutral-800">
              <span className="text-xs text-neutral-300 font-medium">Noir Mode</span>
              <Button size="sm" className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium border-0">Select</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Alert Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-100">Alerts</h2>
        <div className="space-y-4">
          {showAlert && (
            <Alert
              variant="info"
              title="System Information"
              onClose={() => setShowAlert(false)}
              action={<Button size="sm" variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">Dismiss</Button>}
            >
              Authentication and database migration triggers are configured.
            </Alert>
          )}

          <Alert variant="success" title="Generation Complete">
            Shopify Liquid theme template successfully compiled and ready for deployment.
          </Alert>

          <Alert variant="warning" title="Quota Limit Reached">
            You are on the Free tier (3/3 projects used). Upgrade to Pro for unlimited exports.
          </Alert>

          <Alert variant="danger" title="API Authentication Error">
            Unable to connect to Gemini API. Please check your GEMINI_API_KEY environment variable.
          </Alert>
        </div>
      </section>
    </div>
  );
}
