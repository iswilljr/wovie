import { z } from 'astro/zod'
import { TMDB, type TrendingMediaType } from 'tmdb-ts'
import { getSafeContent, getSafeId } from './blockers.ts'

const apiKey = z.string().parse(import.meta.env.TMDB_KEY)
const tmdb = new TMDB(apiKey)

export async function getTrending<T extends TrendingMediaType>(
  type: T,
  { page = 1 } = {}
) {
  return await tmdb.trending.trending(type, 'week', { page })
}

export async function getMovies() {
  return await tmdb.movies.popular({ page: 1 })
}

export async function getNowPlaying() {
  return await tmdb.movies.nowPlaying({ page: 1 })
}

export async function getTVShows() {
  return await tmdb.tvShows.popular({ page: 1 })
}

export async function getTVShow(id: number) {
  const mediaID = getSafeId(id)
  const tv = await tmdb.tvShows.details(mediaID, [
    'credits',
    'recommendations',
    'similar',
  ])
  const tvData = getSafeContent(tv)
  return { ...tvData, media_type: 'tv' as const }
}

export async function getMovie(id: number) {
  const mediaId = getSafeId(id)
  const movie = await tmdb.movies.details(mediaId, [
    'credits',
    'recommendations',
    'similar',
  ])
  const movieData = getSafeContent(movie)
  return { ...movieData, media_type: 'movie' as const }
}

export async function getSeasonDetails(id: number, season: number) {
  return await tmdb.tvShows.season(id, season)
}

export async function multiSearch(query: string) {
  return await tmdb.search.multi({ query })
}
