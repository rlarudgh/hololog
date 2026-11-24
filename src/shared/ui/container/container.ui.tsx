import { type ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** reading: 글 읽기 폭(기본, 포트폴리오와 동일) · wide: 관리 화면처럼 표가 있는 페이지 */
  size?: 'reading' | 'wide';
}

const SIZE_CLASSES = {
  reading: 'max-w-3xl',
  wide: 'max-w-5xl',
} as const;

export function Container({
  children,
  className = '',
  size = 'reading',
}: ContainerProps) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} mx-auto px-5 sm:px-8 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
