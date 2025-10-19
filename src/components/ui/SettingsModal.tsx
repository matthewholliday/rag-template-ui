import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { validateApiUrl } from '@/utils/urlValidator';
import Button from './Button';
import Input from './Input';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiBaseUrl, setApiBaseUrl } = useSettings();
  const [inputValue, setInputValue] = useState(apiBaseUrl);
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when apiBaseUrl changes
  useEffect(() => {
    if (isOpen) {
      setInputValue(apiBaseUrl);
      setError(undefined);
      setTouched(false);
    }
  }, [isOpen, apiBaseUrl]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Validate on change
    const validation = validateApiUrl(value);
    setError(validation.valid ? undefined : validation.error);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSave = () => {
    const validation = validateApiUrl(inputValue);
    if (!validation.valid) {
      setError(validation.error);
      setTouched(true);
      return;
    }

    try {
      setApiBaseUrl(inputValue);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validation = validateApiUrl(inputValue);
  const isValid = validation.valid;
  const showError = touched && error;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">Settings</h2>
        </div>

        <div className="modal-body">
          <Input
            ref={inputRef}
            id="api-base-url"
            label="API Base URL"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={showError ? error : undefined}
            placeholder="http://127.0.0.1:1000"
          />
        </div>

        <div className="modal-footer">
          <Button
            variant="secondary"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid}
            type="button"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
