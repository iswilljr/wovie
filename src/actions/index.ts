import { tmdb } from '@/utils/tmdb'
import { defineAction, z } from 'astro:actions'

export const server = {
  search: defineAction({
    input: z.object({ query: z.string().min(1) }),
    handler: async ({ query }) => {
      const data = await tmdb.search.multi({ query })
      return data.results
    },
  }),
}
