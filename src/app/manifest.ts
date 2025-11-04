import type { MetadataRoute } from 'next';

type Manifest = MetadataRoute.Manifest;

export default function manifest(): Manifest {
  return {
    name: 'Hololog',
    short_name: 'Hololog',
    description: 'development blog',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [],
  };
}
