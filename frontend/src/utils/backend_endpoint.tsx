export function getBackendEndpoint(endpoint: string) {
  
  const isClient = typeof window !== 'undefined';
  
  let baseUrl;
  
  if (isClient) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
  
    baseUrl = `${protocol}//${hostname}${port}/api/v1`;
  } else {
    baseUrl = "http://backend:8090/api/v1";
  }
  
  return baseUrl + endpoint;
}
