import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext';
import * as settingsStorage from '@/utils/settingsStorage';

// Mock the settingsStorage module
vi.mock('@/utils/settingsStorage', () => ({
  getApiBaseUrl: vi.fn(),
  setApiBaseUrl: vi.fn(),
  DEFAULT_API_BASE_URL: 'http://127.0.0.1:1000',
}));

describe('SettingsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(settingsStorage.getApiBaseUrl).mockReturnValue('http://127.0.0.1:1000');
  });

  describe('SettingsProvider', () => {
    it('should render children', () => {
      render(
        <SettingsProvider>
          <div>Test Child</div>
        </SettingsProvider>
      );
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should initialize with value from storage', () => {
      const customUrl = 'http://custom.com:8080';
      vi.mocked(settingsStorage.getApiBaseUrl).mockReturnValue(customUrl);

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.apiBaseUrl).toBe(customUrl);
    });

    it('should use default value when storage returns default', () => {
      vi.mocked(settingsStorage.getApiBaseUrl).mockReturnValue('http://127.0.0.1:1000');

      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.apiBaseUrl).toBe('http://127.0.0.1:1000');
    });
  });

  describe('useSettings hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useSettings());
      }).toThrow('useSettings must be used within a SettingsProvider');

      console.error = originalError;
    });

    it('should provide apiBaseUrl from context', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.apiBaseUrl).toBeDefined();
      expect(typeof result.current.apiBaseUrl).toBe('string');
    });

    it('should provide setApiBaseUrl function', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      expect(result.current.setApiBaseUrl).toBeDefined();
      expect(typeof result.current.setApiBaseUrl).toBe('function');
    });

    it('should update apiBaseUrl when setApiBaseUrl is called', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      const newUrl = 'http://new-api.com:9000';

      act(() => {
        result.current.setApiBaseUrl(newUrl);
      });

      expect(result.current.apiBaseUrl).toBe(newUrl);
    });

    it('should persist to storage when setApiBaseUrl is called', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      const newUrl = 'http://new-api.com:9000';

      act(() => {
        result.current.setApiBaseUrl(newUrl);
      });

      expect(settingsStorage.setApiBaseUrl).toHaveBeenCalledWith(newUrl);
      expect(settingsStorage.setApiBaseUrl).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple updates correctly', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: SettingsProvider,
      });

      const url1 = 'http://api1.com';
      const url2 = 'http://api2.com';
      const url3 = 'http://api3.com';

      act(() => {
        result.current.setApiBaseUrl(url1);
      });
      expect(result.current.apiBaseUrl).toBe(url1);

      act(() => {
        result.current.setApiBaseUrl(url2);
      });
      expect(result.current.apiBaseUrl).toBe(url2);

      act(() => {
        result.current.setApiBaseUrl(url3);
      });
      expect(result.current.apiBaseUrl).toBe(url3);

      expect(settingsStorage.setApiBaseUrl).toHaveBeenCalledTimes(3);
    });
  });
});
