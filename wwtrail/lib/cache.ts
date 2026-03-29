// Simple in-memory cache replacing Redis
// For a production app with multiple instances, switch to Upstash Redis

const memoryCache = new Map<string, { value: string; expiresAt: number }>();

export const CACHE_TTL = 300; // 5 minutes
export const CACHE_TTL_LONG = 3600; // 1 hour

export const cache = {
  async get(key: string): Promise<string | null> {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || CACHE_TTL) * 1000;
    memoryCache.set(key, { value, expiresAt });
  },

  async del(key: string): Promise<void> {
    memoryCache.delete(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  },

  async flush(): Promise<void> {
    memoryCache.clear();
  },
};

// Backwards compatibility
export const cacheService = cache;
export default cache;
