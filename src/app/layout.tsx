import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { Footer } from '@/widgets/footer';
import { THEME_INIT_SCRIPT } from '@/features/theme';
import { Container } from '@/shared/ui';
import { GoogleAdSenseScript } from '@/shared/libs/google-adsense';
import { type PropsWithChildren } from 'react';
import { generateMetadata as createMetadata } from '@/shared/utils/metadata/metadata.util';

export const metadata: Metadata = createMetadata();

const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    // 테마 스크립트가 hydration 전에 <html class>를 바꾸므로 경고를 억제한다.
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 고정 문자열(사용자 입력 없음): 첫 페인트 전에 테마를 적용해 깜빡임을 막는다. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="stylesheet" href={PRETENDARD_CSS} />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:rounded-md focus:border focus:border-slate-300 focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
        >
          본문으로 건너뛰기
        </a>

        <div className="lg:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <Header />
            <main id="main-content">{children}</main>
            <Container>
              <Footer />
            </Container>
          </div>
        </div>

        {/** Google AdSense */}
        <GoogleAdSenseScript />
      </body>
    </html>
  );
}
