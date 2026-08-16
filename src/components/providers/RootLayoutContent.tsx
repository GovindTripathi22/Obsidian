"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = pathname === "/" || pathname === "/builder" || pathname === "/shopify" || pathname?.startsWith("/editor");

  // Full-width immersive studios: Website Builder (/), Shopify Studio (/builder, /shopify), and Editor
  if (isFullWidth) {
    return <>{children}</>;
  }

  // Management & account pages: Projects, Inspiration, Billing, Design System
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 pt-16 pl-64 min-h-screen flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
