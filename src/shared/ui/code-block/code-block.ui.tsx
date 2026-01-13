'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace(/language-/, '') || 'text';

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

  return (
    <div className="relative group my-6">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          backgroundColor: '#0a0c10',
          border: '1px solid #1c2128',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem',
          margin: 0,
          fontSize: '0.875rem',
        }}
        showLineNumbers={code.split('\n').length > 5}
        lineNumberStyle={{
          color: '#8b949e',
          marginRight: '1rem',
          userSelect: 'none',
        }}
      >
        {code}
      </SyntaxHighlighter>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 rounded flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-100"
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
