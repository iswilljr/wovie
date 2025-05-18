import {
  ReleaseDateType,
  type Movie,
  type MovieWithMediaType,
  type PersonWithMediaType,
  type ReleaseDateResult,
  type TVWithMediaType,
} from 'tmdb-ts'
import { getReleaseDates } from './tmdb'
import { SHOW_REAL_MOVIE_QUALITY } from 'astro:env/server'

type Quality = 'N/A' | 'CAM' | 'HD'

export type Media = MovieWithMediaType | TVWithMediaType | PersonWithMediaType

export type MediaWithQuality<T extends Media> = T & {
  quality: Quality
}

export function getQuality(
  movie: Movie,
  releaseDates: ReleaseDateResult[]
): Quality {
  const releaseDate = new Date(movie.release_date).getTime()
  const now = Date.now()

  if (releaseDate > now) return 'N/A'

  const dates = releaseDates.flatMap(result => result.release_dates)
  const digitalRelease = dates.find(
    date =>
      date.type === ReleaseDateType.Digital ||
      date.type === ReleaseDateType.Physical
  )

  if (!digitalRelease) return 'CAM'

  const digitalReleaseTime = new Date(digitalRelease.release_date).getTime()
  const isDigitalReleased = now > digitalReleaseTime

  return isDigitalReleased ? 'HD' : 'CAM'
}

export async function getMediaQuality<T extends Media>(
  media: T
): Promise<Quality> {
  if (!SHOW_REAL_MOVIE_QUALITY) return 'HD'

  try {
    if (media.media_type !== 'movie') return 'HD'
    const data = await getReleaseDates(media.id)
    return getQuality(media, data.results)
  } catch (error) {
    return 'HD'
  }
}

export async function getMediaResultsWithQuality<T extends Media>(
  results: T[]
): Promise<Array<MediaWithQuality<T>>> {
  return await Promise.all(
    results.map(async media => ({
      ...media,
      quality: await getMediaQuality(media),
    }))
  )
}
