import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostCard } from './post-card.ui';
import { BlogPost } from '@/shared/types/blog-type';

const meta = {
  title: 'entities/blog/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: BlogPost = {
  slug: 'test-post',
  title: 'Test Post Title',
  date: '2024-01-15',
  description: 'This is a test post description for Storybook.',
  tags: ['test', 'storybook'],
};

export const Default: Story = {
  args: {
    post: mockPost,
  },
};

export const WithoutTags: Story = {
  args: {
    post: {
      ...mockPost,
      tags: [],
    },
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...mockPost,
      title:
        'This is a very long post title that should wrap appropriately and still look good in the card layout',
    },
  },
};

export const LongDescription: Story = {
  args: {
    post: {
      ...mockPost,
      description:
        'This is a much longer description that provides more context about the blog post. It should demonstrate how the card handles longer text content.',
    },
  },
};

export const ManyTags: Story = {
  args: {
    post: {
      ...mockPost,
      tags: [
        'react',
        'nextjs',
        'typescript',
        'testing',
        'storybook',
        'ui',
        'frontend',
      ],
    },
  },
};
