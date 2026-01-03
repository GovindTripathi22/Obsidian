import { saveChatMessage } from "@/lib/db-actions";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { role, message } = await req.json();

        if (!role || !message) {
            return NextResponse.json({ error: "Missing role or message" }, { status: 400 });
        }

        await saveChatMessage(params.id, role, message);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save Message Error:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}
