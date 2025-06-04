/**
 * Tests for the retryAsync utility function.
 */
import { describe, it, expect, vi } from 'vitest';
import { retryAsync } from '../utils/retryAsync';

describe('retryAsync', () => {
  it('should resolve after retries succeed', async () => {
    let attempts = 0;
    const task = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('fail'));
      }
      return Promise.resolve('ok');
    });

    const result = await retryAsync(task, 3, 10);
    expect(result).toBe('ok');
    expect(task).toHaveBeenCalledTimes(3);
  });

  it('should throw the last error after exhausting attempts', async () => {
    const task = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(retryAsync(task, 3, 10)).rejects.toThrow('fail');
    expect(task).toHaveBeenCalledTimes(3);
  });
});
