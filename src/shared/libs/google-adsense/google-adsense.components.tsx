import { FunctionComponent } from 'react';
import Script from 'next/script';

export function GoogleAdSenseScript() {
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
