import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing business ID' }, { status: 400 });
  }
  try {
    await db.collection('businesses').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete business', details: (error as Error).message }, { status: 500 });
  }
} 