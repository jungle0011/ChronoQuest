'use client';

import { useEffect, useState } from 'react';
import { Plan, PricingTier, hasFeatureAccess, getFeatureLimit } from '../pricing';
import { getCurrentPlan, isFeatureAvailable } from '../plan';
import { getCurrentUserPlan, initializeFirebaseClient } from '../firebase-client';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

type FeatureKey = keyof PricingTier['access'];
type LimitKey = keyof PricingTier['limits'];

export function usePlanFeatures() {
  const [plan, setPlan] = useState<Plan>('free');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPlan('free');
      return;
    }
    
    const initializeAndListen = async () => {
      try {
        const firebaseServices = await initializeFirebaseClient()
        if (!firebaseServices?.db) return
        
        const userDocRef = doc(firebaseServices.db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
          const data = docSnap.data();
          if (data && (data.plan === 'basic' || data.plan === 'premium')) {
            const planUpdatedAt = data.planUpdatedAt;
            const billingCycle = data.billingCycle;
            if (planUpdatedAt && billingCycle) {
              const updated = new Date(planUpdatedAt);
              let expiry: Date;
              if (billingCycle === 'monthly') {
                expiry = new Date(updated);
                expiry.setMonth(expiry.getMonth() + 1);
              } else if (billingCycle === 'yearly') {
                expiry = new Date(updated);
                expiry.setFullYear(expiry.getFullYear() + 1);
              } else {
                setPlan(data.plan);
                return;
              }
              if (!isNaN(expiry.getTime()) && expiry <= new Date()) {
                await updateDoc(userDocRef, { plan: 'free', billingCycle: null, planUpdatedAt: null, updatedAt: new Date() });
                setPlan('free');
                // Log activity event for expiration
                fetch('/api/admin/activity', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.uid,
                    action: 'plan_expired',
                    entityType: 'user',
                    details: { reason: 'Subscription expired and user downgraded to free' }
                  })
                });
                toast(
                  'Your subscription has expired. You have been downgraded to the Free plan. Please renew to regain access to premium features.',
                  {
                    icon: '⚠️',
                    style: {
                      borderRadius: '8px',
                      background: '#fff',
                      color: '#333',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '16px',
                      maxWidth: '400px',
                    },
                    duration: 8000,
                  }
                );
                return;
              }
            }
            setPlan(data.plan);
          } else {
            setPlan('free');
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize Firebase:', error)
        setPlan('free');
      }
    }
    
    const unsubscribe = initializeAndListen()
    return () => {
      unsubscribe.then(unsub => unsub?.())
    }
  }, [user]);

  const canAccess = (feature: FeatureKey) => {
    return hasFeatureAccess(plan, feature);
  };

  const getLimit = (limit: LimitKey) => {
    return getFeatureLimit(plan, limit);
  };

  const isFeatureLocked = (feature: FeatureKey) => {
    return !canAccess(feature);
  };

  const getUpgradeMessage = (feature: string) => {
    return `Upgrade to ${plan === 'free' ? 'Basic' : 'Premium'} to access ${feature}`;
  };

  return {
    plan,
    canAccess,
    getLimit,
    isFeatureLocked,
    getUpgradeMessage,
  };
} 