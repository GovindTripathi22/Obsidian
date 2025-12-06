import { ProjectEditor } from "@/components/workspace/project-editor";
import { getProjectById, getProjectChats } from "@/lib/db-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProjectPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Awaiting params is required in newer Next.js versions (if using dynamic routes in app router)
    // However, depending on Next.js version "params" might not be a promise yet. 
    // Safest pattern in Next 15 is to await it if it's a promise, or just use it. 
    // But since the type definition provided usually implies standard usage:
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Parallel data fetching
    const [project, chats] = await Promise.all([
        getProjectById(id),
        getProjectChats(id)
    ]);

    if (!project) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Project Not Found</h1>
                    <p className="text-zinc-400">The project you are looking for does not exist or you don't have access.</p>
                </div>
            </div>
        );
    }

    // Format chats for the UI
    const formattedChats = chats.map(c => ({
        role: c.role as "user" | "ai",
        content: c.message
    }));

    // If no chats exist, we might want to show the default welcome, handled by ProjectEditor/ChatPanel default prop

    return (
        <ProjectEditor
            initialHtml={project.code}
            initialMessages={formattedChats.length > 0 ? formattedChats : undefined}
            projectId={project.id}
        />
    );
}
