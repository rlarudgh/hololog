import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Hololog',
  description: '개발했던 일들을 기록하는 곳입니다.',
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
