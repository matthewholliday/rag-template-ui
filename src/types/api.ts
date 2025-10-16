// API Types based on OpenAPI specification

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DocumentMetadata {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface Document {
  id: string;
  filename: string;
  status: DocumentStatus;
  metadata?: DocumentMetadata;
  created_at: string;
  updated_at?: string;
  chunk_count?: number;
}

export interface ChunkMetadata {
  page?: number;
  section?: string;
}

export interface Chunk {
  id: string;
  document_id: string;
  content: string;
  position: number;
  metadata?: ChunkMetadata;
}

export interface QueryResult {
  chunk: Chunk;
  score: number;
  document: {
    id: string;
    filename: string;
    metadata?: DocumentMetadata;
  };
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChunksResponse {
  chunks: Chunk[];
  total: number;
}

export interface QueryResponse {
  results: QueryResult[];
  query: string;
}

export interface StatusResponse {
  status: string;
  timestamp: string;
}

export interface ProcessResponse {
  status: string;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
