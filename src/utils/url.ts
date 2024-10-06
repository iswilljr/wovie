import { snakeCase } from '.'
import { DEFAULT_SOURCE } from './sources'

export function getEpisodeUrl(
  id: number,
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

export function getSeasonUrl(
  id: number,
  name: string,
  season: number,
  sourceId: string
) {
  const searchParams = new URLSearchParams()

  if (season !== 1) {
    searchParams.set('season', season.toString())
  }

  if (sourceId !== DEFAULT_SOURCE.id) {
    searchParams.set('source', sourceId)
  }

  const search = searchParams.toString()
  const query = search ? `?${search}` : ''

  return `/play/tv/${id}/${snakeCase(name)}${query}`
}
