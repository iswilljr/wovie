import { z } from 'astro/zod'
import { TMDB, type TrendingMediaType } from 'tmdb-ts'

const apiKey = z.string().parse(import.meta.env.TMDB_KEY)
const tmdb = new TMDB(apiKey)

export async function getTrending<T extends TrendingMediaType>(type: T) {
  return await tmdb.trending.trending(type, 'week', { page: 1 })
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
  return await tmdb.tvShows
    .details(id, ['credits', 'recommendations', 'similar'])
    .then(tv => ({ ...tv, media_type: 'tv' as const }))
}

export async function getMovie(id: number) {
  return await tmdb.movies
    .details(id, ['credits', 'recommendations', 'similar'])
    .then(movie => ({ ...movie, media_type: 'movie' as const }))
}

export async function getSeasonDetails(id: number, season: number) {
  return await tmdb.tvShows.season(id, season)
}

export async function multiSearch(query: string) {
  return await tmdb.search.multi({ query })
}
