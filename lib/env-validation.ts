import { z } from 'zod'

// Environment variable schema - more flexible for development
const envSchema = z.object({
  // Firebase - make optional for development
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  
  // Cloudinary - make optional for development
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Paystack - make optional for development
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  
  // Vercel (for custom domains)
  VERCEL_API_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  
  // JWT (for authentication)
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').optional(),
  
  // Database (if using external database)
  DATABASE_URL: z.string().url('Database URL must be valid').optional(),
  
  // Redis (for caching in production)
  REDIS_URL: z.string().url('Redis URL must be valid').optional(),
  
  // Email (for notifications)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  
  // Security
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters').optional(),
  NEXTAUTH_URL: z.string().url('NextAuth URL must be valid').optional(),
  
  // Feature flags
  ENABLE_AI_FEATURES: z.string().transform(val => val === 'true').optional(),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').optional(),
  ENABLE_CUSTOM_DOMAINS: z.string().transform(val => val === 'true').optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return { success: true, env }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      console.error('❌ Missing or invalid environment variables:', missingVars)
      console.error('Please check your .env file and ensure all required variables are set.')
      
      // In production, throw error to prevent app from starting
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      }
    }
    return { success: false, error }
  }
}

// Get validated environment variables
export function getEnv() {
  const result = validateEnv()
  if (!result.success) {
    throw new Error('Environment validation failed')
  }
  return result.env
}

// Check if we're in production
export const isProduction = process.env.NODE_ENV === 'production'

// Check if we're in development
export const isDevelopment = process.env.NODE_ENV === 'development'

// Check if we're in test
export const isTest = process.env.NODE_ENV === 'test'

// Feature flags
export const featureFlags = {
  ai: process.env.ENABLE_AI_FEATURES === 'true',
  analytics: process.env.ENABLE_ANALYTICS === 'true',
  customDomains: process.env.ENABLE_CUSTOM_DOMAINS === 'true',
}

// Security configuration
export const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: isProduction ? 100 : 1000, // Stricter in production
  },
  
  // CORS
  cors: {
    allowedOrigins: isProduction 
      ? ['https://bizplannaija.vercel.app', 'https://bizplannaija.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
  },
  
  // Session
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: isProduction,
    httpOnly: true,
    sameSite: 'lax' as const,
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
} 