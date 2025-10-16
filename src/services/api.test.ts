import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as api from './api';
import { mockDocument, mockDocuments, mockChunks, mockQueryResults } from '@/test/mocks/mockData';

describe('API Client', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  describe('getStatus', () => {
    it('should fetch API status', async () => {
      const mockResponse = { status: 'ok', timestamp: '2025-10-16T12:00:00Z' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getStatus();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/status'),
        expect.any(Object)
      );
    });

    it('should handle errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(api.getStatus()).rejects.toThrow();
    });
  });

  describe('listDocuments', () => {
    it('should fetch documents with pagination', async () => {
      const mockResponse = {
        documents: mockDocuments,
        total: 3,
        limit: 20,
        offset: 0,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.listDocuments(20, 0);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/documents?limit=20&offset=0'),
        expect.any(Object)
      );
    });
  });

  describe('getDocument', () => {
    it('should fetch single document by ID', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocument,
      });

      const result = await api.getDocument('doc_123abc');
      expect(result).toEqual(mockDocument);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/documents/doc_123abc'),
        expect.any(Object)
      );
    });

    it('should handle 404 not found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(api.getDocument('nonexistent')).rejects.toThrow();
    });
  });

  describe('uploadDocument', () => {
    it('should upload file with metadata', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const metadata = { title: 'Test', description: 'Test doc', tags: ['test'] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocument,
      });

      const result = await api.uploadDocument(file, metadata);
      expect(result).toEqual(mockDocument);

      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/documents');
      expect(fetchCall[1].method).toBe('POST');
      expect(fetchCall[1].body).toBeInstanceOf(FormData);
    });

    it('should handle upload errors', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(api.uploadDocument(file)).rejects.toThrow();
    });
  });

  describe('deleteDocument', () => {
    it('should delete document by ID', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.deleteDocument('doc_123abc');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/documents/doc_123abc'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('processDocument', () => {
    it('should trigger document reprocessing', async () => {
      const mockResponse = { status: 'processing', message: 'Processing initiated' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.processDocument('doc_123abc');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/documents/doc_123abc/process'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('getDocumentChunks', () => {
    it('should fetch document chunks', async () => {
      const mockResponse = { chunks: mockChunks, total: 3 };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getDocumentChunks('doc_123abc');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/documents/doc_123abc/chunks'),
        expect.any(Object)
      );
    });
  });

  describe('queryDocuments', () => {
    it('should search documents with query', async () => {
      const query = 'What is RAG?';
      const mockResponse = { results: mockQueryResults, query };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.queryDocuments(query, 5);
      expect(result).toEqual(mockResponse);

      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/query');
      expect(fetchCall[1].method).toBe('POST');
      expect(fetchCall[1].headers['Content-Type']).toBe('application/json');
    });

    it('should handle empty results', async () => {
      const mockResponse = { results: [], query: 'nonexistent query' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.queryDocuments('nonexistent query');
      expect(result.results).toHaveLength(0);
    });
  });
});
