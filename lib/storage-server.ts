import type { BusinessFormData, SavedBusiness } from "./types"
import { initializeFirebaseAdmin } from './firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Save business data to Firestore
export async function saveBusiness(formData: BusinessFormData, userId: string): Promise<string> {
  const { db } = await initializeFirebaseAdmin();
  const id = uuidv4();
  const slug = formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const business: SavedBusiness = {
    ...formData,
    id,
    userId,
    plan: 'free', // Default plan for new businesses
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection('businesses').doc(id).set(business);
  return id;
}

// Update business data in Firestore
export async function updateBusiness(id: string, formData: BusinessFormData, userId: string): Promise<boolean> {
  const { db } = await initializeFirebaseAdmin();
  const docRef = db.collection('businesses').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Business not found');
  const existing = doc.data();
  if (!existing || existing.userId !== userId) throw new Error('Unauthorized');
  const slug = formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const business: SavedBusiness = {
    ...formData,
    id,
    userId,
    plan: existing.plan || 'free', // Preserve existing plan or default to free
    slug,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  await docRef.set(business);
  return true;
}

// Get business data by ID from Firestore
export async function getBusiness(id: string): Promise<SavedBusiness | null> {
  const { db } = await initializeFirebaseAdmin();
  const doc = await db.collection('businesses').doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as SavedBusiness;
}

// Get businesses by user ID from Firestore
export async function getUserBusinesses(userId: string): Promise<SavedBusiness[]> {
  const { db } = await initializeFirebaseAdmin();
  const snapshot = await db.collection('businesses').where('userId', '==', userId).get();
  return snapshot.docs.map((doc: any) => doc.data() as SavedBusiness);
}

// Get all businesses from Firestore
export async function getAllBusinesses(): Promise<SavedBusiness[]> {
  const { db } = await initializeFirebaseAdmin();
  const snapshot = await db.collection('businesses').get();
  return snapshot.docs.map((doc: any) => doc.data() as SavedBusiness);
}

// Delete business from Firestore
export async function deleteBusiness(id: string, userId?: string): Promise<boolean> {
  const { db } = await initializeFirebaseAdmin();
  const docRef = db.collection('businesses').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Business not found');
  if (userId) {
    const business = doc.data();
    if (!business || business.userId !== userId) throw new Error('Unauthorized');
  }
  await docRef.delete();
  return true;
} 