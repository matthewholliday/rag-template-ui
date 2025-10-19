import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getApiBaseUrl, setApiBaseUrl as saveApiBaseUrl } from '@/utils/settingsStorage';

interface SettingsContextType {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(() => getApiBaseUrl());

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
    saveApiBaseUrl(url);
  };

  return (
    <SettingsContext.Provider value={{ apiBaseUrl, setApiBaseUrl }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
