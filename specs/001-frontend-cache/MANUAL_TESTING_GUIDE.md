# Manual Testing Guide for Frontend Cache Implementation

This guide provides instructions for manually testing the cache-aside pattern implementation.

## Test Environment Setup

1. **Start the application**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser DevTools**:
   - Chrome/Edge: F12 or Cmd+Option+I (Mac)
   - Firefox: F12 or Cmd+Option+I (Mac)
   - Safari: Cmd+Option+I (Mac) - Enable Developer menu first in Preferences

3. **Open Network tab** to monitor API calls

4. **Open Console tab** to view cache logs and test commands

## Test T044: Page Load Performance Comparison

### Baseline (First Load - Cache Miss)

1. **Clear all cache**:
   ```javascript
   window.clearPortfolioCache()
   ```

2. **Hard refresh** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

3. **Record metrics** in DevTools:
   - Total page load time (Network tab)
   - Number of API requests
   - Time to interactive
   - Console should show: "✗ Cache miss - fetching data from API"

4. **Expected baseline**:
   - ~6 API requests (experiences, company_durations, total_duration, projects, education, social_links)
   - Load time: varies based on network/backend

### Cached Load (Cache Hit)

1. **Soft refresh** (Cmd+R or F5)

2. **Record metrics**:
   - Total page load time
   - Number of API requests (should be 0 for cached resources)
   - Time to interactive
   - Console should show: "✓ Loading [resource] data from cache"

3. **Expected improvement**:
   - 0 API requests for cached resources
   - **Target: 50% faster page load time**
   - Instant data display (no loading spinners)

### Verification Steps

1. Check `fromCache` flag in hooks:
   ```javascript
   // In browser console, inspect component state
   // The fromCache flag should be true on cached loads
   ```

2. Verify localStorage contents:
   ```javascript
   // Check cache keys exist
   Object.keys(localStorage).filter(k => k.startsWith('portfolio_cache_'))

   // Check cache data structure
   JSON.parse(localStorage.getItem('portfolio_cache_projects'))
   ```

## Test T045: Safari 7-Day Limitation Handling

**Note**: This test requires Safari browser and waiting 7+ days, or manually manipulating cache timestamps.

### Simulated Test (Recommended)

1. **Create expired cache entry**:
   ```javascript
   // Set cache with expired timestamp
   const testData = { id: 1, name: 'Test' };
   const expiredTimestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago
   localStorage.setItem('portfolio_cache_test', JSON.stringify({
     data: testData,
     timestamp: expiredTimestamp,
     expiresAt: expiredTimestamp + (30 * 24 * 60 * 60 * 1000)
   }));
   ```

2. **Access the resource**:
   ```javascript
   BrowserCache.get('test') // Should return null
   ```

3. **Verify cleanup**:
   ```javascript
   // Cache entry should be removed
   localStorage.getItem('portfolio_cache_test') // Should be null
   ```

4. **Expected behavior**:
   - Expired cache returns null
   - System triggers re-fetch from API
   - New cache entry is created
   - No errors or crashes

### Real Safari Test (Long-term)

1. Load app in Safari
2. Use normally for 7+ days
3. Verify cache eviction occurs gracefully
4. Verify re-fetch happens automatically

## Test T046: QuotaExceededError Handling

### Simulate Storage Quota Exceeded

1. **Fill localStorage to near capacity**:
   ```javascript
   // Generate large data (5MB string)
   const largeData = 'x'.repeat(5 * 1024 * 1024);

   // Try to fill localStorage
   try {
     for (let i = 0; i < 100; i++) {
       localStorage.setItem(`test_large_${i}`, largeData);
     }
   } catch (e) {
     console.log('Storage quota reached:', e.name);
   }
   ```

2. **Try to cache portfolio data**:
   ```javascript
   window.clearPortfolioCache()
   // Refresh page - cache writes should trigger cleanup
   ```

3. **Expected behavior**:
   - Console shows "Cache write error" on first attempt
   - `clearExpired()` is called automatically
   - Retry succeeds after cleanup
   - Or gracefully falls back to no-cache mode
   - No crashes or uncaught errors

4. **Cleanup after test**:
   ```javascript
   // Remove test data
   Object.keys(localStorage)
     .filter(k => k.startsWith('test_large_'))
     .forEach(k => localStorage.removeItem(k));
   ```

## Test T019-T022: User Story 1 - Fast Page Load

### Test T019: Initial page load (cache miss)

1. Clear cache: `window.clearPortfolioCache()`
2. Hard refresh
3. ✓ Verify API calls are made
4. ✓ Verify cache is populated
5. ✓ Verify data displays correctly

### Test T020: Subsequent page load (cache hit)

1. Soft refresh (don't clear cache)
2. ✓ Verify no API calls
3. ✓ Verify instant data display
4. ✓ Verify fromCache=true

### Test T021: Multiple resources cached independently

1. Navigate between pages (Experience → Projects → Education)
2. ✓ Verify each resource is cached separately
3. ✓ Verify no cross-contamination

### Test T022: 30-day TTL expiration (simulated)

1. Create cache with 1-second TTL:
   ```javascript
   BrowserCache.set('test', {data: 'test'}, 1000)
   ```
2. Wait 2 seconds
3. Read cache: `BrowserCache.get('test')`
4. ✓ Verify returns null
5. ✓ Verify entry is removed

## Test T027-T029: User Story 2 - Manual Cache Invalidation

### Test T027: Clear all cache via console

1. Populate cache (load several pages)
2. Run: `window.clearPortfolioCache()`
3. ✓ Verify console shows: "✓ All portfolio cache cleared"
4. ✓ Verify localStorage is empty (portfolio_cache_* keys)
5. ✓ Verify next page load fetches from API

### Test T028: Clear all cache via API

1. Populate cache
2. Run: `curl -X DELETE http://localhost:3000/api/cache`
3. ✓ Verify API returns instructions
4. Run the provided console command
5. ✓ Verify cache is cleared

### Test T029: API validates resource types

1. Try invalid resource:
   ```bash
   curl -X DELETE 'http://localhost:3000/api/cache?resource=invalid'
   ```
2. ✓ Verify returns 400 error
3. ✓ Verify includes list of valid resources

## Test T035-T037: User Story 3 - Granular Cache Control

### Test T035: Clear specific resource

1. Populate all caches
2. Clear only projects: `window.clearPortfolioCache('projects')`
3. ✓ Verify console shows: "✓ Cache cleared for resource: projects"
4. ✓ Verify only projects cache is removed
5. ✓ Verify other caches remain intact

### Test T036: Clear via API with resource type

1. Populate caches
2. Run:
   ```bash
   curl -X DELETE 'http://localhost:3000/api/cache?resource=experiences'
   ```
3. ✓ Verify API returns instructions for specific resource
4. Run the provided console command
5. ✓ Verify only experiences cache is cleared

### Test T037: Multiple independent cache operations

1. Populate all caches
2. Clear projects: `window.clearPortfolioCache('projects')`
3. Navigate to projects page (should re-fetch)
4. Navigate to experience page (should use cache)
5. ✓ Verify independent behavior

## Performance Metrics to Record

### Target Metrics (from spec)

- **Page load time improvement**: 50% faster on cache hit
- **API call reduction**: 80% reduction (6 calls → 0 calls on cache hit)
- **Time to interactive**: Immediate on cache hit

### Actual Metrics Template

```
# Performance Test Results

Test Date: [DATE]
Browser: [Chrome/Firefox/Safari/Edge] [VERSION]
OS: [macOS/Windows/Linux]

## Baseline (Cache Miss)
- Total page load time: ____ ms
- API requests: ____
- Time to interactive: ____ ms
- Backend response times:
  - /api/v1/experiences: ____ ms
  - /api/v1/projects: ____ ms
  - /api/v1/education: ____ ms
  - /api/v1/social-media-links: ____ ms

## Cached Load (Cache Hit)
- Total page load time: ____ ms
- API requests: 0
- Time to interactive: ____ ms
- Improvement: ____ % faster

## Cache Stats
```javascript
BrowserCache.getStats()
// {
//   totalKeys: ____,
//   totalSize: ____ bytes (~____ KB),
//   oldestEntry: ____
// }
```

## Notes
- [Any observations about cache behavior]
- [Any unexpected issues]
- [Browser-specific differences]
```

## Troubleshooting

### Cache not populating

1. Check console for errors
2. Verify `isBrowser()` returns true
3. Check localStorage is enabled in browser
4. Verify backend is responding

### Cache not clearing

1. Check console for clearPortfolioCache function
2. Verify localStorage permissions
3. Try manual clear: `localStorage.clear()`

### Performance not improving

1. Verify cache hits are occurring (check console logs)
2. Check Network tab for unexpected API calls
3. Verify fromCache flag is true
4. Check for component re-renders

## Success Criteria

✅ All automated tests passing (46/46)
✅ Page load time 50% faster with cache
✅ 80% reduction in API calls
✅ No errors in console (except expected error handler tests)
✅ Cache survives page refresh
✅ Expired cache cleaned up automatically
✅ QuotaExceededError handled gracefully
✅ Manual cache invalidation works
✅ Granular cache control works
✅ SSR compatibility maintained
