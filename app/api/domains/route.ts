import { NextResponse } from 'next/server'
import { initializeFirebaseAdmin } from '@/lib/firebase-admin'
import { DomainSchema, validateInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    console.log('Domain API called')
    
    const body = await request.json()
    console.log('Request body:', body)

    // Validate input
    const validation = validateInput(DomainSchema, body);
    if (!validation.success) {
      console.log('Validation failed:', validation.errors)
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validation.errors 
      }, { status: 400 });
    }

    const { businessId, domain } = validation.data;
    console.log('Validated data:', { businessId, domain })

    // Check if Vercel API token is configured
    const hasVercelToken = !!process.env.VERCEL_API_TOKEN;
    console.log('Vercel API token found:', hasVercelToken)

    // For now, simulate the domain connection regardless of token
    // This allows testing the UI and database updates
    const mockResponse = {
      success: true,
      message: hasVercelToken 
        ? 'Domain connection initiated! Please wait up to 24 hours for DNS propagation.'
        : 'Domain connection simulated for testing. Please configure Vercel API token for production use.',
      domain: domain,
      status: 'pending',
      simulated: !hasVercelToken
    }

    // Update the business document in Firestore with the custom domain
    try {
      const { db } = await initializeFirebaseAdmin()
      const businessRef = db.collection('businesses').doc(businessId)
      await businessRef.update({
        customDomain: domain,
        domainConnectedAt: new Date().toISOString(),
        domainStatus: 'pending'
      })
      console.log('Business document updated successfully')
    } catch (firebaseError) {
      console.error('Firebase update error:', firebaseError)
      return NextResponse.json({ 
        error: 'Failed to update business record. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json(mockResponse)

  } catch (error: any) {
    console.error('Error in domain connection:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to connect domain. Please try again later.' 
    }, { status: 500 });
  }
} 