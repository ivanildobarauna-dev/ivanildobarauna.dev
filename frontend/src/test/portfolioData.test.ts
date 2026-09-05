import { afterEach, describe, expect, it, vi } from 'vitest';

const snapshot = {
  projects: [],
  education: { formations: [], certifications: [] },
  socialMedia: [],
  experiences: [],
  companyDurations: [],
  totalExperience: { total_duration: '14 anos e 7 meses', asOf: '2026-09-05' },
  database: { tables: {} },
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('portfolio data helpers', () => {
  it('updates a duration from its snapshot date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-05T12:00:00'));
    const { advanceDurationFromSnapshot, formatDurationFromStart } = await import('@/utils/portfolioData');

    expect(advanceDurationFromSnapshot('14 anos e 7 meses', '2026-09-05')).toBe('14 anos e 8 meses');
    expect(formatDurationFromStart('2023-10-01')).toBe('3 anos');
  });

  it('retries the snapshot request after an earlier failure', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce({ ok: true, json: async () => snapshot });
    vi.stubGlobal('fetch', fetchMock);
    const { getPortfolioSnapshot } = await import('@/utils/portfolioData');

    await expect(getPortfolioSnapshot()).rejects.toThrow('network unavailable');
    await expect(getPortfolioSnapshot()).resolves.toEqual(snapshot);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
