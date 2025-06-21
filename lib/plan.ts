import { Plan, hasFeatureAccess, getFeatureLimit as getPricingFeatureLimit, PricingTier } from './pricing';

const PLAN_STORAGE_KEY = 'bizplannaija_user_plan';

export function getCurrentPlan(): Plan {
  if (typeof window === 'undefined') return 'free';
  const storedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
  return (storedPlan as Plan) || 'free';
}

export function setCurrentPlan(plan: Plan) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLAN_STORAGE_KEY, plan);
}

type FeatureKey = keyof PricingTier['access'];
type LimitKey = keyof PricingTier['limits'];

export function isFeatureAvailable(feature: FeatureKey): boolean {
  const plan = getCurrentPlan();
  return hasFeatureAccess(plan, feature);
}

export function getFeatureLimit(limit: LimitKey): number {
  const plan = getCurrentPlan();
  return getPricingFeatureLimit(plan, limit);
} 