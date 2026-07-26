import {
  discoverMedia,
  getNowPlaying,
  getTrending,
  multiSearch,
} from '@/utils/tmdb'
import { deleteItemFromWatching, getWatching } from '@/utils/watching'
import {
  addToWatchlist,
  deleteFromWatchlist,
  getWatchlist,
} from '@/utils/watchlist'
import {
  deleteSimklAccount,
  getSimklAccount,
  getSimklUserId,
} from '@/utils/simkl/account'
import { isSimklEnabled } from '@/utils/simkl/client'
import { importWatchlist } from '@/utils/simkl/sync'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

const disconnectedSimkl = {
  enabled: isSimklEnabled,
  connected: false,
  userName: null,
}

export const server = {
  discoverByGenre: defineAction({
    input: z.object({
      mediaType: z.enum(['movie', 'tv']),
      genres: z.string(),
    }),
    handler: async ({ mediaType, genres }) => {
      try {
        const data = await discoverMedia(mediaType, genres)
        return data.results
      } catch (e) {
        return []
      }
    },
  }),
  search: defineAction({
    input: z.object({ query: z.string().min(1) }),
    handler: async ({ query }) => {
      try {
        const data = await multiSearch(query)
        return data.results
      } catch (e) {
        return []
      }
    },
  }),
  recommended: defineAction({
    handler: async () => {
      try {
        const [trending, moreTrending] = await Promise.all([
          getTrending('all'),
          getTrending('all', { page: 2 }),
        ])
        return [...trending.results, ...moreTrending.results]
      } catch (e) {
        return []
      }
    },
  }),
  deleteItemFromWatching: defineAction({
    input: z.object({ id: z.number().or(z.string()) }),
    handler: async ({ id }, context) => {
      try {
        await deleteItemFromWatching({
          headers: context.request.headers,
          id,
        })
        return true
      } catch (e) {
        return false
      }
    },
  }),
  trendingAll: defineAction({
    handler: async () => {
      try {
        const all = await getTrending('all')
        return all.results
      } catch (e) {
        console.error('Error fetching trending all', e)
        return null
      }
    },
  }),
  trendingMovies: defineAction({
    handler: async () => {
      try {
        const movies = await getTrending('movie')
        return movies.results
      } catch (e) {
        console.error('Error fetching trending movies', e)
        return []
      }
    },
  }),
  trendingTv: defineAction({
    handler: async () => {
      try {
        const tvShows = await getTrending('tv')
        return tvShows.results
      } catch (e) {
        console.error('Error fetching trending tv shows', e)
        return []
      }
    },
  }),
  nowPlaying: defineAction({
    handler: async () => {
      try {
        const nowPlaying = await getNowPlaying()
        return nowPlaying.results
      } catch (e) {
        console.error('Error fetching now playing', e)
        return []
      }
    },
  }),
  watching: defineAction({
    handler: async (_, context) => {
      try {
        const watching = await getWatching({ headers: context.request.headers })
        return watching
      } catch (e) {
        return null
      }
    },
  }),
  watchlist: defineAction({
    handler: async (_, context) => {
      try {
        const watchlist = await getWatchlist({
          headers: context.request.headers,
        })
        return watchlist
      } catch (e) {
        return null
      }
    },
  }),
  addToWatchlist: defineAction({
    input: z.object({
      id: z.number(),
      mediaType: z.enum(['movie', 'tv']),
    }),
    handler: async ({ id, mediaType }, context) => {
      try {
        await addToWatchlist({
          headers: context.request.headers,
          id,
          mediaType,
        })
        return true
      } catch (e) {
        return false
      }
    },
  }),
  deleteFromWatchlist: defineAction({
    input: z.object({ id: z.number().or(z.string()) }),
    handler: async ({ id }, context) => {
      try {
        await deleteFromWatchlist({
          headers: context.request.headers,
          id,
        })
        return true
      } catch (e) {
        return false
      }
    },
  }),
  simklStatus: defineAction({
    handler: async (_, context) => {
      try {
        if (!isSimklEnabled) return disconnectedSimkl

        const userId = await getSimklUserId(context.request.headers)

        if (!userId) return disconnectedSimkl

        const account = await getSimklAccount(userId)

        return {
          enabled: true,
          connected: account != null,
          userName: account?.userName ?? null,
        }
      } catch (e) {
        console.error('Error fetching Simkl status', e)
        return disconnectedSimkl
      }
    },
  }),
  disconnectSimkl: defineAction({
    handler: async (_, context) => {
      try {
        const userId = await getSimklUserId(context.request.headers)

        if (!userId) return false

        await deleteSimklAccount(userId)

        return true
      } catch (e) {
        console.error('Error disconnecting Simkl account', e)
        return false
      }
    },
  }),
  importSimklWatchlist: defineAction({
    handler: async (_, context) => {
      try {
        const userId = await getSimklUserId(context.request.headers)

        if (!userId) return null

        return await importWatchlist(userId)
      } catch (e) {
        console.error('Error importing Simkl watchlist', e)
        return null
      }
    },
  }),
}
