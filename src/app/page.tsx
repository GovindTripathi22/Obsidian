import { SiteHeader } from "@/components/site-header";
import { LandingPageClient } from "@/components/landing-page-client";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        <SiteHeader />
        <LandingPageClient />
      </div>
    </div>
  );
}
