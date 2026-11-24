import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

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
