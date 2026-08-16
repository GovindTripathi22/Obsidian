import { SiteHeader } from "@/components/SiteHeader";
import { LandingPageClient } from "@/components/LandingPageClient";
import { VideoBackground } from "@/components/ui/VideoBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Bulletproof Autoplay Background Video */}
      <VideoBackground src="/background.mp4" opacity={0.75} />

      <div className="relative z-10">
        <SiteHeader />
        <LandingPageClient />
      </div>
    </div>
  );
}
