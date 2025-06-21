import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { checkFeatureAccess } from '@/lib/plan-enforcement';

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
  }
  const { db } = await initializeFirebaseAdmin();
  const canWhatsApp = await checkFeatureAccess(userId, 'whatsappWidget', db);
  if (!canWhatsApp) {
    return NextResponse.json({ error: 'Your current plan does not allow WhatsApp widget.' }, { status: 403 });
  }
  // Stub: Replace with real WhatsApp widget logic
  return NextResponse.json({ success: true, message: 'WhatsApp widget is available for your plan (stub).' });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
  }
  const { db } = await initializeFirebaseAdmin();
  const canWhatsApp = await checkFeatureAccess(userId, 'whatsappWidget', db);
  if (!canWhatsApp) {
    return NextResponse.json({ error: 'Your current plan does not allow WhatsApp widget.' }, { status: 403 });
  }
  // Stub: Replace with real WhatsApp widget logic
  return NextResponse.json({ success: true, message: 'WhatsApp widget is available for your plan (stub).' });
} 