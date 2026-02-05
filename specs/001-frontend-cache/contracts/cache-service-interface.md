# Cache Service Interface Contract

**Date**: 2026-02-05
**Feature**: 001-frontend-cache
**Version**: 1.0.0

## Overview

This document defines the contract for the `BrowserCache` service class, which provides a type-safe abstraction layer for browser localStorage-based caching.

## Class: BrowserCache

### Constants

```typescript
class BrowserCache {
  private static readonly TTL_DAYS = 30;
  private static readonly TTL_MS = BrowserCache.TTL_DAYS * 24 * 60 * 60 * 1000;
  // TTL_MS = 2,592,000,000 milliseconds (30 days)
}
```

### Methods

---

#### `get<T>(key: string): T | null`

Retrieve cached data with automatic expiration checking.

**Parameters:**
- `key` (string): Resource identifier (e.g., "experiences", "projects")
  - Note: Method automatically prefixes with `portfolio_cache_`

**Returns:**
- `T`: Cached data if valid and not expired
- `null`: If cache miss, expired, corrupted, or browser environment not available

**Type Safety:**
- Generic type `T` ensures returned data matches expected type
- Caller must specify type: `BrowserCache.get<Experience[]>('experiences')`

**Side Effects:**
- Automatically removes expired entries (lazy cleanup)
- Logs errors to console if cache read fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return null;

const cachedEntry = localStorage.getItem('portfolio_cache_' + key);
if (!cachedEntry) return null;

const parsed = JSON.parse(cachedEntry) as CachedData<T>;
if (Date.now() > parsed.expiresAt) {
  localStorage.removeItem('portfolio_cache_' + key);
  return null;
}

return parsed.data;
```

**Error Handling:**
- JSON parse errors: Remove corrupted entry, return null, log error
- localStorage access errors: Return null, log error

**Example Usage:**

```typescript
const experiences = BrowserCache.get<Experience[]>('experiences');
if (experiences) {
  // Cache hit - use cached data
  setExperiences(experiences);
} else {
  // Cache miss - fetch from API
  const response = await fetch(endpoint);
  const data = await response.json();
  BrowserCache.set('experiences', data);
  setExperiences(data);
}
```

---

#### `set<T>(key: string, data: T, ttlMs?: number): void`

Store data in cache with TTL expiration.

**Parameters:**
- `key` (string): Resource identifier (automatically prefixed with `portfolio_cache_`)
- `data` (T): Data to cache (must be JSON-serializable)
- `ttlMs` (number, optional): Time-to-live in milliseconds. Defaults to 30 days (2,592,000,000 ms)

**Returns:** `void`

**Type Safety:**
- Generic type `T` ensures data type consistency with `get<T>()`
- TypeScript enforces JSON-serializability at compile time

**Side Effects:**
- Writes to localStorage
- On QuotaExceededError: Calls `clearExpired()` and retries once
- Logs errors to console if write fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return;

const now = Date.now();
const expiresAt = now + (ttlMs || TTL_MS);
const cacheData: CachedData<T> = {
  data,
  timestamp: now,
  expiresAt
};

try {
  localStorage.setItem('portfolio_cache_' + key, JSON.stringify(cacheData));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    clearExpired(); // Cleanup old entries
    // Retry once
    localStorage.setItem('portfolio_cache_' + key, JSON.stringify(cacheData));
  }
}
```

**Error Handling:**
- QuotaExceededError: Clear expired entries, retry once, log if still fails
- JSON stringify errors: Log error, silently fail (graceful degradation)
- localStorage disabled: Silently fail

**Example Usage:**

```typescript
// Cache with default 30-day TTL
BrowserCache.set('experiences', experiencesData);

// Cache with custom TTL (7 days)
const sevenDays = 7 * 24 * 60 * 60 * 1000;
BrowserCache.set('projects', projectsData, sevenDays);
```

---

#### `remove(key: string): void`

Remove a specific cache entry.

**Parameters:**
- `key` (string): Resource identifier (automatically prefixed with `portfolio_cache_`)

**Returns:** `void`

**Side Effects:**
- Removes entry from localStorage
- Logs errors if removal fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return;

localStorage.removeItem('portfolio_cache_' + key);
```

**Error Handling:**
- localStorage access errors: Log error, silently fail

**Example Usage:**

```typescript
// Invalidate experiences cache
BrowserCache.remove('experiences');

// Next call to get('experiences') will return null (cache miss)
```

---

#### `clearAll(): void`

Remove all portfolio cache entries from localStorage.

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Iterates through all localStorage keys
- Removes all keys starting with `portfolio_cache_`
- Logs errors if operation fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return;

const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.startsWith('portfolio_cache_')) {
    localStorage.removeItem(key);
  }
});
```

**Performance:**
- Time complexity: O(n) where n = total localStorage keys
- Typical execution: <50ms for 6 cache entries

**Error Handling:**
- Continues removing entries even if some fail
- Logs errors for failed removals

**Example Usage:**

```typescript
// Manual cache invalidation (e.g., after backend deployment)
BrowserCache.clearAll();

// All subsequent hook loads will fetch fresh data from API
```

---

#### `clearExpired(): void`

Remove all expired cache entries (cleanup operation).

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Iterates through all portfolio cache entries
- Removes entries where `Date.now() > expiresAt`
- Also removes corrupted entries (JSON parse failures)
- Logs errors if operation fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return;

const now = Date.now();
const keys = Object.keys(localStorage);

keys.forEach(key => {
  if (key.startsWith('portfolio_cache_')) {
    try {
      const cached = localStorage.getItem(key);
      const parsed = JSON.parse(cached);

      if (now > parsed.expiresAt) {
        localStorage.removeItem(key); // Remove expired entry
      }
    } catch {
      localStorage.removeItem(key); // Remove corrupted entry
    }
  }
});
```

**Use Cases:**
1. Automatic cleanup when QuotaExceededError occurs
2. Manual cleanup before critical operations
3. Background cleanup on app load (optional)

**Performance:**
- Time complexity: O(n) where n = total localStorage keys
- Typical execution: <50ms for 6 cache entries

**Error Handling:**
- Continues processing even if individual entries fail
- Logs errors for failed operations

**Example Usage:**

```typescript
// Manual cleanup of expired entries
BrowserCache.clearExpired();

// Automatic cleanup on quota error (handled internally by set())
```

---

#### `getStats(): CacheStats`

Retrieve cache usage statistics for monitoring and debugging.

**Parameters:** None

**Returns:** `CacheStats` object

```typescript
interface CacheStats {
  totalKeys: number;      // Count of portfolio cache entries
  totalSize: number;      // Total bytes used (sum of JSON string lengths)
  oldestEntry: number | null; // Timestamp of oldest entry, or null if no entries
}
```

**Side Effects:**
- Reads all portfolio cache entries (non-destructive)
- Logs errors if operation fails

**Behavior:**

```typescript
// Pseudo-logic
if (!isBrowser()) return { totalKeys: 0, totalSize: 0, oldestEntry: null };

let totalKeys = 0;
let totalSize = 0;
let oldestEntry = null;

const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.startsWith('portfolio_cache_')) {
    totalKeys++;
    const value = localStorage.getItem(key);
    totalSize += value.length; // String byte size

    const parsed = JSON.parse(value);
    if (!oldestEntry || parsed.timestamp < oldestEntry) {
      oldestEntry = parsed.timestamp;
    }
  }
});

return { totalKeys, totalSize, oldestEntry };
```

**Performance:**
- Time complexity: O(n) where n = total localStorage keys
- Typical execution: <20ms for 6 cache entries

**Error Handling:**
- Ignores corrupted entries (JSON parse failures)
- Returns partial stats if some entries fail

**Example Usage:**

```typescript
// Debug cache health
const stats = BrowserCache.getStats();
console.log('Cache entries:', stats.totalKeys);
console.log('Cache size:', (stats.totalSize / 1024).toFixed(2), 'KB');
console.log('Oldest entry:', new Date(stats.oldestEntry).toISOString());

// Example output:
// Cache entries: 6
// Cache size: 48.57 KB
// Oldest entry: 2026-02-05T12:30:00.000Z
```

---

### Private Helper Methods

#### `isBrowser(): boolean`

Check if code is running in a browser environment.

**Returns:**
- `true`: If `window` and `localStorage` are available
- `false`: During SSR or in Node.js environment

**Usage:** Called internally before every localStorage operation.

```typescript
private static isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
```

---

#### `getCacheKey(key: string): string`

Generate namespaced cache key with `portfolio_cache_` prefix.

**Parameters:**
- `key` (string): Raw resource identifier (e.g., "experiences")

**Returns:**
- Namespaced key (e.g., "portfolio_cache_experiences")

**Usage:** Called internally by all public methods.

```typescript
private static getCacheKey(key: string): string {
  return `portfolio_cache_${key}`;
}
```

---

## Type Definitions

### CachedData<T>

```typescript
interface CachedData<T> {
  data: T;           // The cached API response
  timestamp: number; // When cached (Date.now())
  expiresAt: number; // When expires (timestamp + TTL_MS)
}
```

**Stored in localStorage as:** JSON string

**Example:**
```json
{
  "data": [{"id": 1, "company": "Example Corp", ...}],
  "timestamp": 1738828800000,
  "expiresAt": 1741420800000
}
```

### CacheStats

```typescript
interface CacheStats {
  totalKeys: number;      // Number of cached entries
  totalSize: number;      // Total bytes used
  oldestEntry: number | null; // Timestamp of oldest entry
}
```

**Example:**
```json
{
  "totalKeys": 6,
  "totalSize": 48576,
  "oldestEntry": 1738742400000
}
```

---

## Usage Patterns

### Pattern 1: Cache-Aside (Lazy Loading)

```typescript
const cachedData = BrowserCache.get<DataType>(key);
if (cachedData) {
  // Use cached data
} else {
  // Fetch from API
  const freshData = await fetchFromAPI();
  BrowserCache.set(key, freshData);
}
```

### Pattern 2: Write-Through (Immediate Update)

```typescript
// After successful API update
const updatedData = await updateAPI(payload);
BrowserCache.set(key, updatedData); // Update cache immediately
```

### Pattern 3: Manual Invalidation

```typescript
// On backend deployment or data update
BrowserCache.clearAll(); // Invalidate all cache
// Or granular:
BrowserCache.remove('experiences');
BrowserCache.remove('projects');
```

### Pattern 4: Monitoring

```typescript
// Debug cache usage
const stats = BrowserCache.getStats();
if (stats.totalSize > 4 * 1024 * 1024) {
  console.warn('Cache size exceeding 4 MB');
  BrowserCache.clearExpired();
}
```

---

## Error Handling Contract

### Principle: Graceful Degradation

All methods MUST silently handle errors and never throw exceptions. This ensures cache failures don't break the application.

### Error Scenarios

| Scenario | Method | Behavior |
|----------|--------|----------|
| localStorage disabled | All | Return null/void, log error |
| QuotaExceededError | `set()` | Call `clearExpired()`, retry once, log if fails |
| JSON parse error | `get()` | Remove corrupted entry, return null, log error |
| JSON stringify error | `set()` | Return void, log error |
| SSR context (no window) | All | Return null/void immediately (no error) |
| Expired cache entry | `get()` | Remove entry, return null (normal behavior) |

### Logging Standards

All errors MUST be logged to console with context:

```typescript
console.error(`Cache ${operation} error for key "${key}":`, error);
```

Examples:
- `Cache read error for key "experiences": SyntaxError: Unexpected token`
- `Cache write error for key "projects": QuotaExceededError`

---

## Performance Contract

### Guarantees

| Operation | Max Time | Typical Time |
|-----------|----------|--------------|
| `get()` | 10ms | <5ms |
| `set()` | 50ms | <10ms |
| `remove()` | 10ms | <5ms |
| `clearAll()` | 100ms | <50ms |
| `clearExpired()` | 100ms | <50ms |
| `getStats()` | 50ms | <20ms |

**Environment:** Modern browsers (Chrome/Firefox/Safari), 6 cache entries, ~50 KB total data.

### Storage Limits

| Browser | Limit | Portfolio Usage | Headroom |
|---------|-------|-----------------|----------|
| Safari | 5 MB | ~49 KB | 102x |
| Chrome | 10 MB | ~49 KB | 204x |
| Firefox | 10 MB | ~49 KB | 204x |

---

## Versioning and Backward Compatibility

**Current Version:** 1.0.0

**Breaking Changes:** None (initial version)

**Future Considerations:**
1. Schema versioning: Add `schemaVersion` field to `CachedData`
2. Compression: Add optional gzip compression for large datasets
3. IndexedDB migration: If data exceeds localStorage limits

**Deprecation Policy:**
- Breaking changes require major version bump (2.0.0)
- Deprecated methods supported for 6 months
- Migration guides provided for breaking changes

---

## Testing Requirements

### Unit Tests (Required)

1. **get() tests:**
   - Returns cached data when valid
   - Returns null when cache miss
   - Returns null when expired
   - Removes expired entry on read
   - Returns null on JSON parse error
   - Returns null in SSR context

2. **set() tests:**
   - Stores data with correct structure
   - Uses default 30-day TTL
   - Uses custom TTL when provided
   - Handles QuotaExceededError
   - Silently fails in SSR context

3. **remove() tests:**
   - Removes specified entry
   - Silently fails if entry doesn't exist

4. **clearAll() tests:**
   - Removes all portfolio cache entries
   - Doesn't affect non-portfolio localStorage keys

5. **clearExpired() tests:**
   - Removes only expired entries
   - Keeps valid entries
   - Removes corrupted entries

6. **getStats() tests:**
   - Returns correct totalKeys
   - Returns correct totalSize
   - Returns correct oldestEntry

### Integration Tests (Required)

1. Cache-aside pattern with hooks
2. Multi-resource caching (experiences + projects + education)
3. Safari 7-day eviction simulation
4. Quota exceeded scenario

---

## Summary

The `BrowserCache` service provides a simple, type-safe, and robust caching layer for frontend API responses. Key characteristics:

✅ **Type-safe**: Generic methods ensure type consistency
✅ **Graceful degradation**: Never throws errors, always fallback to API
✅ **SSR-compatible**: Checks browser environment before operations
✅ **Automatic expiration**: Lazy cleanup on read, active cleanup on demand
✅ **Quota-aware**: Handles storage limits with automatic cleanup
✅ **Observable**: Statistics API for monitoring and debugging
