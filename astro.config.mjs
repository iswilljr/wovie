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

const OptionalBoolean = envField.boolean({
  optional: true,
  access: 'secret',
  context: 'server',
  default: false,
})

const OptionalString = envField.string({
  optional: true,
  access: 'secret',
  context: 'server',
  default: '',
})

const RequiredString = envField.string({
  optional: false,
  access: 'secret',
  context: 'server',
})

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: false,
  site: SITE_URL,
  adapter: cloudflareAdapterEnabled ? cloudflare() : vercel(),
  integrations: [tailwind(), db(), react(), sitemap()],
  env: {
    schema: {
      // TMDB
      TMDB_KEY: RequiredString,

      // Auth
      ASTRO_DB_APP_TOKEN: RequiredString,
      ASTRO_DB_REMOTE_URL: RequiredString,
      BETTER_AUTH_SECRET: RequiredString,
      BETTER_AUTH_TRUSTED_ORIGINS: RequiredString,
      BETTER_AUTH_URL: RequiredString,

      // Blocked Content
      BLOCKED_COMPANY_LIST: OptionalString,
      BLOCKED_MOVIE_LIST: OptionalString,

      // Redis Cache
      CACHE_ENABLED: OptionalBoolean,
      CACHE_TTL_SECONDS: envField.number({
        optional: true,
        access: 'secret',
        context: 'server',
      }),
      KV_REST_API_TOKEN: OptionalString,
      KV_REST_API_URL: OptionalString,

      // Quality Label
      SHOW_REAL_MOVIE_QUALITY: OptionalBoolean,
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
