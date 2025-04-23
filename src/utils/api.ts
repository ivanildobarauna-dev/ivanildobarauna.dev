/**
 * Utility functions for API communication
 */

/**
 * Constructs the backend URL based on the environment
 * @returns The formatted backend URL
 */
export const getBackendUrl = (): string => {
  let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "10.128.0.6:8080/api/v1";
  
  if (typeof window !== 'undefined' && backendUrl.includes('backend')) {
    try {
      let url;
      if (backendUrl.startsWith('http://') || backendUrl.startsWith('https://')) {
        url = new URL(backendUrl);
      } else {
        url = new URL('http://' + backendUrl);
      }
      url.protocol = 'http:';
      url.hostname = 'localhost';
      url.port = '8090';
      backendUrl = url.toString();
    } catch (e) {
      console.error('Failed to parse backend URL:', e);
      backendUrl = 'http://localhost:8090';
    }
  }
  
  return backendUrl;
};

/**
 * Constructs the endpoint URL for a specific resource
 * @param endpoint The API endpoint to access
 * @returns The complete URL for the endpoint
 */
export const getEndpointUrl = (endpoint: string): string => {
  const backendUrl = getBackendUrl();
  const finalEndpoint = backendUrl.includes('/backend') ? endpoint : `backend/${endpoint}`;
  return `${backendUrl}/${finalEndpoint}`;
};
