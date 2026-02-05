# Research: Frontend Cache-Aside Pattern

**Date**: 2026-02-05
**Feature**: 001-frontend-cache
**Phase**: Phase 0 - Research

## Research Questions

1. **Which browser storage API should we use?** (localStorage vs IndexedDB vs Cache API)
2. **What are the storage capacity limits?**
3. **How do we handle Safari's 7-day storage eviction policy?**

## Findings

### Decision 1: Browser Storage API

**Chosen: localStorage**

**Rationale:**
- **Sufficient capacity**: 5-10 MB limit is more than adequate for portfolio data (experiences, projects, education, social links estimated at <100 KB combined)
- **Synchronous API**: Simpler integration with React hooks and useState/useEffect patterns
- **Best performance for small datasets**: localStorage has 0.017ms write latency vs 10x slower IndexedDB for small writes
- **Excellent browser compatibility**: 98%+ support across all modern browsers
- **Simple TTL implementation**: Manual timestamp-based expiration is straightforward
- **Low overhead**: No transaction management or complex wrapper libraries required

**Alternatives Considered:**

| API | Pros | Cons | Why Rejected |
|-----|------|------|--------------|
| **IndexedDB** | Large capacity (50% disk space), asynchronous, structured queries | 10x slower for small writes, requires wrapper libraries (Dexie.js), complex transaction management | Overkill for simple JSON caching; adds unnecessary complexity |
| **Cache API** | HTTP-aware, designed for caching | Requires Request/Response objects, primarily for Service Workers | Not optimal for application state; designed for HTTP resource caching |

**Sources:**
- [LocalStorage vs IndexedDB Performance - RxDB](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html)
- [9 Differences Between IndexedDB and LocalStorage - DEV Community](https://dev.to/armstrong2035/9-differences-between-indexeddb-and-localstorage-30ai)
- [Modern Web Storage Guide - JSSchools](https://jsschools.com/web_dev/modern-web-storage-guide-local-storage-vs-indexed/)

### Decision 2: Storage Capacity Limits

**Typical Browser Limits:**
- **Chrome/Firefox**: 10 MB per origin
- **Safari**: 5 MB per origin
- **Estimated portfolio data usage**: <100 KB (well within all limits)

**Quota Exceeded Handling Strategy:**
1. Wrap all `localStorage.setItem()` calls in try-catch
2. Detect `QuotaExceededError` (DOMException)
3. Automatically clear expired cache entries
4. Retry once after cleanup
5. Log error if still failing (graceful degradation - fallback to API)

**Sources:**
- [Storage quotas and eviction criteria - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [LocalStorage vs IndexedDB: JavaScript Guide - DEV Community](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5)

### Decision 3: Safari 7-Day Eviction Policy

**Challenge:**
Since iOS/iPadOS 13.4 and Safari 13.1 on macOS, there is a 7-day cap on all script-writable storage (localStorage, IndexedDB, Cache API). If a user doesn't interact with the site for 7 days, all stored data is deleted.

**Chosen Approach: Accept the limitation with graceful fallback**

**Rationale:**
- Portfolio data changes infrequently (experiences, projects, education updates are rare)
- Most visitors likely return within 7 days or are first-time visitors
- Re-fetching after 7 days is acceptable UX (automatic, transparent to user)
- The cache-aside pattern inherently handles cache misses gracefully
- Persistent storage permission (`navigator.storage.persist()`) requires user prompt (poor UX)

**Alternative Approaches Rejected:**

| Approach | Why Rejected |
|----------|--------------|
| **Request persistent storage** (`navigator.storage.persist()`) | Requires user permission prompt; adds friction; not guaranteed to be granted |
| **Server-side cookies** | Not suitable for caching large JSON responses; increases HTTP overhead |
| **Installed PWA** | Out of scope for this feature; requires full PWA implementation |

**Impact on Requirements:**
- Original spec requirement: "30-day TTL"
- Adjusted: "30-day TTL with Safari 7-day eviction fallback"
- Success criteria still achievable: Cache hit rate >70% for users visiting within 7 days

**Sources:**
- [Safari Storage Policy Updates - WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/)

## Best Practices

### 1. Cache Key Naming Convention

**Pattern**: `portfolio_cache_{resource_type}`

**Examples:**
- `portfolio_cache_experiences`
- `portfolio_cache_projects`
- `portfolio_cache_education`
- `portfolio_cache_social_links`
- `portfolio_cache_company_durations`
- `portfolio_cache_total_duration`

**Rationale:** Clear namespace prevents collisions with other localStorage data. Prefix enables bulk operations (clear all portfolio cache, list all entries).

### 2. TTL Implementation Pattern

Store metadata alongside cached data:

```typescript
interface CachedData<T> {
  data: T;           // The actual API response
  timestamp: number; // When cached (Date.now())
  expiresAt: number; // When expires (timestamp + TTL_MS)
}
```

**On read:**
1. Parse cached entry
2. Compare `Date.now()` with `expiresAt`
3. If expired: remove entry, return null (cache miss)
4. If valid: return `data`

**On write:**
1. Calculate `expiresAt = Date.now() + TTL_MS`
2. Wrap data in `CachedData` structure
3. Store as JSON string

### 3. Next.js SSR Compatibility

**Critical:** localStorage is only available in the browser, not during server-side rendering.

**Pattern:**
```typescript
private static isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
```

Always check `isBrowser()` before any localStorage operation. Return null/undefined for cache misses during SSR.

### 4. Error Handling Strategy

**Graceful Degradation Principle:** Never let cache errors break the application.

```typescript
try {
  // Cache operation
} catch (error) {
  console.error('Cache error:', error);
  // Continue without cache (fallback to API)
}
```

**Special case - QuotaExceededError:**
```typescript
catch (error) {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    clearExpired(); // Cleanup old entries
    // Retry once
  }
}
```

### 5. Cache Statistics (Optional Enhancement)

Track cache health for monitoring:

```typescript
interface CacheStats {
  totalKeys: number;      // Number of cached entries
  totalSize: number;      // Total bytes used
  oldestEntry: number;    // Timestamp of oldest entry
}
```

Useful for debugging and understanding cache behavior in production.

## Implementation Patterns

### Cache Service Abstraction

Create a reusable `BrowserCache` class in `src/utils/cacheService.ts`:

**Core Methods:**
- `get<T>(key: string): T | null` - Retrieve cached data with TTL check
- `set<T>(key: string, data: T, ttlMs?: number): void` - Store data with expiration
- `remove(key: string): void` - Clear specific cache entry
- `clearAll(): void` - Clear all portfolio cache entries
- `clearExpired(): void` - Remove expired entries (cleanup)

**Design Principles:**
- Generic type support (`<T>`) for type-safe caching
- Automatic TTL checking on read
- Graceful error handling (never throw)
- SSR-safe (check `typeof window`)
- Namespace all keys with `portfolio_cache_` prefix

### Hook Integration Pattern

Modify existing hooks to use cache-aside pattern:

```typescript
useEffect(() => {
  const fetchData = async () => {
    // 1. Try cache first
    const cached = BrowserCache.get<DataType>(CACHE_KEY);
    if (cached) {
      setData(cached);
      setFromCache(true);
      setLoading(false);
      return; // Exit early with cached data
    }

    // 2. Cache miss - fetch from API
    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      // 3. Populate cache
      BrowserCache.set(CACHE_KEY, data);

      setData(data);
      setFromCache(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

**Key Points:**
- Check cache first (cache-aside pattern)
- Early return if cache hit (avoid unnecessary API call)
- Always populate cache after successful API fetch
- Track `fromCache` flag for debugging/monitoring

### Cache Invalidation API Route

Next.js App Router API route at `src/app/api/cache/route.ts`:

```typescript
// DELETE /api/cache - Clear all cache
// DELETE /api/cache?resource=experiences - Clear specific resource

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  // Return instructions to client
  return Response.json({
    action: 'clear_cache',
    resource: resource || 'all',
    message: 'Cache invalidation instructions sent'
  });
}
```

**Note:** Cache invalidation must happen on the client side (localStorage is browser-only). The API route returns instructions, and the client-side code executes `BrowserCache.clearAll()` or `BrowserCache.remove()`.

**Alternative Pattern:** Client-side utility function instead of API route (simpler, more appropriate since cache is browser-only).

## Technical Constraints

### 1. Browser Compatibility Targets

**Minimum versions:**
- Chrome 80+ (2020)
- Firefox 75+ (2020)
- Safari 13.1+ (2020)
- Edge 80+ (2020)

All support localStorage with 5-10 MB quota. No polyfills needed.

### 2. Performance Benchmarks

**Expected Performance:**
- **Cache hit**: <5ms (localStorage read + JSON.parse)
- **Cache miss + API fetch**: 100-300ms (depends on backend latency)
- **Cache invalidation**: <50ms (clear all entries)

**Target Success Metrics:**
- 50% reduction in page load time for cache hits ✓ (meets spec)
- 80% reduction in API calls ✓ (meets spec)
- 70%+ cache hit rate ✓ (meets spec)

### 3. Data Volume Estimates

| Resource | Estimated Size | Entries | Total |
|----------|---------------|---------|-------|
| Experiences | ~20 KB | 1 | 20 KB |
| Company Durations | ~2 KB | 1 | 2 KB |
| Total Duration | ~0.1 KB | 1 | 0.1 KB |
| Projects | ~15 KB | 1 | 15 KB |
| Education | ~10 KB | 1 | 10 KB |
| Social Links | ~2 KB | 1 | 2 KB |
| **TOTAL** | | | **~49 KB** |

**Conclusion:** Well within 5 MB Safari limit. No compression needed.

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Safari 7-day eviction clears cache prematurely | Medium (users see slower load after 7 days) | High (Safari policy) | Accept limitation; graceful fallback to API; monitor cache hit rate |
| Quota exceeded error (>5 MB) | Low (fallback to API) | Very Low (<1% of limit) | Automatic cleanup of expired entries; retry logic |
| Corrupted cache data (malformed JSON) | Low (fallback to API) | Low | Try-catch around JSON.parse; remove corrupted entry |
| Backend API schema change breaks cached data | Medium (wrong data displayed) | Low | Include schema version in cache keys; manual invalidation during deployments |

## Next Steps (Phase 1)

1. ✅ Create `src/utils/cacheService.ts` - BrowserCache class
2. ✅ Create `src/utils/cacheTypes.ts` - TypeScript interfaces
3. ✅ Modify 4 hooks to integrate cache service
4. ✅ Create cache invalidation utility (client-side function)
5. ✅ Add Vitest tests for cache service
6. ✅ Update quickstart guide with cache usage
