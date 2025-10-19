import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getApiBaseUrl, setApiBaseUrl, DEFAULT_API_BASE_URL } from './settingsStorage';

describe('settingsStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getApiBaseUrl', () => {
    it('should return default URL when localStorage is empty', () => {
      expect(getApiBaseUrl()).toBe(DEFAULT_API_BASE_URL);
    });

    it('should return stored URL when it exists', () => {
      const customUrl = 'http://custom-api.com:8080';
      localStorage.setItem('apiBaseUrl', customUrl);
      expect(getApiBaseUrl()).toBe(customUrl);
    });

    it('should return default URL when localStorage throws error', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      expect(getApiBaseUrl()).toBe(DEFAULT_API_BASE_URL);
      spy.mockRestore();
    });

    it('should return default URL when stored value is null', () => {
      expect(getApiBaseUrl()).toBe(DEFAULT_API_BASE_URL);
    });
  });

  describe('setApiBaseUrl', () => {
    it('should save URL to localStorage', () => {
      const newUrl = 'http://new-api.com:3000';
      setApiBaseUrl(newUrl);
      expect(localStorage.getItem('apiBaseUrl')).toBe(newUrl);
    });

    it('should overwrite existing URL', () => {
      localStorage.setItem('apiBaseUrl', 'http://old-url.com');
      const newUrl = 'http://new-url.com';
      setApiBaseUrl(newUrl);
      expect(localStorage.getItem('apiBaseUrl')).toBe(newUrl);
    });

    it('should handle localStorage quota exceeded error', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      // Should not throw error
      expect(() => setApiBaseUrl('http://test.com')).not.toThrow();
      spy.mockRestore();
    });

    it('should handle localStorage disabled error', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });
      // Should not throw error
      expect(() => setApiBaseUrl('http://test.com')).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('DEFAULT_API_BASE_URL', () => {
    it('should be defined as http://127.0.0.1:1000', () => {
      expect(DEFAULT_API_BASE_URL).toBe('http://127.0.0.1:1000');
    });
  });
});
