import { notFound } from "next/navigation"
import SitePageClient from "@/components/SitePageClient"
import { sampleBusinesses } from "@/lib/sample-data"
import { SavedBusiness } from "@/lib/types"

// This function tells Next.js which pages to build at build time
// Only generate static pages for sample businesses
export async function generateStaticParams() {
  return sampleBusinesses.map((business) => ({
    id: business.id,
  }))
}

interface PageProps {
  params: {
    id: string
  }
}

async function getBusinessData(id: string): Promise<SavedBusiness | null> {
  // For sample businesses, get data directly from the local file
  if (id.startsWith('sample-')) {
    const business = sampleBusinesses.find((b) => b.id === id)
    return business || null
  }

  // For real businesses, fetch from the API
  try {
    const response = await fetch(`/api/business?id=${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export default async function SitePage({ params }: PageProps) {
  const business = await getBusinessData(params.id);
  
  if (!business) {
    notFound();
  }
  
  return <SitePageClient business={business} />;
}
