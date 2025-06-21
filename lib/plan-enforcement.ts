import { getPricingTier, hasFeatureAccess, getFeatureLimit, Plan, PricingTier } from './pricing';
import { Firestore } from 'firebase-admin/firestore';
import { logActivity } from './activity-log';
// import { sendExpirationEmail } from './send-email';

// Fetch the user's plan from Firestore
export async function getUserPlan(userId: string, db: Firestore): Promise<Plan> {
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) return 'free';
  return (userDoc.data()?.plan as Plan) || 'free';
}

// Check if the user's plan is expired and downgrade if needed
export async function checkAndDowngradeExpiredPlan(userId: string, db: Firestore): Promise<Plan> {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) return 'free';
  const data = userDoc.data();
  const plan = data?.plan as Plan;
  const billingCycle = data?.billingCycle;
  const planUpdatedAt = data?.planUpdatedAt;
  if (!plan || plan === 'free' || !billingCycle || !planUpdatedAt) return plan || 'free';
  const updated = new Date(planUpdatedAt);
  let expiry: Date;
  if (billingCycle === 'monthly') {
    expiry = new Date(updated);
    expiry.setMonth(expiry.getMonth() + 1);
  } else if (billingCycle === 'yearly') {
    expiry = new Date(updated);
    expiry.setFullYear(expiry.getFullYear() + 1);
  } else {
    return plan;
  }
  if (isNaN(expiry.getTime()) || expiry > new Date()) return plan;
  // Expired: downgrade
  await userRef.update({ plan: 'free', billingCycle: null, planUpdatedAt: null, updatedAt: new Date() });
  // Log activity event
  await logActivity({
    userId,
    action: 'plan_expired',
    entityType: 'user',
    entityId: userId,
    details: { reason: 'Subscription expired and user downgraded to free' }
  });
  // Send expiration email (uncomment after send-email.ts is created)
  // await sendExpirationEmail(userId, data.email);
  return 'free';
}

// Check if the user has access to a feature
export async function checkFeatureAccess(userId: string, feature: keyof PricingTier['access'], db: Firestore): Promise<boolean> {
  const plan = await getUserPlan(userId, db);
  return hasFeatureAccess(plan, feature);
}

// Check the user's limit for a feature
export async function checkFeatureLimit(userId: string, limit: keyof PricingTier['limits'], db: Firestore): Promise<number> {
  const plan = await getUserPlan(userId, db);
  return getFeatureLimit(plan, limit);
}

// Check if the user is within their landing page limit
export async function checkLandingPageLimit(userId: string, db: Firestore): Promise<{ allowed: boolean; current: number; max: number; }> {
  const plan = await getUserPlan(userId, db);
  const max = getFeatureLimit(plan, 'maxLandingPages');
  const snapshot = await db.collection('businesses').where('userId', '==', userId).get();
  const current = snapshot.size;
  return { allowed: current < max, current, max };
} 