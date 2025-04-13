import { defineConfig, envField } from 'astro/config'
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
  adapter: vercel(),
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
      REDIS_TOKEN: OptionalString,
      REDIS_URL: OptionalString,

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
