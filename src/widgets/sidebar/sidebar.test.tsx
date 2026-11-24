import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from './sidebar.ui';

describe('Sidebar (desktop)', () => {
  it('renders brand, author and role', () => {
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: 'kkh.log' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByText('김경호')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('marks the blog menu as current on the home page', () => {
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('opens external links in a new tab', () => {
    render(<Sidebar />);
    for (const name of [/Portfolio/, /GitHub/, /LinkedIn/]) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('includes the theme toggle', () => {
    render(<Sidebar />);
    expect(
      screen.getByRole('button', { name: /모드로 전환/ }),
    ).toBeInTheDocument();
  });
});
