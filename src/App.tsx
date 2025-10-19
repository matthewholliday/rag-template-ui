import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import DocumentUpload from '@/pages/DocumentUpload';
import DocumentList from '@/pages/DocumentList';
import DocumentDetails from '@/pages/DocumentDetails';
import Search from '@/pages/Search';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={
              <div>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;
