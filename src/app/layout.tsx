import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { RootLayoutContent } from "@/components/providers/RootLayoutContent";

export const metadata: Metadata = {
  title: "Obsidian Builder — AI Website & Shopify Theme Generator",
  description:
    "Generate production-ready websites and Shopify Liquid themes from a single prompt. Edit visually, export clean code, and launch your store in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-black text-white font-sans selection:bg-zinc-800 selection:text-white">
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
