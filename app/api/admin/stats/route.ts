import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const { db } = await initializeFirebaseAdmin();
    const snapshot = await db.collection('businesses').get();
    const businesses = snapshot.docs.map(doc => doc.data());
    let totalViews = 0;
    let totalClicks = 0;
    let totalLeads = 0;
    let totalWhatsappClicks = 0;
    let totalPhoneClicks = 0;
    let totalMapClicks = 0;
    businesses.forEach(b => {
      if (b.analytics) {
        totalViews += b.analytics.views || 0;
        totalClicks += b.analytics.clicks || 0;
        totalLeads += b.analytics.leads || 0;
        totalWhatsappClicks += b.analytics.whatsappClicks || 0;
        totalPhoneClicks += b.analytics.phoneClicks || 0;
        totalMapClicks += b.analytics.mapClicks || 0;
      }
    });
    const stats = {
      totalBusinesses: businesses.length,
      premiumBusinesses: businesses.filter(b => b.interestedInPremium).length,
      totalUsers: new Set(businesses.map(b => b.fullName)).size,
      totalUploads: businesses.filter(b => b.logoUrl).length,
      totalViews,
      totalClicks,
      totalLeads,
      totalWhatsappClicks,
      totalPhoneClicks,
      totalMapClicks,
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 