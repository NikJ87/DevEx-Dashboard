import { useContext } from 'react';
import { ThemeProviderContext } from '@/app/providers/themeContext';

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
