"use client";

import { Button } from "@/components/ui/button";
import { Check, Hexagon, Loader2 } from "lucide-react";
import { useState } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            // 1. Create Order
            const response = await fetch("/api/payment/order", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to create order");

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Obsidian Builder",
                description: "100 Credits - Starter Creator",
                order_id: data.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (verifyRes.ok) {
                            toast.success("Payment Successful! 100 Credits Added.");
                            router.push("/workspace");
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (error) {
                        toast.error("Error verifying payment.");
                    }
                },
                prefill: {
                    name: "Creator",
                    email: "creator@example.com",
                },
                theme: {
                    color: "#10b981", // Emerald-500
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            toast.error("Failed to initiate payment.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b border-white/5 bg-black/50 px-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 font-bold">
                    <Hexagon className="h-6 w-6 fill-white text-white" />
                    <span>Obsidian</span>
                </div>
            </header>

            <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-20">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                        Simple Pricing.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Start building your dream projects today.
                    </p>
                </div>

                <div className="relative group max-w-sm w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500 to-emerald-900 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />

                    <div className="relative flex flex-col p-8 rounded-2xl bg-zinc-900 border border-white/10 h-full">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Starter Creator</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">₹79</span>
                                <span className="text-zinc-500">/one-time</span>
                            </div>
                            <p className="text-sm text-zinc-400 mt-2">Perfect for side projects & portfolios.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>100 AI Generation Credits</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>High-Quality Gemini 1.5 Flash</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>Code Export & Hosting</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-zinc-300">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>Priority Support</span>
                            </li>
                        </ul>

                        <Button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Buy Now"}
                        </Button>
                        <p className="text-xs text-center text-zinc-600 mt-4">Secured by Razorpay</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
