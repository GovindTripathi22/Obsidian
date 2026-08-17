"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CreditCard, Check, Crown, ExternalLink, Zap } from "lucide-react";

export default function BillingPage() {
  const { user, updateUserPlan } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const currentPlan = user?.plan || "free";

  const handleCheckout = async (planTier: string) => {
    setLoadingTier(planTier);
    try {
      if (planTier === "monthly" || planTier === "yearly") {
        updateUserPlan("pro");
      }
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
      description: "Ideal for exploring AI website & Shopify theme generation.",
      features: [
        "Up to 3 free projects (Obsidian & Shopify)",
        "Static HTML & PNG exports",
        "Standard Gemini 2.5 Flash model",
        "Community support & templates",
      ],
      badge: "Starter",
      buttonVariant: "outline" as const,
    },
    {
      id: "monthly",
      name: "Pro Monthly",
      price: "$9.99",
      period: "/ month",
      description: "Full Shopify Liquid theme compiler & unlimited projects.",
      features: [
        "Unlimited store & website projects",
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
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8 bg-[#0a0a0a] min-h-screen text-neutral-100 font-sans">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <CreditCard className="w-4 h-4 text-neutral-300" />
          <span>Billing & Subscriptions</span>
        </div>
        <h1 className="text-3xl font-semibold text-neutral-100 tracking-tight">
          Plans & Billing
        </h1>
        <p className="text-neutral-400 text-sm">
          Select a subscription tier to unlock unlimited Shopify Liquid theme exports, ImageKit AI transformations, and high-speed generation pipelines.
        </p>
      </div>

      {/* Current Active Plan Status Bar */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700/60 text-white shadow-inner">
            <Crown className="w-5 h-5 text-neutral-200" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Current Plan</p>
            <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              {currentPlan === "pro" ? "Pro Unlimited" : "Free Starter"}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium">
                Active
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentPlan === "pro" ? (
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs"
              onClick={() => updateUserPlan("free")}
            >
              Switch to Free
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-xs"
              onClick={() => updateUserPlan("pro")}
            >
              Upgrade to Pro
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => alert("Redirecting to Stripe Customer Portal...")}
          >
            Manage Billing
          </Button>
        </div>
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
              className={`relative flex flex-col justify-between p-6 rounded-xl bg-neutral-900 border ${
                plan.id === "monthly"
                  ? "border-neutral-600 ring-1 ring-neutral-500/20 shadow-xl"
                  : "border-neutral-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                      isPro
                        ? "bg-neutral-800 text-neutral-100 border-neutral-600"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-neutral-200 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5 text-neutral-100" /> Active Plan
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-neutral-100">{plan.name}</h2>
                <p className="text-xs text-neutral-400 mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-semibold text-neutral-100 tracking-tight">{plan.price}</span>
                  <span className="text-xs text-neutral-400 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-neutral-200 shrink-0" />
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
                      ? "bg-neutral-800/80 border-neutral-700 text-neutral-500 cursor-not-allowed hover:bg-neutral-800/80 hover:text-neutral-500"
                      : isPro
                      ? "bg-white hover:bg-neutral-200 text-neutral-950 font-semibold shadow-md border-0"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
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
