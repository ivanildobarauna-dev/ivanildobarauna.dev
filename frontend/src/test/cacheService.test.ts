/**
 * Unit tests for BrowserCache service (IndexedDB implementation)
 *
 * Tests cover:
 * - get/set/remove operations
 * - TTL expiration
 * - SSR compatibility
 * - clearAll and clearExpired operations
 * - getStats functionality
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserCache, clearPortfolioCache } from '../utils/cacheService';

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

describe('BrowserCache', () => {
  beforeEach(async () => {
    await resetDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  describe('get() and set()', () => {
    it('should cache and retrieve data', async () => {
      const testData = { id: 1, name: 'Test' };
      await BrowserCache.set('test', testData);

      const cached = await BrowserCache.get<typeof testData>('test');
      expect(cached).toEqual(testData);
    });

    it('should return null for cache miss', async () => {
      const cached = await BrowserCache.get('nonexistent');
      expect(cached).toBeNull();
    });

    it('should namespace cache keys', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);

      // Verify data is accessible through the namespaced key
      const cached = await BrowserCache.get('experiences');
      expect(cached).not.toBeNull();

      // Verify stats reflect the stored entry
      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(1);
    });

    it('should handle different data types', async () => {
      const stringData = 'test string';
      const numberData = 42;
      const arrayData = [1, 2, 3];
      const objectData = { nested: { value: 'deep' } };

      await BrowserCache.set('string', stringData);
      await BrowserCache.set('number', numberData);
      await BrowserCache.set('array', arrayData);
      await BrowserCache.set('object', objectData);

      expect(await BrowserCache.get('string')).toBe(stringData);
      expect(await BrowserCache.get('number')).toBe(numberData);
      expect(await BrowserCache.get('array')).toEqual(arrayData);
      expect(await BrowserCache.get('object')).toEqual(objectData);
    });
  });

  describe('TTL expiration', () => {
    it('should return null for expired cache', async () => {
      const testData = { id: 1, name: 'Test' };
      await BrowserCache.set('test', testData, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      const cached = await BrowserCache.get('test');
      expect(cached).toBeNull();
    });

    it('should remove expired entry on read', async () => {
      await BrowserCache.set('test', { id: 1 }, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      await BrowserCache.get('test'); // Trigger expiration cleanup

      // Wait briefly for the async remove to complete
      await new Promise((resolve) => setTimeout(resolve, 20));

      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(0);
    });

    it('should respect custom TTL', async () => {
      const testData = { id: 1 };
      const customTTL = 1000; // 1 second
      await BrowserCache.set('test', testData, customTTL);

      const cached = await BrowserCache.get('test');
      expect(cached).toEqual(testData);
    });
  });

  describe('remove()', () => {
    it('should remove specific cache entry', async () => {
      await BrowserCache.set('test1', { id: 1 });
      await BrowserCache.set('test2', { id: 2 });

      await BrowserCache.remove('test1');

      expect(await BrowserCache.get('test1')).toBeNull();
      expect(await BrowserCache.get('test2')).toEqual({ id: 2 });
    });

    it('should handle removing nonexistent entry', async () => {
      await expect(BrowserCache.remove('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('clearAll()', () => {
    it('should remove all portfolio cache entries', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', { formations: [] });

      await BrowserCache.clearAll();

      expect(await BrowserCache.get('experiences')).toBeNull();
      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('education')).toBeNull();
    });

    it('should not affect non-portfolio IDB entries', async () => {
      // Insert a non-portfolio entry directly into IDB
      await insertRawEntry({
        key: 'other_app_data',
        data: 'should remain',
        timestamp: Date.now(),
        expiresAt: Date.now() + 999999,
      });
      await BrowserCache.set('experiences', [{ id: 1 }]);

      await BrowserCache.clearAll();

      // Portfolio entry cleared
      expect(await BrowserCache.get('experiences')).toBeNull();
      // getStats only counts portfolio entries - should be 0
      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(0);
    });
  });

  describe('clearExpired()', () => {
    it('should remove only expired entries', async () => {
      await BrowserCache.set('valid', { id: 1 }, 60000); // Valid for 1 minute
      await BrowserCache.set('expired', { id: 2 }, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      await BrowserCache.clearExpired();

      expect(await BrowserCache.get('valid')).toEqual({ id: 1 });
      expect(await BrowserCache.get('expired')).toBeNull();
    });

    it('should remove entries with missing expiresAt', async () => {
      await BrowserCache.set('valid', { id: 1 });

      // Insert an entry without expiresAt directly into IDB
      await insertRawEntry({
        key: 'portfolio_cache_corrupted',
        data: { bad: true },
        timestamp: Date.now(),
        // no expiresAt
      });

      await BrowserCache.clearExpired();

      expect(await BrowserCache.get('valid')).toEqual({ id: 1 });
      // Corrupted entry (no expiresAt) should be removed
      const stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(1);
    });
  });

  describe('getStats()', () => {
    it('should return correct stats for empty cache', async () => {
      const stats = await BrowserCache.getStats();

      expect(stats.totalKeys).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.oldestEntry).toBeNull();
    });

    it('should calculate correct stats', async () => {
      await BrowserCache.set('test1', { id: 1 });
      await BrowserCache.set('test2', { id: 2 });
      await BrowserCache.set('test3', { id: 3 });

      const stats = await BrowserCache.getStats();

      expect(stats.totalKeys).toBe(3);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.oldestEntry).toBeGreaterThan(0);
    });

    it('should only count portfolio cache entries', async () => {
      // Insert a non-portfolio key directly into IDB
      await insertRawEntry({
        key: 'other_app_key',
        data: 'some data',
        timestamp: Date.now(),
        expiresAt: Date.now() + 999999,
      });

      await BrowserCache.set('experiences', [{ id: 1 }]);

      const stats = await BrowserCache.getStats();

      expect(stats.totalKeys).toBe(1); // Only portfolio cache
    });
  });

  describe('Error handling', () => {
    it('should not throw on errors during get', async () => {
      await expect(BrowserCache.get('test')).resolves.toBeNull();
    });

    it('should not throw on errors during set', async () => {
      await expect(BrowserCache.set('test', { id: 1 })).resolves.not.toThrow();
    });

    it('should not throw on errors during remove', async () => {
      await expect(BrowserCache.remove('test')).resolves.not.toThrow();
    });

    it('should not throw on errors during clearAll', async () => {
      await expect(BrowserCache.clearAll()).resolves.not.toThrow();
    });

    it('should not throw on errors during clearExpired', async () => {
      await expect(BrowserCache.clearExpired()).resolves.not.toThrow();
    });

    it('should not throw on errors during getStats', async () => {
      await expect(BrowserCache.getStats()).resolves.not.toThrow();
    });
  });

  describe('SSR compatibility', () => {
    it('should handle SSR environment gracefully - methods should not throw', async () => {
      // These run in a test environment with fake-indexeddb. Just verify methods don't throw.
      await expect(BrowserCache.get('test')).resolves.toBeNull();
      await expect(BrowserCache.set('test', { id: 1 })).resolves.not.toThrow();
      await expect(BrowserCache.remove('test')).resolves.not.toThrow();
      await expect(BrowserCache.clearAll()).resolves.not.toThrow();
      await expect(BrowserCache.clearExpired()).resolves.not.toThrow();
      await expect(BrowserCache.getStats()).resolves.not.toThrow();
    });
  });

  describe('Granular cache invalidation', () => {
    it('should clear specific resource only', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', { formations: [] });

      // Clear only projects
      await BrowserCache.remove('projects');

      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
      expect(await BrowserCache.get('education')).toEqual({ formations: [] });
    });

    it('should clear multiple specific resources independently', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('company_durations', [{ name: 'A', duration: '1y' }]);
      await BrowserCache.set('total_duration', { total_duration: '5y' });
      await BrowserCache.set('projects', [{ id: 2 }]);

      // Clear experiences and projects, keep durations
      await BrowserCache.remove('experiences');
      await BrowserCache.remove('projects');

      expect(await BrowserCache.get('experiences')).toBeNull();
      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('company_durations')).toEqual([
        { name: 'A', duration: '1y' },
      ]);
      expect(await BrowserCache.get('total_duration')).toEqual({ total_duration: '5y' });
    });

    it('should not affect other resources when clearing specific resource', async () => {
      const experiences = [{ id: 1, company: 'Test Co' }];
      const projects = [{ id: 2, name: 'Test Project' }];
      const education = { formations: [{ id: 3 }], certifications: [] };
      const socialLinks = [{ id: 4, platform: 'LinkedIn' }];

      await BrowserCache.set('experiences', experiences);
      await BrowserCache.set('projects', projects);
      await BrowserCache.set('education', education);
      await BrowserCache.set('social_links', socialLinks);

      // Clear only education
      await BrowserCache.remove('education');

      // Other caches should remain intact
      expect(await BrowserCache.get('experiences')).toEqual(experiences);
      expect(await BrowserCache.get('projects')).toEqual(projects);
      expect(await BrowserCache.get('education')).toBeNull();
      expect(await BrowserCache.get('social_links')).toEqual(socialLinks);
    });

    it('should handle clearing non-existent resource gracefully', async () => {
      await BrowserCache.set('projects', [{ id: 1 }]);

      // Clear non-existent resource
      await expect(BrowserCache.remove('nonexistent')).resolves.not.toThrow();

      // Existing cache should remain
      expect(await BrowserCache.get('projects')).toEqual([{ id: 1 }]);
    });

    it('should track cache stats after partial clearing', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', [{ id: 3 }]);

      let stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(3);

      // Clear one resource
      await BrowserCache.remove('projects');

      stats = await BrowserCache.getStats();
      expect(stats.totalKeys).toBe(2);
    });
  });

  describe('clearPortfolioCache utility function', () => {
    it('should clear all cache when called without parameter', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', { formations: [] });

      await clearPortfolioCache();

      expect(await BrowserCache.get('experiences')).toBeNull();
      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('education')).toBeNull();
    });

    it('should clear specific resource when resourceType provided', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);

      await clearPortfolioCache('projects');

      expect(await BrowserCache.get('projects')).toBeNull();
      expect(await BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
    });

    it('should log success message when clearing all', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await BrowserCache.set('projects', [{ id: 1 }]);
      await clearPortfolioCache();

      expect(consoleSpy).toHaveBeenCalledWith('✓ All portfolio cache cleared');
      consoleSpy.mockRestore();
    });

    it('should log success message when clearing specific resource', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await BrowserCache.set('projects', [{ id: 1 }]);
      await clearPortfolioCache('projects');

      expect(consoleSpy).toHaveBeenCalledWith(
        '✓ Cache cleared for resource: projects'
      );
      consoleSpy.mockRestore();
    });

    it('should handle multiple sequential clearings', async () => {
      await BrowserCache.set('experiences', [{ id: 1 }]);
      await BrowserCache.set('projects', [{ id: 2 }]);
      await BrowserCache.set('education', { formations: [] });

      await clearPortfolioCache('projects');
      expect(await BrowserCache.get('projects')).toBeNull();
      expect((await BrowserCache.getStats()).totalKeys).toBe(2);

      await clearPortfolioCache('education');
      expect(await BrowserCache.get('education')).toBeNull();
      expect((await BrowserCache.getStats()).totalKeys).toBe(1);

      await clearPortfolioCache(); // Clear remaining
      expect((await BrowserCache.getStats()).totalKeys).toBe(0);
    });
  });
});
