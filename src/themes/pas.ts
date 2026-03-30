import type { WhiteLabelTheme } from './types';

/**
 * PAS — Policy Admin System WhiteLabel Persona
 * Electric violet/indigo palette inspired by modern aesthetic.
 * Light mode: crisp white with vivid violet accents.
 * Dark mode: deep space purple with electric highlights.
 */
export const pasTheme: WhiteLabelTheme = {
  light: {
    bg: '#f8f7fc',
    fg: '#1a1033',
    primary: '#7c3aed',
    primaryFg: '#ffffff',
    accent: '#a78bfa',
    accentFg: '#1a1033',
    muted: '#f0ecf9',
    mutedFg: '#6b5f8a',
    border: '#e0d8f0',
    card: '#ffffff',
    cardFg: '#1a1033',
    cardBorder: '#e8e0f5',
    success: '#22c55e',
    destructive: '#ef4444',
    warning: '#f59e0b',
    info: '#8b5cf6',
    chart1: '#7c3aed',
    chart2: '#06b6d4',
    chart3: '#e11d48',
    chart4: '#22c55e',
    chart5: '#f59e0b',
  },
  dark: {
    bg: '#110e1f',
    fg: '#ede9fc',
    primary: '#a78bfa',
    primaryFg: '#110e1f',
    accent: '#c4b5fd',
    accentFg: '#110e1f',
    muted: '#1e1a33',
    mutedFg: '#9387b8',
    border: '#2d2650',
    card: '#181430',
    cardFg: '#ede9fc',
    cardBorder: '#332b5e',
    success: '#34d399',
    destructive: '#f87171',
    warning: '#fbbf24',
    info: '#a78bfa',
    chart1: '#a78bfa',
    chart2: '#22d3ee',
    chart3: '#fb7185',
    chart4: '#4ade80',
    chart5: '#fbbf24',
  },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  radius: { sm: '6px', md: '12px', lg: '16px', xl: '24px' },
  fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
};
