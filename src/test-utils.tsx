import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const createMockBlogPost = (overrides = {}) => ({
  slug: 'test-post',
  title: 'Test Blog Post',
  date: '2024-01-01',
  description: 'This is a test blog post description',
  tags: ['test', 'blog'],
  ...overrides,
});

export const createMockBlogMetadata = (overrides = {}) => ({
  title: 'Test Post',
  date: '2024-01-01',
  description: 'Test description',
  tags: ['test'],
  ...overrides,
});

// Test utilities
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Mock implementations
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

export const mockSearchParams = new URLSearchParams();

// Helper for testing async components
export const renderAsync = async (component: ReactElement) => {
  const result = render(component);
  await waitForLoadingToFinish();
  return result;
};
