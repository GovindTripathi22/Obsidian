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
      buttonVariant: "pink" as const,
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
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-pink-600 font-semibold">
          <CreditCard className="w-4 h-4" />
          <span>MONETIZATION & SUBSCRIPTION MANAGEMENT</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans & Quotas</h1>
        <p className="text-slate-500 text-sm">
          Select a subscription tier to unlock unlimited Shopify Liquid theme exports, ImageKit AI transformations, and high-speed generation pipelines.
        </p>
      </div>

      {/* Current Active Plan Status Bar */}
      <div className="p-4 rounded-2xl border border-indigo-200 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase font-semibold">Current Account Tier</p>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              {currentPlan === "pro" ? "Pro Unlimited Subscription" : "Free Plan (2 Projects Max)"}
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Active
              </span>
            </h3>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
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

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 border-slate-200 bg-white ${
                plan.id === "monthly" ? "border-pink-300 ring-2 ring-pink-500/20 shadow-xl" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    {plan.badge}
                  </span>
                  {isCurrent && (
                    <span className="text-xs font-mono text-emerald-700 flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Active Plan
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-mono ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
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
