# Data Model: Frontend Cache-Aside Pattern

**Date**: 2026-02-05
**Feature**: 001-frontend-cache
**Phase**: Phase 1 - Design

## Overview

This feature introduces a caching layer in the frontend that stores API responses in browser localStorage. The data model focuses on cache entry structure, metadata, and resource type mappings.

## Core Entities

### 1. CachedData<T>

Wrapper structure for all cached API responses.

**Purpose:** Store API response data alongside metadata for TTL management and debugging.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `T` (generic) | Yes | The actual API response payload (Experience[], Project[], etc.) |
| `timestamp` | `number` | Yes | Unix timestamp (milliseconds) when data was cached via `Date.now()` |
| `expiresAt` | `number` | Yes | Unix timestamp (milliseconds) when cache entry expires. Calculated as `timestamp + TTL_MS` |

**Storage Format:** JSON string in localStorage

**Example (Experiences):**
```json
{
  "data": [
    {
      "id": 1,
      "company": "Example Corp",
      "position": "Senior Developer",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "skills": "TypeScript, React, Node.js",
      "companyLogo": "/images/companies/example-corp.png",
      "website": "https://example.com"
    }
  ],
  "timestamp": 1738828800000,
  "expiresAt": 1741420800000
}
```

**Validation Rules:**
- `timestamp` must be <= current time (`Date.now()`)
- `expiresAt` must be > `timestamp`
- `data` must match expected type `T` (validated at runtime via TypeScript)

**State Transitions:**
1. **Created**: When API response is first cached
2. **Valid**: While `Date.now() < expiresAt`
3. **Expired**: When `Date.now() >= expiresAt` → automatically removed on next read
4. **Removed**: Manually cleared via invalidation or quota cleanup

---

### 2. CacheKey

Unique identifier for each cached resource.

**Purpose:** Namespace and organize cache entries in localStorage to prevent collisions.

**Format:** `portfolio_cache_{resource_identifier}`

**Enum of Resource Identifiers:**

| Resource Identifier | Cache Key | API Endpoint | Data Type |
|---------------------|-----------|--------------|-----------|
| `experiences` | `portfolio_cache_experiences` | `/api/v1/experiences` | `Experience[]` |
| `company_durations` | `portfolio_cache_company_durations` | `/api/v1/experiences?company_duration=true` | `CompanyDuration[]` |
| `total_duration` | `portfolio_cache_total_duration` | `/api/v1/experiences?total_duration=true` | `{ total_duration: string }` |
| `projects` | `portfolio_cache_projects` | `/api/v1/projects` | `Project[]` |
| `education` | `portfolio_cache_education` | `/api/v1/education` | `{ formations: Formation[], certifications: Certification[] }` |
| `social_links` | `portfolio_cache_social_links` | `/api/v1/social-media-links` | `SocialLink[]` |

**Design Rationale:**
- **Prefix `portfolio_cache_`**: Enables bulk operations (e.g., clear all portfolio cache entries)
- **Lowercase with underscores**: Consistent with backend endpoint naming conventions
- **No version suffix**: Schema versioning deferred to future enhancement (manual invalidation on schema changes)

**Relationships:**
- One CacheKey → One CachedData entry in localStorage
- Multiple CacheKeys may reference the same API domain (e.g., experiences has 3 related cache keys)

---

### 3. CacheStats

Optional monitoring and debugging entity.

**Purpose:** Provide visibility into cache usage for troubleshooting and performance analysis.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalKeys` | `number` | Yes | Count of all portfolio cache entries in localStorage |
| `totalSize` | `number` | Yes | Total bytes used by all cache entries (sum of stringified JSON lengths) |
| `oldestEntry` | `number \| null` | Yes | Timestamp of the oldest cache entry, or `null` if no entries exist |

**Usage:**
- Called via `BrowserCache.getStats()` for debugging
- Not persisted in localStorage (calculated on-demand)
- Useful for identifying storage quota issues or stale cache entries

**Example Response:**
```json
{
  "totalKeys": 6,
  "totalSize": 48576,
  "oldestEntry": 1738742400000
}
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────────────────────────────────┐
│          localStorage (Browser)         │
└─────────────────────────────────────────┘
                  │
                  │ stores
                  ▼
┌─────────────────────────────────────────┐
│           CacheKey (string)             │
│  e.g., "portfolio_cache_experiences"    │
└─────────────────────────────────────────┘
                  │
                  │ maps to
                  ▼
┌─────────────────────────────────────────┐
│      CachedData<T> (JSON string)        │
│  ┌───────────────────────────────────┐  │
│  │ data: T                           │  │
│  │ timestamp: number                 │  │
│  │ expiresAt: number                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  │ contains
                  ▼
┌─────────────────────────────────────────┐
│     API Response Data (Type T)          │
│  Experience[] | Project[] | etc.        │
└─────────────────────────────────────────┘
```

### Cache Key → API Endpoint Mapping

| Cache Key | Backend Endpoint | HTTP Method | Response Type |
|-----------|------------------|-------------|---------------|
| `portfolio_cache_experiences` | `/api/v1/experiences` | GET | `Experience[]` |
| `portfolio_cache_company_durations` | `/api/v1/experiences?company_duration=true` | GET | `CompanyDuration[]` |
| `portfolio_cache_total_duration` | `/api/v1/experiences?total_duration=true` | GET | `{ total_duration: string }` |
| `portfolio_cache_projects` | `/api/v1/projects` | GET | `Project[]` |
| `portfolio_cache_education` | `/api/v1/education` | GET | `{ formations: Formation[], certifications: Certification[] }` |
| `portfolio_cache_social_links` | `/api/v1/social-media-links` | GET | `SocialLink[]` |

---

## Data Types (Existing Interfaces)

### Experience (from `frontend/src/app/experience/interfaces`)

```typescript
interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  duration: string;
  description: string;
  skills: string;
  companyLogo: string;
  website: string;
}
```

### CompanyDuration

```typescript
interface CompanyDuration {
  name: string;      // Company name
  duration: string;  // Human-readable duration (e.g., "2 years 3 months")
}
```

### Project (from `frontend/src/app/projects/interfaces`)

```typescript
interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  projectUrl: string;
  tags: string[];
  imageUrl?: string;
}
```

### Formation (from `frontend/src/app/education/interfaces`)

```typescript
interface Formation {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  description: string;
  institutionLogo: string;
  website: string;
}
```

### Certification (from `frontend/src/app/education/interfaces`)

```typescript
interface Certification {
  id: number;
  institution: string;
  name: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string;
  credentialUrl: string;
}
```

### SocialLink (from `frontend/src/app/social-links/interfaces`)

```typescript
interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}
```

---

## Validation Rules

### Cache Entry Validation

**On Write (set operation):**
1. `key` must be non-empty string
2. `data` must be JSON-serializable
3. `ttlMs` (if provided) must be positive number
4. Calculated `expiresAt` must be > current timestamp

**On Read (get operation):**
1. localStorage entry must exist for given key
2. JSON must parse successfully → if not, remove corrupted entry and return null
3. `expiresAt` must be > `Date.now()` → if expired, remove entry and return null
4. `data` field must exist and match expected type `T`

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| localStorage disabled/blocked | All cache operations silently fail; fallback to API |
| QuotaExceededError (>5 MB) | Clear expired entries, retry once; if fails, log error and fallback to API |
| Corrupted JSON in cache | Remove corrupted entry, log error, return null (cache miss) |
| Missing `expiresAt` field | Treat as corrupted, remove entry, return null |
| `expiresAt` in the past | Remove entry, return null (expired) |
| SSR context (no window) | All cache operations return null immediately |

---

## Cache Lifecycle

### State Machine Diagram

```
┌──────────┐
│  Empty   │  (No cache entry)
└────┬─────┘
     │
     │ API fetch successful
     │ BrowserCache.set()
     ▼
┌──────────┐
│  Valid   │  (Date.now() < expiresAt)
└────┬─────┘
     │
     ├───────────────────────┐
     │ Automatic expiration  │ Manual invalidation
     │ (Date.now() ≥ expiresAt) │ BrowserCache.remove()
     ▼                       ▼
┌──────────┐          ┌──────────┐
│ Expired  │          │ Removed  │
└────┬─────┘          └────┬─────┘
     │                     │
     │ Automatic cleanup   │
     │ on next read        │
     ▼                     ▼
┌──────────┐          ┌──────────┐
│  Empty   │          │  Empty   │
└──────────┘          └──────────┘
```

### Lifecycle Events

1. **Cache Creation**
   - **Trigger**: First API fetch or cache miss
   - **Action**: Store API response with `CachedData` wrapper
   - **Duration**: TTL = 30 days (2,592,000,000 ms)

2. **Cache Read (Hit)**
   - **Trigger**: Hook loads, cache exists and valid
   - **Action**: Return cached data, set `fromCache = true`
   - **Performance**: <5ms (localStorage read + JSON.parse)

3. **Cache Read (Miss)**
   - **Trigger**: Hook loads, cache missing or expired
   - **Action**: Fetch from API, populate cache, set `fromCache = false`
   - **Performance**: 100-300ms (API latency)

4. **Automatic Expiration**
   - **Trigger**: `Date.now() >= expiresAt` on read operation
   - **Action**: Remove entry, return null (cache miss)
   - **Cleanup**: Lazy (on-read) or active (via `clearExpired()`)

5. **Manual Invalidation**
   - **Trigger**: User calls cache invalidation function
   - **Action**: Remove specific entry or all portfolio cache entries
   - **Next Read**: Cache miss → fresh API fetch

6. **Quota Cleanup**
   - **Trigger**: QuotaExceededError on write
   - **Action**: Call `clearExpired()`, remove all entries with `expiresAt < Date.now()`
   - **Retry**: Attempt write operation once after cleanup

---

## Schema Versioning (Future Enhancement)

**Current State:** No schema versioning implemented.

**Risk:** Backend API schema changes may break cached data.

**Mitigation (Current):**
- Manual cache invalidation after backend deployments
- Graceful error handling in hooks (try-catch around data access)

**Future Enhancement:**
- Add `schemaVersion` field to `CachedData`
- Check version on read; invalidate if mismatch
- Update cache keys to include version: `portfolio_cache_v1_experiences`

---

## Performance Characteristics

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| `get(key)` | O(1) | localStorage lookup + JSON.parse |
| `set(key, data)` | O(1) | JSON.stringify + localStorage write |
| `remove(key)` | O(1) | Single localStorage delete |
| `clearAll()` | O(n) | Iterate all localStorage keys, filter by prefix |
| `clearExpired()` | O(n) | Iterate all cache entries, parse JSON, check expiry |

**n** = total localStorage keys (not just portfolio cache)

### Space Complexity

| Resource | Estimated Size | Cached Entries | Total |
|----------|---------------|----------------|-------|
| Experiences | 20 KB | 3 (experiences + durations + total) | 22 KB |
| Projects | 15 KB | 1 | 15 KB |
| Education | 10 KB | 1 | 10 KB |
| Social Links | 2 KB | 1 | 2 KB |
| **Total** | | **6 entries** | **~49 KB** |

**Overhead:** ~10% for JSON metadata (timestamp, expiresAt)

**Browser Limits:**
- Safari: 5 MB (102x headroom)
- Chrome/Firefox: 10 MB (204x headroom)

---

## Summary

The data model for frontend caching is lightweight and focused:

1. **CachedData<T>**: Generic wrapper for API responses with TTL metadata
2. **CacheKey**: Namespaced string identifiers for localStorage keys
3. **CacheStats**: Optional monitoring entity for debugging

**Key Design Decisions:**
- Generic type support for type-safe caching
- 30-day TTL with automatic expiration checking
- Graceful degradation on errors
- SSR-safe implementation (browser-only operations)
- No schema versioning (deferred to future enhancement)

**Trade-offs:**
- ✅ Simplicity: localStorage over IndexedDB
- ✅ Performance: Synchronous API for small datasets
- ⚠️ Safari 7-day eviction: Accepted limitation (graceful fallback)
- ⚠️ No schema versioning: Requires manual invalidation on API changes
