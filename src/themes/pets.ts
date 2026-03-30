import type { WhiteLabelTheme } from './types';

/**
 * Pets — Pet WhiteLabel Persona
 * Fresh teal/mint palette inspired by Pet  Squad's vibrant turquoise branding.
 * Light mode: airy off-white with teal pop.
 * Dark mode: deep oceanic blue-green.
 */
export const petsTheme: WhiteLabelTheme = {
  light: {
    bg: '#f4fafa',
    fg: '#0d1b1e',
    primary: '#0e9aa7',
    primaryFg: '#ffffff',
    accent: '#3dc1d3',
    accentFg: '#0d1b1e',
    muted: '#e6f5f5',
    mutedFg: '#5a7c7f',
    border: '#cce8e8',
    card: '#ffffff',
    cardFg: '#0d1b1e',
    cardBorder: '#d8eded',
    success: '#22c55e',
    destructive: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    chart1: '#0891b2',
    chart2: '#f59e0b',
    chart3: '#e11d48',
    chart4: '#22c55e',
    chart5: '#8b5cf6',
  },
  dark: {
    bg: '#0d1b1e',
    fg: '#e8f4f4',
    primary: '#2ec4b6',
    primaryFg: '#0d1b1e',
    accent: '#3dc1d3',
    accentFg: '#0d1b1e',
    muted: '#1a2e32',
    mutedFg: '#7fb8b8',
    border: '#243a3e',
    card: '#142428',
    cardFg: '#e8f4f4',
    cardBorder: '#2a4448',
    success: '#34d399',
    destructive: '#f87171',
    warning: '#fbbf24',
    info: '#22d3ee',
    chart1: '#22d3ee',
    chart2: '#fbbf24',
    chart3: '#fb7185',
    chart4: '#4ade80',
    chart5: '#a78bfa',
  },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  radius: { sm: '8px', md: '12px', lg: '18px', xl: '28px' },
  fontFamily: "'Filson Pro', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};
