export const dynamic = "force-dynamic";
import { notFound } from "next/navigation"
import SitePageClient from "@/components/SitePageClient"
import nextDynamic from "next/dynamic"
const LeafletMap = nextDynamic(() => import('@/components/LeafletMap'), { ssr: false })

interface PageProps {
  params: {
    id: string
  }
}

export default async function SitePage({ params }: PageProps) {
  try {
    // Debug logging
    console.log('SitePage: Received params.id:', params.id);
    
    // Add timestamp to ensure fresh data
    const timestamp = Date.now();
    const response = await fetch(`/api/business?id=${params.id}&t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('SitePage: API response not ok:', response.status, response.statusText);
      throw new Error('Failed to fetch business');
    }
    
    const business = await response.json();
    console.log('SitePage: Fetched business:', business ? 'Found' : 'Not found');
    
    if (!business) {
      console.error('SitePage: Business not found for ID:', params.id);
      notFound();
    }
    
    return <SitePageClient business={business} />;
  } catch (error) {
    console.error('SitePage: Error fetching business:', error);
    notFound();
  }
}
