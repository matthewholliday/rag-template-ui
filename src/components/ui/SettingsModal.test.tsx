import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsModal from './SettingsModal';
import { SettingsProvider } from '@/contexts/SettingsContext';
import * as settingsStorage from '@/utils/settingsStorage';

// Mock the settingsStorage module
vi.mock('@/utils/settingsStorage', () => ({
  getApiBaseUrl: vi.fn(() => 'http://127.0.0.1:1000'),
  setApiBaseUrl: vi.fn(),
  DEFAULT_API_BASE_URL: 'http://127.0.0.1:1000',
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SettingsProvider>{ui}</SettingsProvider>);
};

describe('SettingsModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClose.mockClear();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      renderWithProvider(<SettingsModal isOpen={false} onClose={mockOnClose} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('should render title', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render API Base URL input field', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByLabelText(/api base url/i)).toBeInTheDocument();
    });

    it('should render Save button', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should render Cancel button', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should display current API URL in input field', () => {
      const currentUrl = 'http://existing-api.com:8080';
      vi.mocked(settingsStorage.getApiBaseUrl).mockReturnValue(currentUrl);

      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const input = screen.getByLabelText(/api base url/i) as HTMLInputElement;
      expect(input.value).toBe(currentUrl);
    });
  });

  describe('closing behavior', () => {
    it('should call onClose when Cancel button is clicked', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const backdrop = screen.getByRole('dialog').parentElement;
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should not close when modal content is clicked', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose for other keys', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    it('should accept valid HTTP URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'http://valid-api.com:3000');

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should accept valid HTTPS URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'https://valid-api.com');

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should show error for invalid URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'not-a-valid-url');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
      });
    });

    it('should disable Save button for invalid URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'invalid');

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });

    it('should show error for empty URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    it('should disable Save button for empty URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });

    it('should clear error when valid URL is entered', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);

      // Enter invalid URL
      await user.clear(input);
      await user.type(input, 'invalid');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
      });

      // Enter valid URL
      await user.clear(input);
      await user.type(input, 'http://valid.com');

      await waitFor(() => {
        expect(screen.queryByText(/invalid url/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('save functionality', () => {
    it('should save valid URL and close modal', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      const newUrl = 'http://new-api.com:9000';

      await user.clear(input);
      await user.type(input, newUrl);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should not save invalid URL', async () => {
      const user = userEvent.setup();
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'invalid-url');

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();

      // Clicking disabled button should not close modal
      fireEvent.click(saveButton);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not close modal if save fails', async () => {
      const user = userEvent.setup();
      vi.mocked(settingsStorage.setApiBaseUrl).mockImplementation(() => {
        throw new Error('Storage error');
      });

      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);

      const input = screen.getByLabelText(/api base url/i);
      await user.clear(input);
      await user.type(input, 'http://valid.com');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Should not close on error
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should focus first interactive element when opened', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const input = screen.getByLabelText(/api base url/i);
      expect(document.activeElement).toBe(input);
    });

    it('should have proper button variants', () => {
      renderWithProvider(<SettingsModal isOpen={true} onClose={mockOnClose} />);
      const saveButton = screen.getByRole('button', { name: /save/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(saveButton).toHaveClass('btn-primary');
      expect(cancelButton).toHaveClass('btn-secondary');
    });
  });
});
