'use client';

import React, { type MouseEvent, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center bg-slate-950/80 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`이미지 확대 보기: ${alt}`}
    >
      <div className="relative flex items-center justify-center w-full h-full p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: 'calc(100vh - 4rem)',
            maxWidth: 'calc(100vw - 4rem)',
            margin: '0 auto',
          }}
        />
        <button
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 transition-colors hover:bg-white"
          aria-label="이미지 닫기"
          style={{ zIndex: 10000 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
