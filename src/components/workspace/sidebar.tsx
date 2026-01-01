import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hexagon, Plus, Layout, MessageSquare, Settings, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserCredits, getUserProjects } from "@/lib/db-actions";

export async function WorkspaceSidebar() {
    const { userId } = await auth();
    const user = await currentUser();
    const credits = userId ? await getUserCredits(userId) : 0;
    const projects = userId ? await getUserProjects(userId) : [];

    return (
        <div className="hidden border-r border-zinc-800 bg-black md:flex md:w-64 md:flex-col">
            <div className="flex h-14 items-center border-b border-zinc-800 px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-white">
                    <Hexagon className="h-6 w-6 fill-white text-white" />
                    <span>Obsidian</span>
                </Link>
            </div>

            <div className="flex-1 overflow-hidden py-4">
                <div className="px-4 mb-4">
                    <Button className="w-full justify-start gap-2 bg-white text-black hover:bg-zinc-200" size="sm" asChild>
                        <Link href="/workspace/project/new" target="_blank">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-10rem)] px-2">
                    <div className="space-y-1 p-2">
                        <h4 className="mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Recent Projects
                        </h4>
                        {projects.length === 0 ? (
                            <div className="px-2 text-sm text-zinc-600">No projects yet.</div>
                        ) : (
                            projects.map((project) => (
                                <Button key={project.id} variant="ghost" className="w-full justify-start gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900" asChild>
                                    <Link href={`/workspace/project/${project.id}`}>
                                        <Layout className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                </Button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            <div className="border-t border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {user?.emailAddresses.some(e => e.emailAddress === process.env.ADMIN_EMAIL) ? (
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <span className="text-amber-500 text-xs">👑</span>
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-amber-500">Admin Mode</p>
                                    <p className="text-zinc-500">Unlimited Access</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${credits > 0 ? 'bg-zinc-800' : 'bg-red-900/20'}`}>
                                    <span className={`text-xs font-bold ${credits > 0 ? 'text-white' : 'text-red-500'}`}>{credits}</span>
                                </div>
                                <div className="text-xs text-zinc-400">
                                    <p className="font-medium text-white">Credits</p>
                                    <Link href="/pricing" className="hover:text-white hover:underline">Upgrade</Link>
                                </div>
                            </>
                        )}
                    </div>
                    <UserButton />
                </div>
            </div>
        </div>
    );
}
