export const DEFAULT_API_BASE_URL = 'http://127.0.0.1:1000';

const STORAGE_KEY = 'apiBaseUrl';

/**
 * Get the API base URL from localStorage or return the default
 */
export function getApiBaseUrl(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_API_BASE_URL;
  } catch (error) {
    // localStorage might not be available (private browsing, etc.)
    console.warn('Failed to read from localStorage:', error);
    return DEFAULT_API_BASE_URL;
  }
}

/**
 * Save the API base URL to localStorage
 */
export function setApiBaseUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url);
  } catch (error) {
    // localStorage might be full or unavailable
    console.error('Failed to save to localStorage:', error);
    // Don't throw - we want the app to continue working even if persistence fails
  }
}
