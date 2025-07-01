import { TMDB_KEY as apiKey } from 'astro:env/server'
import { TMDB, type TrendingMediaType, type TrendingResults } from 'tmdb-ts'
import { getSafeContent, getSafeId } from './blockers.ts'
import { getMediaResultsWithQuality } from './quality.ts'
import { cache } from './cache.ts'

const tmdb = new TMDB(apiKey)

export const getTrending = cache(
  'trending',
  async <T extends TrendingMediaType>(type: T, { page = 1 } = {}) => {
    const trending = await tmdb.trending.trending(type, 'week', { page })
    const trendingWithType = trending.results.map(media => ({
      ...media,
      media_type:
        'media_type' in media
          ? media.media_type
          : type === 'all'
          ? 'movie'
          : type,
    }))
    const results = (await getMediaResultsWithQuality<any>(
      trendingWithType
    )) as TrendingResults<T>['results']

    return { ...trending, results }
  }
)

export const getNowPlaying = cache('playing', async () => {
  const nowPlaying = await tmdb.movies.nowPlaying({ page: 1 })
  const nowPlayingWithType = nowPlaying.results.map(movie => ({
    ...movie,
    media_type: 'movie' as const,
  }))
  const results = await getMediaResultsWithQuality(nowPlayingWithType)
  return { ...nowPlaying, results }
})

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

export async function getReleaseDates(id: number) {
  return await tmdb.movies.releaseDates(id)
}

export function multiSearch(query: string) {
  return tmdb.search.multi({ query })
}

export function getMovieGenres() {
  return tmdb.genres.movies()
}

export function getTvShowGenres() {
  return tmdb.genres.tvShows()
}

export function discoverMedia(mediaType: 'movie' | 'tv', genres: string) {
  if (mediaType === 'movie') {
    return tmdb.discover.movie({ with_genres: genres })
  }
  return tmdb.discover.tvShow({ with_genres: genres })
}
