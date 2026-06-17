/**
 * Retry utility for handling transient failures
 * Implements exponential backoff for retryable errors
 */

export const isRetryableError = (error) => {
  // Network errors
  if (error.code === 'ECONNABORTED') return true;
  if (error.message === 'Network Error') return true;
  if (error.isNetworkError) return true;
  
  // Service unavailable or gateway errors
  if (error.response?.status === 503) return true;
  if (error.response?.status === 502) return true;
  if (error.response?.status === 504) return true;
  if (error.response?.status === 429) return true; // Too many requests
  
  // Timeout
  if (error.code === 'ECONNABORTED') return true;
  
  return false;
};

export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry non-retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate exponential backoff delay
      const jitter = Math.floor(Math.random() * 250);
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt),
        maxDelay
      ) + jitter;
      
      console.warn(
        `[Retry] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
        error.message
      );
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export default retryWithBackoff;
