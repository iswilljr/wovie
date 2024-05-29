import {
  BackdropSizes,
  LogoSizes,
  PosterSizes,
  ProfileSizes,
  StillSizes,
  TMDB,
  getFullImagePath,
  type TrendingMediaType,
} from 'tmdb-ts'

export type ImageSize = `${LogoSizes}` | `${StillSizes}` | `${PosterSizes}` | `${ProfileSizes}` | `${BackdropSizes}`

export const tmdb = new TMDB(import.meta.env.TMDB_KEY)

export function getImagePath(imagePath: string, size: ImageSize) {
  return getFullImagePath('https://image.tmdb.org/t/p/', size, imagePath)
}

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
