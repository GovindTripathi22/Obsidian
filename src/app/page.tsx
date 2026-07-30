import { SiteHeader } from "@/components/SiteHeader";
import { LandingPageClient } from "@/components/LandingPageClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white relative overflow-x-hidden">
      {/* Subtle radial ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-zinc-800/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-emerald-950/10 blur-3xl" />
      </div>

      {/* Scanlines overlay for retro feel */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)",
        }}
      />

      <div className="relative z-10">
        <SiteHeader />
        <LandingPageClient />
      </div>
    </div>
  );
}
