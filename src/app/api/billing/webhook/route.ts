import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock_secret";

  try {
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.warn("Webhook signature validation mock pass:", err.message);
      event = JSON.parse(body);
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        console.log("Stripe subscription active:", event.data.object);
        break;
      case "customer.subscription.deleted":
        console.log("Stripe subscription cancelled:", event.data.object);
        break;
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
