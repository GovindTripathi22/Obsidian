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
    { name: "Porcelain White (Bg)", class: "bg-slate-50 border border-slate-200", hex: "#F8FAFC" },
    { name: "Pure White (Card)", class: "bg-white border border-slate-200", hex: "#FFFFFF" },
    { name: "Slate 900 (Primary)", class: "bg-slate-900", hex: "#0F172A" },
    { name: "Pink Accent (Fashion)", class: "bg-rose-500", hex: "#F43F5E" },
    { name: "Indigo Accent", class: "bg-indigo-600", hex: "#4F46E5" },
    { name: "Success (Emerald)", class: "bg-emerald-500", hex: "#10B981" },
    { name: "Warning (Amber)", class: "bg-amber-500", hex: "#F59E0B" },
    { name: "Danger (Rose)", class: "bg-rose-600", hex: "#EF4444" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span className="text-xs font-mono text-pink-600 uppercase tracking-widest font-semibold">
            White Edition Design System
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Design System & Component Library</h1>
        <p className="text-slate-500 text-sm">
          Pristine white and off-white color tokens, typography scale, and reusable UI components.
        </p>
      </div>

      {/* 1. Color Palette */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Color Tokens & Shades of White</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className={`h-16 rounded-xl ${c.class} shadow-xs`} />
              <div>
                <p className="text-xs font-bold text-slate-900">{c.name}</p>
                <p className="text-xs font-mono text-slate-400">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Typography Scale</h2>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 font-sans">
          <div>
            <span className="text-xs font-mono text-slate-400">h1 (text-4xl)</span>
            <p className="text-4xl font-black text-slate-900">Heading 1: Modern E-Commerce Generator</p>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400">h2 (text-2xl)</span>
            <p className="text-2xl font-bold text-slate-800">Heading 2: AI Powered Shopify Liquid Themes</p>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400">h3 (text-lg)</span>
            <p className="text-lg font-semibold text-slate-700">Heading 3: Interactive Live Preview & Inline Customizer</p>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400">body (text-sm)</span>
            <p className="text-sm text-slate-600">
              Standard body text formatted cleanly for light background readability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Button Component Variants & States</h2>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
              Primary Dark
            </Button>
            <Button variant="secondary">Secondary White</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="pink" leftIcon={<Sparkles className="w-4 h-4" />}>
              Pink Fashion Accent
            </Button>
            <Button variant="danger">Danger</Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="icon"><Search className="w-4 h-4" /></Button>
            <Button variant="primary" isLoading>Loading State</Button>
            <Button variant="primary" disabled>Disabled State</Button>
          </div>
        </div>
      </section>

      {/* 4. Input Component States */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Input Component States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Input
            label="Standard Input"
            placeholder="Enter store name..."
            leftIcon={<Search className="w-4 h-4" />}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="We will never share your email."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error="Password must be at least 8 characters."
          />
        </div>
      </section>

      {/* 5. Card Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Card Component Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable>
            <CardHeader>
              <CardTitle>Interactive Hover Card</CardTitle>
              <CardDescription>Hover over this card to preview elevation and shadow effects.</CardDescription>
            </CardHeader>
            <CardContent>
              Built using InsForge database, Gemini AI engine, and Image Kit transformations.
            </CardContent>
            <CardFooter>
              <span className="text-xs font-mono text-indigo-600 font-semibold">Status: Active</span>
              <Button size="sm" variant="outline">Explore</Button>
            </CardFooter>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle>Frosted Glass Panel</CardTitle>
              <CardDescription>Backdrop-blur glass panel with subtle slate border.</CardDescription>
            </CardHeader>
            <CardContent>
              Used for floating toolbars, chat box messages, and settings dialogs.
            </CardContent>
            <CardFooter>
              <span className="text-xs font-mono text-emerald-600 font-semibold">White Glass</span>
              <Button size="sm" variant="secondary">Details</Button>
            </CardFooter>
          </Card>

          <Card className="border-pink-200 bg-pink-50/50">
            <CardHeader>
              <CardTitle className="text-pink-900">Fashion Theme Accent</CardTitle>
              <CardDescription className="text-pink-700">Tailored for luxury fashion & cosmetics presets.</CardDescription>
            </CardHeader>
            <CardContent className="text-pink-800">
              Custom CSS variables enable theme switching across store layouts seamlessly.
            </CardContent>
            <CardFooter>
              <span className="text-xs font-mono text-pink-600 font-semibold">Pink Theme</span>
              <Button size="sm" variant="pink">Select</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Alert Component Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Alert Component Variants</h2>
        <div className="space-y-4">
          {showAlert && (
            <Alert
              variant="info"
              title="System Information"
              onClose={() => setShowAlert(false)}
              action={<Button size="sm" variant="outline">Dismiss Notice</Button>}
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
