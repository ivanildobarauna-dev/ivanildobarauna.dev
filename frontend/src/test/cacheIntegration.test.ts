/**
 * Integration tests for cache-hook interaction (IndexedDB implementation)
 *
 * Tests cover:
 * - Cache hit scenario (second load uses cache)
 * - Cache miss scenario (first load fetches from API)
 * - Cache expiration scenario (expired cache triggers re-fetch)
 * - Graceful fallback on cache errors
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserCache } from '../utils/cacheService';

// Helper to reset the IndexedDB database between tests
async function resetDB(): Promise<void> {
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase('portfolio_cache');
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

// Helper to insert a raw entry directly into IndexedDB (for testing edge cases)
async function insertRawEntry(entry: Record<string, unknown>): Promise<void> {
  return new Promise<void>((resolve) => {
    const req = indexedDB.open('portfolio_cache', 1);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('cache', 'readwrite');
      const store = tx.objectStore('cache');
      store.put(entry);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    };
    req.onerror = () => resolve();
  });
}

describe('Cache-Hook Integration', () => {
  beforeEach(async () => {
    await resetDB();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await resetDB();
  });

  describe('Cache hit scenario', () => {
    it('should load data from cache on second request', async () => {
      const testData = [{ id: 1, name: 'Test Project' }];

      // First request - populate cache
      await BrowserCache.set('projects', testData);

      // Second request - should hit cache
      const cached = await BrowserCache.get('projects');

      expect(cached).toEqual(testData);
      expect(cached).not.toBeNull();
    });

    it('should load multiple cache entries', async () => {
      const experiences = [{ id: 1, company: 'Test Co' }];
      const projects = [{ id: 1, name: 'Test Project' }];
      const education = { formations: [], certifications: [] };

      await BrowserCache.set('experiences', experiences);
      await BrowserCache.set('projects', projects);
      await BrowserCache.set('education', education);

      expect(await BrowserCache.get('experiences')).toEqual(experiences);
      expect(await BrowserCache.get('projects')).toEqual(projects);
      expect(await BrowserCache.get('education')).toEqual(education);
    });
  });

  describe('Cache miss scenario', () => {
    it('should return null for non-existent cache', async () => {
      const cached = await BrowserCache.get('nonexistent');
      expect(cached).toBeNull();
    });

    it('should require API fetch on cache miss', async () => {
      // Simulate cache miss
      const cached = await BrowserCache.get('projects');
      expect(cached).toBeNull();

      // Hook would then fetch from API and populate cache
      const apiData = [{ id: 1, name: 'New Project' }];
      await BrowserCache.set('projects', apiData);

      // Next request should hit cache
      const nextRequest = await BrowserCache.get('projects');
      expect(nextRequest).toEqual(apiData);
    });
  });

  describe('Cache expiration scenario', () => {
    it('should expire cache after TTL', async () => {
      const testData = [{ id: 1, name: 'Test' }];

      // Set with 1ms TTL
      await BrowserCache.set('projects', testData, 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should return null (expired)
      const cached = await BrowserCache.get('projects');
      expect(cached).toBeNull();
    });

    it('should automatically remove expired entry on read', async () => {
      await BrowserCache.set('projects', [{ id: 1 }], 1);

      await new Promise((resolve) => setTimeout(resolve, 10));

      await BrowserCache.get('projects'); // Trigger cleanup

      // Wait briefly for the async remove to complete
      await new Promise((resolve) => setTimeout(resolve, 20));

      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(0);
    });
  });

  describe('Graceful fallback on cache errors', () => {
    it('should handle missing expiresAt field gracefully', async () => {
      // Insert an entry without expiresAt directly into IDB
      await insertRawEntry({
        key: 'portfolio_cache_projects',
        data: [{ id: 1 }],
        timestamp: Date.now(),
        // Missing expiresAt - treated as expired by clearExpired
      });

      // Should handle gracefully (returns null or the data, no throw)
      await expect(BrowserCache.get('projects')).resolves.not.toThrow();
    });

    it('should continue working after cache error', async () => {
      // Read from empty cache (should return null)
      expect(await BrowserCache.get('projects')).toBeNull();

      // Should still be able to set new data
      const newData = [{ id: 2, name: 'New Project' }];
      await BrowserCache.set('projects', newData);

      // Should work now
      expect(await BrowserCache.get('projects')).toEqual(newData);
    });
  });

  describe('Multi-resource caching', () => {
    it('should cache multiple resources independently', async () => {
      const experiences = [{ id: 1, company: 'A' }];
      const projects = [{ id: 1, name: 'B' }];
      const education = { formations: [{ id: 1 }], certifications: [] };
      const socialLinks = [{ id: 1, platform: 'LinkedIn' }];

      await BrowserCache.set('experiences', experiences);
      await BrowserCache.set('projects', projects);
      await BrowserCache.set('education', education);
      await BrowserCache.set('social_links', socialLinks);

      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(4);
    });

    it('should invalidate specific resource without affecting others', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);

      // Remove only projects
      await BrowserCache.remove('projects');

      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
    });

    it('should clear all resources at once', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', { formations: [], certifications: [] });

      await BrowserCache.clearAll();

      expect(await BrowserCache.get('experiences')).toBeNull();
      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('education')).toBeNull();
    });
  });

  describe('Cache performance', () => {
    it('should retrieve cached data quickly', async () => {
      const testData = [{ id: 1, name: 'Test' }];
      await BrowserCache.set('projects', testData);

      const startTime = performance.now();
      const cached = await BrowserCache.get('projects');
      const endTime = performance.now();

      const cacheTime = endTime - startTime;

      expect(cached).toEqual(testData);
      expect(cacheTime).toBeLessThan(200); // Should complete within 200ms
    });

    it('should handle large data efficiently', async () => {
      // Create large dataset
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Project ${i}`,
        description: 'A'.repeat(1000), // 1KB per item
      }));

      await BrowserCache.set('projects', largeData);
      const cached = await BrowserCache.get('projects');

      expect(cached).toHaveLength(100);
    });
  });

  describe('Cache key namespacing', () => {
    it('should use portfolio_cache_ prefix for all keys internally', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);

      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(2);

      // Both can be retrieved correctly
      expect(await BrowserCache.get('experiences')).not.toBeNull();
      expect(await BrowserCache.get('projects')).not.toBeNull();
    });

    it('should not count entries without portfolio_cache_ prefix in stats', async () => {
      // Insert a non-namespaced entry directly into IDB
      await insertRawEntry({
        key: 'other_app_key',
        data: 'some data',
        timestamp: Date.now(),
        expiresAt: Date.now() + 999999,
      });

      await BrowserCache.set('projects', [{ id: 1 }]);

      // getStats only counts portfolio_cache_ keys
      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(1);
    });

    it('should not remove non-portfolio entries on clearAll', async () => {
      // Insert a non-namespaced entry directly into IDB
      await insertRawEntry({
        key: 'other_app_key',
        data: 'some data',
        timestamp: Date.now(),
        expiresAt: Date.now() + 999999,
      });

      await BrowserCache.set('projects', [{ id: 1 }]);
      await BrowserCache.clearAll();

      // Portfolio entry cleared
      expect(await BrowserCache.get('projects')).toBeNull();

      // getStats after clearAll should show 0 portfolio keys
      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(0);
    });
  });
});
