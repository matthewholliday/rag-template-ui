import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Search from './Search';
import * as api from '@/services/api';
import { mockQueryResults } from '@/test/mocks/mockData';

vi.mock('@/services/api');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search form', () => {
    renderWithRouter(<Search />);

    expect(screen.getByPlaceholderText(/enter your search query/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/results limit/i)).toBeInTheDocument();
  });

  it('should submit search query', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: mockQueryResults,
      query: 'What is RAG?',
    });

    renderWithRouter(<Search />);

    const input = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(input, 'What is RAG?');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.queryDocuments).toHaveBeenCalledWith('What is RAG?', 5);
    });
  });

  it('should display search results', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: mockQueryResults,
      query: 'What is RAG?',
    });

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'What is RAG?');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/test-document\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/score.*0\.87/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no results', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: [],
      query: 'nonexistent',
    });

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'nonexistent');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during search', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ results: [], query: '' }), 100))
    );

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'test');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  it('should show error message on search failure', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockRejectedValue(new Error('Search failed'));

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'test');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });

  it('should allow changing results limit', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: mockQueryResults,
      query: 'test',
    });

    renderWithRouter(<Search />);

    const limitSelect = screen.getByLabelText(/results limit/i);
    await user.selectOptions(limitSelect, '10');

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'test');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.queryDocuments).toHaveBeenCalledWith('test', 10);
    });
  });

  it('should link to document details from results', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: mockQueryResults,
      query: 'test',
    });

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'test');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /view document/i });
      expect(link).toHaveAttribute('href', '/documents/doc_123abc');
    });
  });

  it('should validate query is not empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Search />);

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(api.queryDocuments).not.toHaveBeenCalled();
    expect(screen.getByText(/query is required/i)).toBeInTheDocument();
  });

  it('should display chunk content in results', async () => {
    const user = userEvent.setup();
    vi.mocked(api.queryDocuments).mockResolvedValue({
      results: mockQueryResults,
      query: 'RAG',
    });

    renderWithRouter(<Search />);

    await user.type(screen.getByPlaceholderText(/enter your search query/i), 'RAG');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/This is the first chunk of the document/i)
      ).toBeInTheDocument();
    });
  });
});
