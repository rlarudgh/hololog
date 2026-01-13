import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button.ui';

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const WithClickHandler: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};

export const CustomClass: Story = {
  args: {
    variant: 'primary',
    children: 'Custom Button',
    className: 'px-8 py-4 text-lg',
  },
};
