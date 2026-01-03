import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkAndDeductCredits(clerkId: string, email: string) {
    // 1. Check if user exists, if not create them
    let user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (!user) {
        [user] = await db.insert(users).values({
            clerkId,
            email,
            credits: 5,
            lastGenerationDate: new Date(),
        }).returning();
    }

    if (!user) throw new Error("Failed to create/find user");

    // 2. Check daily reset
    const now = new Date();
    const lastGen = user.lastGenerationDate ? new Date(user.lastGenerationDate) : new Date(0);

    const isToday = now.getDate() === lastGen.getDate() &&
        now.getMonth() === lastGen.getMonth() &&
        now.getFullYear() === lastGen.getFullYear();

    if (!isToday) {
        // Reset credits to 5 if it's a new day
        await db.update(users)
            .set({ credits: 5, lastGenerationDate: now })
            .where(eq(users.clerkId, clerkId));
        user.credits = 5;
    }

    // 3. Check if enough credits
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (email === ADMIN_EMAIL) {
        return { success: true, remaining: 9999 };
    }

    if (user.credits > 0) {
        await db.update(users)
            .set({ credits: user.credits - 1 })
            .where(eq(users.clerkId, clerkId));
        return { success: true, remaining: user.credits - 1 };
    }

    return { success: false, remaining: 0 };
}

export async function getUserCredits(clerkId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });
    return user?.credits ?? 0;
}

export async function getUserProjects(clerkId: string) {
    // Import projects here to avoid circular dependencies if any
    const { projects } = await import("@/db/schema");
    const { desc } = await import("drizzle-orm");

    return await db.query.projects.findMany({
        where: eq(projects.createdBy, clerkId),
        orderBy: [desc(projects.createdAt)],
    });
}

export async function getProjectById(projectId: string) {
    // Import schema dynamically to handle potential circular deps if needed, 
    // though here it's likely safe. Using same pattern for consistency.
    const { projects, frames } = await import("@/db/schema");
    const { desc } = await import("drizzle-orm");

    const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });

    if (!project) return null;

    const latestFrame = await db.query.frames.findFirst({
        where: eq(frames.projectId, projectId),
        orderBy: [desc(frames.createdAt)],
    });

    return {
        ...project,
        code: latestFrame?.code || ""
    };
}

export async function getProjectChats(projectId: string) {
    const { chats } = await import("@/db/schema");
    const { asc } = await import("drizzle-orm");

    return await db.query.chats.findMany({
        where: eq(chats.projectId, projectId),
        orderBy: [asc(chats.createdAt)],
    });
}

export async function saveChatMessage(projectId: string, role: "user" | "ai", message: string) {
    const { chats } = await import("@/db/schema");
    return await db.insert(chats).values({
        projectId,
        role,
        message,
    }).returning();
}
