import { createContext } from 'react';
export type ThemeMode = 'light' | 'dark';

export interface ThemeProviderState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  whiteLabel: string;
  setWhiteLabel: (whiteLabel: string) => void;
}

export const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
  whiteLabel: 'hm',
  setWhiteLabel: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
