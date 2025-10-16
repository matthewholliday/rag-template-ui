import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getStatus } from '@/services/api';
import type { StatusResponse } from '@/types/api';

const Home: React.FC = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await getStatus();
        setStatus(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch API status. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>RAG Data Ingestion System</h1>

      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>API Status</h2>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {status && (
          <div>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${status.status === 'ok' ? 'completed' : 'failed'}`}>
                {status.status}
              </span>
            </p>
            <p style={{ marginTop: 'var(--spacing-sm)' }}>
              <strong>Last checked:</strong> {new Date(status.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <Link to="/upload" className="btn btn-primary">
            Upload Document
          </Link>
          <Link to="/documents" className="btn btn-secondary">
            View Documents
          </Link>
          <Link to="/search" className="btn btn-secondary">
            Search Documents
          </Link>
        </div>
      </Card>

      <Card>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>About</h2>
        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
          This is a Retrieval-Augmented Generation (RAG) data ingestion system that allows you to:
        </p>
        <ul style={{ marginLeft: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
          <li>Upload and process documents</li>
          <li>Automatically chunk documents for efficient retrieval</li>
          <li>Perform semantic search across your document library</li>
          <li>Manage and monitor document processing status</li>
        </ul>
        <p>Get started by uploading your first document!</p>
      </Card>
    </div>
  );
};

export default Home;
