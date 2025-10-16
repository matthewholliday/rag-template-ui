import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { listDocuments, deleteDocument } from '@/services/api';
import type { Document } from '@/types/api';
import './DocumentList.css';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const limit = 20;

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listDocuments(limit, offset);
      setDocuments(data.documents);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [offset]);

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      setDeleting(id);
      await deleteDocument(id);
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handlePrevious = () => {
    setOffset(Math.max(0, offset - limit));
  };

  const handleNext = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return `badge badge-${status}`;
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Documents</h1>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <LoadingSpinner />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Loading documents...</p>
          </div>
        </Card>
      ) : documents.length === 0 ? (
        <Card>
          <p>No documents found. <Link to="/upload">Upload your first document</Link>.</p>
        </Card>
      ) : (
        <>
          <Card>
            <div className="table-container">
              <table className="document-table">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Status</th>
                    <th>Chunks</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <Link to={`/documents/${doc.id}`} className="document-link">
                          {doc.filename}
                        </Link>
                        {doc.metadata?.title && (
                          <div className="document-subtitle">{doc.metadata.title}</div>
                        )}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(doc.status)}>
                          {doc.status}
                        </span>
                      </td>
                      <td>{doc.chunk_count || 0}</td>
                      <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(doc.id, doc.filename)}
                          disabled={deleting === doc.id}
                          loading={deleting === doc.id}
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="pagination">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={offset === 0}
            >
              Previous
            </Button>
            <span>
              Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
            </span>
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={offset + limit >= total}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentList;
