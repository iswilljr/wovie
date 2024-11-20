import { snakeCase } from '.'
import { DEFAULT_SOURCE } from './sources'

export function getEpisodeUrl(
  id: number | string,
  name: string,
  season: number,
  episode: number,
  sourceId: string
) {
  const searchParams = new URLSearchParams()

  if (season !== 1) {
    searchParams.set('season', season.toString())
  }

  if (episode !== 1) {
    searchParams.set('episode', episode.toString())
  }

  if (sourceId !== DEFAULT_SOURCE.id) {
    searchParams.set('source', sourceId)
  }

  const search = searchParams.toString()
  const query = search ? `?${search}` : ''

  return `/play/tv/${id}/${snakeCase(name)}${query}`
}

export function getMovieUrl(
  id: number | string,
  title: string,
  sourceId: string
) {
  const searchParams = new URLSearchParams()

  if (sourceId !== DEFAULT_SOURCE.id) {
    searchParams.set('source', sourceId)
  }

  const search = searchParams.toString()
  const query = search ? `?${search}` : ''

  return `/play/movie/${id}/${snakeCase(title)}${query}`
}

export function getTvOrMovieUrl(
  mediaType: 'tv' | 'movie',
  mediaId: string | number,
  mediaTitle: string,
  season?: number,
  episode?: number,
  sourceId?: string
) {
  if (mediaType === 'tv') {
    return getEpisodeUrl(
      mediaId,
      mediaTitle,
      season ?? 1,
      episode ?? 1,
      sourceId ?? DEFAULT_SOURCE.id
    )
  }

  return getMovieUrl(mediaId, mediaTitle, sourceId ?? DEFAULT_SOURCE.id)
}
