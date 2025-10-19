import { describe, it, expect } from 'vitest';
import { validateApiUrl } from './urlValidator';

describe('urlValidator', () => {
  describe('validateApiUrl', () => {
    describe('valid URLs', () => {
      it('should validate HTTP URL with port', () => {
        const result = validateApiUrl('http://127.0.0.1:1000');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate HTTPS URL with port', () => {
        const result = validateApiUrl('https://api.example.com:8080');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate HTTP URL without port', () => {
        const result = validateApiUrl('http://localhost');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate HTTPS URL without port', () => {
        const result = validateApiUrl('https://api.example.com');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate URL with path', () => {
        const result = validateApiUrl('http://api.example.com/v1');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate URL with trailing slash', () => {
        const result = validateApiUrl('http://api.example.com/');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate localhost with port', () => {
        const result = validateApiUrl('http://localhost:3000');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate IP address', () => {
        const result = validateApiUrl('http://192.168.1.1:8080');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('invalid URLs', () => {
      it('should reject empty string', () => {
        const result = validateApiUrl('');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('required');
      });

      it('should reject URL without protocol', () => {
        const result = validateApiUrl('api.example.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should reject FTP protocol', () => {
        const result = validateApiUrl('ftp://api.example.com');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('http');
      });

      it('should reject file protocol', () => {
        const result = validateApiUrl('file:///path/to/file');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('http');
      });

      it('should reject malformed URL', () => {
        const result = validateApiUrl('http://');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should reject URL with spaces', () => {
        const result = validateApiUrl('http://api example.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should reject invalid characters', () => {
        const result = validateApiUrl('http://api<>.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should reject just whitespace', () => {
        const result = validateApiUrl('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('edge cases', () => {
      it('should handle URL with query parameters', () => {
        const result = validateApiUrl('http://api.example.com?key=value');
        expect(result.valid).toBe(true);
      });

      it('should handle URL with fragment', () => {
        const result = validateApiUrl('http://api.example.com#section');
        expect(result.valid).toBe(true);
      });

      it('should trim whitespace', () => {
        const result = validateApiUrl('  http://api.example.com  ');
        expect(result.valid).toBe(true);
      });
    });
  });
});
