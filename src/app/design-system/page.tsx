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
    { name: "Obsidian Black (Bg)", class: "bg-zinc-950 border border-zinc-800", hex: "#09090B" },
    { name: "Zinc Dark (Card)", class: "bg-zinc-900 border border-zinc-800", hex: "#18181B" },
    { name: "Zinc Surface (Hover)", class: "bg-zinc-800 border border-zinc-700", hex: "#27272A" },
    { name: "Emerald Accent (Primary)", class: "bg-emerald-500", hex: "#10B981" },
    { name: "Emerald Light (Text)", class: "bg-emerald-400", hex: "#34D399" },
    { name: "Indigo Accent", class: "bg-indigo-600", hex: "#4F46E5" },
    { name: "Warning (Amber)", class: "bg-amber-500", hex: "#F59E0B" },
    { name: "Danger (Rose)", class: "bg-rose-600", hex: "#EF4444" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            Dark Obsidian Design System
          </span>
        </div>
        <h1 className="text-3xl font-black font-heading tracking-tight text-zinc-100">
          Design System & Component Library
        </h1>
        <p className="text-zinc-400 text-sm">
          Obsidian dark color tokens, typography scale, and reusable UI components.
        </p>
      </div>

      {/* 1. Color Palette */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Color Tokens & Dark Obsidian Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-3">
              <div className={`h-16 rounded-xl ${c.class}`} />
              <div>
                <p className="text-xs font-bold text-zinc-100">{c.name}</p>
                <p className="text-xs font-mono text-zinc-500">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Typography Scale</h2>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-4 font-sans">
          <div>
            <span className="text-xs font-mono text-zinc-500">h1 (text-4xl)</span>
            <p className="text-4xl font-black font-heading text-zinc-100">Heading 1: Modern E-Commerce Generator</p>
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-500">h2 (text-2xl)</span>
            <p className="text-2xl font-bold font-heading text-zinc-200">Heading 2: AI Powered Shopify Liquid Themes</p>
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-500">h3 (text-lg)</span>
            <p className="text-lg font-semibold font-heading text-zinc-300">Heading 3: Interactive Live Preview & Inline Customizer</p>
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-500">body (text-sm)</span>
            <p className="text-sm text-zinc-400">
              Standard body text formatted cleanly for dark background readability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Button Component Variants & States</h2>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" className="bg-white hover:bg-zinc-200 text-zinc-950 font-medium" leftIcon={<Send className="w-4 h-4" />}>
              Primary White
            </Button>
            <Button variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700">Secondary Dark</Button>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Outline</Button>
            <Button variant="ghost" className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">Ghost</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0" leftIcon={<Sparkles className="w-4 h-4" />}>
              Emerald Accent
            </Button>
            <Button variant="danger">Danger</Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200">Small</Button>
            <Button variant="primary" size="md" className="bg-white text-zinc-950 hover:bg-zinc-200">Medium</Button>
            <Button variant="primary" size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200">Large</Button>
            <Button variant="primary" size="icon" className="bg-white text-zinc-950 hover:bg-zinc-200"><Search className="w-4 h-4" /></Button>
            <Button variant="primary" isLoading className="bg-white text-zinc-950">Loading State</Button>
            <Button variant="primary" disabled className="bg-zinc-800 text-zinc-500 border-zinc-700">Disabled State</Button>
          </div>
        </div>
      </section>

      {/* 4. Input Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Input Component States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
          <Input
            label="Standard Input"
            placeholder="Enter store name..."
            leftIcon={<Search className="w-4 h-4 text-zinc-400" />}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            helperText="We will never share your email."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-zinc-400" />}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            error="Password must be at least 8 characters."
          />
        </div>
      </section>

      {/* 5. Card Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Card Component Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable glass={false} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700">
            <CardHeader>
              <CardTitle className="font-heading text-zinc-100">Interactive Hover Card</CardTitle>
              <CardDescription className="text-zinc-400">Hover over this card to preview elevation and shadow effects.</CardDescription>
            </CardHeader>
            <CardContent className="text-zinc-300">
              Built using InsForge database, Gemini AI engine, and Image Kit transformations.
            </CardContent>
            <CardFooter className="border-zinc-800">
              <span className="text-xs font-mono text-emerald-400 font-semibold">Status: Active</span>
              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Explore</Button>
            </CardFooter>
          </Card>

          <Card glass={false} className="bg-zinc-900/80 backdrop-blur-xl border-zinc-800">
            <CardHeader>
              <CardTitle className="font-heading text-zinc-100">Frosted Glass Panel</CardTitle>
              <CardDescription className="text-zinc-400">Backdrop-blur glass panel with subtle zinc border.</CardDescription>
            </CardHeader>
            <CardContent className="text-zinc-300">
              Used for floating toolbars, chat box messages, and settings dialogs.
            </CardContent>
            <CardFooter className="border-zinc-800">
              <span className="text-xs font-mono text-emerald-400 font-semibold">Dark Glass</span>
              <Button size="sm" variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700">Details</Button>
            </CardFooter>
          </Card>

          <Card glass={false} className="border-emerald-800/60 bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="font-heading text-emerald-200">Emerald Theme Accent</CardTitle>
              <CardDescription className="text-emerald-400/80">Tailored for luxury fashion & cosmetics presets.</CardDescription>
            </CardHeader>
            <CardContent className="text-emerald-300">
              Custom CSS variables enable theme switching across store layouts seamlessly.
            </CardContent>
            <CardFooter className="border-emerald-800/60">
              <span className="text-xs font-mono text-emerald-400 font-semibold">Emerald Theme</span>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Select</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Alert Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-zinc-100">Alert Component Variants</h2>
        <div className="space-y-4">
          {showAlert && (
            <Alert
              variant="info"
              title="System Information"
              onClose={() => setShowAlert(false)}
              action={<Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Dismiss Notice</Button>}
            >
              InsForge BaaS authentication and PostgreSQL migration triggers are configured.
            </Alert>
          )}

          <Alert variant="success" title="Generation Complete">
            Shopify Liquid theme template successfully compiled and ready for deployment.
          </Alert>

          <Alert variant="warning" title="Quota Limit Reached">
            You are on the Free tier (2/2 projects used). Upgrade to Pro for unlimited exports.
          </Alert>

          <Alert variant="danger" title="API Authentication Error">
            Unable to connect to Gemini API. Please check your GEMINI_API_KEY environment variable.
          </Alert>
        </div>
      </section>
    </div>
  );
}
