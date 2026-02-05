/**
 * Cache Invalidation API Route
 *
 * DELETE /api/cache - Clear all portfolio cache
 * DELETE /api/cache?resource=projects - Clear specific resource cache
 *
 * IMPORTANT: This endpoint returns instructions for client-side cache clearing.
 * The actual cache clearing happens on the client side (in the browser's localStorage),
 * since the cache is stored in the user's browser, not on the server.
 *
 * Usage:
 * - From browser console: window.clearPortfolioCache()
 * - Via API call: curl -X DELETE http://localhost:3000/api/cache
 * - With resource type: curl -X DELETE 'http://localhost:3000/api/cache?resource=projects'
 *
 * This API route is useful for:
 * 1. Documenting the cache invalidation capability
 * 2. Providing a standard endpoint for cache management
 * 3. Future integration with backend webhooks (when data changes)
 * 4. Automated testing and deployment scripts
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle DELETE requests to invalidate cache
 *
 * Query Parameters:
 * - resource (optional): Specific resource type to invalidate
 *   Valid values: 'experiences', 'company_durations', 'total_duration',
 *                 'projects', 'education', 'social_links'
 *
 * Returns:
 * - action: The cache invalidation action to perform
 * - resource: The resource being cleared ('all' or specific type)
 * - message: Instructions for cache clearing
 * - clientSideInstructions: How to clear cache from browser console
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  // Validate resource type if provided
  const validResources = [
    'experiences',
    'company_durations',
    'total_duration',
    'projects',
    'education',
    'social_links',
  ];

  if (resource && !validResources.includes(resource)) {
    return NextResponse.json(
      {
        error: 'Invalid resource type',
        validResources,
        message: `Resource "${resource}" is not valid. Please use one of: ${validResources.join(', ')}`,
      },
      { status: 400 }
    );
  }

  // Return instructions for cache clearing
  const response = {
    action: 'clear_cache',
    resource: resource || 'all',
    message: resource
      ? `Cache invalidation instructions sent for resource: ${resource}`
      : 'Cache invalidation instructions sent for all resources',
    clientSideInstructions: resource
      ? `To clear cache for ${resource}, run in browser console: window.clearPortfolioCache('${resource}')`
      : 'To clear all cache, run in browser console: window.clearPortfolioCache()',
    note: 'Cache is stored client-side in localStorage. This endpoint provides instructions for cache clearing. The actual clearing must be done by the client.',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 200 });
}

/**
 * Handle GET requests to provide cache information
 *
 * Returns information about the cache invalidation endpoint and available resources.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/cache',
    description: 'Portfolio cache invalidation endpoint',
    methods: ['DELETE', 'GET'],
    usage: {
      clearAll: 'DELETE /api/cache',
      clearSpecific: 'DELETE /api/cache?resource=projects',
      consoleCommand: 'window.clearPortfolioCache() or window.clearPortfolioCache("projects")',
    },
    availableResources: [
      'experiences',
      'company_durations',
      'total_duration',
      'projects',
      'education',
      'social_links',
    ],
    note: 'Cache is stored client-side. This endpoint provides instructions only.',
  });
}
