import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import type { SavedBusiness } from '@/lib/types';
import { checkFeatureAccess } from '@/lib/plan-enforcement';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const doc = await db.collection('businesses').doc(params.id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(doc.data());
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const businessData: SavedBusiness & { userId: string } = await request.json();
    const { db } = await initializeFirebaseAdmin();
    // PLAN ENFORCEMENT: Only allow editing if plan allows
    const canEdit = await checkFeatureAccess(businessData.userId, 'ownerUpload', db);
    if (!canEdit) {
      return NextResponse.json({ error: 'Your current plan does not allow editing businesses.' }, { status: 403 });
    }
    const docRef = db.collection('businesses').doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    await docRef.set(businessData);
    return NextResponse.json(businessData);
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await initializeFirebaseAdmin();
    // Extract userId from query or header if possible (for enforcement)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
    }
    // PLAN ENFORCEMENT: Only allow deleting if plan allows
    const canDelete = await checkFeatureAccess(userId, 'ownerUpload', db);
    if (!canDelete) {
      return NextResponse.json({ error: 'Your current plan does not allow deleting businesses.' }, { status: 403 });
    }
    const docRef = db.collection('businesses').doc(params.id);
    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
} 