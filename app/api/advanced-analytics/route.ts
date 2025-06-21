import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { checkFeatureAccess } from '@/lib/plan-enforcement';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
  }
  const { db } = await initializeFirebaseAdmin();
  const canAdvancedAnalytics = await checkFeatureAccess(userId, 'realTimeAnalytics', db); // Use realTimeAnalytics for advanced
  if (!canAdvancedAnalytics) {
    return NextResponse.json({ error: 'Your current plan does not allow advanced analytics.' }, { status: 403 });
  }
  // Stub: Replace with real advanced analytics logic
  return NextResponse.json({ success: true, message: 'Advanced analytics is available for your plan (stub).' });
} 