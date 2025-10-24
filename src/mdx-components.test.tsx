import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMDXComponents } from './mdx-components';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, FC } from 'react';

/**
 * Test suite for MDX custom components
 * Validates styling and rendering behavior of all custom MDX elements
 */
describe('MDX Components', () => {
  const components = useMDXComponents({}) as MDXComponents;

  /**
   * Test h1 heading component rendering and styling
   */
  it('renders h1 component with proper styling', () => {
    const H1 = components.h1 as FC<ComponentPropsWithoutRef<'h1'>>;
    render(<H1>Test Heading</H1>);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Heading');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-6');
  });

  /**
   * Test h2 subheading component rendering and styling
   */
  it('renders h2 component with proper styling', () => {
    const H2 = components.h2 as FC<ComponentPropsWithoutRef<'h2'>>;
    render(<H2>Test Subheading</H2>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Test Subheading');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'mb-4', 'mt-6');
  });

  /**
   * Test paragraph component rendering and styling
   */
  it('renders paragraphs with proper styling', () => {
    const P = components.p as FC<ComponentPropsWithoutRef<'p'>>;
    render(<P>Test paragraph</P>);

    const paragraph = screen.getByText('Test paragraph');
    expect(paragraph).toHaveClass(
      'mb-4',
      'leading-relaxed',
      'text-gray-800',
      'dark:text-gray-200',
    );
  });

  /**
   * Test inline code rendering with proper background and styling
   */
  it('renders inline code with proper styling', () => {
    const Code = components.code as FC<ComponentPropsWithoutRef<'code'>>;
    render(<Code>inline code</Code>);

    const code = screen.getByText('inline code');
    expect(code).toHaveClass(
      'bg-gray-100',
      'dark:bg-gray-800',
      'px-1.5',
      'py-0.5',
      'rounded',
      'text-sm',
      'font-mono',
    );
  });

  /**
   * Test code blocks with syntax highlighting for programming languages
   */
  it('renders code blocks with syntax highlighting', () => {
    const Code = components.code as FC<ComponentPropsWithoutRef<'code'>>;
    render(
      <Code className="language-javascript">
        console.log(&quot;test&quot;)
      </Code>,
    );

    // Validate that CodeBlock component renders the syntax-highlighted code
    expect(screen.getByText('console')).toBeInTheDocument();
    expect(screen.getByText('log')).toBeInTheDocument();
    expect(screen.getByText('"test"')).toBeInTheDocument();
  });

  /**
   * Test pre block integration with CodeBlock component
   */
  it('renders pre blocks with CodeBlock', () => {
    const Pre = components.pre as FC<ComponentPropsWithoutRef<'pre'>>;
    const Code = components.code as FC<ComponentPropsWithoutRef<'code'>>;

    render(
      <Pre>
        <Code className="language-javascript">
          console.log(&quot;test&quot;)
        </Code>
      </Pre>,
    );

    expect(screen.getByText('console')).toBeInTheDocument();
    expect(screen.getByText('log')).toBeInTheDocument();
    expect(screen.getByText('"test"')).toBeInTheDocument();
  });

  /**
   * Test unordered list rendering with proper list styling
   */
  it('renders lists with proper styling', () => {
    const Ul = components.ul as FC<ComponentPropsWithoutRef<'ul'>>;

    render(
      <Ul>
        <li>First item</li>
        <li>Second item</li>
      </Ul>,
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('list-disc', 'list-inside', 'mb-4', 'space-y-2');

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });

  /**
   * Test blockquote component with border and italic styling
   */
  it('renders blockquotes with proper styling', () => {
    const Blockquote = components.blockquote as FC<
      ComponentPropsWithoutRef<'blockquote'>
    >;
    render(<Blockquote>Test quote</Blockquote>);

    const blockquote = screen.getByText('Test quote');
    expect(blockquote).toHaveClass(
      'border-l-4',
      'border-gray-300',
      'pl-4',
      'italic',
      'my-4',
    );
  });

  /**
   * Test anchor link rendering with hover effects
   */
  it('renders links with proper styling', () => {
    const A = components.a as FC<ComponentPropsWithoutRef<'a'>>;
    render(<A href="/test">Test Link</A>);

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Test Link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'underline',
    );
  });
});
