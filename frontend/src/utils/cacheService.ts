/**
 * BrowserCache Service
 *
 * Provides a type-safe abstraction layer for browser localStorage-based caching
 * implementing the cache-aside pattern with automatic TTL expiration.
 *
 * Key Features:
 * - Type-safe generic methods with TypeScript
 * - Automatic 30-day TTL with expiration checking
 * - Graceful degradation (never throws, always fallback)
 * - SSR-compatible (checks browser environment)
 * - Quota-aware (handles storage limits with cleanup)
 */

import type { CachedData, CacheStats } from './cacheTypes';

/**
 * Global cache invalidation function for manual cache clearing
 *
 * Can be called from browser console: window.clearPortfolioCache()
 * or used programmatically in the application.
 *
 * @param resourceType - Optional resource type to clear (e.g., 'projects', 'experiences')
 *                      If not provided, clears all cache entries.
 *
 * @example
 * // Clear all cache
 * clearPortfolioCache();
 *
 * @example
 * // Clear only projects cache
 * clearPortfolioCache('projects');
 */
export function clearPortfolioCache(resourceType?: string): void {
  if (resourceType) {
    BrowserCache.remove(resourceType);
    console.log(`✓ Cache cleared for resource: ${resourceType}`);
  } else {
    BrowserCache.clearAll();
    console.log('✓ All portfolio cache cleared');
  }
}

// Expose to browser console for manual testing/debugging
if (typeof window !== 'undefined') {
  interface WindowWithCache extends Window {
    clearPortfolioCache: typeof clearPortfolioCache;
  }
  (window as WindowWithCache).clearPortfolioCache = clearPortfolioCache;
}

export class BrowserCache {
  /** Default TTL: 30 days */
  private static readonly TTL_DAYS = 30;

  /** TTL in milliseconds: 30 days = 2,592,000,000 ms */
  private static readonly TTL_MS = BrowserCache.TTL_DAYS * 24 * 60 * 60 * 1000;

  /**
   * Check if code is running in a browser environment
   *
   * @returns true if window and localStorage are available, false during SSR
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Generate namespaced cache key with portfolio_cache_ prefix
   *
   * @param key - Raw resource identifier (e.g., "experiences")
   * @returns Namespaced key (e.g., "portfolio_cache_experiences")
   */
  private static getCacheKey(key: string): string {
    return `portfolio_cache_${key}`;
  }

  /**
   * Retrieve cached data with automatic expiration checking
   *
   * @param key - Resource identifier (automatically prefixed with portfolio_cache_)
   * @returns Cached data if valid, null if cache miss/expired/error
   */
  static get<T>(key: string): T | null {
    if (!this.isBrowser()) return null;

    try {
      const cacheKey = this.getCacheKey(key);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const parsed: CachedData<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (now > parsed.expiresAt) {
        this.remove(key); // Clean up expired cache
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error(`Cache read error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Store data in cache with TTL expiration
   *
   * @param key - Resource identifier (automatically prefixed with portfolio_cache_)
   * @param data - Data to cache (must be JSON-serializable)
   * @param ttlMs - Optional time-to-live in milliseconds (defaults to 30 days)
   */
  static set<T>(key: string, data: T, ttlMs?: number): void {
    if (!this.isBrowser()) return;

    try {
      const cacheKey = this.getCacheKey(key);
      const now = Date.now();
      const expiresAt = now + (ttlMs || this.TTL_MS);

      const cacheData: CachedData<T> = {
        data,
        timestamp: now,
        expiresAt,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`Cache write error for key "${key}":`, error);

      // If quota exceeded, try to clear old caches
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearExpired();
        // Retry once
        try {
          const cacheKey = this.getCacheKey(key);
          const now = Date.now();
          const expiresAt = now + (ttlMs || this.TTL_MS);

          const cacheData: CachedData<T> = {
            data,
            timestamp: now,
            expiresAt,
          };

          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch {
          console.error('Cache write failed even after cleanup');
        }
      }
    }
  }

  /**
   * Remove a specific cache entry
   *
   * @param key - Resource identifier (automatically prefixed with portfolio_cache_)
   */
  static remove(key: string): void {
    if (!this.isBrowser()) return;

    try {
      const cacheKey = this.getCacheKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error(`Cache remove error for key "${key}":`, error);
    }
  }

  /**
   * Remove all portfolio cache entries from localStorage
   */
  static clearAll(): void {
    if (!this.isBrowser()) return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith('portfolio_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }

  /**
   * Remove all expired cache entries (cleanup operation)
   */
  static clearExpired(): void {
    if (!this.isBrowser()) return;

    try {
      const now = Date.now();
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith('portfolio_cache_')) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const parsed: CachedData<unknown> = JSON.parse(cached);
              if (now > parsed.expiresAt) {
                localStorage.removeItem(key); // Remove expired entry
              }
            }
          } catch {
            // If parsing fails, remove the corrupted entry
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  /**
   * Retrieve cache usage statistics for monitoring and debugging
   *
   * @returns Cache statistics object
   */
  static getStats(): CacheStats {
    if (!this.isBrowser())
      return {
        totalKeys: 0,
        totalSize: 0,
        oldestEntry: null,
      };

    let totalKeys = 0;
    let totalSize = 0;
    let oldestEntry: number | null = null;

    try {
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith('portfolio_cache_')) {
          totalKeys++;
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length; // String byte size

            try {
              const parsed: CachedData<unknown> = JSON.parse(value);
              if (!oldestEntry || parsed.timestamp < oldestEntry) {
                oldestEntry = parsed.timestamp;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
    }

    return { totalKeys, totalSize, oldestEntry };
  }
}
