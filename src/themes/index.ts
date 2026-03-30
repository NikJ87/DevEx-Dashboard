import { hmTheme } from './hm';
import { petsTheme } from './pets';
import { partnersTheme } from './partners';
import { pasTheme } from './pas';
import type { WhiteLabelTheme } from './types';
import { logEvent } from '@/analytics';

export const whiteLabelThemes: Record<string, WhiteLabelTheme> = {
  hm: hmTheme,
  pets: petsTheme,
  partners: partnersTheme,
  pas: pasTheme,
};

export const applyTheme = (themeName: string, mode: 'light' | 'dark' = 'light') => {
  logEvent('theme_apply_start', { whiteLabel: themeName, mode });
  const whiteLabelTheme = whiteLabelThemes[themeName] || whiteLabelThemes.hm;
  const colors = whiteLabelTheme[mode];
  const root = document.documentElement;

  root.setAttribute('data-theme', mode);

  // Colors
  root.style.setProperty('--color-bg', colors.bg);
  root.style.setProperty('--color-fg', colors.fg);
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-fg', colors.primaryFg);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-fg', colors.accentFg);
  root.style.setProperty('--color-muted', colors.muted);
  root.style.setProperty('--color-muted-fg', colors.mutedFg);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-card', colors.card);
  root.style.setProperty('--color-card-fg', colors.cardFg);
  root.style.setProperty('--color-card-border', colors.cardBorder);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-destructive', colors.destructive);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-info', colors.info);

  // Chart accent colors
  root.style.setProperty('--color-chart-1', colors.chart1);
  root.style.setProperty('--color-chart-2', colors.chart2);
  root.style.setProperty('--color-chart-3', colors.chart3);
  root.style.setProperty('--color-chart-4', colors.chart4);
  root.style.setProperty('--color-chart-5', colors.chart5);

  // Spacing & Radius
  root.style.setProperty('--space-sm', whiteLabelTheme.spacing.sm);
  root.style.setProperty('--space-md', whiteLabelTheme.spacing.md);
  root.style.setProperty('--space-lg', whiteLabelTheme.spacing.lg);
  root.style.setProperty('--radius-sm', whiteLabelTheme.radius.sm);
  root.style.setProperty('--radius-md', whiteLabelTheme.radius.md);
  root.style.setProperty('--radius-lg', whiteLabelTheme.radius.lg);
  root.style.setProperty('--radius-xl', whiteLabelTheme.radius.xl);
  root.style.setProperty('--font-family', whiteLabelTheme.fontFamily);
};
