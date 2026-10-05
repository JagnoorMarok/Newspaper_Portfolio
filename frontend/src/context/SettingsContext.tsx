import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

export interface Settings {
  id?: string;
  instagram: string;
  auction?: string;
  linkedin: string;
  github: string;
}

const defaultSettings: Settings = {
  id: 'global',
  instagram: 'https://instagram.com/jagnoormarok',
  auction: '',
  linkedin: 'https://linkedin.com/in/jagnoormarok',
  github: 'https://github.com/JagnoorMarok'
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          ...prev,
          ...data,
          instagram: data.instagram?.trim() || prev.instagram,
          linkedin: data.linkedin?.trim() || prev.linkedin,
          github: data.github?.trim() || prev.github,
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
