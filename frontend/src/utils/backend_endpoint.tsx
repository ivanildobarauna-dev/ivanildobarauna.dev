// Em desenvolvimento, usamos o caminho relativo que será redirecionado pelo proxy do Next.js
// Em produção, usamos o mesmo caminho, assumindo que o proxy estará configurado no servidor
export function getBackendEndpoint(endpoint: string) {
  // Remove barras iniciais duplicadas
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Sempre usa o caminho relativo que será redirecionado pelo proxy
  return `/api/v1${cleanEndpoint}`;
}
