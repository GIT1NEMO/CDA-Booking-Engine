import { LRUCache } from 'lru-cache';

// Cache for API responses with 5 minute TTL
export const apiCache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
});

// Generate a unique cache key for price requests
export const getPriceCacheKey = (
  hostId: string,
  tourCode: string,
  date: string,
  extraId: number
) => {
  return `price:${hostId}:${tourCode}:${date}:${extraId}`;
};