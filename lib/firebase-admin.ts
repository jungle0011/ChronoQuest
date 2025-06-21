import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = getApps()[0];
}

export const db = getFirestore();

export async function initializeFirebaseAdmin() {
  // Always return the singleton db, but keep as async for compatibility
  return { db };
} 