import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white">
            <SiteHeader />

            <main className="flex flex-col items-center justify-center px-4 pt-20 pb-20">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-zinc-400">
                        Start for free. Upgrade for power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    {/* Free Plan */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 flex flex-col">
                        <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹0<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <p className="text-zinc-400 mb-8 text-sm">Perfect for hobbyists and testing.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> 5 Generations / Day
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Basic Code Export
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Community Support
                            </li>
                        </ul>

                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">Current Plan</Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹999<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <p className="text-zinc-400 mb-8 text-sm">For serious developers and freelancers.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-white" /> Unlimited Generations
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-white" /> Priority Generation Speed
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-white" /> Advanced Export (React/Next.js)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-white" /> Private Projects
                            </li>
                        </ul>

                        <Button className="w-full bg-white text-black hover:bg-zinc-200">Upgrade to Pro</Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 flex flex-col">
                        <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
                        <div className="text-3xl font-bold text-white mb-6">Custom</div>
                        <p className="text-zinc-400 mb-8 text-sm">For teams and agencies.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Everything in Pro
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Team Collaboration
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Custom AI Models
                            </li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300">
                                <Check className="h-4 w-4 text-emerald-500" /> Dedicated Support
                            </li>
                        </ul>

                        <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white">Contact Sales</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
