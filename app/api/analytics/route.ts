import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { checkFeatureAccess } from '@/lib/plan-enforcement';

export async function GET(request: Request) {
  try {
    const { db } = await initializeFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId for plan enforcement.' }, { status: 400 });
    }
    // Allow analytics for admin
    if (userId !== 'admin') {
      // PLAN ENFORCEMENT: Only allow analytics if plan allows
      const canAnalytics = await checkFeatureAccess(userId, 'profileAnalytics', db);
      if (!canAnalytics) {
        return NextResponse.json({ error: 'Your current plan does not allow analytics.' }, { status: 403 });
      }
    }
    const snapshot = await db.collection('businesses').get();
    const businesses = snapshot.docs.map(doc => doc.data());
    
    // Calculate analytics data
    const analytics = {
      totalViews: 0,
      totalClicks: 0,
      totalLeads: 0,
      totalWhatsappClicks: 0,
      totalPhoneClicks: 0,
      totalMapClicks: 0,
      viewsByDay: {} as Record<string, number>,
      clicksByDay: {} as Record<string, number>,
      deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
      locationStats: {} as Record<string, number>,
      topPages: [] as { page: string, views: number }[],
      lastVisit: '',
    };

    const pageViews: Record<string, number> = {};
    let lastVisitDate: Date | null = null;

    businesses.forEach(business => {
      if (business.analytics) {
        analytics.totalViews += business.analytics.views || 0;
        analytics.totalClicks += business.analytics.clicks || 0;
        analytics.totalLeads += business.analytics.leads || 0;
        analytics.totalWhatsappClicks += business.analytics.whatsappClicks || 0;
        analytics.totalPhoneClicks += business.analytics.phoneClicks || 0;
        analytics.totalMapClicks += business.analytics.mapClicks || 0;

        // Aggregate daily views and clicks
        if (business.analytics.dailyStats) {
          Object.entries(business.analytics.dailyStats).forEach(([date, stats]: [string, any]) => {
            analytics.viewsByDay[date] = (analytics.viewsByDay[date] || 0) + (stats.views || 0);
            analytics.clicksByDay[date] = (analytics.clicksByDay[date] || 0) + (stats.clicks || 0);
          });
        }
        // Aggregate device stats
        if (business.analytics.deviceStats) {
          analytics.deviceStats.mobile += business.analytics.deviceStats.mobile || 0;
          analytics.deviceStats.desktop += business.analytics.deviceStats.desktop || 0;
          analytics.deviceStats.tablet += business.analytics.deviceStats.tablet || 0;
        }
        // Aggregate location stats
        if (business.analytics.locationStats) {
          Object.entries(business.analytics.locationStats).forEach(([loc, count]: [string, any]) => {
            analytics.locationStats[loc] = (analytics.locationStats[loc] || 0) + (count || 0);
          });
        }
        // Aggregate top pages
        if (business.analytics.topPages) {
          business.analytics.topPages.forEach((page: { page: string, views: number }) => {
            pageViews[page.page] = (pageViews[page.page] || 0) + (page.views || 0);
          });
        }
        // Track last visit
        if (business.analytics.lastVisit) {
          const visitDate = new Date(business.analytics.lastVisit);
          if (!lastVisitDate || visitDate > lastVisitDate) {
            lastVisitDate = visitDate;
          }
        }
      }
    });
    // Set top pages sorted by views
    analytics.topPages = Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    // Set last visit
    analytics.lastVisit = lastVisitDate instanceof Date ? lastVisitDate.toISOString() : '';
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 