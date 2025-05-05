export function getBackendEndpoint(endpoint: string) {
  // Se está rodando no navegador do cliente
  const isClient = typeof window !== 'undefined';
  
  let baseUrl;
  
  if (isClient) {
    // No cliente (browser), sempre use o host da atual página e o protocolo atual
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    baseUrl = `${protocol}//${hostname}:8090/api/v1`;
  } else {
    // No servidor (SSR), use o nome do serviço Docker em produção
    baseUrl = process.env.NODE_ENV === 'production' 
      ? "https://backend:8090/api/v1" 
      : "http://localhost:8090/api/v1";
  }
  
  return baseUrl + endpoint;
}