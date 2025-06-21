import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { logActivity } from '@/lib/activity-log';
import { z } from 'zod';

const StatusActionSchema = z.object({
  action: z.enum(['ban', 'unban', 'suspend', 'activate']),
  reason: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const userId = params.id;
    // Debug log
    console.log('Fetching user details for:', userId);
    // Get user details
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.log('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    const userData = userDoc.data();
    
    // Ensure joinedDate exists - use document creation time if not present
    if (userData && !userData.joinedDate && userDoc.createTime) {
      userData.joinedDate = userDoc.createTime.toDate().toISOString();
    }
    
    // Get user's businesses
    const businessesSnapshot = await db.collection('businesses')
      .where('userId', '==', userId)
      // .orderBy('createdAt', 'desc') // Removed to avoid index errors
      .get();
    const businesses = businessesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    // Calculate user statistics
    const totalViews = businesses.reduce((sum: number, b: any) => sum + (b.analytics?.views || 0), 0);
    const totalClicks = businesses.reduce((sum: number, b: any) => sum + (b.analytics?.clicks || 0), 0);
    const totalLeads = businesses.reduce((sum: number, b: any) => sum + (b.analytics?.leads || 0), 0);
    const userDetails = {
      ...userData,
      id: userId,
      businesses,
      statistics: {
        totalBusinesses: businesses.length,
        totalViews,
        totalClicks,
        totalLeads,
        averageViewsPerBusiness: businesses.length > 0 ? Math.round(totalViews / businesses.length) : 0,
        averageClicksPerBusiness: businesses.length > 0 ? Math.round(totalClicks / businesses.length) : 0
      }
    };
    return NextResponse.json(userDetails);
  } catch (error) {
    console.error('Error fetching user details for', params?.id, ':', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { db } = await initializeFirebaseAdmin();
    const userId = params.id;
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // If updates object is present, update profile fields
    if (body.updates && typeof body.updates === 'object') {
      const updates: any = {
        ...body.updates,
        updatedAt: new Date()
      };
      // Plan logic: always set billingCycle and planUpdatedAt for paid plans, remove for free
      if (body.updates.plan) {
        if (body.updates.plan === 'basic' || body.updates.plan === 'premium') {
          updates.billingCycle = body.updates.billingCycle || 'monthly';
          updates.planUpdatedAt = body.updates.planUpdatedAt || new Date().toISOString();
        } else if (body.updates.plan === 'free') {
          updates.billingCycle = null;
          updates.planUpdatedAt = null;
        }
      }
      await userRef.update(updates);
      // Log name change
      if (body.updates.name) {
        await logActivity({
          userId,
          action: 'name_change',
          entityType: 'user',
          entityId: userId,
          details: { newName: body.updates.name }
        });
      }
      // Log plan change
      if (body.updates.plan) {
        await logActivity({
          userId,
          action: 'plan_change',
          entityType: 'user',
          entityId: userId,
          details: { newPlan: body.updates.plan, billingCycle: updates.billingCycle, planUpdatedAt: updates.planUpdatedAt }
        });
      }
      return NextResponse.json({ success: true, message: 'Profile updated' });
    }
    // If action is present, handle status actions
    if (body.action) {
      const parseResult = StatusActionSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
      let updates: any = {
        updatedAt: new Date()
      };
      switch (body.action) {
        case 'ban':
          updates.status = 'banned';
          updates.bannedAt = new Date();
          updates.banReason = body.reason;
          break;
        case 'unban':
          updates.status = 'active';
          updates.bannedAt = null;
          updates.banReason = null;
          break;
        case 'suspend':
          updates.status = 'suspended';
          updates.suspendedAt = new Date();
          updates.suspensionReason = body.reason;
          break;
        case 'activate':
          updates.status = 'active';
          updates.suspendedAt = null;
          updates.suspensionReason = null;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }
      await userRef.update(updates);
      return NextResponse.json({ 
        success: true, 
        message: `User ${body.action}ed successfully` 
      });
    }
    // If neither, return 400
    return NextResponse.json({ error: 'No valid update payload' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user status:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
} 