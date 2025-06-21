interface CacheItem {
  value: any;
  expiry: number;
}

class Cache {
  private store: Map<string, CacheItem> = new Map();
  private readonly defaultTTL: number = 300; // 5 minutes

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + (ttl * 1000);
    this.store.set(key, { value, expiry });
  }

  get(key: string): any | null {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;
    
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        expiredItems++;
        this.store.delete(key);
      } else {
        validItems++;
      }
    }
    
    return {
      total: validItems + expiredItems,
      valid: validItems,
      expired: expiredItems,
    };
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;

// Cache keys for different data types
export const CACHE_KEYS = {
  BUSINESS: (id: string) => `business:${id}`,
  USER_BUSINESSES: (userId: string) => `user_businesses:${userId}`,
  ANALYTICS: (businessId: string) => `analytics:${businessId}`,
  USER_PLAN: (userId: string) => `user_plan:${userId}`,
} as const;

// Cache TTLs in seconds
export const CACHE_TTL = {
  BUSINESS: 300, // 5 minutes
  USER_BUSINESSES: 180, // 3 minutes
  ANALYTICS: 600, // 10 minutes
  USER_PLAN: 900, // 15 minutes
} as const; 