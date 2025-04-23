/**
 * Utility functions for API communication
 */

/**
 * Constructs the endpoint URL for a specific resource
 * @param endpoint The API endpoint to access
 * @returns The complete URL for the endpoint
 */
export const getEndpointUrl = (endpoint: string): string => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    // For Docker environment
    if (process.env.NEXT_PUBLIC_BACKEND_URL.includes('backend:8090')) {
      return `http://backend:8090/backend/${endpoint}`;
    }
  }
  
  if (typeof window !== 'undefined') {
    return `http://localhost:8090/backend/${endpoint}`;
  }
  
  return `http://localhost:8090/backend/${endpoint}`;
};
