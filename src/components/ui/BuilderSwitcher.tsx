"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hexagon } from "lucide-react";

/* ── Official Shopify SVG Icon ── */
const ShopifyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 109.5 124.5" className={className} fill="currentColor">
    <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.6-2.9-.4 0 0-1.5.5-3.9 1.2-2.3-6.7-6.4-12.8-13.6-12.8h-.6C53.4 3.6 50.7 2 48.4 2 31.3 2 23.2 23.4 20.8 35.3c-6.2 1.9-10.6 3.3-11.1 3.5-3.5 1.1-3.6 1.2-4 4.5C5.3 46 0 92.2 0 92.2l71.2 12.3 38.3-9.5S95.7 28.8 95.6 28.2z" />
  </svg>
);

interface BuilderSwitcherProps {
  active: "website" | "shopify";
  className?: string;
  size?: "sm" | "md";
}

export const BuilderSwitcher: React.FC<BuilderSwitcherProps> = ({
  active,
  className = "",
  size = "md",
}) => {
  const router = useRouter();

  // Prefetch both routes for instant zero-lag switching
  useEffect(() => {
    try {
      router.prefetch("/");
      router.prefetch("/builder");
    } catch {
      // ignore
    }
  }, [router]);

  const handleSwitch = (mode: "website" | "shopify") => {
    if (mode === active) return;
    if (mode === "website") {
      router.push("/");
    } else {
      router.push("/builder");
    }
  };

  const isSmall = size === "sm";

  return (
    <div
      role="tablist"
      aria-label="Engine Mode Switcher"
      className={`relative inline-flex items-center p-1 rounded-2xl bg-neutral-900/95 border border-neutral-800 shadow-xl backdrop-blur-2xl select-none transition-all duration-300 smooth-gpu ${className}`}
    >
      {/* Sliding Active Pill Background (GPU Accelerated) */}
      <div
        style={{
          transform: active === "website" ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
          transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl shadow-lg will-change-transform ${
          active === "website"
            ? "bg-gradient-to-r from-neutral-800 to-neutral-700/90 border border-neutral-600/40 text-white shadow-neutral-950/80"
            : "bg-neutral-800 border border-neutral-600 text-white shadow-black/80"
        }`}
      />

      {/* Website Option */}
      <button
        type="button"
        role="tab"
        aria-selected={active === "website"}
        onClick={() => handleSwitch("website")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer ${
          isSmall ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
        } ${
          active === "website"
            ? "text-white"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
        }`}
      >
        <Hexagon
          className={`shrink-0 transition-transform duration-200 ${
            isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
          } ${active === "website" ? "fill-white text-white scale-105" : "text-neutral-500"}`}
        />
        <span className="truncate">Website</span>
        {active === "website" && (
          <span className="hidden sm:inline-block text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-900/80 text-neutral-300 border border-neutral-700/60 ml-0.5">
            HTML
          </span>
        )}
      </button>

      {/* Shopify Option */}
      <button
        type="button"
        role="tab"
        aria-selected={active === "shopify"}
        onClick={() => handleSwitch("shopify")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer ${
          isSmall ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
        } ${
          active === "shopify"
            ? "text-white"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
        }`}
      >
        <ShopifyIcon
          className={`shrink-0 transition-transform duration-200 ${
            isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
          } ${active === "shopify" ? "fill-white scale-105" : "fill-neutral-500"}`}
        />
        <span className="truncate">Shopify</span>
        {active === "shopify" ? (
          <span className="hidden sm:inline-block text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 ml-0.5">
            Liquid
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-glow-white hidden sm:inline-block ml-0.5" />
        )}
      </button>
    </div>
  );
};
