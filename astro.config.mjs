import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import db from '@astrojs/db'
import legacy from '@vitejs/plugin-legacy'
import sitemap from '@astrojs/sitemap'
import { VitePWA } from 'vite-plugin-pwa'
import { manifest } from './src/utils/manifest'

const SITE_URL =
  import.meta.env.SITE_URL ||
  import.meta.env.BETTER_AUTH_URL ||
  'https://wovie.vercel.app'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: false,
  site: SITE_URL,
  adapter: vercel(),
  integrations: [tailwind(), db(), react(), sitemap()],
  vite: {
    plugins: [
      legacy({
        targets: ['Chrome >= 70', 'defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        workbox: {
          globDirectory: '.vercel/output/static',
          globPatterns: [
            '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
          ],
          // Don't fallback on document based (e.g. `/some-page`) requests
          // This removes an errant console.log message from showing up.
          navigateFallback: null,
        },
      }),
    ],
  },
})
