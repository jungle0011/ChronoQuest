import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const snapshot = await db.collection('activity').orderBy('timestamp', 'desc').limit(limit).get();
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Activity log error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
} 