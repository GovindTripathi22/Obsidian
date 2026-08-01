"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CreditCard, Check, Crown, ExternalLink } from "lucide-react";

export default function BillingPage() {
  const { user } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const currentPlan = user?.plan || "free";

  const handleCheckout = async (planTier: string) => {
    setLoadingTier(planTier);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error("Checkout error:", e);
    } finally {
      setLoadingTier(null);
    }
  };

  const PLANS = [
    {
      id: "free",
      name: "Free Starter",
      price: "$0",
      period: "forever",
      description: "Ideal for exploring AI store generation.",
      features: [
        "Up to 2 AI store projects",
        "Static HTML & PNG exports",
        "Standard Gemini 2.5 Flash model",
        "Community support",
      ],
      badge: "Basic",
      buttonVariant: "outline" as const,
    },
    {
      id: "monthly",
      name: "Pro Monthly",
      price: "$9.99",
      period: "/ month",
      description: "Full Shopify Liquid theme compiler & unlimited projects.",
      features: [
        "Unlimited store projects",
        "Full Shopify Liquid theme exports (.ZIP)",
        "ImageKit AI background removal & upscaling",
        "InsForge PostgreSQL database persistence",
        "Priority Gemini streaming pipeline",
      ],
      badge: "Popular",
      buttonVariant: "primary" as const,
    },
    {
      id: "yearly",
      name: "Pro Annual",
      price: "$79.99",
      period: "/ year",
      description: "Save 33% with annual billing & team features.",
      features: [
        "Everything in Pro Monthly",
        "Save 33% ($79.99 vs $119.88)",
        "Unlimited Shopify Liquid exports",
        "ImageKit AI premium quotas",
        "Dedicated agentic PR reviews (Code Rabbit)",
      ],
      badge: "Best Value",
      buttonVariant: "primary" as const,
    },
  ];

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-10 bg-zinc-950 min-h-screen text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>MONETIZATION & SUBSCRIPTION MANAGEMENT</span>
        </div>
        <h1 className="text-3xl font-black font-heading text-zinc-100 tracking-tight">
          Subscription Plans & Quotas
        </h1>
        <p className="text-zinc-400 text-sm">
          Select a subscription tier to unlock unlimited Shopify Liquid theme exports, ImageKit AI transformations, and high-speed generation pipelines.
        </p>
      </div>

      {/* Current Active Plan Status Bar */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-mono text-zinc-400 uppercase font-semibold">Current Account Tier</p>
            <h3 className="text-lg font-extrabold font-heading text-zinc-100 flex items-center gap-2">
              {currentPlan === "pro" ? "Pro Unlimited Subscription" : "Free Plan (2 Projects Max)"}
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                Active
              </span>
            </h3>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={() => alert("Redirecting to Stripe Customer Portal...")}
        >
          Manage Subscription Portal
        </Button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = (currentPlan === "free" && plan.id === "free") || (currentPlan === "pro" && plan.id !== "free");
          const isPro = plan.id === "monthly" || plan.id === "yearly";

          return (
            <Card
              key={plan.id}
              glass={false}
              className={`relative flex flex-col justify-between p-6 border-zinc-800 bg-zinc-900 ${
                plan.id === "monthly"
                  ? "border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/30"
                  : plan.id === "yearly"
                  ? "border-zinc-700"
                  : "border-zinc-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      isPro
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  {isCurrent && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Active Plan
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold font-heading text-zinc-100">{plan.name}</h2>
                <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-black font-heading text-zinc-100 tracking-tight">{plan.price}</span>
                  <span className="text-xs text-zinc-400 font-mono ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant={isCurrent ? "outline" : isPro ? "primary" : "secondary"}
                  className={`w-full ${
                    isCurrent
                      ? "bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed hover:bg-zinc-800/80 hover:text-zinc-500"
                      : isPro
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/30 border-0"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                  }`}
                  disabled={isCurrent}
                  isLoading={loadingTier === plan.id}
                  onClick={() => handleCheckout(plan.id)}
                >
                  {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
