import { db } from "@/db";
import { projects, frames } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, code } = await req.json();

        // 1. Create Project
        const [project] = await db.insert(projects).values({
            name: name || "Untitled Project",
            createdBy: userId,
        }).returning();

        // 2. Create Initial Frame
        const [frame] = await db.insert(frames).values({
            projectId: project.id,
            code: code,
        }).returning();

        return NextResponse.json({ projectId: project.id, frameId: frame.id });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
