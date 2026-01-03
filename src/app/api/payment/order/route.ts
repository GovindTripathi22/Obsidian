import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Initialize Cashfree Instance
// Constructor: (Env, ClientId, ClientSecret) - Env: 1=Sandbox, 2=Production
const cashfree = new Cashfree(
    process.env.CASHFREE_ENV === "PRODUCTION" ? 2 : 1,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

export async function POST() {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orderId = `order_${Date.now()}`;
    const userEmail = user.emailAddresses[0]?.emailAddress || "customer@example.com";
    const userPhone = "9999999999";

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
        const response = await cashfree.PGCreateOrder(request as any);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Cashfree Error:", error?.response?.data || error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
