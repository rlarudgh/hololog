import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer.ui';

describe('Footer Component', () => {
  it('renders copyright information', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString())),
    ).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Sharing insights on development and innovation./i),
    ).toBeInTheDocument();
  });
});
