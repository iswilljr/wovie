import { TMDB, type TrendingMediaType } from 'tmdb-ts'
import { TMDB_KEY } from 'astro:env/server'

const tmdb = new TMDB(TMDB_KEY)

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
