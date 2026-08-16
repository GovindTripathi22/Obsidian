"use client";

import React, { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  opacity?: number;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  opacity = 0.75,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;

    const playVideo = () => {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Video autoplay waiting for interaction:", err);
          const handleFirstClick = () => {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
            window.removeEventListener("click", handleFirstClick);
            window.removeEventListener("touchstart", handleFirstClick);
            window.removeEventListener("keydown", handleFirstClick);
          };
          window.addEventListener("click", handleFirstClick, { once: true });
          window.addEventListener("touchstart", handleFirstClick, { once: true });
          window.addEventListener("keydown", handleFirstClick, { once: true });
        });
    };

    playVideo();
  }, [src]);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* ── High-Visibility Video Element ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover scale-100 filter saturate-125 contrast-110"
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Subtle Top & Bottom Vignette for Crisp Contrast */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-zinc-800/20 via-transparent to-transparent blur-3xl" />
    </div>
  );
};
