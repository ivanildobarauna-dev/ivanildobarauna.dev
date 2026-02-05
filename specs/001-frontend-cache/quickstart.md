# Quickstart: Frontend Cache-Aside Pattern

**Date**: 2026-02-05
**Feature**: 001-frontend-cache
**Target Audience**: Developers implementing or maintaining the cache feature

## Overview

This guide provides a quick introduction to the frontend caching system implemented for the ivanildobarauna.dev portfolio. The cache uses a cache-aside pattern with localStorage to reduce backend API calls by 80% and improve page load times by 50% for repeat visitors.

**Key Benefits:**
- ⚡ Faster page loads (cache hit <5ms vs API call 100-300ms)
- 📉 Reduced backend load (80% fewer API calls)
- 🔄 Automatic expiration (30-day TTL)
- 🛡️ Graceful fallback (if cache fails, API still works)

---

## Installation & Setup

### Prerequisites

- Next.js 16.1.6+ with App Router
- TypeScript 5.8.3+
- Modern browser with localStorage support

### Files Added

```
frontend/src/
├── utils/
│   ├── cacheService.ts      # BrowserCache class (core logic)
│   └── cacheTypes.ts         # TypeScript interfaces
└── app/
    └── api/
        └── cache/
            └── route.ts      # Cache invalidation endpoint (optional)
```

### Files Modified

```
frontend/src/app/
├── experience/hooks/useExperience.ts     # Added cache integration
├── projects/hooks/useProjects.ts         # Added cache integration
├── education/hooks/useEducation.ts       # Added cache integration
└── social-links/hooks/useSocialLinks.ts  # Added cache integration
```

---

## Basic Usage

### 1. Import the Cache Service

```typescript
import { BrowserCache } from '@/utils/cacheService';
```

### 2. Read from Cache

```typescript
// Try to get cached data
const cachedData = BrowserCache.get<Experience[]>('experiences');

if (cachedData) {
  // Cache hit - use cached data
  console.log('Loaded from cache');
  setData(cachedData);
} else {
  // Cache miss - fetch from API
  console.log('Fetching from API');
  const response = await fetch(endpoint);
  const data = await response.json();

  // Store in cache for next time
  BrowserCache.set('experiences', data);
  setData(data);
}
```

### 3. Manual Cache Invalidation

```typescript
// Clear all portfolio cache
BrowserCache.clearAll();

// Clear specific resource
BrowserCache.remove('experiences');

// Clear expired entries only
BrowserCache.clearExpired();
```

---

## Hook Integration Pattern

All existing hooks follow the same cache-aside pattern:

```typescript
export function useExperience(): ExperienceData {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check cache first
      const cached = BrowserCache.get<Experience[]>('experiences');

      if (cached) {
        // Cache hit - early return
        setData(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // 2. Cache miss - fetch from API
      try {
        const response = await fetch(endpoint);
        const apiData = await response.json();

        // 3. Populate cache
        BrowserCache.set('experiences', apiData);

        setData(apiData);
        setFromCache(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, fromCache };
}
```

**Key Points:**
- Always check cache first
- Return early if cache hit (avoid API call)
- Always populate cache after successful API fetch
- Track `fromCache` flag for debugging

---

## Cache Keys Reference

| Resource | Cache Key | Data Type | Endpoint |
|----------|-----------|-----------|----------|
| Experiences | `experiences` | `Experience[]` | `/api/v1/experiences` |
| Company Durations | `company_durations` | `CompanyDuration[]` | `/api/v1/experiences?company_duration=true` |
| Total Duration | `total_duration` | `{ total_duration: string }` | `/api/v1/experiences?total_duration=true` |
| Projects | `projects` | `Project[]` | `/api/v1/projects` |
| Education | `education` | `{ formations: Formation[], certifications: Certification[] }` | `/api/v1/education` |
| Social Links | `social_links` | `SocialLink[]` | `/api/v1/social-media-links` |

**Note:** Cache keys are automatically prefixed with `portfolio_cache_` in localStorage.

---

## Common Tasks

### Task 1: Add Caching to a New Hook

```typescript
// 1. Import cache service
import { BrowserCache } from '@/utils/cacheService';

// 2. Define cache key
const CACHE_KEY = 'new_resource';

// 3. Implement cache-aside pattern in useEffect
useEffect(() => {
  const fetchData = async () => {
    const cached = BrowserCache.get<NewResourceType>(CACHE_KEY);
    if (cached) {
      setData(cached);
      setFromCache(true);
      setLoading(false);
      return;
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    BrowserCache.set(CACHE_KEY, data);
    setData(data);
    setFromCache(false);
  };

  fetchData();
}, []);
```

### Task 2: Invalidate Cache After Backend Update

```typescript
// After successful backend deployment or data update
BrowserCache.clearAll();

// Or invalidate specific resources
BrowserCache.remove('experiences');
BrowserCache.remove('projects');
```

### Task 3: Debug Cache Issues

```typescript
// Check cache statistics
const stats = BrowserCache.getStats();
console.log('Cache entries:', stats.totalKeys);
console.log('Cache size:', (stats.totalSize / 1024).toFixed(2), 'KB');
console.log('Oldest entry:', new Date(stats.oldestEntry).toISOString());

// Clear expired entries
BrowserCache.clearExpired();

// Force cache miss for testing
BrowserCache.remove('experiences');
```

### Task 4: Monitor Cache Hit Rate

```typescript
// Add to hook return value
return {
  data,
  loading,
  error,
  fromCache // true = cache hit, false = API fetch
};

// Track in analytics
if (fromCache) {
  console.log('✓ Cache hit');
} else {
  console.log('✗ Cache miss - fetched from API');
}
```

---

## Configuration

### Default TTL (30 days)

Change in `cacheService.ts`:

```typescript
class BrowserCache {
  private static readonly TTL_DAYS = 30; // Change this value
  // ...
}
```

### Custom TTL for Specific Resource

```typescript
// Cache for 7 days instead of default 30 days
const sevenDays = 7 * 24 * 60 * 60 * 1000;
BrowserCache.set('projects', data, sevenDays);
```

---

## Troubleshooting

### Issue: Cache not working in development

**Symptoms:** Cache always returns null, data always fetched from API

**Causes:**
1. Next.js Fast Refresh clearing localStorage
2. Browser localStorage disabled
3. Incognito/private browsing mode

**Solutions:**
1. Check browser DevTools → Application → Local Storage → localhost:3000
2. Verify entries with prefix `portfolio_cache_`
3. Add console logs to verify cache operations

### Issue: Stale data after backend update

**Symptoms:** Frontend shows old data, backend has new data

**Cause:** Cache still valid (not expired)

**Solution:**
```typescript
// Manual cache invalidation
BrowserCache.clearAll();
```

Or automate via deployment script:
```bash
# In deployment script
curl -X DELETE http://localhost:3000/api/cache
```

### Issue: QuotaExceededError in Safari

**Symptoms:** `QuotaExceededError` in console, cache write failing

**Cause:** localStorage full (>5 MB in Safari)

**Solution:** Automatic cleanup triggered by `BrowserCache.set()`:
```typescript
// Handled internally
BrowserCache.set(key, data); // Automatically clears expired entries on quota error
```

Manual cleanup:
```typescript
BrowserCache.clearExpired();
```

### Issue: Cache hit rate lower than expected

**Symptoms:** `fromCache: false` more often than expected

**Possible Causes:**
1. Safari 7-day eviction policy (users not visiting within 7 days)
2. Users clearing browser data
3. Incognito mode usage
4. Cache keys mismatch

**Investigation:**
```typescript
const stats = BrowserCache.getStats();
console.log('Cache age:', Date.now() - stats.oldestEntry, 'ms');
console.log('Total entries:', stats.totalKeys);
```

---

## Performance Monitoring

### Metrics to Track

```typescript
// 1. Cache hit rate
const cacheHits = fromCache ? 1 : 0;
const totalRequests = 1;
const hitRate = (cacheHits / totalRequests) * 100;

// 2. Page load time
const loadStart = performance.now();
// ... fetch data ...
const loadEnd = performance.now();
const loadTime = loadEnd - loadStart;

// 3. Cache size
const stats = BrowserCache.getStats();
const cacheSizeKB = stats.totalSize / 1024;
```

### Expected Performance

| Metric | Target | Typical |
|--------|--------|---------|
| Cache hit time | <10ms | <5ms |
| API fetch time | <500ms | 100-300ms |
| Cache hit rate | >70% | ~80-85% |
| Page load improvement | >50% | ~60-70% |
| API call reduction | >80% | ~85-90% |

---

## Testing

### Manual Testing

```typescript
// 1. Clear cache
BrowserCache.clearAll();

// 2. Load page (should fetch from API)
// Check console for "Fetching from API"

// 3. Reload page (should load from cache)
// Check console for "Loaded from cache"

// 4. Verify cache in DevTools
// Application → Local Storage → localhost:3000
// Look for keys: portfolio_cache_experiences, portfolio_cache_projects, etc.
```

### Automated Testing

```typescript
// Example: Vitest test
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserCache } from '@/utils/cacheService';

describe('BrowserCache', () => {
  beforeEach(() => {
    BrowserCache.clearAll();
  });

  it('should cache and retrieve data', () => {
    const testData = { id: 1, name: 'Test' };
    BrowserCache.set('test', testData);

    const cached = BrowserCache.get('test');
    expect(cached).toEqual(testData);
  });

  it('should return null for expired cache', () => {
    const testData = { id: 1, name: 'Test' };
    BrowserCache.set('test', testData, 0); // Expire immediately

    const cached = BrowserCache.get('test');
    expect(cached).toBeNull();
  });
});
```

---

## Best Practices

### ✅ DO

1. **Always check cache first** before API calls
2. **Always populate cache** after successful API fetch
3. **Use type-safe generics** (`BrowserCache.get<Type>()`)
4. **Track `fromCache` flag** for monitoring
5. **Handle errors gracefully** (cache failures should not break app)
6. **Clear cache after backend deployments** (manual invalidation)

### ❌ DON'T

1. **Don't cache sensitive data** (passwords, tokens)
2. **Don't rely on cache for real-time data** (30-day TTL is too long)
3. **Don't throw errors from cache operations** (always graceful degradation)
4. **Don't cache POST/PUT/DELETE responses** (only GET responses)
5. **Don't forget SSR compatibility** (`typeof window !== 'undefined'`)

---

## API Reference

### BrowserCache Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `get<T>(key: string): T \| null` | Retrieve cached data with type safety |
| `set` | `set<T>(key: string, data: T, ttlMs?: number): void` | Store data with optional TTL |
| `remove` | `remove(key: string): void` | Clear specific cache entry |
| `clearAll` | `clearAll(): void` | Clear all portfolio cache |
| `clearExpired` | `clearExpired(): void` | Remove expired entries |
| `getStats` | `getStats(): CacheStats` | Get cache statistics |

### TypeScript Interfaces

```typescript
// CachedData (internal structure)
interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// CacheStats (getStats() return type)
interface CacheStats {
  totalKeys: number;
  totalSize: number;
  oldestEntry: number | null;
}
```

---

## Next Steps

1. **Implement the feature**: Follow tasks.md for step-by-step implementation
2. **Run tests**: `npm run test` to verify cache behavior
3. **Deploy**: Test in staging before production
4. **Monitor**: Track cache hit rate and performance metrics
5. **Optimize**: Adjust TTL or add compression if needed

---

## Additional Resources

- [Specification](./spec.md) - Feature requirements and acceptance criteria
- [Data Model](./data-model.md) - Cache entry structure and relationships
- [Cache Service Interface](./contracts/cache-service-interface.md) - Detailed API documentation
- [Research](./research.md) - Technical decisions and alternatives considered

---

## Support

**Questions or Issues?**
- Check [Troubleshooting](#troubleshooting) section
- Review [Cache Service Interface](./contracts/cache-service-interface.md) for detailed API docs
- Check browser console for cache-related logs

**Feature Enhancements:**
- Schema versioning for API compatibility
- Cache compression for large datasets
- Cross-tab cache synchronization
