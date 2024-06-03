import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    imageService: process.env.VERCEL != null,
    imagesConfig: {
      domains: ['image.tmdb.org'],
      sizes: [45, 300, 720, 780, 1280],
    },
  }),
  integrations: [tailwind(), preact()],
  experimental: {
    actions: true,
  },
})
