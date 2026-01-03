
import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Change to PRODUCTION for live

export async function POST() {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orderId = `order_${Date.now()}`;
    const userEmail = user.emailAddresses[0]?.emailAddress || "customer@example.com";
    const userPhone = "9999999999"; // Cashfree requires phone, using dummy if not available

    const request = {
        order_amount: 79.00,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: userId,
            customer_phone: userPhone,
            customer_email: userEmail,
            customer_name: user.firstName || "Creator"
        },
        order_meta: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?order_id=${orderId}`,
        }
    };

    try {
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Cashfree Error:", error?.response?.data || error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
