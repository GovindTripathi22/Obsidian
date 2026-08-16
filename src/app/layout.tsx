import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RootLayoutContent } from "@/components/providers/RootLayoutContent";
import { AuthModals } from "@/components/auth/AuthModals";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";

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
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-white/20 selection:text-white">
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
          <AuthModals />
          <GoogleOneTap />
        </AuthProvider>
      </body>
    </html>
  );
}

