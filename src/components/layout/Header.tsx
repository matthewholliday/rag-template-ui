import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from '@/components/ui/SettingsModal';
import './Header.css';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            RAG Data Ingestion
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
            <li>
              <Link to="/documents">Documents</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <button
                onClick={handleOpenSettings}
                className="settings-button"
                aria-label="Settings"
              >
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </header>
  );
};

export default Header;
