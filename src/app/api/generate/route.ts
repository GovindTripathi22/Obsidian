import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDummyKeyForDevelopmentSetup";
const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt, projectId, pageName = "Home Page" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `You are an expert AI front-end engineer and Shopify Liquid Theme designer.
Generate a complete, modern, responsive HTML page styled strictly with Tailwind CSS utility classes for an e-commerce store based on the user prompt.

DESIGN CONSTRAINTS:
1. Color Palette: Use dark slate background (#090d16), indigo accents (#6366f1), pink accents (#ec4899) for fashion/beauty themes, emerald (#10b981) for prices, and slate-900 cards with border-slate-800.
2. Structure: Include a Navigation Header with cart count, a Hero Banner section with CTA button, a Featured Products grid (4 products with titles, prices, ratings, and image tags), a Features/Benefits grid, Customer Reviews carousel, and a Footer.
3. Images: Use ImageKit endpoint URL format for image placeholders:
   <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80" alt="Product Image" class="w-full h-full object-cover rounded-lg" />
4. OUTPUT FORMAT: Output ONLY pure valid HTML inside a \`\`\`html codeblock. Do not include markdown preamble outside the codeblock. Ensure all interactive sections have unique IDs and data-section attributes (e.g. data-section="hero", data-section="products").`;

    // Try live Gemini API model call or fallback generator if API key is in dev mode
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContentStream([
        systemInstruction,
        `User Prompt: ${prompt} for page: ${pageName}`,
      ]);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (apiError) {
      console.warn("Gemini API stream fallback activated:", apiError);
      
      // High quality fallback e-commerce HTML stream for rapid development & testing
      const generatedHtml = generateFallbackEcommerceHtml(prompt, pageName);
      return new NextResponse(generatedHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}

function generateFallbackEcommerceHtml(prompt: string, pageName: string): string {
  const isPinkTheme = prompt.toLowerCase().includes("fashion") || prompt.toLowerCase().includes("cosmetics") || prompt.toLowerCase().includes("pink");

  return `
<section data-section="announcement-bar" class="bg-indigo-600/20 border-b border-indigo-500/20 py-2 px-4 text-center text-xs font-mono text-indigo-300">
  🚀 Spring Sale Active: Use code <strong class="text-white">STITCH2026</strong> for 20% OFF all Shopify liquid orders
</section>

<header data-section="header" class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg ${isPinkTheme ? 'bg-pink-600' : 'bg-indigo-600'} flex items-center justify-center font-bold text-white text-lg">
      S
    </div>
    <span class="font-extrabold text-xl tracking-tight text-white">LuxeAura Store</span>
  </div>
  <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
    <a href="#hero" class="hover:text-white transition-colors">Home</a>
    <a href="#products" class="hover:text-white transition-colors">Catalog</a>
    <a href="#features" class="hover:text-white transition-colors">Features</a>
    <a href="#reviews" class="hover:text-white transition-colors">Reviews</a>
  </nav>
  <div class="flex items-center gap-3">
    <button class="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
      🛒 <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full ${isPinkTheme ? 'bg-pink-500' : 'bg-indigo-500'} text-[10px] text-white flex items-center justify-center font-bold">3</span>
    </button>
  </div>
</header>

<section data-section="hero" id="hero" class="relative py-24 px-6 text-center border-b border-slate-800/80 overflow-hidden">
  <div class="max-w-4xl mx-auto space-y-6 relative z-10">
    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full ${isPinkTheme ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'} text-xs font-mono border">
      ✨ Next-Gen Shopify Collection
    </span>
    <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
      ${prompt.slice(0, 50) || "Next-Generation Luxury E-Commerce Store"}
    </h1>
    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
      Handcrafted with premium materials, real-time dynamic styling, and instant Shopify Liquid 2.0 theme export compatibility.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <button class="px-8 py-3.5 rounded-xl ${isPinkTheme ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-600/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'} text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5">
        Explore Collection →
      </button>
      <button class="px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold transition-all">
        Watch Lookbook
      </button>
    </div>
  </div>
</section>

<section data-section="products" id="products" class="py-20 px-6 max-w-7xl mx-auto border-b border-slate-800/80">
  <div class="flex items-center justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold text-slate-100">Featured Products</h2>
      <p class="text-xs text-slate-400 mt-1">Curated selections updated live via ImageKit AI transformation</p>
    </div>
    <span class="text-xs font-mono ${isPinkTheme ? 'text-pink-400' : 'text-indigo-400'}">4 Products Active</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition-all hover:shadow-xl">
      <div class="aspect-square bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
        <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80" alt="Rose Velvet Serum" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded ${isPinkTheme ? 'bg-pink-500/10 text-pink-400' : 'bg-indigo-500/10 text-indigo-400'}">Best Seller</span>
      <h3 class="text-base font-semibold text-slate-100 mt-2">Rose Velvet Botanical Serum</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-emerald-400 font-mono">$84.00</span>
        <button class="px-3 py-1.5 rounded-lg ${isPinkTheme ? 'bg-pink-600 text-white' : 'bg-indigo-600 text-white'} text-xs font-medium">Add to Cart</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition-all hover:shadow-xl">
      <div class="aspect-square bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
        <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80" alt="Midnight Elixir" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Limited Run</span>
      <h3 class="text-base font-semibold text-slate-100 mt-2">Midnight Hydration Elixir</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-emerald-400 font-mono">$110.00</span>
        <button class="px-3 py-1.5 rounded-lg ${isPinkTheme ? 'bg-pink-600 text-white' : 'bg-indigo-600 text-white'} text-xs font-medium">Add to Cart</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition-all hover:shadow-xl">
      <div class="aspect-square bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
        <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80" alt="Luminous Glow Cream" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">New Arrival</span>
      <h3 class="text-base font-semibold text-slate-100 mt-2">Luminous Radiance Cream</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-emerald-400 font-mono">$65.00</span>
        <button class="px-3 py-1.5 rounded-lg ${isPinkTheme ? 'bg-pink-600 text-white' : 'bg-indigo-600 text-white'} text-xs font-medium">Add to Cart</button>
      </div>
    </div>

    <div class="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition-all hover:shadow-xl">
      <div class="aspect-square bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
        <img src="https://images.unsplash.com/photo-1608248597560-841793739798?w=800&auto=format&fit=crop&q=80" alt="Organic Essence Oil" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">Organic</span>
      <h3 class="text-base font-semibold text-slate-100 mt-2">Pure Organic Essence Oil</h3>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-bold text-emerald-400 font-mono">$92.00</span>
        <button class="px-3 py-1.5 rounded-lg ${isPinkTheme ? 'bg-pink-600 text-white' : 'bg-indigo-600 text-white'} text-xs font-medium">Add to Cart</button>
      </div>
    </div>
  </div>
</section>

<footer data-section="footer" id="footer" class="py-12 px-6 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500 space-y-4">
  <div class="flex items-center justify-center gap-6 font-medium text-slate-400">
    <a href="#" class="hover:text-white">Shipping & Returns</a>
    <a href="#" class="hover:text-white">Shopify Liquid Spec</a>
    <a href="#" class="hover:text-white">Privacy Policy</a>
    <a href="#" class="hover:text-white">Support</a>
  </div>
  <p>© ${new Date().getFullYear()} LuxeAura Store. Powered by StitchStore AI & InsForge BaaS.</p>
</footer>
`;
}
