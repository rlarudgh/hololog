import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './footer.ui';

const meta = {
  title: 'widgets/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => <Footer />,
};

export const Mobile: Story = {
  render: () => <Footer />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <Footer />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Desktop: Story = {
  render: () => <Footer />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
