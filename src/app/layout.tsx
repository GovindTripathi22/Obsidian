import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "StitchStore AI - AI Shopify E-Commerce Generator",
  description: "Generate, customize, and export high-converting Shopify Liquid themes and e-commerce web applications powered by Gemini AI and InsForge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        <AuthProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 pt-16 pl-64 min-h-screen flex flex-col">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
