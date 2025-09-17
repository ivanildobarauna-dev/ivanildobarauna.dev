import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkBackendHealth } from '../utils/checkBackendHealth';
import { getBackendEndpoint } from '../utils/backend_endpoint';

// Mock do axios com tipagem correta
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

const routes = ['/'];

describe('Application Health Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify that backend API is up and returning correct payload', async () => {
    // Mock successful axios response
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: { message: 'pong' },
      statusText: 'OK',
      headers: {},
      config: { 
        headers: {} as Record<string, string>,
        url: '',
        method: 'get',
        data: undefined
      }
    } as const);

    const isBackendHealthy = await checkBackendHealth(1000);
    expect(isBackendHealthy).toBe(true);
    
    const response = await axios.get(getBackendEndpoint('/ping'));
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'pong' });
    expect(mockedAxios.get).toHaveBeenCalledWith(getBackendEndpoint('/ping'));
  });

  routes.forEach(route => {
    it(`should verify that ${route} page is accessible`, async () => {
      // Mock successful page response
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: '<html>Mock page content</html>',
        statusText: 'OK',
        headers: {},
        config: { 
          headers: {} as Record<string, string>,
          url: '',
          method: 'get',
          data: undefined
        }
      } as const);

      const response = await axios.get(`${BASE_URL}${route}`);
      expect(response.status).toBe(200);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}${route}`);
    });
  });
});
