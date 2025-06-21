'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PremiumButton } from '@/components/PremiumButton';
import { PRICING_TIERS } from '@/lib/pricing';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your business
          </p>
          <p className="mt-2 text-sm text-blue-600">
            After payment, you will be redirected back and your plan will be upgraded automatically.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center mt-8 mb-8">
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

        <div className="mt-4 space-y-4 sm:mt-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-5xl lg:mx-auto">
          {PRICING_TIERS.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${plan.id === 'premium' ? 'border-2 border-purple-500' : ''}`}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-gray-500">{plan.features[0]?.description}</p>
                <p className="mt-8">
                  {plan.id === 'free' ? (
                    <span className="text-4xl font-extrabold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-gray-900">
                        ₦{(billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly)?.toLocaleString()}
                      </span>
                      <span className="text-base font-medium text-gray-500 ml-1">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                      {billingCycle === 'yearly' && (
                        <span className="ml-2 text-green-600 font-semibold text-sm">2 months free</span>
                      )}
                    </>
                  )}
                </p>
                <div className="mt-6">
                  {plan.id === 'free' ? (
                    <a href="/login" className="w-full block">
                      <button className="w-full py-3 rounded-lg bg-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-400 transition-all duration-200">Get Started</button>
                    </a>
                  ) : (
                    <PremiumButton plan={plan.id as 'basic' | 'premium'} billingCycle={billingCycle} className="w-full" />
                  )}
                </div>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{feature.name}</span>: {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-xs text-gray-500">
                  <strong>Limits:</strong><br />
                  Landing Pages: {plan.limits.maxLandingPages === Infinity ? 'Unlimited' : plan.limits.maxLandingPages}<br />
                  Style Templates: {plan.limits.styleTemplates === Infinity ? 'Unlimited' : plan.limits.styleTemplates}<br />
                  Color Schemes: {plan.limits.colorSchemes === Infinity ? 'Unlimited' : plan.limits.colorSchemes}<br />
                  Fonts: {plan.limits.fonts === Infinity ? 'Unlimited' : plan.limits.fonts}<br />
                  Layouts: {plan.limits.layoutStyles === Infinity ? 'Unlimited' : plan.limits.layoutStyles}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 