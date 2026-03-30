export type ThemeColorTokens = {
  bg: string;
  fg: string;
  primary: string;
  primaryFg: string;
  accent: string;
  accentFg: string;
  muted: string;
  mutedFg: string;
  border: string;
  card: string;
  cardFg: string;
  cardBorder: string;
  success: string;
  destructive: string;
  warning: string;
  info: string;
  // Chart-specific accent colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

export type ThemeTokens = {
  light: ThemeColorTokens;
  dark: ThemeColorTokens;
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontFamily: string;
};

export type WhiteLabelTheme = ThemeTokens;

/** WhiteLabel metadata for the UI */
export type WhiteLabelPersona = {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
};

export const WHITELABELS: WhiteLabelPersona[] = [
  {
    id: 'hm',
    name: 'Home & Motor',
    shortName: 'H&M',
    emoji: '🏠',
    description: 'Home & Motor insurance WhiteLabel Persona',
  },
  {
    id: 'pets',
    name: 'Pet',
    shortName: 'Pets',
    emoji: '🐾',
    description: 'Pet insurance WhiteLabel Persona',
  },
  {
    id: 'partners',
    name: 'Partners',
    shortName: 'Partners',
    emoji: '🤝',
    description: 'Partner integration WhiteLabel Persona',
  },
  {
    id: 'pas',
    name: 'PAS',
    shortName: 'PAS',
    emoji: '⚙️',
    description: 'Policy Admin System WhiteLabel Persona',
  },
];
