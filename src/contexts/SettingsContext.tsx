import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

interface SettingsEntry {
  value: string;
  label?: string;
}

type SettingsMap = Record<string, SettingsEntry>;

interface SettingsContextType {
  settings: SettingsMap;
  loading: boolean;
  get: (key: string) => string | undefined;
  getEntry: (key: string) => SettingsEntry | undefined;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  loading: true,
  get: () => undefined,
  getEntry: () => undefined,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children, prefix = '' }: { children: ReactNode; prefix?: string }) => {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const get = (key: string) => {
    const fullKey = prefix ? `${prefix}${key}` : key;
    return settings[fullKey]?.value;
  };

  const getEntry = (key: string) => {
    const fullKey = prefix ? `${prefix}${key}` : key;
    return settings[fullKey];
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, get, getEntry }}>
      {children}
    </SettingsContext.Provider>
  );
};
