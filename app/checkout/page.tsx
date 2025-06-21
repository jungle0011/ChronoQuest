"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { PRICING_TIERS } from '@/lib/pricing';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "basic";
  const plan = PRICING_TIERS.find((tier) => tier.id === planKey);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (!plan || plan.id === 'free') {
      toast.error("Invalid plan selected.");
      router.push("/pricing");
    }
  }, [plan, router]);

  if (!plan) return null;

  let price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  let paystackLink = billingCycle === 'yearly' ? plan.paystackYearly : plan.paystackMonthly;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Upgrade to {plan.name}</h2>
        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg bg-gray-200 p-1">
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly <span className="ml-1 text-green-600 font-bold">Save 22%</span>
            </button>
          </div>
        </div>
        <div className="text-4xl font-extrabold text-gray-900 mb-1">
          ₦{price?.toLocaleString()}
          <span className="text-base font-medium text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
        </div>
        {billingCycle === 'yearly' && (
          <div className="text-green-600 text-sm font-semibold mb-2">2 months free</div>
        )}
        <div className="mt-4 mb-2 font-semibold text-gray-800">Features included:</div>
        <ul className="mb-6 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature.id} className="flex items-center text-gray-700">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">{feature.name}</span>
              <span className="ml-2 text-gray-500 text-sm">{feature.description}</span>
            </li>
          ))}
        </ul>
        <button
          className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            window.location.href = paystackLink!;
          }}
        >
          {loading ? "Redirecting..." : `Upgrade Now`}
        </button>
      </div>
    </div>
  );
} 