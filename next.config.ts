import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { PORTFOLIO_URL } from './src/shared/configs/site.config';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // next-mdx-remote v6는 ESM 전용이라 Turbopack이 외부 모듈로 빼면
  // /rsc 서브패스 해석에 실패한다. 번들에 포함시켜 해결한다.
  transpilePackages: ['next-mdx-remote'],

  // /api/posts는 런타임에 content/posts의 MDX를 fs로 읽는다.
  // 경로가 동적이라 파일 추적이 못 잡으므로, 서버리스 번들에 명시적으로 포함시킨다.
  outputFileTracingIncludes: {
    '/api/posts': ['./content/posts/**/*'],
  },

  // 블로그 전용 도메인: 소개/이력서는 포트폴리오로, 목록은 홈(/)으로 통합한다.
  async redirects() {
    return [
      { source: '/about', destination: PORTFOLIO_URL, permanent: true },
      { source: '/resume', destination: PORTFOLIO_URL, permanent: true },
      { source: '/blog', destination: '/', permanent: true },
    ];
  },

  // Performance optimizations

  // Image optimization for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'velog.velcdn.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    unoptimized: false,
  },

  // Compression
  compress: true,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
