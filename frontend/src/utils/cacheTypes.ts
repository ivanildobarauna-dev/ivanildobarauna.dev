/**
 * TypeScript type definitions for frontend caching system
 *
 * This file defines the core types used by the BrowserCache service
 * for implementing cache-aside pattern with localStorage.
 */

/**
 * Wrapper structure for cached API responses
 *
 * Stores the actual data alongside metadata for TTL management and debugging.
 */
export interface CachedData<T> {
  /** The actual API response payload */
  data: T;

  /** Unix timestamp (milliseconds) when data was cached */
  timestamp: number;

  /** Unix timestamp (milliseconds) when cache entry expires */
  expiresAt: number;
}

/**
 * Cache statistics for monitoring and debugging
 *
 * Provides visibility into cache usage for troubleshooting and performance analysis.
 */
export interface CacheStats {
  /** Count of all portfolio cache entries in localStorage */
  totalKeys: number;

  /** Total bytes used by all cache entries (sum of stringified JSON lengths) */
  totalSize: number;

  /** Timestamp of the oldest cache entry, or null if no entries exist */
  oldestEntry: number | null;
}

/**
 * Resource types that can be cached
 *
 * Used for granular cache invalidation (User Story 3 - P3)
 */
export type ResourceType =
  | 'experiences'
  | 'company_durations'
  | 'total_duration'
  | 'projects'
  | 'education'
  | 'social_links';
