import type { WhiteLabelTheme } from './types';

/**
 * Partners WhiteLabel Persona
 * Professional navy & gold palette.
 * Light mode: clean white with deep navy accents and gold highlights.
 * Dark mode: midnight navy with warm gold.
 */
export const partnersTheme: WhiteLabelTheme = {
  light: {
    bg: '#f6f7fb',
    fg: '#0f172a',
    primary: '#1e3a5f',
    primaryFg: '#ffffff',
    accent: '#d4a843',
    accentFg: '#0f172a',
    muted: '#ebeef5',
    mutedFg: '#64748b',
    border: '#d8dde8',
    card: '#ffffff',
    cardFg: '#0f172a',
    cardBorder: '#e2e6ef',
    success: '#10b981',
    destructive: '#ef4444',
    warning: '#d4a843',
    info: '#3b82f6',
    chart1: '#2563eb',
    chart2: '#d4a843',
    chart3: '#dc2626',
    chart4: '#10b981',
    chart5: '#8b5cf6',
  },
  dark: {
    bg: '#0b1120',
    fg: '#e2e8f0',
    primary: '#4a8eda',
    primaryFg: '#0b1120',
    accent: '#e8c468',
    accentFg: '#0b1120',
    muted: '#1a2744',
    mutedFg: '#8b9cc0',
    border: '#253454',
    card: '#111d38',
    cardFg: '#e2e8f0',
    cardBorder: '#2a3d64',
    success: '#34d399',
    destructive: '#f87171',
    warning: '#e8c468',
    info: '#60a5fa',
    chart1: '#60a5fa',
    chart2: '#e8c468',
    chart3: '#f87171',
    chart4: '#34d399',
    chart5: '#c084fc',
  },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '20px' },
  fontFamily: "'Geologica', 'Inter', system-ui, -apple-system, sans-serif",
};
