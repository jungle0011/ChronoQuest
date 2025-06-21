import { NextRequest, NextResponse } from 'next/server'
import rateLimiter, { RATE_LIMIT_CONFIGS, getClientIdentifier } from './rate-limit'
import { validateInput } from './validation'
import type { z } from 'zod'

interface ApiMiddlewareConfig {
  rateLimit?: keyof typeof RATE_LIMIT_CONFIGS
  validation?: z.ZodSchema
  requireAuth?: boolean
  cors?: boolean
}

export function withApiMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: ApiMiddlewareConfig = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // CORS headers
      if (config.cors) {
        const origin = request.headers.get('origin')
        const allowedOrigins = [
          'http://localhost:3000',
          'https://bizplannaija.vercel.app',
          'https://bizplannaija.com'
        ]
        
        if (origin && allowedOrigins.includes(origin)) {
          const response = NextResponse.next()
          response.headers.set('Access-Control-Allow-Origin', origin)
          response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          response.headers.set('Access-Control-Max-Age', '86400')
          
          if (request.method === 'OPTIONS') {
            return response
          }
        }
      }

      // Rate limiting
      if (config.rateLimit) {
        const clientId = getClientIdentifier(request)
        const rateLimit = rateLimiter.check(clientId, RATE_LIMIT_CONFIGS[config.rateLimit])
        
        if (!rateLimit.allowed) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': RATE_LIMIT_CONFIGS[config.rateLimit].maxRequests.toString(),
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
              }
            }
          )
        }
      }

      // Authentication check
      if (config.requireAuth) {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
          return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }
        
        // Here you would validate the JWT token
        // For now, we'll just check if it exists
        try {
          // You can add JWT validation here
          // const token = authHeader.replace('Bearer ', '')
          // const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        } catch (error) {
          return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
        }
      }

      // Input validation
      if (config.validation) {
        const body = await request.json().catch(() => ({}))
        const validation = validateInput(config.validation, body)
        
        if (!validation.success) {
          return NextResponse.json({ 
            error: 'Invalid input data', 
            details: validation.errors 
          }, { status: 400 })
        }
        
        // Add validated data to request for the handler to use
        ;(request as any).validatedData = validation.data
      }

      // Call the actual handler
      return await handler(request)
      
    } catch (error) {
      console.error('API middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' }, 
        { status: 500 }
      )
    }
  }
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

// Logging middleware
export function logApiRequest(request: NextRequest, response: NextResponse) {
  const start = Date.now()
  const duration = Date.now() - start
  
  console.log(`${request.method} ${request.url} - ${response.status} - ${duration}ms`)
  
  // You can add more detailed logging here
  // Log to external service like DataDog, New Relic, etc.
} 