# Implementation Plan: Frontend Cache-Aside Pattern

**Branch**: `001-frontend-cache` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-cache/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a cache-aside pattern in the Next.js frontend to reduce backend API calls by 80% and improve page load times by 50% for repeat visitors. The solution will intercept all existing hook-based API calls (useExperience, useProjects, useEducation, useSocialLinks), check an in-memory cache before making requests, store responses with a 30-day TTL, and provide a manual cache invalidation endpoint for content updates.

## Technical Context

**Language/Version**: TypeScript 5.8.3, Next.js 16.1.6, React 19.2.1
**Primary Dependencies**: Next.js App Router, React hooks, Vitest for testing, Tailwind CSS
**Storage**: localStorage (5-10 MB browser limit, sufficient for ~49 KB portfolio data)
**Testing**: Vitest with Testing Library for unit and integration tests
**Target Platform**: Web browsers (modern Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend-only changes)
**Performance Goals**:
- 50% reduction in page load time for repeat visits
- 80% reduction in backend API calls
- <100ms cache invalidation time
- 70%+ cache hit rate

**Constraints**:
- Must maintain backward compatibility with existing hooks (useExperience, useProjects, useEducation, useSocialLinks)
- Must gracefully degrade if cache fails (fallback to API)
- Safari 7-day storage eviction (accepted limitation with graceful fallback)
- localStorage quota: Safari 5 MB, Chrome/Firefox 10 MB (portfolio data ~49 KB, 102x headroom)
- Cache keys must be clear and avoid collisions

**Scale/Scope**:
- 6 cache keys (experiences, company_durations, total_duration, projects, education, social_links)
- 4 existing hooks to modify
- 1 new cache service utility module
- 1 optional cache invalidation utility function (client-side)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Frontend Technology Stack Compliance ✓

**REQUIRED (from constitution)**:
- ✅ Next.js with App Router - Using existing Next.js 16.1.6 setup
- ✅ TypeScript (strict mode) - TypeScript 5.8.3 with strict type checking
- ✅ Tailwind CSS for styling - No new styling required (utility only)
- ✅ Vitest with Testing Library - Will add tests for cache service
- ✅ React hooks (functional components only) - Extending existing hooks pattern

**FORBIDDEN (from constitution)**:
- ✅ No class components - Using functional hooks only
- ✅ No direct backend URL hardcoding - Using existing `getBackendEndpoint()` utility
- ✅ No inline styles or CSS-in-JS - Not applicable (no UI changes)

### File Organization Compliance ✓

**Frontend structure (from constitution)**:
```
frontend/
├── src/
│   ├── app/          # Next.js App Router pages (existing hooks here)
│   ├── components/   # Shared components (no changes needed)
│   ├── test/         # Vitest tests (will add cache tests)
│   └── utils/        # Backend endpoint config (will add cache service here)
└── public/           # Static assets (no changes)
```

**Compliance**:
- ✅ Cache service will be added to `src/utils/` (alongside `backend_endpoint.tsx`)
- ✅ Existing hooks in `src/app/{feature}/hooks/` will be modified to use cache service
- ✅ Tests will be added to `src/test/`
- ✅ Cache invalidation API route will follow Next.js App Router convention at `src/app/api/cache/`

### Development Workflow Compliance ✓

**Pre-Commit Requirements (from constitution)**:
- ✅ Code Quality: Will run `npm run lint` before commit
- ✅ Tests: Will add Vitest tests with 100% coverage for cache service
- ✅ Integration: Docker Compose compatibility maintained (frontend-only changes)

### API-First Design Compliance ✓

**Requirements (from constitution)**:
- ✅ Backend API remains unchanged (no backend modifications)
- ✅ Frontend consumes backend through `getBackendEndpoint()` utility (existing pattern maintained)
- ✅ Cache invalidation endpoint follows Next.js API Routes convention

### Gate Status: **PASS** ✓

No constitution violations. This feature:
1. Aligns with existing frontend architecture (Next.js + TypeScript + React hooks)
2. Follows established file organization patterns
3. Maintains backward compatibility with existing code
4. Requires no backend changes (frontend-only)
5. Enhances performance without compromising architecture principles

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── cache/
│   │   │       └── route.ts              # NEW: Cache invalidation API route
│   │   ├── experience/
│   │   │   └── hooks/
│   │   │       ├── useExperience.ts      # MODIFIED: Add cache integration
│   │   │       └── useTotalExperience.ts
│   │   ├── projects/
│   │   │   └── hooks/
│   │   │       ├── useProjects.ts        # MODIFIED: Add cache integration
│   │   │       └── useTotalProjects.ts
│   │   ├── education/
│   │   │   └── hooks/
│   │   │       ├── useEducation.ts       # MODIFIED: Add cache integration
│   │   │       └── useTotalEducation.ts
│   │   └── social-links/
│   │       └── hooks/
│   │           └── useSocialLinks.ts     # MODIFIED: Add cache integration
│   ├── utils/
│   │   ├── backend_endpoint.tsx          # EXISTING: Backend URL configuration
│   │   ├── cacheService.ts               # NEW: Cache abstraction layer
│   │   └── cacheTypes.ts                 # NEW: TypeScript types for cache
│   └── test/
│       ├── cacheService.test.ts          # NEW: Cache service unit tests
│       └── cacheIntegration.test.ts      # NEW: Integration tests with hooks
└── package.json
```

**Structure Decision**: Web application (frontend-only changes). All modifications are isolated to the `frontend/` directory. No backend changes required. The cache service will be added to `src/utils/` alongside existing utilities, following the established pattern. Cache invalidation endpoint follows Next.js 13+ App Router API convention at `src/app/api/cache/route.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section is not applicable.

---

## Phase 0: Research ✓ COMPLETED

**Objective**: Resolve technical unknowns and make informed technology decisions.

**Research Questions:**
1. Which browser storage API to use? (localStorage vs IndexedDB vs Cache API)
2. What are the storage capacity limits?
3. How to handle Safari's 7-day storage eviction policy?

**Decisions Made:**

### Decision 1: localStorage (Primary Storage API)

**Chosen**: localStorage with manual TTL implementation

**Rationale:**
- Sufficient capacity (5-10 MB) for portfolio data (~49 KB)
- Best performance for small datasets (0.017ms write latency)
- Synchronous API simplifies React hook integration
- 98%+ browser compatibility
- Simple TTL implementation (timestamp-based)

**Alternatives Rejected:**
- IndexedDB: 10x slower for small writes, requires wrapper libraries, overkill for simple JSON caching
- Cache API: Designed for HTTP resource caching, not optimal for application state

**Sources**: [research.md](./research.md)

### Decision 2: Accept Safari 7-Day Eviction with Graceful Fallback

**Chosen**: Accept Safari's 7-day storage eviction policy, implement graceful cache miss handling

**Rationale:**
- Portfolio data changes infrequently
- Most visitors return within 7 days or are first-time visitors
- Cache-aside pattern inherently handles cache misses
- Persistent storage permission requires user prompt (poor UX)

**Impact**: Adjusted TTL from "30 days guaranteed" to "30 days with Safari 7-day fallback"

**Sources**: [research.md](./research.md)

### Decision 3: Storage Capacity Strategy

**Chosen**: localStorage with automatic quota management

**Limits:**
- Safari: 5 MB (102x headroom for ~49 KB data)
- Chrome/Firefox: 10 MB (204x headroom)

**Quota Handling:**
1. Wrap all writes in try-catch
2. Detect QuotaExceededError
3. Automatically clear expired entries
4. Retry once after cleanup

**Sources**: [research.md](./research.md)

**Deliverables:**
- ✅ [research.md](./research.md) - Complete technical research document
- ✅ All NEEDS CLARIFICATION items resolved
- ✅ Technology stack decisions finalized

---

## Phase 1: Design & Contracts ✓ COMPLETED

**Objective**: Design data model, define API contracts, and create implementation guide.

**Design Artifacts:**

### 1. Data Model ✓

**File**: [data-model.md](./data-model.md)

**Key Entities:**
- **CachedData<T>**: Generic wrapper for API responses with metadata (data, timestamp, expiresAt)
- **CacheKey**: Namespaced identifiers (e.g., `portfolio_cache_experiences`)
- **CacheStats**: Optional monitoring entity (totalKeys, totalSize, oldestEntry)

**Cache Keys Defined:**
| Cache Key | API Endpoint | Data Type |
|-----------|--------------|-----------|
| `experiences` | `/api/v1/experiences` | `Experience[]` |
| `company_durations` | `/api/v1/experiences?company_duration=true` | `CompanyDuration[]` |
| `total_duration` | `/api/v1/experiences?total_duration=true` | `{ total_duration: string }` |
| `projects` | `/api/v1/projects` | `Project[]` |
| `education` | `/api/v1/education` | `{ formations: [], certifications: [] }` |
| `social_links` | `/api/v1/social-media-links` | `SocialLink[]` |

**Validation Rules**: TTL expiration, JSON parsing, SSR compatibility

### 2. API Contracts ✓

**File**: [contracts/cache-service-interface.md](./contracts/cache-service-interface.md)

**BrowserCache Class Contract:**
- `get<T>(key: string): T | null` - Retrieve with automatic expiration checking
- `set<T>(key: string, data: T, ttlMs?: number): void` - Store with TTL
- `remove(key: string): void` - Clear specific entry
- `clearAll(): void` - Clear all portfolio cache
- `clearExpired(): void` - Remove expired entries
- `getStats(): CacheStats` - Get cache statistics

**Type Safety**: Generic type support for compile-time type checking

**Error Handling**: Graceful degradation (never throw, always fallback)

**Performance Guarantees**:
- `get()`: <5ms typical, <10ms max
- `set()`: <10ms typical, <50ms max
- `clearAll()`: <50ms typical, <100ms max

### 3. Quickstart Guide ✓

**File**: [quickstart.md](./quickstart.md)

**Contents:**
- Installation and setup instructions
- Basic usage examples
- Hook integration pattern
- Cache keys reference
- Common tasks (add caching, invalidate cache, debug)
- Troubleshooting guide
- Performance monitoring
- Testing strategies
- Best practices

### 4. Agent Context Update ✓

**Command**: `.specify/scripts/bash/update-agent-context.sh claude`

**Changes**:
- Added TypeScript 5.8.3, Next.js 16.1.6, React 19.2.1
- Added Next.js App Router, React hooks, Vitest, Tailwind CSS
- Updated CLAUDE.md with active technologies for this feature

**Deliverables:**
- ✅ [data-model.md](./data-model.md) - Complete data model specification
- ✅ [contracts/cache-service-interface.md](./contracts/cache-service-interface.md) - API contract
- ✅ [quickstart.md](./quickstart.md) - Developer guide
- ✅ Agent context updated (CLAUDE.md)

---

## Constitution Check (Post-Design Re-evaluation) ✓ PASS

**Re-evaluated after Phase 1 design. Status: PASS (no changes)**

All design decisions align with constitution principles:
- ✅ Frontend technology stack compliance maintained
- ✅ File organization follows established patterns
- ✅ No backend changes (frontend-only feature)
- ✅ Type safety enforced (TypeScript generics)
- ✅ Testing requirements met (Vitest unit + integration tests)
- ✅ Graceful degradation ensures reliability

**No violations or deviations from constitution.**

---

## Next Steps

**Phase 2 - Task Generation**: Run `/speckit.tasks` to generate implementation tasks.

The plan is complete and ready for task generation. All technical decisions have been made, contracts defined, and design artifacts created. Implementation can proceed with:

1. Create cache service utility (`src/utils/cacheService.ts`)
2. Modify 4 existing hooks to integrate caching
3. Add comprehensive tests
4. Document cache invalidation process

**Ready for**: `/speckit.tasks`
