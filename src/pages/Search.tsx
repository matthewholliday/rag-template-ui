import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { queryDocuments } from '@/services/api';
import type { QueryResult } from '@/types/api';
import './Search.css';

interface SearchFormData {
  query: string;
  limit: number;
}

const Search: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    defaultValues: { limit: 5 },
  });
  const [results, setResults] = useState<QueryResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onSubmit = async (data: SearchFormData) => {
    try {
      setSearching(true);
      setError('');
      const response = await queryDocuments(data.query, data.limit);
      setResults(response.results);
      setSearchQuery(data.query);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'var(--color-success)';
    if (score >= 0.6) return 'var(--color-warning)';
    return 'var(--color-secondary)';
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Semantic Search</h1>

      <Card>
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="query"
            label="Search Query"
            placeholder="Enter your search query..."
            {...register('query', { required: 'Query is required' })}
            error={errors.query?.message}
          />

          <div className="form-group">
            <label className="label" htmlFor="limit">
              Results Limit
            </label>
            <select
              id="limit"
              className="input"
              {...register('limit', { valueAsNumber: true })}
            >
              <option value={5}>5 results</option>
              <option value={10}>10 results</option>
              <option value={20}>20 results</option>
              <option value={50}>50 results</option>
            </select>
          </div>

          <Button type="submit" loading={searching} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Card>

      {searchQuery && (
        <Card>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
            Results for "{searchQuery}" ({results.length})
          </h2>

          {results.length === 0 ? (
            <p>No results found. Try a different query.</p>
          ) : (
            <div className="results-list">
              {results.map((result, index) => (
                <div key={`${result.chunk.id}-${index}`} className="result-item">
                  <div className="result-header">
                    <div>
                      <Link
                        to={`/documents/${result.document.id}`}
                        className="document-link"
                      >
                        {result.document.filename}
                      </Link>
                      {result.document.metadata?.title && (
                        <div className="document-subtitle">
                          {result.document.metadata.title}
                        </div>
                      )}
                    </div>
                    <div className="score-container">
                      <div className="score-label">Score: {(result.score * 100).toFixed(1)}%</div>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${result.score * 100}%`,
                            backgroundColor: getScoreColor(result.score),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="chunk-content">{result.chunk.content}</div>

                  <div className="chunk-meta">
                    {result.chunk.metadata?.page && (
                      <span>Page {result.chunk.metadata.page}</span>
                    )}
                    {result.chunk.metadata?.section && (
                      <span>{result.chunk.metadata.section}</span>
                    )}
                    <span>Position: {result.chunk.position + 1}</span>
                  </div>

                  <Link
                    to={`/documents/${result.document.id}`}
                    className="btn btn-secondary"
                    style={{ marginTop: 'var(--spacing-md)', display: 'inline-block' }}
                  >
                    View Document
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Search;
