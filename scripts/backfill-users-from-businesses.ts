import 'dotenv/config';
import { initializeFirebaseAdmin } from '../lib/firebase-admin';

async function backfillUsersFromBusinesses() {
  const { db } = await initializeFirebaseAdmin();
  const businessesSnapshot = await db.collection('businesses').get();
  const businesses = businessesSnapshot.docs.map((doc: any) => doc.data());

  let count = 0;
  for (const business of businesses) {
    console.log('Processing business:', business.businessName, 'userId:', business.userId);
    if (!business.userId) {
      console.log('Skipping business with missing userId:', business.businessName);
      continue;
    }
    const userRef = db.collection('users').doc(business.userId);
    const userDoc = await userRef.get();
    const now = new Date();
    let emailToSet = business.email && business.email.length > 0 ? business.email : `${business.fullName?.replace(/\s+/g, '').toLowerCase() || 'user'}@example.com`;
    if (userDoc.exists) {
      const existingData = userDoc.data();
      const existingEmail = existingData?.email;
      if (existingEmail && !existingEmail.endsWith('@example.com')) {
        emailToSet = existingEmail;
      }
    }
    const userData = {
      id: business.userId,
      name: business.fullName,
      email: emailToSet,
      plan: business.plan || (business.interestedInPremium ? 'premium' : 'free'),
      status: 'active',
      createdAt: userDoc.exists ? userDoc.data()?.createdAt : business.createdAt || now,
      updatedAt: now,
    };
    await userRef.set(userData, { merge: true });
    console.log('Upserted user:', userData);
    count++;
  }
  console.log(`Backfilled ${count} users from businesses.`);
}

backfillUsersFromBusinesses().catch((err) => {
  console.error('Error during backfill:', err);
  process.exit(1);
}); 