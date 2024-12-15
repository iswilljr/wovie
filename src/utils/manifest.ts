import type { ManifestOptions } from 'vite-plugin-pwa'

export const manifest: Partial<ManifestOptions> = {
  name: 'Wovie',
  short_name: 'Wovie',
  description: 'Watch Movies and Tv shows!',
  start_url: '/',
  display: 'standalone',
  background_color: '#3b82f6',
  theme_color: '#3b82f6',
  icons: [
    {
      src: '/favicon.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}
