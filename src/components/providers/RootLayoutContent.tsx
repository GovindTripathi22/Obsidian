"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isEditor = pathname?.startsWith("/editor");

  // Home page: full-width, no sidebar (uses its own SiteHeader)
  // Editor: full-width, no sidebar (has its own layout)
  if (isHome || isEditor) {
    return <>{children}</>;
  }

  // All other pages: dark sidebar + dark header shell
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
