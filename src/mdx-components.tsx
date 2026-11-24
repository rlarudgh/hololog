import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/shared/ui';
import { lazy, Suspense } from 'react';

const ClickableImage = lazy(() =>
  import('@/entities/blog').then((module) => ({
    default: module.ClickableImage,
  })),
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-4 mt-12 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="my-5 leading-8">{children}</p>,
    a: ({ href, children }) => {
      // 외부 링크만 새 탭으로 연다(본문 내 앵커/내부 링크는 같은 탭).
      const isExternal = /^https?:\/\//.test(href ?? '');
      return (
        <a
          href={href}
          className="text-accent underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-accent dark:decoration-slate-600"
          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900 dark:text-slate-50">
        {children}
      </strong>
    ),
    hr: () => <hr className="my-12 border-slate-200 dark:border-slate-800" />,
    code: ({ children, className, ...props }) => {
      // If it's inline code (no className), render as inline
      if (!className) {
        return (
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.875em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {children}
          </code>
        );
      }
      // If it's a code block (has className), render with syntax highlighting
      return (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      );
    },
    pre: ({ children }) => {
      // Extract the code element from pre
      if (typeof children === 'object' && children && 'props' in children) {
        const { className, children: code, ...props } = children.props;
        return (
          <CodeBlock className={className} {...props}>
            {code}
          </CodeBlock>
        );
      }
      // Fallback for simple pre blocks
      return (
        <pre className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          {children}
        </pre>
      );
    },
    ul: ({ children }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 marker:text-slate-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-slate-400">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-slate-300 pl-4 text-slate-600 dark:border-slate-700 dark:text-slate-400">
        {children}
      </blockquote>
    ),
    img: ({ src, alt, className, width, height }) => (
      <Suspense
        fallback={
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src || ''}
            alt={alt || 'Blog image'}
            className={`my-6 w-full rounded-lg border border-slate-200 dark:border-slate-800 ${className || ''}`}
            width={width}
            height={height}
          />
        }
      >
        <ClickableImage
          src={src || ''}
          alt={alt || 'Blog image'}
          className={`my-6 w-full rounded-lg border border-slate-200 dark:border-slate-800 ${className || ''}`}
          width={width}
          height={height}
        />
      </Suspense>
    ),
    ...components,
  };
}
