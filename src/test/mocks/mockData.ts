import type { Document, Chunk, QueryResult } from '@/types/api';

export const mockDocument: Document = {
  id: 'doc_123abc',
  filename: 'test-document.pdf',
  status: 'completed',
  metadata: {
    title: 'Test Document',
    description: 'A test document for unit testing',
    tags: ['test', 'sample'],
  },
  created_at: '2025-10-16T12:00:00Z',
  updated_at: '2025-10-16T12:05:00Z',
  chunk_count: 5,
};

export const mockDocuments: Document[] = [
  mockDocument,
  {
    id: 'doc_456def',
    filename: 'another-doc.pdf',
    status: 'processing',
    metadata: {
      title: 'Another Document',
    },
    created_at: '2025-10-16T13:00:00Z',
    updated_at: '2025-10-16T13:01:00Z',
    chunk_count: 0,
  },
  {
    id: 'doc_789ghi',
    filename: 'failed-doc.pdf',
    status: 'failed',
    metadata: {},
    created_at: '2025-10-16T14:00:00Z',
    updated_at: '2025-10-16T14:02:00Z',
    chunk_count: 0,
  },
];

export const mockChunk: Chunk = {
  id: 'chunk_001',
  document_id: 'doc_123abc',
  content: 'This is the first chunk of the document containing important information about RAG.',
  position: 0,
  metadata: {
    page: 1,
    section: 'Introduction',
  },
};

export const mockChunks: Chunk[] = [
  mockChunk,
  {
    id: 'chunk_002',
    document_id: 'doc_123abc',
    content: 'This is the second chunk with more information about retrieval-augmented generation.',
    position: 1,
    metadata: {
      page: 1,
      section: 'Introduction',
    },
  },
  {
    id: 'chunk_003',
    document_id: 'doc_123abc',
    content: 'Third chunk discussing semantic search and embeddings.',
    position: 2,
    metadata: {
      page: 2,
      section: 'Technical Details',
    },
  },
];

export const mockQueryResult: QueryResult = {
  chunk: mockChunk,
  score: 0.87,
  document: {
    id: 'doc_123abc',
    filename: 'test-document.pdf',
    metadata: {
      title: 'Test Document',
    },
  },
};

export const mockQueryResults: QueryResult[] = [
  mockQueryResult,
  {
    chunk: {
      id: 'chunk_004',
      document_id: 'doc_456def',
      content: 'Information about vector databases and similarity search.',
      position: 5,
      metadata: {},
    },
    score: 0.75,
    document: {
      id: 'doc_456def',
      filename: 'another-doc.pdf',
      metadata: {
        title: 'Another Document',
      },
    },
  },
];
