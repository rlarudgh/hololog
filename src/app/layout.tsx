import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export const metadata: Metadata = {
  title: 'Hololog',
  description: 'development blog',
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
      </body>
    </html>
  );
}
