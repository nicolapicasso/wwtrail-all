import { createClient } from 'redis';
import logger from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
redisClient.on('connect', () => logger.info('✅ Redis connected'));
redisClient.on('disconnect', () => logger.warn('⚠️ Redis disconnected'));

// Conectar automáticamente
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
  }
})();

// Cache TTL constants
export const CACHE_TTL = 5 * 60; // 5 minutos
export const CACHE_TTL_LONG = 60 * 60; // 1 hora

// Cache helpers
export const cache = {
  async get(key: string): Promise<string | null> {
    try {
      const data = await redisClient.get(key);
      return data;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redisClient.setEx(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      // Buscar todas las claves que coincidan con el patrón
      const keys = await redisClient.keys(pattern);

      if (keys.length > 0) {
        // Borrar todas las claves encontradas
        await redisClient.del(keys);
        logger.info(`Deleted ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
    }
  },

  async flush(): Promise<void> {
    try {
      await redisClient.flushAll();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  },
};

// Legacy export
export const cacheService = cache;

export default redisClient;
