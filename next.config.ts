import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // next-mdx-remote v6는 ESM 전용이라 Turbopack이 외부 모듈로 빼면
  // /rsc 서브패스 해석에 실패한다. 번들에 포함시켜 해결한다.
  transpilePackages: ['next-mdx-remote'],

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
