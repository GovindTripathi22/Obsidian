"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/Card";
import { Sparkles, ArrowRight, Star, Layers } from "lucide-react";

const INSPIRATION_GALLERY = [
  {
    title: "Tokyo Nocturnal Parallax Metropolis",
    category: "Parallax City Website",
    prompt:
      "Create an immersive multi-layer parallax city website for Tokyo Metropolis at dusk with 3D skyline depth planes, Shibuya & Shinjuku district cards, and aerial motion video.",
    image: "/images/parallax-tokyo.jpg",
    rating: "5.0",
    parallax: true,
    tags: ["Parallax 3D", "City Skyline", "60fps Motion"],
  },
  {
    title: "Velvet Aura Luxury Cosmetics",
    category: "Cosmetics & Skincare",
    prompt:
      "Create an ultra-luxurious clean beauty storefront with rose water mist, peptide glow serums, sticky cart preview, customer reviews, and Shopify Liquid 2.0 theme compatibility.",
    image: "/images/product-skincare.jpg",
    rating: "4.9",
    parallax: false,
    tags: ["Luxury Noir", "Liquid 2.0", "Studio AI"],
  },
  {
    title: "Apex Cybernetics Planar Audio",
    category: "Industrial & Tech",
    prompt:
      "Build an industrial tech store for planar magnetic headphones, mechanical keyboard spec tables, fast charging hubs, and Liquid theme templates.",
    image: "/images/product-audio.jpg",
    rating: "4.9",
    parallax: false,
    tags: ["Titanium", "Specs Table", "Shopify Ready"],
  },
  {
    title: "Alpine Horizon Brutalist Sanctuary",
    category: "Parallax Architecture",
    prompt:
      "Build a cinematic parallax architectural website for an Alpine cliffside sanctuary in Switzerland with mountain ridge depth layers and valley mist.",
    image: "/images/parallax-alps.jpg",
    rating: "5.0",
    parallax: true,
    tags: ["Parallax Depth", "Architecture", "Monochrome"],
  },
  {
    title: "KINETIC Supply Streetwear Atelier",
    category: "Apparel & Fashion",
    prompt:
      "Design a high-contrast minimalist streetwear shop with lookbook gallery, custom product size filters, 450 GSM French terry hoodies, and Liquid theme sections.",
    image: "/images/product-streetwear.jpg",
    rating: "5.0",
    parallax: false,
    tags: ["Minimalist", "Monochrome", "Lookbook"],
  },
  {
    title: "Manhattan Supertall Vertical Noir",
    category: "Parallax Real Estate",
    prompt:
      "Design a luxury monochrome noir parallax website for Manhattan supertall real estate and urban architecture with vertical scroll depth layers.",
    image: "/images/parallax-nyc.jpg",
    rating: "4.9",
    parallax: true,
    tags: ["Parallax City", "NYC Skyline", "Editorial"],
  },
];

export default function InspirationPage() {
  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 bg-[#0a0a0a] min-h-screen text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Curated Gallery</span>
        </div>
        <h1 className="text-3xl font-semibold text-neutral-100 tracking-tight">
          Parallax Cityscapes & Store Inspiration
        </h1>
        <p className="text-neutral-400 text-sm">
          Explore high-converting parallax city experiences and Shopify Liquid 2.0 storefronts built with Obsidian Studio.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INSPIRATION_GALLERY.map((item) => (
          <Card
            key={item.title}
            hoverable
            glass={false}
            className="group flex flex-col justify-between overflow-hidden bg-neutral-900 border-neutral-800 hover:border-neutral-700"
          >
            <div>
              <div className="aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden mb-4 relative border border-neutral-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.parallax && (
                  <span className="absolute top-2 left-2 bg-white text-neutral-950 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-bold shadow-xs">
                    <Layers className="w-3 h-3" /> PARALLAX 3D
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-[#0a0a0a]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-amber-400 border border-amber-500/30 flex items-center gap-1 font-semibold shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-neutral-100 group-hover:text-white transition-colors">
                {item.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>

            <CardFooter className="pt-4 border-neutral-800">
              <span className="text-xs text-neutral-500">{item.category}</span>
              <Link
                href={`/?prompt=${encodeURIComponent(item.prompt)}${
                  item.parallax ? "&parallax=true" : ""
                }`}
              >
                <Button
                  size="sm"
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold border-0 shadow-md shadow-white/5"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 text-neutral-950" />}
                >
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
