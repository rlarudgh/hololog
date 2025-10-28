import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Utterances } from './utterances.ui';

// Mock console methods to avoid noise in tests
const consoleMock = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('Utterances', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(consoleMock.log);
    vi.spyOn(console, 'warn').mockImplementation(consoleMock.warn);
    vi.spyOn(console, 'error').mockImplementation(consoleMock.error);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders utterances container with correct class', () => {
    const { container } = render(<Utterances repo="test/repo" />);

    const utterancesContainer = container.querySelector(
      '.utterances-container',
    );
    expect(utterancesContainer).toBeInTheDocument();
    expect(utterancesContainer).toHaveStyle('min-height: 200px');
  });

  it('renders with different props', () => {
    const { container } = render(
      <Utterances
        repo="different/repo"
        theme="github-light"
        issueTerm="title"
        label="comments"
      />,
    );

    const utterancesContainer = container.querySelector(
      '.utterances-container',
    );
    expect(utterancesContainer).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const { container } = render(<Utterances repo="test/repo" />);

    const utterancesContainer = container.querySelector(
      '.utterances-container',
    );
    expect(utterancesContainer).toBeInTheDocument();
  });
});
