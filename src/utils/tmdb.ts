import { z } from 'astro/zod'
import { TMDB, type TrendingMediaType } from 'tmdb-ts'

const apiKey = z.string().parse(import.meta.env.TMDB_KEY)
export const tmdb = new TMDB(apiKey)

export function getTrending<T extends TrendingMediaType>(type: T) {
  return tmdb.trending.trending(type, 'week', { page: 1 })
}

export function getMovies() {
  return tmdb.movies.popular({ page: 1 })
}

export function getNowPlaying() {
  return tmdb.movies.nowPlaying({ page: 1 })
}

export function getTVShows() {
  return tmdb.tvShows.popular({ page: 1 })
}

export function getTVShow(id: number) {
  return tmdb.tvShows.details(id)
}

export function getMovie(id: number) {
  return tmdb.movies.details(id)
}
