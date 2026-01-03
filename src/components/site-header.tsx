import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Hexagon } from "lucide-react";

import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

export async function SiteHeader() {
  const user = await currentUser();
  const isAdmin = user?.emailAddresses?.some(e => e.emailAddress === process.env.ADMIN_EMAIL);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <Hexagon className="h-6 w-6 fill-white text-white" />
            <span>Obsidian</span>
          </Link>
          {isAdmin && (
            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all font-mono text-[10px] tracking-widest uppercase">
              Admin Access
            </Badge>
          )}
        </div>
        <nav className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                Sign In
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button className="bg-white text-black hover:bg-zinc-200">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-900 mr-2">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-900 mr-2">
              <Link href="/workspace">My Projects</Link>
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
