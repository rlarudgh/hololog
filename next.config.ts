import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Performance optimizations
  serverExternalPackages: ['remark-mdx'],

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
    unoptimized: false, // We'll handle image optimization differently
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
