import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const model = getGeminiModel();

        const systemPrompt = "You are an expert AI Image Prompt Engineer. Your task is to take a simple user prompt and expand it into a detailed, high-quality prompt suitable for an AI image generator like Stable Diffusion or Midjourney. Focus on lighting, style, texture, and composition. Return ONLY the enhanced prompt text, nothing else.";

        const result = await model.generateContent([systemPrompt, prompt]);
        const enhancedPrompt = result.response.text();

        return NextResponse.json({ enhancedPrompt });
    } catch (error) {
        console.error("Prompt enhancement failed:", error);
        return NextResponse.json({ error: "Failed to enhance prompt" }, { status: 500 });
    }
}
