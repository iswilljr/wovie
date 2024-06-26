import { multiSearch } from '@/utils/tmdb'
import { defineAction, z } from 'astro:actions'

export const server = {
  search: defineAction({
    input: z.object({ query: z.string().min(1) }),
    handler: async ({ query }) => {
      const data = await multiSearch(query)
      return data.results
    },
  }),
}
