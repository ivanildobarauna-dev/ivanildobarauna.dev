export function getBackendEndpoint(endpoint: string) {
  const env = process.env.NODE_ENV;

  if (env === 'development') {
    console.log('Executing in development mode with backend_url: ', process.env.NEXT_PUBLIC_BACKEND_URL);
    return process.env.NEXT_PUBLIC_BACKEND_URL + endpoint;
  }

  return process.env.NEXT_PUBLIC_BACKEND_URL + endpoint;
}