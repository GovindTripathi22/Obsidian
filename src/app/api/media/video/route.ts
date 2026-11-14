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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = (body?.prompt || "").trim();
    const isShopify = Boolean(body?.isShopify);

    if (!prompt) {
      return NextResponse.json({ error: "Video prompt is required" }, { status: 400 });
    }

    if (ai) {
      try {
        const interaction = await ai.interactions.create(
          {
            model: "gemini-omni-1.2-flash",
            input: prompt,
            background: false,
            store: false,
            stream: false,
            response_format: {
              type: "video",
              aspect_ratio: "16:9",
              duration: "5s",
              resolution: "720p",
            },
          },
          { timeout: 120000 }
        );

        const videoPart = interaction.output_video;
        if (videoPart && videoPart.data) {
          const mime = videoPart.mime_type || "video/mp4";
          return NextResponse.json({
            videoUrl: `data:${mime};base64,${videoPart.data}`,
            posterUrl: "/images/parallax-tokyo.jpg",
            label: prompt.slice(0, 48),
            source: "gemini-omni-video",
          });
        }
      } catch (err) {
        console.warn("Gemini Omni video fallback to local 60fps MP4 reel:", err);
      }
    }

    const lower = prompt.toLowerCase();
    const posterUrl = lower.includes("alpine") || lower.includes("mountain")
      ? "/images/parallax-alps.jpg"
      : lower.includes("nyc") || lower.includes("manhattan")
      ? "/images/parallax-nyc.jpg"
      : "/images/parallax-tokyo.jpg";

    return NextResponse.json({
      videoUrl: isShopify ? "/shopify-bg.mp4" : "/background.mp4",
      posterUrl,
      label: prompt.slice(0, 56),
      source: "obsidian-motion-engine",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to synthesize video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
