import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { checkFeatureAccess } from '@/lib/plan-enforcement';

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
  }
  const { db } = await initializeFirebaseAdmin();
  const canAI = await checkFeatureAccess(userId, 'aiContentGenerator', db);
  if (!canAI) {
    return NextResponse.json({ error: 'Your current plan does not allow AI content generation.' }, { status: 403 });
  }
  // Stub: Replace with real AI content logic
  return NextResponse.json({ success: true, message: 'AI content generation is available for your plan (stub).' });
} 