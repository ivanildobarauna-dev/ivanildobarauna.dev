/**
 * IndexedDB Cache Service
 *
 * Provides a type-safe abstraction layer for browser IndexedDB-based caching
 * implementing the cache-aside pattern with automatic TTL expiration.
 *
 * Key Features:
 * - Type-safe generic methods with TypeScript
 * - Automatic 30-day TTL with expiration checking
 * - Graceful degradation (never throws, always fallback)
 * - SSR-compatible (checks browser environment)
 * - Larger storage quota than localStorage (GB vs ~5MB)
 */

import type { CachedData, CacheStats } from './cacheTypes';

const DB_NAME = 'portfolio_cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

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
export async function clearPortfolioCache(resourceType?: string): Promise<void> {
  if (resourceType) {
    await BrowserCache.remove(resourceType);
    console.log(`✓ Cache cleared for resource: ${resourceType}`);
  } else {
    await BrowserCache.clearAll();
    console.log('✓ All portfolio cache cleared');
  }
}

// Expose to browser console for manual testing/debugging
if (typeof window !== 'undefined') {
  interface WindowWithCache extends Window {
    clearPortfolioCache: typeof clearPortfolioCache;
  }
  (window as unknown as WindowWithCache).clearPortfolioCache =
    clearPortfolioCache;
}

export class BrowserCache {
  /** Default TTL: 30 days */
  private static readonly TTL_DAYS = 30;

  /** TTL in milliseconds: 30 days = 2,592,000,000 ms */
  private static readonly TTL_MS = BrowserCache.TTL_DAYS * 24 * 60 * 60 * 1000;

  /**
   * Check if code is running in a browser environment with IndexedDB support
   *
   * @returns true if window and indexedDB are available, false during SSR
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
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
  static async get<T>(key: string): Promise<T | null> {
    if (!this.isBrowser()) return null;

    try {
      const db = await openDB();
      const cacheKey = this.getCacheKey(key);

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(cacheKey);

        request.onsuccess = () => {
          db.close();
          const result = request.result as ({ key: string } & CachedData<T>) | undefined;

          if (!result) {
            resolve(null);
            return;
          }

          const now = Date.now();
          if (now > result.expiresAt) {
            this.remove(key); // Async cleanup, fire-and-forget
            resolve(null);
            return;
          }

          resolve(result.data);
        };

        request.onerror = () => {
          db.close();
          resolve(null);
        };
      });
    } catch (error) {
      console.error(`Cache read error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Store data in cache with TTL expiration
   *
   * @param key - Resource identifier (automatically prefixed with portfolio_cache_)
   * @param data - Data to cache (must be structured-cloneable)
   * @param ttlMs - Optional time-to-live in milliseconds (defaults to 30 days)
   */
  static async set<T>(key: string, data: T, ttlMs?: number): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const db = await openDB();
      const cacheKey = this.getCacheKey(key);
      const now = Date.now();
      const expiresAt = now + (ttlMs || this.TTL_MS);

      const entry = {
        key: cacheKey,
        data,
        timestamp: now,
        expiresAt,
      };

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(entry);

        tx.oncomplete = () => {
          db.close();
          resolve();
        };

        tx.onerror = () => {
          db.close();
          console.error(`Cache write error for key "${key}"`);
          resolve();
        };
      });
    } catch (error) {
      console.error(`Cache write error for key "${key}":`, error);
    }
  }

  /**
   * Remove a specific cache entry
   *
   * @param key - Resource identifier (automatically prefixed with portfolio_cache_)
   */
  static async remove(key: string): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const db = await openDB();
      const cacheKey = this.getCacheKey(key);

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(cacheKey);

        tx.oncomplete = () => {
          db.close();
          resolve();
        };

        tx.onerror = () => {
          db.close();
          console.error(`Cache remove error for key "${key}"`);
          resolve();
        };
      });
    } catch (error) {
      console.error(`Cache remove error for key "${key}":`, error);
    }
  }

  /**
   * Remove all portfolio cache entries from IndexedDB
   */
  static async clearAll(): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const db = await openDB();

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const entry = cursor.value as { key: string };
            if (entry.key?.startsWith('portfolio_cache_')) {
              cursor.delete();
            }
            cursor.continue();
          }
        };

        tx.oncomplete = () => {
          db.close();
          resolve();
        };

        tx.onerror = () => {
          db.close();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }

  /**
   * Remove all expired cache entries (cleanup operation)
   */
  static async clearExpired(): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const db = await openDB();
      const now = Date.now();

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const entry = cursor.value as { key: string; expiresAt?: number };
            if (entry.key?.startsWith('portfolio_cache_')) {
              if (!entry.expiresAt || now > entry.expiresAt) {
                cursor.delete();
              }
            }
            cursor.continue();
          }
        };

        tx.oncomplete = () => {
          db.close();
          resolve();
        };

        tx.onerror = () => {
          db.close();
          resolve();
        };
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
  static async getStats(): Promise<CacheStats> {
    if (!this.isBrowser()) {
      return { totalKeys: 0, totalSize: 0, oldestEntry: null };
    }

    try {
      const db = await openDB();

      return new Promise((resolve) => {
        let totalKeys = 0;
        let totalSize = 0;
        let oldestEntry: number | null = null;

        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const entry = cursor.value as { key: string; timestamp: number };
            if (entry.key?.startsWith('portfolio_cache_')) {
              totalKeys++;
              totalSize += JSON.stringify(cursor.value).length;
              if (!oldestEntry || entry.timestamp < oldestEntry) {
                oldestEntry = entry.timestamp;
              }
            }
            cursor.continue();
          }
        };

        tx.oncomplete = () => {
          db.close();
          resolve({ totalKeys, totalSize, oldestEntry });
        };

        tx.onerror = () => {
          db.close();
          resolve({ totalKeys: 0, totalSize: 0, oldestEntry: null });
        };
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalKeys: 0, totalSize: 0, oldestEntry: null };
    }
  }
}
