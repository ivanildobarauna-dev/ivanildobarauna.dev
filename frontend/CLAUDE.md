# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev: `npm run dev --turbo`
- Lint: `npm run lint`
- Test: `npm run test`
- Single test: `npm run test src/test/path/to/test.ts`
- Test health check: `npm run test:health`

## Code Style
- **Imports**: Group by 1) React/Next, 2) external libraries, 3) local components/hooks
- **Types**: Use TypeScript interfaces for component props and explicit return types for hooks
- **Error Handling**: Try/catch with type checking (e.g., `if (error instanceof Error)`)
- **Components**: Use functional components with hooks
- **Hooks**: Custom hooks for data fetching and state management
- **Styling**: Use Tailwind CSS classes directly in components
- **File Structure**: Group related components with their hooks and interfaces
- **Naming**: PascalCase for components, camelCase for functions and variables

## Backend Endpoint Configuration

The application has been configured to connect to the backend API with the following settings:

- In development mode (local): `http://localhost:8090/api/v1`
- In production mode (Docker): `http://backend:8090/api/v1`

This configuration is stored in `src/utils/backend_endpoint.tsx` and automatically detects the environment.

## Frontend Cache System

The application implements a **cache-aside pattern** using browser localStorage to improve performance and reduce backend API calls by ~80%.

### Cache Service API

**Location**: `src/utils/cacheService.ts`

**Key Features**:
- 30-day TTL (Time-To-Live) with automatic expiration
- Type-safe generic methods with TypeScript
- SSR-compatible (checks browser environment)
- Graceful error handling (never throws, always fallback)
- QuotaExceededError handling with automatic cleanup
- Namespaced keys: `portfolio_cache_*`

**Public Methods**:
```typescript
// Get cached data (returns null if cache miss/expired)
BrowserCache.get<T>(key: string): T | null

// Set cached data with optional TTL
BrowserCache.set<T>(key: string, data: T, ttlMs?: number): void

// Remove specific cache entry
BrowserCache.remove(key: string): void

// Clear all portfolio cache entries
BrowserCache.clearAll(): void

// Remove expired entries (cleanup)
BrowserCache.clearExpired(): void

// Get cache statistics
BrowserCache.getStats(): CacheStats
```

**Resource Types**:
- `experiences` - Professional experience data
- `company_durations` - Company duration calculations
- `total_duration` - Total career duration
- `projects` - Portfolio projects
- `education` - Academic formation and certifications
- `social_links` - Social media links

### Manual Cache Management

**Clear all cache** (from browser console):
```javascript
window.clearPortfolioCache()
```

**Clear specific resource** (from browser console):
```javascript
window.clearPortfolioCache('projects')  // Clear only projects cache
```

**Check cache stats** (from browser console):
```javascript
BrowserCache.getStats()
// Returns: { totalKeys, totalSize, oldestEntry }
```

### Cache Invalidation API

**Endpoint**: `/api/cache`

**Clear all cache**:
```bash
curl -X DELETE http://localhost:3000/api/cache
```

**Clear specific resource**:
```bash
curl -X DELETE 'http://localhost:3000/api/cache?resource=projects'
```

**Get endpoint info**:
```bash
curl http://localhost:3000/api/cache
```

### Cache Integration in Hooks

All data-fetching hooks implement the cache-aside pattern:

1. **Check cache first** (fast path)
2. **Return cached data** if valid and unexpired
3. **Fetch from API** on cache miss
4. **Populate cache** after successful API call

**Example hook usage**:
```typescript
const { experiences, loading, error, fromCache } = useExperience();
// fromCache flag indicates if data was loaded from cache
```

### Testing Cache

**Run all cache tests**:
```bash
npm run test -- src/test/cacheService.test.ts src/test/cacheIntegration.test.ts
```

**Test coverage**:
- 30 unit tests (cacheService.test.ts)
- 16 integration tests (cacheIntegration.test.ts)
- 100% pass rate

**Manual testing guide**: See `specs/001-frontend-cache/MANUAL_TESTING_GUIDE.md`

### Cache Behavior

**Cache Hit Scenario**:
- Console: `✓ Loading [resource] data from cache`
- 0 API requests
- Instant data display
- ~50% faster page load

**Cache Miss Scenario**:
- Console: `✗ Cache miss - fetching [resource] data from API`
- API request made
- Cache populated after successful fetch
- Normal load time

**Expiration Handling**:
- Expired cache automatically removed on read
- `clearExpired()` called on QuotaExceededError
- Graceful fallback to API fetch

### Performance Metrics

**Target improvements** (cache hit vs cache miss):
- Page load time: 50% faster
- API calls: 80% reduction (6 calls → 0 calls)
- Time to interactive: Immediate

### Browser Compatibility

**Supported**:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with 7-day eviction limitation)

**Safari Limitation**: May evict localStorage after 7 days. Cache gracefully handles this with automatic re-fetch.

## Common Issues and Solutions

1. **404 API Errors**: If you see errors like `GET http://localhost:8080/undefined/projects 404 (Not Found)`, it means:
   - The frontend can't find the backend API
   - Ensure the backend service is running on port 8090
   - Check that all hooks are using the `getBackendEndpoint()` function

2. **Running in Docker**: When using Docker Compose, the services communicate using container names

3. **Local Development**: When running outside Docker, ensure the backend is accessible at `http://localhost:8090`

4. **Cache Not Working**: If cache doesn't seem to be working:
   - Check browser console for cache logs (✓ or ✗ messages)
   - Verify localStorage is enabled in browser settings
   - Clear all cache and try again: `window.clearPortfolioCache()`
   - Check cache stats: `BrowserCache.getStats()`

5. **Stale Cache Data**: If cache shows outdated data:
   - Manually clear cache: `window.clearPortfolioCache()`
   - Or clear specific resource: `window.clearPortfolioCache('projects')`
   - Cache automatically expires after 30 days

6. **QuotaExceededError**: If localStorage is full:
   - Cache automatically calls `clearExpired()` and retries
   - Manually clear old data: `BrowserCache.clearExpired()`
   - Check cache size: `BrowserCache.getStats().totalSize`
