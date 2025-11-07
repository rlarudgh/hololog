import type { MetadataRoute } from 'next';

type Manifest = MetadataRoute.Manifest;

export default function manifest(): Manifest {
  return {
    name: 'Hololog',
    short_name: 'Hololog',
    description: '개발 했던 일들을 기록하는 곳입니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [],
  };
}
