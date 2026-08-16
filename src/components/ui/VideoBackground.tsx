"use client";

import React, { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  opacity?: number;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  opacity = 0.4,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Bulletproof React 19 muted autoplay policy bypass
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: retry play on first user interaction if browser policy paused it
        const handleInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("touchstart", handleInteraction);
        };
        window.addEventListener("click", handleInteraction, { once: true });
        window.addEventListener("touchstart", handleInteraction, { once: true });
      });
    }
  }, [src]);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover scale-105 filter saturate-150 transition-opacity duration-1000"
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Dark Contrast Vignette Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-radial from-emerald-950/30 via-transparent to-transparent blur-3xl" />
    </div>
  );
};
