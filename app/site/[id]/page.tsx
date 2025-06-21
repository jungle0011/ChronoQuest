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
    // Add timestamp to ensure fresh data
    const timestamp = Date.now();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/business?id=${params.id}&t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch business');
    }
    
    const business = await response.json();
    
    if (!business) {
      notFound();
    }
    
    return <SitePageClient business={business} />;
  } catch (error) {
    console.error('Error fetching business:', error);
    notFound();
  }
}
