import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer.ui';

describe('Footer', () => {
  it('renders the copyright with the current year and author', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${year} 김경호`))).toBeInTheDocument();
  });

  it('has a contentinfo landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('links to the portfolio in a new tab', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /Portfolio/ });
    expect(link).toHaveAttribute('href', 'https://kkh-log.pages.dev');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
