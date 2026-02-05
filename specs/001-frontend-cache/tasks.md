# Tasks: Frontend Cache-Aside Pattern

**Input**: Design documents from `/specs/001-frontend-cache/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Unit and integration tests included for cache service (Vitest)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source code, `frontend/src/test/` for tests
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create TypeScript types and base cache service structure

**Deliverables**: Type definitions, cache service skeleton

- [x] T001 Create TypeScript type definitions in frontend/src/utils/cacheTypes.ts
- [x] T002 [P] Create BrowserCache class skeleton in frontend/src/utils/cacheService.ts with empty method stubs

**Checkpoint**: Type system and class structure in place - ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core caching infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until cache service is fully functional

- [x] T003 [P] Implement BrowserCache.isBrowser() private method in frontend/src/utils/cacheService.ts
- [x] T004 [P] Implement BrowserCache.getCacheKey() private method in frontend/src/utils/cacheService.ts
- [x] T005 Implement BrowserCache.get<T>() method with TTL expiration checking in frontend/src/utils/cacheService.ts
- [x] T006 Implement BrowserCache.set<T>() method with automatic TTL and QuotaExceededError handling in frontend/src/utils/cacheService.ts
- [x] T007 [P] Implement BrowserCache.remove() method in frontend/src/utils/cacheService.ts
- [x] T008 [P] Implement BrowserCache.clearAll() method in frontend/src/utils/cacheService.ts
- [x] T009 [P] Implement BrowserCache.clearExpired() method in frontend/src/utils/cacheService.ts
- [x] T010 [P] Implement BrowserCache.getStats() method in frontend/src/utils/cacheService.ts
- [x] T011 Create unit tests for BrowserCache class in frontend/src/test/cacheService.test.ts (test get, set, remove, clearAll, clearExpired, getStats, TTL expiration, QuotaExceededError handling, SSR compatibility)
- [x] T012 Verify all unit tests pass with npm run test

**Checkpoint**: Foundation ready - BrowserCache service fully functional and tested. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Fast Page Load on Repeat Visits (Priority: P1) 🎯 MVP

**Goal**: Implement cache-aside pattern in all existing hooks to reduce page load time by 50% for repeat visitors

**Independent Test**: Visit any portfolio page twice within 30 days. First visit fetches from API (slow), second visit loads from cache (fast). Verify by checking browser DevTools console logs and Network tab (no API calls on second visit).

**Acceptance Criteria**:
1. First page visit fetches from backend API and stores in cache (verify: localStorage has `portfolio_cache_*` entries)
2. Second page visit loads from cache without API calls (verify: Network tab shows no backend requests)
3. Cached data older than 30 days is automatically expired and re-fetched (verify: modify timestamp in localStorage, reload page, see API call)

### Implementation for User Story 1

**Note**: All hook modifications can be done in parallel since they operate on different files

- [x] T013 [P] [US1] Modify useExperience hook to integrate cache-aside pattern in frontend/src/app/experience/hooks/useExperience.ts (check cache for experiences, company_durations, total_duration keys; fetch from API on miss; populate cache on successful fetch; add fromCache flag to return value)
- [x] T014 [P] [US1] Modify useProjects hook to integrate cache-aside pattern in frontend/src/app/projects/hooks/useProjects.ts (check cache for projects key; fetch from API on miss; populate cache; add fromCache flag)
- [x] T015 [P] [US1] Modify useEducation hook to integrate cache-aside pattern in frontend/src/app/education/hooks/useEducation.ts (check cache for education key; fetch from API on miss; populate cache; add fromCache flag)
- [x] T016 [P] [US1] Modify useSocialLinks hook to integrate cache-aside pattern in frontend/src/app/social-links/hooks/useSocialLinks.ts (check cache for social_links key; fetch from API on miss; populate cache; add fromCache flag)
- [x] T017 Create integration tests for cache-hook interaction in frontend/src/test/cacheIntegration.test.ts (test cache hit scenario, cache miss scenario, cache expiration scenario, graceful fallback on cache errors)
- [x] T018 Verify integration tests pass with npm run test
- [ ] T019 Manual test: Visit Experience page twice, verify second visit uses cache (check console logs for "Loaded from cache" message and Network tab for no API calls)
- [ ] T020 Manual test: Visit Projects page twice, verify cache behavior
- [ ] T021 Manual test: Visit Education page twice, verify cache behavior
- [ ] T022 Manual test: Visit Social Links page (in sidebar), verify cache behavior

**Checkpoint**: User Story 1 complete. All pages load instantly on repeat visits with 80%+ reduction in API calls.

---

## Phase 4: User Story 2 - Manual Cache Invalidation for Data Updates (Priority: P2)

**Goal**: Provide a way for portfolio owner to manually clear cache when backend data is updated

**Independent Test**:
1. Visit any page (cache populated)
2. Call invalidation utility function from browser console: `window.clearPortfolioCache()`
3. Reload page - verify fresh data is fetched from API
4. Check localStorage - verify all `portfolio_cache_*` entries are removed

**Acceptance Criteria**:
1. Calling invalidation function removes all cached entries (verify: localStorage empty)
2. Next page load fetches fresh data from API (verify: Network tab shows API requests)
3. Fresh data is cached again (verify: localStorage repopulated with new timestamps)

### Implementation for User Story 2

- [x] T023 [US2] Create cache invalidation utility function in frontend/src/utils/cacheService.ts (export a global function `clearPortfolioCache()` that calls `BrowserCache.clearAll()`)
- [x] T024 [US2] Expose cache invalidation function to browser console for manual testing in frontend/src/utils/cacheService.ts (add `window.clearPortfolioCache = clearPortfolioCache;` in browser environment)
- [x] T025 [US2] Create Next.js API route for cache invalidation at frontend/src/app/api/cache/route.ts (DELETE method returns JSON response with instructions to call client-side clearPortfolioCache)
- [x] T026 [US2] Add documentation comment to API route explaining that actual cache clearing happens client-side in frontend/src/app/api/cache/route.ts
- [ ] T027 Manual test: Call `window.clearPortfolioCache()` from console, verify localStorage cleared
- [ ] T028 Manual test: Call DELETE /api/cache endpoint via curl or Postman, verify response format
- [ ] T029 Manual test: Clear cache, visit all pages, verify fresh API calls and cache repopulation

**Checkpoint**: User Story 2 complete. Portfolio owner can manually invalidate cache when content is updated.

---

## Phase 5: User Story 3 - Granular Cache Control per Resource Type (Priority: P3)

**Goal**: Support invalidating cache for specific resource types instead of clearing all cache

**Independent Test**:
1. Visit Experience page (cache populated for experiences)
2. Visit Projects page (cache populated for projects)
3. Call `window.clearPortfolioCache('projects')` from console
4. Reload Projects page - verify API call (cache miss)
5. Reload Experience page - verify no API call (cache hit)

**Acceptance Criteria**:
1. Calling `clearPortfolioCache('projects')` removes only projects cache (verify: localStorage still has `portfolio_cache_experiences` but not `portfolio_cache_projects`)
2. Projects page fetches fresh data from API (verify: Network tab shows /projects API call)
3. Experience page still loads from cache (verify: Network tab shows no /experiences API call)

### Implementation for User Story 3

- [x] T030 [US3] Add optional resource type parameter to clearPortfolioCache function in frontend/src/utils/cacheService.ts (signature: `clearPortfolioCache(resourceType?: string)`)
- [x] T031 [US3] Implement granular cache clearing logic in frontend/src/utils/cacheService.ts (if resourceType provided, call `BrowserCache.remove(resourceType)`; otherwise call `BrowserCache.clearAll()`)
- [x] T032 [US3] Update Next.js API route to support resource type query parameter at frontend/src/app/api/cache/route.ts (accept `?resource=experiences|projects|education|social_links` query param)
- [x] T033 [US3] Add unit tests for granular cache invalidation in frontend/src/test/cacheService.test.ts (test clearing specific resource, test clearing multiple resources, test that other caches remain intact)
- [x] T034 Verify granular cache tests pass with npm run test
- [ ] T035 Manual test: Populate all caches, clear only 'projects', verify projects cache removed and others remain
- [ ] T036 Manual test: Clear 'experiences' cache, reload Experience page (API call), reload Projects page (cache hit)
- [ ] T037 Manual test: Test API route with query parameter: `curl -X DELETE 'http://localhost:3000/api/cache?resource=projects'`

**Checkpoint**: User Story 3 complete. All user stories are now independently functional with full cache control.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Code quality, documentation, and final verification

**Deliverables**: Clean code, comprehensive documentation, all tests passing

- [ ] T038 [P] Run ESLint on all modified files: `cd frontend && npm run lint`
- [ ] T039 [P] Fix any linting errors or warnings
- [ ] T040 [P] Add JSDoc comments to all public methods in BrowserCache class in frontend/src/utils/cacheService.ts
- [ ] T041 [P] Add JSDoc comments to clearPortfolioCache function in frontend/src/utils/cacheService.ts
- [ ] T042 Run all tests one final time: `cd frontend && npm run test`
- [ ] T043 Verify all tests pass (100% pass rate)
- [ ] T044 Manual performance test: Measure page load time on first visit vs second visit (should be 50%+ faster on second visit)
- [ ] T045 Manual test: Verify Safari 7-day limitation handling (simulate by clearing cache after 7 days, verify graceful re-fetch)
- [ ] T046 Manual test: Verify QuotaExceededError handling by filling localStorage near quota limit (artificially add large data), then trigger cache write
- [ ] T047 Create summary report of performance metrics (cache hit rate, page load time improvements, API call reduction)
- [ ] T048 Update CLAUDE.md or README if needed with cache feature documentation

**Checkpoint**: Feature complete, tested, documented, and ready for deployment

---

## Dependency Graph

**User Story Completion Order:**

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKING: Must complete before any user stories
    ↓
    ├──→ Phase 3 (US1: Fast Page Load) ← MVP - Highest Priority
    ├──→ Phase 4 (US2: Manual Invalidation) ← Can start after US1 complete
    └──→ Phase 5 (US3: Granular Control) ← Can start after US2 complete
    ↓
Phase 6 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (US1) - MVP delivery

**Independent Stories**: US1, US2, US3 are independent after Phase 2 completes, but recommended to implement in priority order (P1 → P2 → P3) for incremental value delivery.

---

## Parallel Execution Examples

### Phase 1 (Setup) - 2 tasks in parallel
```bash
# Task T001 and T002 can run simultaneously
Agent 1: Create cacheTypes.ts
Agent 2: Create cacheService.ts skeleton
```

### Phase 2 (Foundational) - Up to 5 tasks in parallel after T005-T006 complete
```bash
# First: T003, T004 in parallel (helpers)
Agent 1: Implement isBrowser()
Agent 2: Implement getCacheKey()

# Second: T005, T006 sequentially (core logic)
Agent 1: Implement get() method
Agent 1: Implement set() method (depends on get for testing)

# Third: T007-T010 in parallel (remaining methods)
Agent 1: Implement remove()
Agent 2: Implement clearAll()
Agent 3: Implement clearExpired()
Agent 4: Implement getStats()

# Fourth: T011-T012 (tests)
Agent 1: Write and run tests
```

### Phase 3 (US1) - 4 hooks in parallel
```bash
# Tasks T013-T016 can ALL run in parallel (independent files)
Agent 1: Modify useExperience hook
Agent 2: Modify useProjects hook
Agent 3: Modify useEducation hook
Agent 4: Modify useSocialLinks hook

# Then: T017-T018 (integration tests)
Agent 1: Write integration tests
Agent 1: Run tests

# Then: T019-T022 (manual tests - sequential)
Tester: Manual verification
```

### Phase 4 (US2) - Sequential (T023-T024 before T025-T026)
```bash
# First: T023-T024
Agent 1: Create invalidation function

# Then: T025-T026
Agent 1: Create API route

# Then: T027-T029 (manual tests)
Tester: Manual verification
```

### Phase 5 (US3) - T030-T032 in parallel, then T033-T034
```bash
# First: T030-T032 in parallel
Agent 1: Add resource type parameter to utility
Agent 2: Update API route for query param

# Then: T033-T034
Agent 1: Write and run tests

# Then: T035-T037 (manual tests)
Tester: Manual verification
```

### Phase 6 (Polish) - Many tasks in parallel
```bash
# Tasks T038-T042 can run in parallel
Agent 1: Run linting
Agent 2: Add JSDoc comments to BrowserCache
Agent 3: Add JSDoc comments to clearPortfolioCache
Agent 4: Run all tests

# Then: T043-T048 (verification and docs)
Agent 1: Performance testing and documentation
```

**Maximum Parallelism**: Phase 3 (US1) has highest parallelism with 4 independent hook modifications

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**Phases to implement for MVP:**
- ✅ Phase 1: Setup
- ✅ Phase 2: Foundational
- ✅ Phase 3: User Story 1 (Fast Page Load)

**MVP Delivers:**
- 50%+ faster page loads for repeat visitors
- 80%+ reduction in backend API calls
- Full cache-aside pattern implementation
- Automatic TTL expiration (30 days)
- Graceful fallback on errors

**Effort**: ~24 tasks (T001-T022, T042-T043)
**Value**: Core caching functionality - immediate performance improvement

### Incremental Delivery (Post-MVP)

**Phase 4 (US2: Manual Invalidation):**
- Add cache clearing capability
- Useful for portfolio owner when content updates
- Effort: 7 tasks (T023-T029)
- Value: Content freshness control

**Phase 5 (US3: Granular Control):**
- Optimize cache invalidation (clear only what changed)
- Nice-to-have optimization
- Effort: 8 tasks (T030-T037)
- Value: Reduced unnecessary API calls

**Phase 6 (Polish):**
- Code quality, documentation, final verification
- Effort: 11 tasks (T038-T048)
- Value: Production readiness

---

## Task Summary

### Total Task Count: **48 tasks**

**By Phase:**
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 10 tasks ⚠️ BLOCKING
- Phase 3 (US1 - P1): 10 tasks 🎯 MVP
- Phase 4 (US2 - P2): 7 tasks
- Phase 5 (US3 - P3): 8 tasks
- Phase 6 (Polish): 11 tasks

**By User Story:**
- Setup & Foundational: 12 tasks (blocking)
- User Story 1 (P1): 10 tasks ← MVP
- User Story 2 (P2): 7 tasks
- User Story 3 (P3): 8 tasks
- Polish: 11 tasks

**Parallelizable Tasks**: 16 tasks marked with [P]
**Sequential Tasks**: 32 tasks (dependencies or single file modifications)

### Independent Test Criteria

**User Story 1 (Fast Page Load):**
- ✅ First visit fetches from API (Network tab shows backend calls)
- ✅ Second visit loads from cache (Network tab shows no backend calls)
- ✅ localStorage contains `portfolio_cache_*` entries with correct TTL
- ✅ Page load time reduced by 50%+ on second visit

**User Story 2 (Manual Invalidation):**
- ✅ Call `window.clearPortfolioCache()` removes all cache entries
- ✅ Next page load fetches fresh data from API
- ✅ localStorage is repopulated with new data

**User Story 3 (Granular Control):**
- ✅ Call `clearPortfolioCache('projects')` removes only projects cache
- ✅ Projects page fetches fresh data, other pages use cache
- ✅ localStorage shows selective deletion (only specified resource removed)

---

## Format Validation ✅

All 48 tasks follow the required checklist format:
- ✅ Every task starts with `- [ ]` (markdown checkbox)
- ✅ Every task has a sequential ID (T001-T048)
- ✅ Parallelizable tasks marked with [P] (16 tasks)
- ✅ User story tasks marked with [US1], [US2], or [US3] (25 tasks)
- ✅ Setup/Foundational/Polish tasks have no story label
- ✅ Every task includes file path or clear description
- ✅ Dependencies and execution order documented

---

## Success Metrics

**Performance Targets** (from spec.md):
- ✅ SC-001: Page load time reduced by 50%+ for repeat visits
- ✅ SC-002: Backend API calls reduced by 80%+
- ✅ SC-003: Cache invalidation completes within 100ms
- ✅ SC-004: Zero user-visible errors on cache failures (graceful fallback)
- ✅ SC-005: Cache hit rate exceeds 70% for repeat visitors

**Track These Metrics:**
1. Cache hit rate (fromCache flag in hooks)
2. Page load time (first visit vs second visit)
3. API call count (Network tab monitoring)
4. Cache invalidation time (console.time measurements)
5. Error rate (console errors, Sentry if integrated)

**Recommended Tools:**
- Browser DevTools Network tab (API call tracking)
- Browser DevTools Application → Local Storage (cache inspection)
- Console logs with `fromCache` flag (cache hit/miss tracking)
- Lighthouse performance audits (load time measurements)
