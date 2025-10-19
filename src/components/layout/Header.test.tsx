import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { SettingsProvider } from '@/contexts/SettingsContext';

// Mock the settingsStorage module
vi.mock('@/utils/settingsStorage', () => ({
  getApiBaseUrl: vi.fn(() => 'http://127.0.0.1:1000'),
  setApiBaseUrl: vi.fn(),
  DEFAULT_API_BASE_URL: 'http://127.0.0.1:1000',
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <SettingsProvider>
        <Header />
      </SettingsProvider>
    </BrowserRouter>
  );
};

describe('Header with Settings', () => {
  it('should render header with navigation links', () => {
    renderHeader();
    expect(screen.getByText('RAG Data Ingestion')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /upload/i })).toBeInTheDocument();
  });

  it('should render settings button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('should open settings modal when settings button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('should close settings modal when close is requested', async () => {
    const user = userEvent.setup();
    renderHeader();

    // Open modal
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    await user.click(settingsButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not render modal initially', () => {
    renderHeader();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
