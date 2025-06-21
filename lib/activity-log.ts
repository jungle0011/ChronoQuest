import { initializeFirebaseAdmin } from './firebase-admin';

export async function logActivity({ userId, action, entityType, entityId, details }: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
}) {
  const { db } = await initializeFirebaseAdmin();
  await db.collection('activity').add({
    userId,
    action,
    entityType,
    entityId: entityId || null,
    details: details || null,
    timestamp: new Date().toISOString(),
  });
} 