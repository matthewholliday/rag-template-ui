import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentUpload from './DocumentUpload';
import * as api from '@/services/api';
import { mockDocument } from '@/test/mocks/mockData';

vi.mock('@/services/api');

describe('DocumentUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload form', () => {
    render(<DocumentUpload />);

    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/file/i) as HTMLInputElement;

    await user.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  it('should submit form with file and metadata', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockResolvedValue(mockDocument);

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/file/i);
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.upload(fileInput, file);
    await user.type(titleInput, 'Test Document');
    await user.type(descriptionInput, 'A test document');

    const submitButton = screen.getByRole('button', { name: /upload/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.uploadDocument).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          title: 'Test Document',
          description: 'A test document',
        })
      );
    });
  });

  it('should show success message after upload', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockResolvedValue(mockDocument);

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });
  });

  it('should show error message on upload failure', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockRejectedValue(new Error('Upload failed'));

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during upload', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockDocument), 100))
    );

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/file/i), file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled();
  });

  it('should clear form after successful upload', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockResolvedValue(mockDocument);

    render(<DocumentUpload />);

    const fileInput = screen.getByLabelText(/file/i) as HTMLInputElement;
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(fileInput, file);
    await user.type(titleInput, 'Test Document');
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(fileInput.files).toHaveLength(0);
      expect(titleInput.value).toBe('');
    });
  });

  it('should validate required file field', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload />);

    await user.click(screen.getByRole('button', { name: /upload/i }));

    expect(api.uploadDocument).not.toHaveBeenCalled();
    expect(screen.getByText(/file is required/i)).toBeInTheDocument();
  });

  it('should handle tags input', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadDocument).mockResolvedValue(mockDocument);

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/file/i), file);

    const tagsInput = screen.getByLabelText(/tags/i);
    await user.type(tagsInput, 'tag1, tag2, tag3');

    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(api.uploadDocument).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          tags: ['tag1', 'tag2', 'tag3'],
        })
      );
    });
  });
});
