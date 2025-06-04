/**
 * Utility function that executes an asynchronous task with linear retry logic.
 * It retries the provided function up to `attempts` times, waiting `delayMs`
 * milliseconds between attempts.
 *
 * @param fn - Asynchronous function to execute
 * @param attempts - Total number of attempts, defaults to 3
 * @param delayMs - Delay in milliseconds between attempts, defaults to 1000
 * @returns The result of the asynchronous function
 * @throws The last encountered error after exhausting all retries
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError as Error;
}
