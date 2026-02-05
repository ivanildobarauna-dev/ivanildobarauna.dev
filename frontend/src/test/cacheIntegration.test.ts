/**
 * Integration tests for cache-hook interaction
 *
 * Tests cover:
 * - Cache hit scenario (second load uses cache)
 * - Cache miss scenario (first load fetches from API)
 * - Cache expiration scenario (expired cache triggers re-fetch)
 * - Graceful fallback on cache errors
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BrowserCache } from '../utils/cacheService';

describe('Cache-Hook Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Cache hit scenario', () => {
    it('should load data from cache on second request', () => {
      const testData = [{ id: 1, name: 'Test Project' }];

      // First request - populate cache
      BrowserCache.set('projects', testData);

      // Second request - should hit cache
      const cached = BrowserCache.get('projects');

      expect(cached).toEqual(testData);
      expect(cached).not.toBeNull();
    });

    it('should load multiple cache entries', () => {
      const experiences = [{ id: 1, company: 'Test Co' }];
      const projects = [{ id: 1, name: 'Test Project' }];
      const education = { formations: [], certifications: [] };

      BrowserCache.set('experiences', experiences);
      BrowserCache.set('projects', projects);
      BrowserCache.set('education', education);

      expect(BrowserCache.get('experiences')).toEqual(experiences);
      expect(BrowserCache.get('projects')).toEqual(projects);
      expect(BrowserCache.get('education')).toEqual(education);
    });
  });

  describe('Cache miss scenario', () => {
    it('should return null for non-existent cache', () => {
      const cached = BrowserCache.get('nonexistent');
      expect(cached).toBeNull();
    });

    it('should require API fetch on cache miss', () => {
      // Simulate cache miss
      const cached = BrowserCache.get('projects');
      expect(cached).toBeNull();

      // Hook would then fetch from API and populate cache
      const apiData = [{ id: 1, name: 'New Project' }];
      BrowserCache.set('projects', apiData);

      // Next request should hit cache
      const nextRequest = BrowserCache.get('projects');
      expect(nextRequest).toEqual(apiData);
    });
  });

  describe('Cache expiration scenario', () => {
    it('should expire cache after TTL', async () => {
      const testData = [{ id: 1, name: 'Test' }];

      // Set with 1ms TTL
      BrowserCache.set('projects', testData, 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should return null (expired)
      const cached = BrowserCache.get('projects');
      expect(cached).toBeNull();
    });

    it('should automatically remove expired entry on read', async () => {
      BrowserCache.set('projects', [{ id: 1 }], 1);

      await new Promise((resolve) => setTimeout(resolve, 10));

      BrowserCache.get('projects'); // Trigger cleanup

      const keys = Object.keys(localStorage);
      expect(keys).not.toContain('portfolio_cache_projects');
    });
  });

  describe('Graceful fallback on cache errors', () => {
    it('should handle corrupted cache data', () => {
      // Manually corrupt cache entry
      localStorage.setItem('portfolio_cache_projects', 'invalid json{');

      // Should return null (graceful fallback)
      const cached = BrowserCache.get('projects');
      expect(cached).toBeNull();
    });

    it('should handle missing expiresAt field', () => {
      // Corrupt cache entry without expiresAt
      localStorage.setItem(
        'portfolio_cache_projects',
        JSON.stringify({
          data: [{ id: 1 }],
          timestamp: Date.now(),
          // Missing expiresAt
        })
      );

      // Should handle gracefully
      expect(() => BrowserCache.get('projects')).not.toThrow();
    });

    it('should continue working after cache error', () => {
      // Corrupt one entry
      localStorage.setItem('portfolio_cache_projects', 'corrupted');

      // Try to read it (should return null)
      expect(BrowserCache.get('projects')).toBeNull();

      // Should still be able to set new data
      const newData = [{ id: 2, name: 'New Project' }];
      BrowserCache.set('projects', newData);

      // Should work now
      expect(BrowserCache.get('projects')).toEqual(newData);
    });
  });

  describe('Multi-resource caching', () => {
    it('should cache multiple resources independently', () => {
      const experiences = [{ id: 1, company: 'A' }];
      const projects = [{ id: 1, name: 'B' }];
      const education = { formations: [{ id: 1 }], certifications: [] };
      const socialLinks = [{ id: 1, platform: 'LinkedIn' }];

      BrowserCache.set('experiences', experiences);
      BrowserCache.set('projects', projects);
      BrowserCache.set('education', education);
      BrowserCache.set('social_links', socialLinks);

      const stats = BrowserCache.getStats();
      expect(stats.totalKeys).toBe(4);
    });

    it('should invalidate specific resource without affecting others', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);

      // Remove only projects
      BrowserCache.remove('projects');

      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('experiences')).toEqual([{ id: 1 }]);
    });

    it('should clear all resources at once', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);
      BrowserCache.set('education', { formations: [], certifications: [] });

      BrowserCache.clearAll();

      expect(BrowserCache.get('experiences')).toBeNull();
      expect(BrowserCache.get('projects')).toBeNull();
      expect(BrowserCache.get('education')).toBeNull();
    });
  });

  describe('Cache performance', () => {
    it('should be faster than API call simulation', () => {
      const testData = [{ id: 1, name: 'Test' }];
      BrowserCache.set('projects', testData);

      const startTime = performance.now();
      const cached = BrowserCache.get('projects');
      const endTime = performance.now();

      const cacheTime = endTime - startTime;

      expect(cached).toEqual(testData);
      expect(cacheTime).toBeLessThan(10); // Should be < 10ms
    });

    it('should handle large data efficiently', () => {
      // Create large dataset
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Project ${i}`,
        description: 'A'.repeat(1000), // 1KB per item
      }));

      const startSet = performance.now();
      BrowserCache.set('projects', largeData);
      const endSet = performance.now();

      const startGet = performance.now();
      const cached = BrowserCache.get('projects');
      const endGet = performance.now();

      expect(cached).toHaveLength(100);
      expect(endSet - startSet).toBeLessThan(50); // Set should be fast
      expect(endGet - startGet).toBeLessThan(10); // Get should be very fast
    });
  });

  describe('Cache key namespacing', () => {
    it('should use portfolio_cache_ prefix for all keys', () => {
      BrowserCache.set('experiences', [{ id: 1 }]);
      BrowserCache.set('projects', [{ id: 2 }]);

      const keys = Object.keys(localStorage);
      const portfolioKeys = keys.filter((k) => k.startsWith('portfolio_cache_'));

      expect(portfolioKeys).toHaveLength(2);
      expect(portfolioKeys).toContain('portfolio_cache_experiences');
      expect(portfolioKeys).toContain('portfolio_cache_projects');
    });

    it('should not conflict with other localStorage keys', () => {
      localStorage.setItem('user_preferences', 'some data');
      localStorage.setItem('app_state', 'other data');

      BrowserCache.set('projects', [{ id: 1 }]);
      BrowserCache.clearAll();

      expect(localStorage.getItem('user_preferences')).toBe('some data');
      expect(localStorage.getItem('app_state')).toBe('other data');
      expect(BrowserCache.get('projects')).toBeNull();
    });
  });
});
