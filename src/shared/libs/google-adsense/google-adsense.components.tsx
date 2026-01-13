import Script from 'next/script';

export function GoogleAdSenseScript() {
  // Only load in production
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    return null;
  }

  // Validate environment variable
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!clientId || clientId.trim() === '') {
    console.warn('NEXT_PUBLIC_ADSENSE_CLIENT is not configured');
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
