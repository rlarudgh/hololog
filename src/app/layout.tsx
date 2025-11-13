import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export const metadata: Metadata = {
  title: 'Hololog',
  description: '개발했던 일들을 기록하는 곳입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/** Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
