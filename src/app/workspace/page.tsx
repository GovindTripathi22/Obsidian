import { Button } from "@/components/ui/button";
import { getUserProjects } from "@/lib/db-actions";
import { auth } from "@clerk/nextjs/server";
import { Plus, Clock, ArrowRight, Code } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const projects = await getUserProjects(userId);

    return (
        <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
            <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-zinc-400 mt-1">Manage and edit your generated websites.</p>
                </div>
                <Button asChild className="bg-white text-black hover:bg-zinc-200">
                    <Link href="/workspace/project/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Link>
                </Button>
            </header>

            {projects.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                        <Code className="h-8 w-8 text-zinc-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                    <p className="text-zinc-400 mb-8">
                        Start by creating your first project. Describe your dream website and watch it come to life.
                    </p>
                    <Button asChild className="bg-white text-black hover:bg-zinc-200">
                        <Link href="/workspace/project/new">
                            Create Project
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/workspace/project/${project.id}`}
                            className="group relative flex flex-col h-[280px] rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all hover:border-zinc-700 overflow-hidden"
                        >
                            {/* Preview Placeholder (Since we don't have screenshots yet, use a code pattern or gradient) */}
                            <div className="flex-1 bg-gradient-to-br from-zinc-900 to-black p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>
                                <div className="relative z-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="w-full h-2 bg-zinc-800 rounded-full mb-2 w-[40%]"></div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full mb-2 w-[80%]"></div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full w-[60%]"></div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowRight className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-zinc-800/50 bg-black/40 backdrop-blur-sm">
                                <h3 className="font-medium text-white truncate pr-4">{project.name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
