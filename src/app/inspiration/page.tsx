"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/Card";
import { Sparkles, ArrowRight, Star } from "lucide-react";

const INSPIRATION_GALLERY = [
  {
    title: "Velvet Aura Luxury Cosmetics",
    category: "Cosmetics & Skincare",
    prompt: "Luxurious cosmetics store with pastel pink accents, product grids, and customer reviews.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    rating: "4.9",
    tags: ["Luxury Noir", "Liquid 2.0", "ImageKit AI"],
  },
  {
    title: "AeroTech 3D Printers & Filaments",
    category: "Industrial & Tech",
    prompt: "Industrial tech store for 3D printers, custom filament materials, spec tables, and instant quotes.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    rating: "4.8",
    tags: ["Tech", "Specs Table", "Shopify Ready"],
  },
  {
    title: "Monochrome Streetwear Boutique",
    category: "Apparel & Fashion",
    prompt: "Sleek minimalist apparel boutique with dark monochrome aesthetics and sticky cart preview.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    rating: "5.0",
    tags: ["Minimalist", "Monochrome", "Lookbook"],
  },
];

export default function InspirationPage() {
  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 bg-zinc-950 min-h-screen text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-semibold">
          <Sparkles className="w-4 h-4 text-white" />
          <span>CURATED SHOPIFY STORE GALLERY</span>
        </div>
        <h1 className="text-3xl font-black font-heading text-zinc-100 tracking-tight">Store Inspiration & Templates</h1>
        <p className="text-zinc-400 text-sm">
          Explore high-converting store concepts built with Obsidian AI, Gemini 2.5 Flash, and Shopify Liquid 2.0.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INSPIRATION_GALLERY.map((item) => (
          <Card key={item.title} hoverable glass={false} className="group flex flex-col justify-between overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700">
            <div>
              <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden mb-4 relative border border-zinc-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-zinc-950/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {item.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                    {t}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-bold font-heading text-zinc-100 group-hover:text-white transition-colors">
                {item.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>

            <CardFooter className="pt-4 border-zinc-800">
              <span className="text-xs font-mono text-zinc-500">{item.category}</span>
              <Link href={`/?prompt=${encodeURIComponent(item.prompt)}`}>
                <Button size="sm" className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold border-0 shadow-md shadow-white/5" rightIcon={<ArrowRight className="w-3.5 h-3.5 text-zinc-950" />}>
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
