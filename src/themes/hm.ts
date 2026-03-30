import type { WhiteLabelTheme } from './types';

/**
 * H&M — Home & Motor WhiteLabel Persona
 *
 * Distinctive golden amber brand identity.
 * Primary: Rich golden (#F5A623 / #FFB800)
 * Dark backgrounds with warm charcoal tones.
 * Clear chart color differentiation for pipeline environments.
 */
export const hmTheme: WhiteLabelTheme = {
  light: {
    bg: '#fdfaf5',
    fg: '#1c1917',
    primary: '#e5a100',
    primaryFg: '#1c1917',
    accent: '#f5c542',
    accentFg: '#1c1917',
    muted: '#f5f0e6',
    mutedFg: '#78716c',
    border: '#e7e0d2',
    card: '#ffffff',
    cardFg: '#1c1917',
    cardBorder: '#ede6d8',
    success: '#22c55e',
    destructive: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6',
    // Chart chart1=Dev(blue), chart2=Staging(amber), chart3=Prod(red)
    // Maximised contrast for pipeline duration clarity
    chart1: '#2563eb', // vivid blue — Dev
    chart2: '#e5a100', // golden honey — Staging
    chart3: '#dc2626', // strong red — Prod
    chart4: '#16a34a', // green
    chart5: '#9333ea', // purple
  },
  dark: {
    bg: '#171310',
    fg: '#faf5eb',
    primary: '#f5b731',
    primaryFg: '#171310',
    accent: '#f5c542',
    accentFg: '#171310',
    muted: '#292420',
    mutedFg: '#a8a29e',
    border: '#3d3630',
    card: '#211d18',
    cardFg: '#faf5eb',
    cardBorder: '#3d3630',
    success: '#4ade80',
    destructive: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    // Dark mode — same hue logic, lighter for contrast on dark bg
    chart1: '#60a5fa', // light blue — Dev
    chart2: '#fbbf24', // bright amber — Staging
    chart3: '#f87171', // salmon red — Prod
    chart4: '#4ade80', // green
    chart5: '#c084fc', // lavender
  },
  spacing: { sm: '8px', md: '16px', lg: '24px' },
  radius: { sm: '6px', md: '10px', lg: '16px', xl: '24px' },
  fontFamily: "'Söhne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};
