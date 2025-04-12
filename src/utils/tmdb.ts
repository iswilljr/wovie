import { z } from 'astro/zod'
import { TMDB, type TrendingMediaType } from 'tmdb-ts'
import { getSafeContent, getSafeId } from './blockers.ts'
import { cache } from './cache.ts'

const apiKey = z.string().parse(import.meta.env.TMDB_KEY)
const tmdb = new TMDB(apiKey)

export const getTrending = cache(
  'trending',
  async <T extends TrendingMediaType>(type: T, { page = 1 } = {}) => {
    return await tmdb.trending.trending(type, 'week', { page })
  }
)

export const getNowPlaying = cache('playing', async () => {
  return await tmdb.movies.nowPlaying({ page: 1 })
})

export const getTVShow = cache('tv', async (id: number) => {
  const mediaID = getSafeId(id)
  const tv = await tmdb.tvShows.details(mediaID, [
    'credits',
    'recommendations',
    'similar',
  ])
  const tvData = getSafeContent(tv)
  return { ...tvData, media_type: 'tv' as const }
})

export const getMovie = cache('movie', async (id: number) => {
  const mediaId = getSafeId(id)
  const movie = await tmdb.movies.details(mediaId, [
    'credits',
    'recommendations',
    'similar',
  ])
  const movieData = getSafeContent(movie)
  return { ...movieData, media_type: 'movie' as const }
})

export const getSeasonDetails = cache(
  'season',
  async (id: number, season: number) => {
    return await tmdb.tvShows.season(id, season)
  }
)

export const multiSearch = cache('search', async (query: string) => {
  return await tmdb.search.multi({ query })
})
