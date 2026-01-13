import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { GoogleAdSenseScript } from '@/shared/libs/google-adsense';
import { type PropsWithChildren } from 'react';
import { generateMetadata as createMetadata } from '@/shared/utils/metadata/metadata.util';

export const metadata: Metadata = createMetadata();

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/** Google AdSense */}
        <GoogleAdSenseScript />
      </body>
    </html>
  );
}
