import type { Preview } from '@storybook/react';
import { useEffect } from 'react';
import '../src/index.css';
import { applyTheme } from '../src/themes';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: { disable: true }, // We let our CSS vars handle backgrounds
  },
  globalTypes: {
    themeMode: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    whitelabel: {
      description: 'WhiteLabel Persona',
      defaultValue: 'hm',
      toolbar: {
        title: 'WhiteLabel',
        icon: 'paintbrush',
        items: [
          { value: 'hm', title: 'H&M' },
          { value: 'pets', title: 'Pet' },
          { value: 'partners', title: 'Partners' },
          { value: 'pas', title: 'PAS' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Apply the theme directly so that background/foreground updates globally
      useEffect(() => {
        applyTheme(context.globals.whitelabel, context.globals.themeMode);
      }, [context.globals.whitelabel, context.globals.themeMode]);

      return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] p-8">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
