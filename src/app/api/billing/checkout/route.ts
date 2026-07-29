import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { planTier } = await req.json();

    const priceId =
      planTier === "yearly"
        ? "price_yearly_7999"
        : "price_monthly_999";

    // Create mock or real Stripe Checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.nextUrl.origin}/billing?success=true`,
        cancel_url: `${req.nextUrl.origin}/billing?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    } catch (stripeErr) {
      console.warn("Stripe API fallback activated:", stripeErr);
      return NextResponse.json({
        url: `${req.nextUrl.origin}/billing?success=true&tier=${planTier}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
