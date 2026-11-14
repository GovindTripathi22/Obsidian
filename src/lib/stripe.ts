import Stripe from "stripe";

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_development";

export const stripe = new Stripe(stripeSecretKey);
