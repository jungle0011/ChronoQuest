import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const { db } = await initializeFirebaseAdmin();
    const snapshot = await db.collection('businesses').get();
    const businesses = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
} 