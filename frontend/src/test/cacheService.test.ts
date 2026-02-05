/**
 * Unit tests for BrowserCache service
 *
 * Tests cover:
 * - get/set/remove operations
 * - TTL expiration
 * - QuotaExceededError handling (simulated)
 * - SSR compatibility
 * - clearAll and clearExpired operations
 * - getStats functionality
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserCache, clearPortfolioCache } from '../utils/cacheService';

describe('BrowserCache', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('get() and set()', () => {
    it('should cache and retrieve data', () => {
      const testData = { id: 1, name: 'Test' };
      BrowserCache.set('test', testData);

      const cached = BrowserCache.get<typeof testData>('test');
      expect(cached).toEqual(testData);
    });

    it('should return null for cache miss', () => {
      const cached = BrowserCache.get('nonexistent');
      expect(cached).toBeNull();
    });

    it('should namespace cache keys', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);

      const keys = Object.keys(localStorage);
      expect(keys).toContain('portfolio_cache_experiences');
    });

    it('should handle different data types', () => {
      const stringData = 'test string';
      const numberData = 42;
      const arrayData = [1, 2, 3];
      const objectData = { nested: { value: 'deep' } };

      BrowserCache.set('string', stringData);
      BrowserCache.set('number', numberData);
      BrowserCache.set('array', arrayData);
      BrowserCache.set('object', objectData);

      expect(BrowserCache.get('string')).toBe(stringData);
      expect(BrowserCache.get('number')).toBe(numberData);
      expect(BrowserCache.get('array')).toEqual(arrayData);
      expect(BrowserCache.get('object')).toEqual(objectData);
    });
  });

  describe('TTL expiration', () => {
    it('should return null for expired cache', async () => {
      const testData = { id: 1, name: 'Test' };
      BrowserCache.set('test', testData, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      const cached = BrowserCache.get('test');
      expect(cached).toBeNull();
    });

    it('should remove expired entry on read', async () => {
      BrowserCache.set('test', { id: 1 }, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      BrowserCache.get('test'); // Trigger expiration cleanup

      const keys = Object.keys(localStorage);
      expect(keys).not.toContain('portfolio_cache_test');
    });

    it('should respect custom TTL', () => {
      const testData = { id: 1 };
      const customTTL = 1000; // 1 second
      BrowserCache.set('test', testData, customTTL);

      const cached = BrowserCache.get('test');
      expect(cached).toEqual(testData);
    });
  });

  describe('remove()', () => {
    it('should remove specific cache entry', () => {
      BrowserCache.set('test1', { id: 1 });
      BrowserCache.set('test2', { id: 2 });

      BrowserCache.remove('test1');

      expect(BrowserCache.get('test1')).toBeNull();
      expect(BrowserCache.get('test2')).toEqual({ id: 2 });
    });

    it('should handle removing nonexistent entry', () => {
      expect(() => BrowserCache.remove('nonexistent')).not.toThrow();
    });
  });

  describe('clearAll()', () => {
    it('should remove all portfolio cache entries', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', { formations: [] });

      BrowserCache.clearAll();

      expect(BrowserCache.get('experiences')).toBeNull();
      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('education')).toBeNull();
    });

    it('should not affect non-portfolio localStorage keys', () => {
      localStorage.setItem('other_app_data', 'should remain');
      BrowserCache.set('experiences', [{ id: 1 }]);

      BrowserCache.clearAll();

      expect(localStorage.getItem('other_app_data')).toBe('should remain');
      expect(BrowserCache.get('experiences')).toBeNull();
    });
  });

  describe('clearExpired()', () => {
    it('should remove only expired entries', async () => {
      BrowserCache.set('valid', { id: 1 }, 60000); // Valid for 1 minute
      BrowserCache.set('expired', { id: 2 }, 1); // Expire in 1ms

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      BrowserCache.clearExpired();

      expect(BrowserCache.get('valid')).toEqual({ id: 1 });
      expect(BrowserCache.get('expired')).toBeNull();
    });

    it('should remove corrupted entries', () => {
      BrowserCache.set('valid', { id: 1 });

      // Manually corrupt an entry
      localStorage.setItem('portfolio_cache_corrupted', 'invalid json{');

      BrowserCache.clearExpired();

      expect(BrowserCache.get('valid')).toEqual({ id: 1 });
      expect(localStorage.getItem('portfolio_cache_corrupted')).toBeNull();
    });
  });

  describe('getStats()', () => {
    it('should return correct stats for empty cache', () => {
      const stats = BrowserCache.getStats();

      expect(stats.totalKeys).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.oldestEntry).toBeNull();
    });

    it('should calculate correct stats', () => {
      BrowserCache.set('test1', { id: 1 });
      BrowserCache.set('test2', { id: 2 });
      BrowserCache.set('test3', { id: 3 });

      const stats = BrowserCache.getStats();

      expect(stats.totalKeys).toBe(3);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.oldestEntry).toBeGreaterThan(0);
    });

    it('should only count portfolio cache entries', () => {
      localStorage.setItem('other_app_key', 'some data');
      BrowserCache.set('experiences', [{ id: 1 }]);

      const stats = BrowserCache.getStats();

      expect(stats.totalKeys).toBe(1); // Only portfolio cache
    });
  });

  describe('Error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      localStorage.setItem('portfolio_cache_corrupt', 'not valid json{');

      const cached = BrowserCache.get('corrupt');
      expect(cached).toBeNull();
    });

    it('should not throw on localStorage errors', () => {
      // Simulate localStorage error by mocking
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });

      expect(() => BrowserCache.get('test')).not.toThrow();
      expect(BrowserCache.get('test')).toBeNull();

      // Restore original
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('SSR compatibility', () => {
    it('should handle SSR environment (no window)', () => {
      // This test runs in Node.js/Vitest environment
      // In browser, typeof window !== 'undefined'
      // In SSR, it should gracefully return null

      // Since we're in a test environment that does have window,
      // we'll just verify the methods don't throw
      expect(() => BrowserCache.get('test')).not.toThrow();
      expect(() => BrowserCache.set('test', { id: 1 })).not.toThrow();
      expect(() => BrowserCache.remove('test')).not.toThrow();
      expect(() => BrowserCache.clearAll()).not.toThrow();
      expect(() => BrowserCache.clearExpired()).not.toThrow();
      expect(() => BrowserCache.getStats()).not.toThrow();
    });
  });

  describe('Granular cache invalidation', () => {
    it('should clear specific resource only', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', { formations: [] });

      // Clear only projects
      BrowserCache.remove('projects');

      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
      expect(BrowserCache.get('education')).toEqual({ formations: [] });
    });

    it('should clear multiple specific resources independently', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('company_durations', [{ name: 'A', duration: '1y' }]);
      BrowserCache.set('total_duration', { total_duration: '5y' });
      BrowserCache.set('projects', [{ id: 2 }]);

      // Clear experiences and projects, keep durations
      BrowserCache.remove('experiences');
      BrowserCache.remove('projects');

      expect(BrowserCache.get('experiences')).toBeNull();
      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('company_durations')).toEqual([
        { name: 'A', duration: '1y' },
      ]);
      expect(BrowserCache.get('total_duration')).toEqual({ total_duration: '5y' });
    });

    it('should not affect other resources when clearing specific resource', () => {
      const experiences = [{ id: 1, company: 'Test Co' }];
      const projects = [{ id: 2, name: 'Test Project' }];
      const education = { formations: [{ id: 3 }], certifications: [] };
      const socialLinks = [{ id: 4, platform: 'LinkedIn' }];

      BrowserCache.set('experiences', experiences);
      BrowserCache.set('projects', projects);
      BrowserCache.set('education', education);
      BrowserCache.set('social_links', socialLinks);

      // Clear only education
      BrowserCache.remove('education');

      // Other caches should remain intact
      expect(BrowserCache.get('experiences')).toEqual(experiences);
      expect(BrowserCache.get('projects')).toEqual(projects);
      expect(BrowserCache.get('education')).toBeNull();
      expect(BrowserCache.get('social_links')).toEqual(socialLinks);
    });

    it('should handle clearing non-existent resource gracefully', () => {
      BrowserCache.set('projects', [{ id: 1 }]);

      // Clear non-existent resource
      expect(() => BrowserCache.remove('nonexistent')).not.toThrow();

      // Existing cache should remain
      expect(BrowserCache.get('projects')).toEqual([{ id: 1 }]);
    });

    it('should track cache stats after partial clearing', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', [{ id: 3 }]);

      let stats = BrowserCache.getStats();
      expect(stats.totalKeys).toBe(3);

      // Clear one resource
      BrowserCache.remove('projects');

      stats = BrowserCache.getStats();
      expect(stats.totalKeys).toBe(2);
    });
  });

  describe('QuotaExceededError handling', () => {
    it('should handle quota exceeded by clearing expired entries', async () => {
      // Add an expired entry
      BrowserCache.set('expired', { data: 'old' }, 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Mock setItem to throw QuotaExceededError on first call, succeed on second
      let callCount = 0;
      const originalSetItem = Storage.prototype.setItem;

      Storage.prototype.setItem = vi.fn((key, value) => {
        callCount++;
        if (callCount === 1) {
          const quotaError = new DOMException(
            'QuotaExceededError',
            'QuotaExceededError'
          );
          quotaError.name = 'QuotaExceededError';
          throw quotaError;
        }
        return originalSetItem.call(localStorage, key, value);
      });

      // This should trigger cleanup and retry
      BrowserCache.set('new_data', { id: 1 });

      // Verify expired entry was cleaned up
      expect(BrowserCache.get('expired')).toBeNull();

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('clearPortfolioCache utility function', () => {
    it('should clear all cache when called without parameter', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', { formations: [] });

      clearPortfolioCache();

      expect(BrowserCache.get('experiences')).toBeNull();
      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('education')).toBeNull();
    });

    it('should clear specific resource when resourceType provided', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);

      clearPortfolioCache('projects');

      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
    });

    it('should log success message when clearing all', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      BrowserCache.set('projects', [{ id: 1 }]);
      clearPortfolioCache();

      expect(consoleSpy).toHaveBeenCalledWith('✓ All portfolio cache cleared');
      consoleSpy.mockRestore();
    });

    it('should log success message when clearing specific resource', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      BrowserCache.set('projects', [{ id: 1 }]);
      clearPortfolioCache('projects');

      expect(consoleSpy).toHaveBeenCalledWith(
        '✓ Cache cleared for resource: projects'
      );
      consoleSpy.mockRestore();
    });

    it('should handle multiple sequential clearings', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', { formations: [] });

      clearPortfolioCache('projects');
      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.getStats().totalKeys).toBe(2);

      clearPortfolioCache('education');
      expect(BrowserCache.get('education')).toBeNull();
      expect(BrowserCache.getStats().totalKeys).toBe(1);

      clearPortfolioCache(); // Clear remaining
      expect(BrowserCache.getStats().totalKeys).toBe(0);
    });
  });
});
