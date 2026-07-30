"use client";

import React from "react";
import { useShopifyTheme } from "@/components/providers/ShopifyThemeProvider";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useShopifyTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={`relative inline-flex items-center justify-between p-1.5 w-16 h-8 rounded-full border transition-all duration-300 shadow-inner group ${
        isDark
          ? "bg-slate-900 border-slate-700 text-amber-400 shadow-slate-950/80"
          : "bg-slate-200 border-slate-300 text-slate-700 shadow-slate-300/60"
      } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Sun Icon */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ${
          isDark ? "opacity-40 scale-75 text-slate-500" : "opacity-100 scale-100 text-amber-500"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
          clipRule="evenodd"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ${
          isDark ? "opacity-100 scale-100 text-indigo-400" : "opacity-40 scale-75 text-slate-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>

      {/* Animated Sliding Pill */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center border ${
          isDark
            ? "translate-x-8 bg-slate-800 border-indigo-500/50 shadow-indigo-500/20"
            : "translate-x-0 bg-white border-slate-300 shadow-slate-400/30"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isDark ? "bg-indigo-400 animate-pulse" : "bg-amber-500"
          }`}
        />
      </span>
    </button>
  );
};
