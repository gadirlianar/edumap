import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduMatch — Smart Tutor & Learning Studio',
    short_name: 'EduMatch',
    description:
      'Bilingual AZ/RU/EN tutoring WebApp with live schedule booking, interactive classroom, video chapters, diagnostics, and teacher studio.',
    start_url: '/?source=pwa',
    display: 'standalone',
    orientation: 'any',
    background_color: '#EBF7FE',
    theme_color: '#C7E6FF',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
