import 'dotenv/config';
import { initializeFirebaseAdmin } from '../lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

async function syncAuthEmailsToFirestore() {
  const { db } = await initializeFirebaseAdmin();
  const auth = getAuth();
  let nextPageToken: string | undefined = undefined;
  let updatedCount = 0;
  do {
    const listUsersResult: any = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of listUsersResult.users) {
      const { uid, email, displayName } = userRecord;
      if (!email) continue;
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : null;
      const firestoreEmail = userData?.email || null;
      let plan = 'free';
      if (userData?.plan) {
        plan = userData.plan;
      }
      if (!firestoreEmail || firestoreEmail !== email || !userData?.plan) {
        await userRef.set({
          id: uid,
          email,
          name: displayName || '',
          plan,
          updatedAt: new Date(),
        }, { merge: true });
        console.log(`Updated Firestore user ${uid} with email ${email} and plan ${plan}`);
        updatedCount++;
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  console.log(`Sync complete. Updated ${updatedCount} users.`);
}

syncAuthEmailsToFirestore().catch((err) => {
  console.error('Error during sync:', err);
  process.exit(1);
}); 