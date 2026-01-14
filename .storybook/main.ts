import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],

  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },

  staticDirs: ['../public'],
};

export default config;
