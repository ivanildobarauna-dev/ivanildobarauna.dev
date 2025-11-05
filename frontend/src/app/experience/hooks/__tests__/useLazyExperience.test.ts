import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useLazyExperience } from '../useLazyExperience';

vi.mock('@/utils/backend_endpoint', () => ({
  getBackendEndpoint: vi.fn(() => 'http://localhost/experiences'),
}));

vi.mock('@/utils/retryAsync', () => ({
  retryAsync: vi.fn(async (fn: () => Promise<unknown>) => fn()),
}));

const originalFetch = global.fetch;

describe('useLazyExperience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  /**
   * Confirms the hook fetches experience data successfully and caches the result.
   */
  it('should fetch and group experiences, marking the hook as fetched', async () => {
    const mockExperiences = [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Developer',
        description: ['Building features'],
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        current: false,
        companyLogo: 'https://tech.example.com/logo.png',
        website: 'https://tech.example.com',
        location: 'Remote',
        period: '2020 - 2021',
        duration: '1 ano',
        skills: 'TypeScript;React',
      },
      {
        id: '2',
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: ['Leading projects'],
        startDate: '2021-02-01',
        endDate: '2022-02-01',
        current: false,
        companyLogo: 'https://tech.example.com/logo.png',
        website: 'https://tech.example.com',
        location: 'Remote',
        period: '2021 - 2022',
        duration: '1 ano',
        skills: 'Node.js;Leadership',
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockExperiences,
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    const { result } = renderHook(() => useLazyExperience());

    await act(async () => {
      const success = await result.current.fetchExperiences();
      expect(success).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.hasFetched).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.experiences['Tech Corp']).toHaveLength(2);
    expect(result.current.tempoTotalCarreira.length).toBeGreaterThan(0);
  });

  /**
   * Validates the hook surfaces an error when the backend request fails.
   */
  it('should handle fetch failures and keep hasFetched as false', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    const { result } = renderHook(() => useLazyExperience());

    await act(async () => {
      const success = await result.current.fetchExperiences();
      expect(success).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.hasFetched).toBe(false);
    expect(result.current.error).toContain('Falha ao carregar as experiências');

    consoleSpy.mockRestore();
  });
});
