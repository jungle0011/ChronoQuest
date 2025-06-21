'use client';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';

interface FeatureLockProps {
  children: React.ReactNode;
  message: string;
  featureId: string;
}

export function FeatureLock({ children, message, featureId }: FeatureLockProps) {
  const router = useRouter();
  const { isFeatureLocked } = usePlanFeatures();

  if (!isFeatureLocked(featureId as any)) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-lg">
        <Lock className="w-8 h-8 text-white mb-2" />
        <p className="text-white font-semibold mb-2">Pro Feature</p>
        <p className="text-white text-sm mb-4">{message}</p>
        <Button
          onClick={() => router.push('/checkout?plan=pro')}
          variant="secondary"
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
} 