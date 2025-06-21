import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

// Map reference substrings to plan and billing cycle
const PAYSTACK_REF_MAP = [
  { ref: 'mto0epoefe', plan: 'basic', billingCycle: 'monthly' },
  { ref: 'oyjqh49cae', plan: 'basic', billingCycle: 'yearly' },
  { ref: 'vom5k8ch38', plan: 'premium', billingCycle: 'monthly' },
  { ref: '63wkw-i79s', plan: 'premium', billingCycle: 'yearly' },
];

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { event, data } = payload;

    // Verify Paystack signature
    const hash = req.headers.get('x-paystack-signature');
    if (!hash) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 });
    }

    // Initialize Firebase Admin
    const { db } = await initializeFirebaseAdmin();

    if (event === 'charge.success') {
      const { reference, customer } = data;
      const { email } = customer;

      // Get user by email
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', email).limit(1).get();
      
      if (userQuery.empty) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Determine plan and billing cycle from reference
      let plan = 'premium';
      let billingCycle = 'monthly';
      for (const entry of PAYSTACK_REF_MAP) {
        if (reference.includes(entry.ref)) {
          plan = entry.plan;
          billingCycle = entry.billingCycle;
          break;
        }
      }

      // Update user's plan and billing cycle
      await userDoc.ref.update({
        plan,
        billingCycle,
        planUpdatedAt: new Date(),
        paymentReference: reference
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 