import type { WhiteLabelTheme } from '@/themes/types';

const THEME_API_BASE =
  import.meta.env.VITE_THEME_API_URL || 'https://api.devex-analytics/theme/v1/';

export const fetchWhiteLabelTheme = async (whiteLabelId: string): Promise<WhiteLabelTheme> => {
  const response = await fetch(`${THEME_API_BASE}/themes/${whiteLabelId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch theme for ${whiteLabelId}`);
  }
  return response.json();
};
