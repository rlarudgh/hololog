import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import rehypeSanitize from 'rehype-sanitize';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

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
    rehypePlugins: [rehypeSanitize],
  },
});

export default withMDX(nextConfig);
