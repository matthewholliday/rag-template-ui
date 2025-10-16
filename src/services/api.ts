import type {
  Document,
  DocumentListResponse,
  DocumentMetadata,
  ChunksResponse,
  QueryResponse,
  StatusResponse,
  ProcessResponse,
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(response.status, errorMessage);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getStatus(): Promise<StatusResponse> {
  const response = await fetch(`${API_BASE_URL}/status`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse<StatusResponse>(response);
}

export async function listDocuments(
  limit: number = 20,
  offset: number = 0
): Promise<DocumentListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/documents?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );
  return handleResponse<DocumentListResponse>(response);
}

export async function getDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse<Document>(response);
}

export async function uploadDocument(
  file: File,
  metadata?: DocumentMetadata
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<Document>(response);
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function processDocument(id: string): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}/process`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse<ProcessResponse>(response);
}

export async function getDocumentChunks(id: string): Promise<ChunksResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}/chunks`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse<ChunksResponse>(response);
}

export async function queryDocuments(
  query: string,
  limit: number = 5
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, limit }),
  });
  return handleResponse<QueryResponse>(response);
}
