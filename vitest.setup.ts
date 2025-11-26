import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  notFound: vi.fn(),
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    [key: string]: unknown;
    src: string;
    alt: string;
  }) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

// Mock MDX Remote
vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => {
    return React.createElement('div', { 'data-testid': 'mdx-content' }, source);
  },
}));
