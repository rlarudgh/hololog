import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Header } from './header.ui';

describe('Header (mobile)', () => {
  it('renders the brand link to home', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'kkh.log' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('has a banner landmark', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('keeps the menu closed until the button is pressed', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const button = screen.getByRole('button', { name: '메뉴 열기' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('navigation', { name: '모바일 메뉴' }),
    ).toBeNull();

    await user.click(button);

    expect(screen.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const nav = screen.getByRole('navigation', { name: '모바일 메뉴' });
    expect(nav).toBeVisible();
  });

  it('shows blog and portfolio links in the open menu', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));

    expect(screen.getByRole('link', { name: /Blog/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: /Portfolio/ })).toHaveAttribute(
      'href',
      'https://kkh-log.pages.dev',
    );
  });

  it('closes the menu with Escape', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
