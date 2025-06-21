interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  };

  private cleanup() {
    const now = Date.now();
    for (const [key, data] of Object.entries(this.store)) {
      if (now > data.resetTime) {
        delete this.store[key];
      }
    }
  }

  check(key: string, config: Partial<RateLimitConfig> = {}): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    
    const { windowMs, maxRequests } = { ...this.defaultConfig, ...config };
    const now = Date.now();
    
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }
    
    const data = this.store[key];
    
    if (now > data.resetTime) {
      // Reset window
      data.count = 1;
      data.resetTime = now + windowMs;
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: data.resetTime,
      };
    }
    
    if (data.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: data.resetTime,
      };
    }
    
    data.count++;
    return {
      allowed: true,
      remaining: maxRequests - data.count,
      resetTime: data.resetTime,
    };
  }

  reset(key: string): void {
    delete this.store[key];
  }

  getStats() {
    this.cleanup();
    return {
      totalKeys: Object.keys(this.store).length,
      store: this.store,
    };
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // General API endpoints
  DEFAULT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  // Authentication endpoints (more restrictive)
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
  },
  
  // Business creation (prevent spam)
  BUSINESS_CREATE: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 businesses per hour
  },
  
  // Analytics endpoints (less restrictive)
  ANALYTICS: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50,
  },
  
  // File uploads
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 uploads per hour
  },
} as const;

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // For authenticated users, use their user ID
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Extract user ID from token if available
    // This is a simplified version - you might want to decode the actual token
    return `user:${authHeader.slice(-10)}`; // Use last 10 chars as identifier
  }
  
  return `ip:${ip}`;
} 