
import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();

    try {
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        // Check if any transaction is SUCCESS
        const successfulPayment = response.data.find((tx: any) => tx.payment_status === "SUCCESS");

        if (successfulPayment) {
            // Payment Verified - Add Credits
            await db.update(users)
                .set({
                    credits: sql`${users.credits} + 100`
                })
                .where(eq(users.id, userId));

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
