"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ShopifyThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("shopify_builder_theme") as Theme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("shopify_builder_theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`transition-colors duration-500 ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useShopifyTheme = () => useContext(ThemeContext);
