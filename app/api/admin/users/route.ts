import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

interface UserData {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
  plan?: string;
  status?: string;
  [key: string]: any;
}

const UserQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  plan: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export async function GET(request: Request) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    
    const queryObj = Object.fromEntries(searchParams.entries());
    const parseResult = UserQuerySchema.safeParse(queryObj);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    const { search = '', status = '', plan = '', page = '1', limit = '20' } = parseResult.data;
    
    // Get all users from Firestore
    let usersQuery = db.collection('users') as any;
    
    // Apply filters
    if (status) {
      usersQuery = usersQuery.where('status', '==', status);
    }
    if (plan) {
      usersQuery = usersQuery.where('plan', '==', plan);
    }
    
    const snapshot = await usersQuery.get();
    let users: UserData[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply search filter (client-side for better performance)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        (user.email?.toLowerCase().includes(searchLower) || false) ||
        (user.name?.toLowerCase().includes(searchLower) || false) ||
        (user.displayName?.toLowerCase().includes(searchLower) || false)
      );
    }
    
    // Get user businesses for additional data
    const usersWithBusinesses = await Promise.all(
      users.map(async (user) => {
        const businessesSnapshot = await db.collection('businesses')
          .where('userId', '==', user.id)
          .get();
        
        const businesses = businessesSnapshot.docs.map((doc: any) => doc.data());
        
        return {
          ...user,
          businessCount: businesses.length,
          totalViews: businesses.reduce((sum: number, b: any) => sum + (b.analytics?.views || 0), 0),
          totalClicks: businesses.reduce((sum: number, b: any) => sum + (b.analytics?.clicks || 0), 0),
          lastActivity: businesses.length > 0 
            ? Math.max(...businesses.map((b: any) => new Date(b.updatedAt || b.createdAt || Date.now()).getTime()))
            : new Date(user.createdAt || user.updatedAt || Date.now()).getTime(),
          businesses: businesses.slice(0, 5) // Limit to 5 most recent
        };
      })
    );
    
    // Sort by last activity (most recent first)
    usersWithBusinesses.sort((a, b) => b.lastActivity - a.lastActivity);
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = usersWithBusinesses.slice(startIndex, endIndex);
    
    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: usersWithBusinesses.length,
        totalPages: Math.ceil(usersWithBusinesses.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, updates } = await request.json();
    const { db } = await initializeFirebaseAdmin();
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    await userRef.update({
      ...updates,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 