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

// UUID validation function
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export default async function SitePage({ params }: PageProps) {
  try {
    // Debug logging
    console.log('SitePage: Received params.id:', params.id);
    
    // Validate that the ID is a proper UUID
    if (!isValidUUID(params.id)) {
      console.error('SitePage: Invalid business ID format:', params.id);
      notFound();
    }
    
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
