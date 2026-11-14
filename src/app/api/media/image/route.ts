import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

const LOCAL_ASSET_LIBRARY: Array<{ keywords: string[]; url: string; label: string }> = [
  {
    keywords: ["tokyo", "cyber", "neon", "shibuya", "shinjuku", "japan", "city", "night", "metropolis"],
    url: "/images/parallax-tokyo.jpg",
    label: "Tokyo Nocturnal Skyline",
  },
  {
    keywords: ["alpine", "alps", "mountain", "swiss", "switzerland", "cliff", "nature", "horizon", "snow", "peak"],
    url: "/images/parallax-alps.jpg",
    label: "Alpine Horizon Sanctuary",
  },
  {
    keywords: ["nyc", "manhattan", "new york", "skyscraper", "tower", "architecture", "building", "urban", "street"],
    url: "/images/parallax-nyc.jpg",
    label: "Manhattan Supertall Noir",
  },
  {
    keywords: ["hoodie", "streetwear", "apparel", "clothing", "fashion", "jacket", "tee", "garment"],
    url: "/images/product-streetwear.jpg",
    label: "Technical Streetwear Lookbook",
  },
  {
    keywords: ["audio", "headphone", "speaker", "tech", "titanium", "keyboard", "hardware", "gadget"],
    url: "/images/product-audio.jpg",
    label: "Aerospace Titanium Audio",
  },
  {
    keywords: ["coffee", "roast", "espresso", "cafe", "pour-over", "ceramic", "artisan", "bean"],
    url: "/images/product-coffee.jpg",
    label: "Artisanal Pour-Over Studio",
  },
  {
    keywords: ["skincare", "serum", "beauty", "cosmetic", "bottle", "botanical", "perfume", "luxury"],
    url: "/images/product-skincare.jpg",
    label: "Obsidian Botanical Serum",
  },
];

function selectCuratedImageForPrompt(prompt: string): { url: string; label: string } {
  const lower = (prompt || "").toLowerCase();
  for (const entry of LOCAL_ASSET_LIBRARY) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { url: entry.url, label: entry.label };
    }
  }
  return { url: "/images/parallax-tokyo.jpg", label: "Obsidian Architectural Study" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = (body?.prompt || "").trim();
    const aspectRatio = body?.aspectRatio || "16:9";

    if (!prompt) {
      return NextResponse.json({ error: "Image prompt is required" }, { status: 400 });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as "1:1" | "16:9" | "4:3" | "3:4" | "9:16",
            },
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType ?? "image/png";
            return NextResponse.json({
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              label: prompt.slice(0, 48),
              source: "gemini-image",
            });
          }
        }
      } catch (err) {
        console.warn("Gemini image model fallback to curated local studio asset:", err);
      }
    }

    const matched = selectCuratedImageForPrompt(prompt);
    return NextResponse.json({
      imageUrl: matched.url,
      label: matched.label,
      prompt,
      source: "obsidian-studio-library",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to synthesize image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
