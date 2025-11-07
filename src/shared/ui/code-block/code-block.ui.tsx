'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the Highlight component to reduce initial bundle size
const Highlight = dynamic(
  () => import('prism-react-renderer').then((mod) => mod.Highlight),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-900 p-4 rounded-lg animate-pulse h-40" />
    ),
  },
);

// Using a simple theme to reduce bundle size
const simpleTheme = {
  plain: {
    color: '#f8f8f2',
    backgroundColor: '#282a36',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#6272a4',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#f8f8f2',
      },
    },
    {
      types: ['property', 'tag', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#ff79c6',
      },
    },
    {
      types: ['boolean', 'number'],
      style: {
        color: '#bd93f9',
      },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#50fa7b',
      },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: {
        color: '#f8f8f2',
      },
    },
    {
      types: ['atrule', 'attr-value', 'function', 'class-name'],
      style: {
        color: '#f1fa8c',
      },
    },
    {
      types: ['keyword'],
      style: {
        color: '#ff79c6',
      },
    },
    {
      types: ['regex', 'important'],
      style: {
        color: '#ffb86c',
      },
    },
  ],
};

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace(/language-/, '') || 'javascript';

  // Clean up the code content
  const code = children.replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Use dynamic import for syntax highlighting to reduce initial bundle size
  return (
    <div className="relative group my-6">
      {typeof window !== 'undefined' && Highlight ? (
        <Highlight
          theme={simpleTheme}
          code={code}
          language={
            language as
              | 'javascript'
              | 'typescript'
              | 'python'
              | 'css'
              | 'jsx'
              | 'tsx'
              | 'json'
              | 'bash'
              | 'text'
              | ''
          }
        >
          {({
            className: highlightClassName,
            style,
            tokens,
            getLineProps,
            getTokenProps,
          }) => (
            <pre
              className={`${highlightClassName} overflow-x-auto p-4 rounded-lg text-sm relative`}
              style={{
                ...style,
                backgroundColor: '#282a36',
                border: '1px solid #44475a',
                color: '#f8f8f2',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {tokens.length > 5 && (
                    <span className="select-none mr-4 inline-block w-8 text-right text-gray-400">
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({
                      token,
                      key,
                    });
                    return <span key={key} {...tokenProps} />;
                  })}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      ) : (
        // Fallback for SSR and loading state
        <pre className="bg-gray-900 text-gray-100 overflow-x-auto p-4 rounded-lg text-sm font-mono">
          <code>{code}</code>
        </pre>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 rounded flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-200"
        title="Copy code"
      >
        {copied ? (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
