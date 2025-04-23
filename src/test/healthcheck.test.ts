import axios from 'axios';
import { describe, it, expect } from 'vitest';

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