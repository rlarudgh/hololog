import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<HomePage />);
    expect(screen.getByText(/welcome to my blog/i)).toBeInTheDocument();
  });

  it('renders main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Welcome to My Blog',
    );
  });

  it('has proper semantic structure', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
