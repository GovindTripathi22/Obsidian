
import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Initialize Cashfree Instance
const cashfree = new Cashfree(
    process.env.CASHFREE_ENV === "PRODUCTION" ? 2 : 1,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();

    try {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        // Check if any transaction is SUCCESS
        const successfulPayment = response.data.find((tx: any) => tx.payment_status === "SUCCESS");

        if (successfulPayment) {
            // Payment Verified - Add Credits
            await db.update(users)
                .set({
                    credits: sql`${users.credits} + 100`
                })
                .where(eq(users.clerkId, userId));

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
