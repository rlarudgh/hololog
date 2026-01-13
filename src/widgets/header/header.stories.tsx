import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './header.ui';

const meta = {
  title: 'widgets/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Header />,
};

export const Mobile: Story = {
  render: () => <Header />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <Header />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Desktop: Story = {
  render: () => <Header />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
