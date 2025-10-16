import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getDocument, getDocumentChunks, processDocument, deleteDocument } from '@/services/api';
import type { Document, Chunk } from '@/types/api';
import './DocumentDetails.css';

const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');
        const [docData, chunksData] = await Promise.all([
          getDocument(id),
          getDocumentChunks(id),
        ]);
        setDocument(docData);
        setChunks(chunksData.chunks);
      } catch (err) {
        setError('Failed to load document. It may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReprocess = async () => {
    if (!id) return;

    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      await processDocument(id);
      setSuccess('Document reprocessing initiated successfully!');
      // Refresh document data after a short delay
      setTimeout(() => {
        if (id) getDocument(id).then(setDocument);
      }, 1000);
    } catch (err) {
      setError('Failed to reprocess document. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !document) return;

    if (!confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      return;
    }

    try {
      await deleteDocument(id);
      navigate('/documents');
    } catch (err) {
      setError('Failed to delete document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <LoadingSpinner />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Loading document...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div>
        <ErrorMessage message="Document not found" />
        <Link to="/documents" className="btn btn-secondary">Back to Documents</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{document.filename}</h1>
        <Link to="/documents" className="btn btn-secondary">Back to List</Link>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}

      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Document Information</h2>

        <div className="info-grid">
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`badge badge-${document.status}`}>{document.status}</span>
          </div>

          <div className="info-item">
            <strong>ID:</strong>
            <span>{document.id}</span>
          </div>

          <div className="info-item">
            <strong>Created:</strong>
            <span>{new Date(document.created_at).toLocaleString()}</span>
          </div>

          {document.updated_at && (
            <div className="info-item">
              <strong>Updated:</strong>
              <span>{new Date(document.updated_at).toLocaleString()}</span>
            </div>
          )}

          <div className="info-item">
            <strong>Chunks:</strong>
            <span>{document.chunk_count || 0}</span>
          </div>
        </div>

        {document.metadata && (
          <>
            <h3 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
              Metadata
            </h3>
            {document.metadata.title && (
              <p><strong>Title:</strong> {document.metadata.title}</p>
            )}
            {document.metadata.description && (
              <p><strong>Description:</strong> {document.metadata.description}</p>
            )}
            {document.metadata.tags && document.metadata.tags.length > 0 && (
              <p>
                <strong>Tags:</strong>{' '}
                {document.metadata.tags.map((tag) => (
                  <span key={tag} className="badge badge-secondary" style={{ marginRight: 'var(--spacing-xs)' }}>
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </>
        )}

        <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button
            variant="primary"
            onClick={handleReprocess}
            loading={processing}
            disabled={processing}
          >
            {processing ? 'Reprocessing...' : 'Reprocess Document'}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Document
          </Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
          Chunks ({chunks.length})
        </h2>

        {chunks.length === 0 ? (
          <p>No chunks available. The document may still be processing.</p>
        ) : (
          <div className="chunks-list">
            {chunks.map((chunk) => (
              <div key={chunk.id} className="chunk-item">
                <div className="chunk-header">
                  <span className="chunk-position">Chunk {chunk.position + 1}</span>
                  {chunk.metadata?.page && (
                    <span className="chunk-meta">Page {chunk.metadata.page}</span>
                  )}
                  {chunk.metadata?.section && (
                    <span className="chunk-meta">{chunk.metadata.section}</span>
                  )}
                </div>
                <div className="chunk-content">{chunk.content}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentDetails;
