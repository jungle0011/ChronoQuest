'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PRICING_TIERS } from '@/lib/pricing';

interface PremiumButtonProps {
  plan: 'basic' | 'premium';
  billingCycle?: 'monthly' | 'yearly';
  className?: string;
}

export function PremiumButton({ plan, billingCycle = 'monthly', className = '' }: PremiumButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      router.push('/login');
      return;
    }
    setIsLoading(true);
    try {
      // Get correct Paystack link from PRICING_TIERS
      const planInfo = PRICING_TIERS.find((tier) => tier.id === plan);
      let paymentUrl = '';
      if (planInfo) {
        paymentUrl = billingCycle === 'yearly' ? planInfo.paystackYearly! : planInfo.paystackMonthly!;
      }
      if (!paymentUrl) throw new Error('Payment link not found');
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const planInfo = PRICING_TIERS.find((tier) => tier.id === plan);

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Upgrade to {planInfo ? planInfo.name : plan.charAt(0).toUpperCase() + plan.slice(1)}
        </>
      )}
    </button>
  );
} 