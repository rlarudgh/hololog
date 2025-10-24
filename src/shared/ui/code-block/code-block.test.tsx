import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CodeBlock } from './code-block.ui';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('CodeBlock', () => {
  const sampleCode = `function hello() {
  console.log("Hello, World!");
}`;

  it('renders code with syntax highlighting', () => {
    render(<CodeBlock className="language-javascript">{sampleCode}</CodeBlock>);

    expect(screen.getByText('function')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('console')).toBeInTheDocument();
    expect(screen.getByText('log')).toBeInTheDocument();
  });

  it('shows line numbers for code longer than 5 lines', () => {
    const longCode = Array(6).fill('console.log("line");').join('\n');
    render(<CodeBlock className="language-javascript">{longCode}</CodeBlock>);

    // Check for line numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('does not show line numbers for short code', () => {
    const shortCode = 'console.log("short");';
    render(<CodeBlock className="language-javascript">{shortCode}</CodeBlock>);

    // Line numbers should not be present
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('shows copy button on hover and copies text', async () => {
    render(<CodeBlock className="language-javascript">{sampleCode}</CodeBlock>);

    const copyButton = screen.getByTitle('Copy code');
    expect(copyButton).toBeInTheDocument();

    // Click copy button
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleCode);

    // Check for "Copied" feedback
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('extracts language from className', () => {
    const { container } = render(
      <CodeBlock className="language-python">print("hello")</CodeBlock>,
    );

    // Check that the code is rendered (language detection working)
    expect(container.querySelector('pre')).toBeInTheDocument();
  });

  it('handles code without language className', () => {
    render(<CodeBlock>plain text</CodeBlock>);

    expect(screen.getByText('plain text')).toBeInTheDocument();
  });

  it('applies dark theme styling', () => {
    const { container } = render(
      <CodeBlock className="language-javascript">{sampleCode}</CodeBlock>,
    );

    const preElement = container.querySelector('pre');
    expect(preElement).toHaveStyle({
      backgroundColor: '#0a0c10',
      border: '1px solid #1c2128',
      color: '#f0f6fc',
    });
  });

  it('removes trailing newlines from code', () => {
    const codeWithNewline = 'console.log("test");\n';
    render(
      <CodeBlock className="language-javascript">{codeWithNewline}</CodeBlock>,
    );

    // The newline should be removed, but content should still be there
    expect(screen.getByText('console')).toBeInTheDocument();
    expect(screen.getByText('log')).toBeInTheDocument();
    expect(screen.getByText('"test"')).toBeInTheDocument();
  });
});
