export function getBackendEndpoint(endpoint: string) {
  // Se está rodando no navegador do cliente
  const isClient = typeof window !== 'undefined';
  
  let baseUrl;
  
  if (isClient) {
    // No cliente (browser), use a mesma origem (para proxy reverso)
    // Isto permite que as requisições do navegador sejam encaminhadas pelo servidor Next.js
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    // Usa o proxy reverso configurado no next.config.js sem especificar porta
    baseUrl = `${protocol}//${hostname}/api/v1`;
  } else {
    // No servidor (SSR), use o nome do serviço Docker
    // Em ambiente Docker, os serviços podem se comunicar pelo nome do serviço
    baseUrl = "http://backend:8090/api/v1";
  }
  
  return baseUrl + endpoint;
}