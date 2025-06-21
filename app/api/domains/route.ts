import { NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-admin'
import { DomainSchema, validateInput } from '@/lib/validation'
import rateLimiter, { RATE_LIMIT_CONFIGS, getClientIdentifier } from '@/lib/rate-limit'

// This function will call the Vercel API to add a domain.
async function addDomainToVercel(domain: string) {
  const response = await fetch(`https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: domain })
  })
  return response.json()
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = rateLimiter.check(clientId, RATE_LIMIT_CONFIGS.DEFAULT);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.DEFAULT.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json()

    // Validate input
    const validation = validateInput(DomainSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors 
      }, { status: 400 });
    }

    const { businessId, domain } = validation.data;

    // 1. Add domain to Vercel
    const vercelResponse = await addDomainToVercel(domain)

    if (vercelResponse.error) {
      return NextResponse.json({ error: vercelResponse.error.message }, { status: 500 })
    }

    // 2. Update the business document in Firestore with the custom domain
    const businessRef = doc(db as any, 'businesses', businessId)
    await updateDoc(businessRef, {
      customDomain: domain,
    })

    return NextResponse.json({ message: 'Domain added successfully', details: vercelResponse })

  } catch (error: any) {
    console.error('Error in domain connection:', error)
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 })
  }
} 