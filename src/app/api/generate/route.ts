import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { checkAndDeductCredits } from "@/lib/db-actions";

export const runtime = "nodejs"; // Switch to nodejs for DB access
// Force Rebuild: 2025-12-04 14:55

export async function POST(req: Request) {
    try {
        console.log("API Route Hit: /api/generate");
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check and deduct credits
        console.log("Checking credits for user:", userId);
        const creditResult = await checkAndDeductCredits(userId, user.emailAddresses[0].emailAddress);
        console.log("Credit result:", creditResult);

        if (!creditResult.success) {
            console.error("Insufficient credits");
            return NextResponse.json({ error: "Insufficient credits. Please upgrade." }, { status: 403 });
        }

        const { prompt } = await req.json();
        console.log("Generating for prompt:", prompt.substring(0, 50) + "...");

        const systemPrompt = `
      You are an expert Frontend Developer. You generate production-ready, responsive HTML code using Tailwind CSS CDN. 
      
      **CRITICAL RULES:**
      1. **NO MARKDOWN**: Do NOT wrap the code in \`\`\`html or \`\`\`. Return ONLY the raw HTML string.
      2. **NO PLACEHOLDERS**: Do NOT use "Lorem Ipsum". Write REAL, professional copy relevant to the user's request.
      3. **IMAGES**: Use 'https://image.pollinations.ai/prompt/description?width=800&height=600&nologo=true' for images. Replace 'description' with a URL-encoded description.
      4. **STYLING**: You MUST include the Tailwind CDN in the <head>: <script src="https://cdn.tailwindcss.com"></script>. This is non-negotiable.
      
      **DESIGN SYSTEM (LOVABLE / V0 TIER):**
      
      **1. Typography & Layout**
      - Font: Use 'Inter' via Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      - Body: \`font-family: 'Inter', sans-serif;\`
      - Spacing: Use generous whitespace. Section padding: \`py-20\` or \`py-24\`. Gap: \`gap-8\` or \`gap-12\`.
      - Container: Use \`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\`.
      
      **2. Aesthetics (Glassmorphism & Clean)**
      - **Cards**: \`bg-white/80 backdrop-blur-md border border-white/20 shadow-xl shadow-black/5 rounded-2xl\`.
      - **Buttons**: \`rounded-full px-8 py-3 font-medium transition-all duration-300 hover:scale-105 active:scale-95\`.
      - **Gradients**: Use subtle, mesh-like gradients for backgrounds (e.g., \`bg-gradient-to-br from-indigo-50 via-white to-cyan-50\`).
      - **Shadows**: Use soft, diffused shadows: \`shadow-[0_8px_30px_rgb(0,0,0,0.04)]\`.
      
      **3. Color Palette (Modern & Premium)**
      - Primary: Indigo-600, Violet-600, or Emerald-600 (depending on vibe).
      - Text: \`text-zinc-900\` (headings), \`text-zinc-500\` (body).
      - Background: \`bg-zinc-50\` or subtle gradients. NEVER plain white #FFFFFF for the main background.
      
      **4. Components**
      - **Hero**: Large H1 (text-5xl/6xl), tracking-tight, balanced text. Two buttons (Primary & Ghost).
      - **Features**: Grid (cols-1 md:cols-3). Cards with icons (use SVG paths or Lucide-like placeholders).
      - **Navbar**: Sticky, glassmorphism, logo left, links center, CTA right.
      
      **Technical Requirements:**
      - Complete HTML document with <html>, <head> (Tailwind CDN + Fonts), and <body>.
      - <script src="https://cdn.tailwindcss.com"></script>
      - <script>tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } } } }</script>
      - Include a <title> tag with a CREATIVE name.
    `;

        const model = getGeminiModel();
        console.log("Model initialized. Starting stream...");

        try {
            const result = await model.generateContentStream([systemPrompt, prompt]);
            console.log("Stream started successfully.");

            // Create a stream
            const stream = new ReadableStream({
                async start(controller) {
                    const encoder = new TextEncoder();
                    try {
                        for await (const chunk of result.stream) {
                            const chunkText = chunk.text();
                            controller.enqueue(encoder.encode(chunkText));
                        }
                        console.log("Stream finished.");
                    } catch (streamError) {
                        console.error("Stream error inside ReadableStream:", streamError);
                        controller.error(streamError);
                    }
                    controller.close();
                },
            });

            return new NextResponse(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });
        } catch (genError) {
            console.error("Gemini Generation Error:", genError);
            throw genError;
        }
    } catch (error) {
        console.error("Error generating code:", error);
        return NextResponse.json({ error: "Failed to generate code", details: String(error) }, { status: 500 });
    }
}
