import axios from 'axios';
import { getBackendEndpoint } from './backend_endpoint';

interface HealthCheckResponse {
  message: string;
}

export async function checkBackendHealth(
  timeout: number = 30000,
  interval: number = 1000
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get<HealthCheckResponse>(
        getBackendEndpoint('/ping')
      );
      
      if (response.status === 200 && response.data.message === 'pong') {
        return true;
      }
    } catch {
      // Aguarda antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  return false;
}
