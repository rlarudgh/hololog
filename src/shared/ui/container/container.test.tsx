import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './container.ui';

describe('Container Component', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>,
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default container styles', () => {
    render(
      <Container>
        <div>Content</div>
      </Container>,
    );
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('max-w-3xl', 'mx-auto', 'px-5');
  });

  it('applies the wide size', () => {
    render(
      <Container size="wide">
        <div>Content</div>
      </Container>,
    );
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('max-w-5xl');
    expect(container).not.toHaveClass('max-w-3xl');
  });

  it('applies custom className', () => {
    render(
      <Container className="custom-container">
        <div>Content</div>
      </Container>,
    );
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('custom-container');
    expect(container).toHaveClass('max-w-3xl'); // Still has default classes
  });
});
