import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RootLayoutContent } from "@/components/providers/RootLayoutContent";
import { AuthModals } from "@/components/auth/AuthModals";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";

export const metadata: Metadata = {
  title: "Obsidian Builder — AI Website & Shopify Theme Generator",
  description:
    "Generate production-ready websites and Shopify Liquid themes from a single prompt. Edit visually, export clean code, and launch your store in minutes.",
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <AuthProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
      <AuthModals />
      <GoogleOneTap />
    </AuthProvider>
  );

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0a0a0a] text-neutral-100 selection:bg-white/15 selection:text-white">
        {clerkPublishableKey ? (
          <ClerkProvider
            publishableKey={clerkPublishableKey}
            appearance={{
              variables: {
                colorPrimary: "#ffffff",
                colorBackground: "#09090b",
              },
              elements: {
                card: "bg-zinc-950 border border-zinc-800 shadow-2xl text-zinc-100",
                navbar: "bg-zinc-950",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-zinc-400",
                formButtonPrimary: "bg-white text-zinc-950 hover:bg-zinc-200 font-bold",
                footerActionLink: "text-white hover:text-zinc-300",
              },
            }}
          >
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}

