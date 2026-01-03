
import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, tone } = await req.json();

        if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

        const model = getGeminiModel();
        const prompt = `You are a professional conversion copywriter. 
        Rewrite the following text to be ${tone || "professional, punchy, and engaging"}.
        Keep the meaning the same but improve the flow and impact.
        Do NOT add quotes or explanations. Just return the rewritten text.
        
        Original Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const rewritten = result.response.text();

        return NextResponse.json({ text: rewritten.trim() });
    } catch (error) {
        console.error("Rewrite Error:", error);
        return NextResponse.json({ error: "Failed to rewrite" }, { status: 500 });
    }
}
