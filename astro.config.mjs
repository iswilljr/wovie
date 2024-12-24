import { defineConfig, envField } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import cloudflare from '@astrojs/cloudflare'
import db from '@astrojs/db'
import legacy from '@vitejs/plugin-legacy'
import sitemap from '@astrojs/sitemap'
import { VitePWA } from 'vite-plugin-pwa'
import { manifest } from './src/utils/manifest'

const SITE_URL =
  process.env.SITE_URL ??
  process.env.BETTER_AUTH_URL ??
  'https://wovie.vercel.app'

const cloudflareAdapterEnabled =
  process.env.CLOUDFLARE_ADAPTER_ENABLED === 'true'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: SITE_URL,
  adapter: cloudflareAdapterEnabled ? cloudflare() : vercel(),
  integrations: [tailwind(), db(), react(), sitemap()],
  env: {
    schema: {
      TMDB_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      BETTER_AUTH_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        url: true,
      }),
      BETTER_AUTH_TRUSTED_ORIGINS: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      ASTRO_DB_REMOTE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      ASTRO_DB_APP_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
    },
  },
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
