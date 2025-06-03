import axios from 'axios';
import { describe, it, expect } from 'vitest';
import { checkBackendHealth } from '../utils/checkBackendHealth';
import { getBackendEndpoint } from '../utils/backend_endpoint';

const BASE_URL = process.env.APP_URL;
const TIMEOUT = 30000; // 30 segundos

const routes = [
  '/',
  '/projects',
  '/experience',
  '/education',
  '/contact'
];

describe('Application Health Check', () => {
  it('should verify that backend API is up and returning correct payload', async () => {
    const isBackendHealthy = await checkBackendHealth(TIMEOUT);
    expect(isBackendHealthy).toBe(true);
    
    // Validar especificamente o payload
    try {
      const response = await axios.get(getBackendEndpoint('/ping'));
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'pong' });
    } catch (error) {
      // Falhar o teste se não conseguir fazer a requisição
      expect(error).toBeFalsy();
    }
  }, TIMEOUT + 1000);

  routes.forEach(route => {
    it(`should verify that ${route} page is accessible`, async () => {
      const startTime = Date.now();
      let isUp = false;
      
      while (!isUp && Date.now() - startTime < TIMEOUT) {
        try {
          const response = await axios.get(`${BASE_URL}${route}`);
          if (response.status === 200) {
            isUp = true;
            break;
          }
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      expect(isUp).toBe(true);
    }, TIMEOUT + 1000);
  });
}); 
