import { NextResponse } from "next/server"
import type { BusinessFormData, SavedBusiness } from "@/lib/types"
import { initializeFirebaseAdmin } from '@/lib/firebase-admin'
import { v4 as uuidv4 } from 'uuid'
import { logActivity } from '@/lib/activity-log'
import { checkLandingPageLimit } from '@/lib/plan-enforcement'
import { BusinessFormSchema, validateInput } from '@/lib/validation'
import cache, { CACHE_KEYS, CACHE_TTL } from '@/lib/cache'
import rateLimiter, { RATE_LIMIT_CONFIGS, getClientIdentifier } from '@/lib/rate-limit'

// Generate a unique ID
function generateId(): string {
  return uuidv4();
}

// Generate a URL-friendly slug
function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Clean undefined values from objects for Firestore
function cleanForFirestore(obj: any): any {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function POST(request: Request) {
  let userId: string | undefined;
  let formData: any;
  
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = rateLimiter.check(clientId, RATE_LIMIT_CONFIGS.BUSINESS_CREATE);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.BUSINESS_CREATE.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }
    
    const requestData = await request.json();
    userId = requestData.userId;
    formData = requestData.formData;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate input
    const validation = validateInput(BusinessFormSchema, formData);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const { db } = await initializeFirebaseAdmin();
    
    // Get user's current plan first
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userPlan = userDoc.exists ? (userDoc.data()?.plan || 'free') : 'free';
    
    // PLAN ENFORCEMENT: Check if user can create another landing page
    const limitCheck = await checkLandingPageLimit(userId, db);
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: `Plan limit reached: You can only create ${limitCheck.max} landing page(s) on your current plan.` }, { status: 403 });
    }
    
    const id = generateId();
    const slug = generateSlug(validation.data.businessName);
    const business: SavedBusiness = {
      ...validation.data,
      id,
      userId,
      plan: userPlan, // Use user's current plan, not formData.plan
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Clean undefined values for Firestore
    const cleanBusiness = cleanForFirestore(business);
    await db.collection('businesses').doc(id).set(cleanBusiness);

    // Clear user businesses cache
    cache.delete(CACHE_KEYS.USER_BUSINESSES(userId));

    // Upsert user in users collection - preserve existing plan
    const now = new Date();
    let userData: any = {
      id: userId,
      plan: userPlan, // Preserve user's plan, don't overwrite with formData.plan
      status: 'active',
      createdAt: userDoc.exists ? userDoc.data()?.createdAt : now.toISOString(),
      updatedAt: now.toISOString(),
    };
    if (!userDoc.exists) {
      userData.name = validation.data.fullName || null;
      userData.email = validation.data.email || null;
    } else {
      const existingData = userDoc.data();
      userData.name = existingData?.name || null;
      userData.email = existingData?.email || null;
    }
    
    // Clean undefined values for Firestore
    const cleanUserData = cleanForFirestore(userData);
    await userRef.set(cleanUserData, { merge: true });

    // Log business creation
    await logActivity({
      userId,
      action: 'create',
      entityType: 'business',
      entityId: id,
      details: { businessName: validation.data.businessName }
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Business creation error:', error instanceof Error ? error.message : error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: userId,
      formDataKeys: formData ? Object.keys(formData) : []
    });
    return NextResponse.json({ error: 'Failed to save business' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    // Add cache-busting headers to ensure fresh data
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    if (id) {
      // Check cache first
      const cacheKey = CACHE_KEYS.BUSINESS(id);
      const cached = cache.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached, { headers });
      }
      
      const doc = await db.collection('businesses').doc(id).get();
      if (!doc.exists) return NextResponse.json(null, { headers });
      
      const data = doc.data();
      // Cache the result
      cache.set(cacheKey, data, CACHE_TTL.BUSINESS);
      
      return NextResponse.json(data, { headers });
    } else if (userId) {
      // Check cache first
      const cacheKey = CACHE_KEYS.USER_BUSINESSES(userId);
      const cached = cache.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached, { headers });
      }
      
      const snapshot = await db.collection('businesses').where('userId', '==', userId).get();
      const businesses = snapshot.docs.map((doc: any) => doc.data());
      const sortedBusinesses = businesses.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Cache the result
      cache.set(cacheKey, sortedBusinesses, CACHE_TTL.USER_BUSINESSES);
      
      return NextResponse.json(sortedBusinesses, { headers });
    } else {
      const snapshot = await db.collection('businesses').get();
      const businesses = snapshot.docs.map((doc: any) => doc.data());
      return NextResponse.json(businesses.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), { headers });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get businesses' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, formData, userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate input
    const validation = validateInput(BusinessFormSchema, formData);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const { db } = await initializeFirebaseAdmin();
    
    // Get user's current plan first
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userPlan = userDoc.exists ? (userDoc.data()?.plan || 'free') : 'free';
    
    const docRef = db.collection('businesses').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    const existing = doc.data();
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const slug = generateSlug(validation.data.businessName);
    const business: SavedBusiness = {
      ...validation.data,
      id,
      userId,
      plan: userPlan, // Use user's current plan, preserve existing plan
      slug,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    // Clean undefined values for Firestore
    const cleanBusiness = cleanForFirestore(business);
    await docRef.set(cleanBusiness, { merge: true });

    // Clear caches
    cache.delete(CACHE_KEYS.BUSINESS(id));
    cache.delete(CACHE_KEYS.USER_BUSINESSES(userId));

    // Log business edit
    await logActivity({
      userId,
      action: 'edit',
      entityType: 'business',
      entityId: id,
      details: { businessName: validation.data.businessName }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Business update error:', error);
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json({ error: 'ID and User ID are required' }, { status: 400 });
    }
    
    const { db } = await initializeFirebaseAdmin();
    const docRef = db.collection('businesses').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    const business = doc.data();
    if (!business || business.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await docRef.delete();
    
    // Clear caches
    cache.delete(CACHE_KEYS.BUSINESS(id));
    cache.delete(CACHE_KEYS.USER_BUSINESSES(userId));

    // Log business deletion
    await logActivity({
      userId,
      action: 'delete',
      entityType: 'business',
      entityId: id,
      details: { businessName: business.businessName }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Business deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
} 