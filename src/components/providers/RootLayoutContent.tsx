"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isEditor = pathname?.startsWith("/editor");

  // Home page: full-width dark layout, no sidebar or top header
  if (isHome || isEditor) {
    return <>{children}</>;
  }

  // All other pages: white Stitch layout with sidebar + top header
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
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
