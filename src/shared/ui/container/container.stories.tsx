import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from './container.ui';

const meta = {
  title: 'shared/ui/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Container Content</h2>
        <p>This is a container with max-width and centered content.</p>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'max-w-2xl',
    children: (
      <div className="p-8 bg-green-100 dark:bg-green-900 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Narrow Container</h2>
        <p>This container has a custom max-width.</p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div className="space-y-4 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold">Long Content Example</h2>
        <p className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
      </div>
    ),
  },
};
