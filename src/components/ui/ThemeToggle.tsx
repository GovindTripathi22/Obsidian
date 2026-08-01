"use client";

import React from "react";
import { useShopifyTheme } from "@/components/providers/ShopifyThemeProvider";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme, isDark } = useShopifyTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={`relative w-14 h-7 rounded-full border transition-all duration-300 ${
        isDark
          ? "bg-zinc-800 border-zinc-700"
          : "bg-zinc-300 border-zinc-400"
      } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Track Icons */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5">
        {/* Sun */}
        <svg
          className={`w-3.5 h-3.5 transition-all duration-300 ${isDark ? "text-zinc-600" : "text-amber-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
            clipRule="evenodd"
          />
        </svg>
        {/* Moon */}
        <svg
          className={`w-3.5 h-3.5 transition-all duration-300 ${isDark ? "text-indigo-400" : "text-zinc-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>

      {/* Sliding Thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          isDark
            ? "left-[calc(100%-26px)] bg-zinc-900 border border-indigo-500/40"
            : "left-0.5 bg-white border border-zinc-300"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isDark ? "bg-indigo-400" : "bg-amber-400"}`} />
      </span>
    </button>
  );
};
