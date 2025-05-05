export function getBackendEndpoint(endpoint: string) {
  // Se está rodando no navegador do cliente
  const isClient = typeof window !== 'undefined';
  
  let baseUrl;
  
  if (isClient) {
    // No cliente (browser), sempre use o host da atual página
    const hostname = window.location.hostname;
    baseUrl = `http://${hostname}:8090/api/v1`;
  } else {
    // No servidor (SSR), use o nome do serviço Docker em produção
    baseUrl = process.env.NODE_ENV === 'production' 
      ? "http://backend:8090/api/v1" 
      : "http://localhost:8090/api/v1";
  }
  
  return baseUrl + endpoint;
}