import { SiteHeader } from "@/components/SiteHeader";
import { LandingPageClient } from "@/components/LandingPageClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Original Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-45"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Subtle Ambient Radial Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-radial from-emerald-950/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        <LandingPageClient />
      </div>
    </div>
  );
}
