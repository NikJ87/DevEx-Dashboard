import { useEffect, useState } from 'react';
import { applyTheme } from '@/themes';
import { ThemeProviderContext, type ThemeMode } from './themeContext';

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'devex-theme-mode',
  whiteLabelStorageKey = 'devex-white-label',
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  whiteLabelStorageKey?: string;
}) {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem(storageKey) as ThemeMode) || defaultTheme,
  );
  const [whiteLabel, setWhiteLabel] = useState<string>(
    () => localStorage.getItem(whiteLabelStorageKey) || 'hm',
  );

  useEffect(() => {
    applyTheme(whiteLabel, theme);
  }, [whiteLabel, theme]);

  const value = {
    theme,
    whiteLabel,
    setTheme: (newTheme: ThemeMode) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    setWhiteLabel: (newWhiteLabel: string) => {
      localStorage.setItem(whiteLabelStorageKey, newWhiteLabel);
      setWhiteLabel(newWhiteLabel);
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
