import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Base validation schemas
export const BaseUserSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  name: z.string().min(1, 'Name is required').max(100).transform(val => DOMPurify.sanitize(val)),
});

export const BusinessFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100).transform(val => DOMPurify.sanitize(val)),
  businessName: z.string().min(1, 'Business name is required').max(100).transform(val => DOMPurify.sanitize(val)),
  businessDescription: z.string().min(10, 'Description must be at least 10 characters').max(1000).transform(val => DOMPurify.sanitize(val)),
  productDescription: z.string().max(1000).optional().transform(val => val ? DOMPurify.sanitize(val) : ''),
  location: z.string().max(200).optional().transform(val => val ? DOMPurify.sanitize(val) : ''),
  businessPlan: z.string().max(5000).optional().transform(val => val ? DOMPurify.sanitize(val) : ''),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  ownerPictureUrl: z.string().url('Invalid picture URL').optional(),
  siteStyle: z.enum(['modern', 'elegant', 'bold', 'minimal', 'creative', 'corporate', 'luxury', 'neon', 'vintage', 'glassmorphism', 'nature']),
  colorScheme: z.enum(['blue', 'purple', 'green', 'orange', 'red', 'dark', 'gradient', 'gold', 'teal', 'rose', 'slate']),
  fontStyle: z.enum(['modern', 'classic', 'playful', 'professional', 'luxury', 'tech', 'artistic', 'bold']),
  layoutStyle: z.enum(['centered', 'full-width', 'card-based', 'magazine', 'minimal', 'wide']),
  contactOption: z.enum(['whatsapp', 'call', 'both', 'none']),
  contactNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
  language: z.enum(['en', 'yo', 'ig', 'ha']),
  showMap: z.boolean(),
  whatsappSettings: z.object({
    welcomeMessage: z.string().max(200).transform(val => DOMPurify.sanitize(val)),
    businessHours: z.boolean(),
    autoReply: z.boolean(),
    chatPosition: z.enum(['bottom-right', 'bottom-left']),
  }),
  enableAI: z.boolean(),
  enableAnalytics: z.boolean(),
  enableSEO: z.boolean(),
  enableLeadCapture: z.boolean(),
  enableBooking: z.boolean(),
  enableReviews: z.boolean(),
  socialLinks: z.object({
    facebook: z.string().url('Invalid Facebook URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    youtube: z.string().url('Invalid YouTube URL').optional(),
  }),
  businessHours: z.record(z.string().max(100)).optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  featuresEnabled: z.boolean().optional(),
  features: z.array(z.object({
    icon: z.string().max(50),
    title: z.string().min(1).max(100).transform(val => DOMPurify.sanitize(val)),
    description: z.string().min(1).max(200).transform(val => DOMPurify.sanitize(val)),
  })).max(10).optional(),
  products: z.array(z.object({
    name: z.string().min(1).max(100).transform(val => DOMPurify.sanitize(val)),
    description: z.string().min(1).max(500).transform(val => DOMPurify.sanitize(val)),
    imageUrl: z.string().url('Invalid image URL').optional(),
  })).max(5).optional(),
});

export const DomainSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  domain: z.string()
    .min(1, 'Domain is required')
    .max(253, 'Domain too long')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/, 'Invalid domain format')
    .transform(val => val.toLowerCase()),
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return { 
      success: false, 
      errors: ['Validation failed: ' + (error instanceof Error ? error.message : 'Unknown error')]
    };
  }
}

// Sanitization helper
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

// URL validation helper
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Phone number validation helper
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

// File type validation
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}

// XSS prevention helper
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// SQL injection prevention (for any direct database queries)
export function sanitizeSqlInput(input: string): string {
  // Remove common SQL injection patterns
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/union/gi, '')
    .replace(/select/gi, '')
    .replace(/insert/gi, '')
    .replace(/update/gi, '')
    .replace(/delete/gi, '')
    .replace(/drop/gi, '')
    .replace(/create/gi, '');
} 