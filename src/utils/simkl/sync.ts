import { db, eq, Watchlist } from 'astro:db'
import { findByImdbId, getMovie, getTVShow } from '../tmdb'
import { getSimklAccount, setLastImportedAt } from './account'
import {
  isSimklEnabled,
  simklFetch,
  type SimklAllItemsResponse,
  type SimklListItem,
  type SimklMediaItem,
  type SimklWatchedItem,
} from './client'

type MediaType = 'movie' | 'tv'

export interface SimklMediaRef {
  tmdbId: number
  mediaType: MediaType
  title?: string | undefined
  year?: number | undefined
}

interface WatchProgress {
  season: number
  episode: number
  runtime: number
  watchedTime: number
  previousWatchedTime: number | null
}

export interface SimklImportResult {
  imported: number
  skipped: number
  hasMore: boolean
}

/** Simkl marks an item as watched once playback goes past this percentage. */
const WATCHED_PROGRESS = 80

/** Each imported item costs a TMDB request, so imports are done in slices. */
const IMPORT_LIMIT = 60
const IMPORT_CONCURRENCY = 5

async function getAccessToken(userId: string) {
  if (!isSimklEnabled) return null

  const account = await getSimklAccount(userId)

  return account?.accessToken ?? null
}

/**
 * Simkl is a companion of the Wovie library, never a requirement for it, so a
 * failing request is logged and forgotten instead of breaking the caller.
 */
async function push(
  userId: string,
  name: string,
  task: (token: string) => Promise<unknown>
) {
  try {
    const token = await getAccessToken(userId)

    if (!token) return

    await task(token)
  } catch (error) {
    console.error(`Unable to push ${name} to Simkl`, error)
  }
}

function toSimklMedia({ tmdbId, title, year }: SimklMediaRef): SimklMediaItem {
  const media: SimklMediaItem = { ids: { tmdb: tmdbId.toString() } }

  if (title) media.title = title
  if (year) media.year = year

  return media
}

function toSimklPayload(media: SimklMediaRef, extra?: Partial<SimklMediaItem>) {
  const item = { ...toSimklMedia(media), ...extra }

  return media.mediaType === 'movie' ? { movies: [item] } : { shows: [item] }
}

function toProgress(watchedTime: number, runtime: number) {
  if (runtime <= 0) return 0

  return Math.min(Math.round((watchedTime / runtime) * 100), 100)
}

export async function pushWatchlistAdd(userId: string, media: SimklMediaRef) {
  await push(userId, 'watchlist item', async token => {
    await simklFetch('/sync/add-to-list', {
      token,
      method: 'POST',
      body: { to: 'plantowatch', ...toSimklPayload(media) },
    })
  })
}

export async function pushWatchlistRemove(
  userId: string,
  media: SimklMediaRef
) {
  await push(userId, 'watchlist removal', async token => {
    const watched = await simklFetch<SimklWatchedItem[] | null>(
      '/sync/watched',
      { token, method: 'POST', body: [toSimklMedia(media)] }
    )

    // Removing from Simkl also wipes the watch history and rating of an item,
    // so only titles the user merely planned to watch are removed.
    if (watched?.at(0)?.list !== 'plantowatch') return

    await simklFetch('/sync/history/remove', {
      token,
      method: 'POST',
      body: toSimklPayload(media),
    })
  })
}

export async function pushWatchProgress(
  userId: string,
  media: SimklMediaRef,
  { season, episode, runtime, watchedTime, previousWatchedTime }: WatchProgress
) {
  const progress = toProgress(watchedTime, runtime)
  const isNew = previousWatchedTime == null
  const previousProgress = toProgress(previousWatchedTime ?? 0, runtime)
  const finishedNow =
    previousProgress < WATCHED_PROGRESS && progress >= WATCHED_PROGRESS

  if (!isNew && !finishedNow) return

  await push(userId, 'watch progress', async token => {
    if (isNew) {
      const body =
        media.mediaType === 'movie'
          ? { progress, movie: toSimklMedia(media) }
          : {
              progress,
              show: toSimklMedia(media),
              episode: { season, number: episode },
            }

      await simklFetch('/scrobble/start', { token, method: 'POST', body })
      return
    }

    await simklFetch('/sync/history', {
      token,
      method: 'POST',
      body: toSimklPayload(media, {
        seasons: [{ number: season, episodes: [{ number: episode }] }],
      }),
    })
  })
}

interface PlanToWatchItem {
  mediaType: MediaType
  tmdbId: number | null
  imdbId: string | null
}

function toPlanToWatchItems(
  items: SimklListItem[] = [],
  mediaType: MediaType
): PlanToWatchItem[] {
  return items.map(item => {
    const ids = (item.movie ?? item.show)?.ids
    const tmdbId = Number(ids?.tmdb)

    return {
      mediaType,
      tmdbId: Number.isFinite(tmdbId) && tmdbId > 0 ? tmdbId : null,
      imdbId: ids?.imdb ?? null,
    }
  })
}

async function resolveTmdbId(item: PlanToWatchItem) {
  if (item.tmdbId) return item.tmdbId

  if (!item.imdbId) return null

  const results = await findByImdbId(item.imdbId)
  const match =
    item.mediaType === 'movie'
      ? results.movie_results.at(0)
      : results.tv_results.at(0)

  return match?.id ?? null
}

async function importItem(userId: string, item: PlanToWatchItem) {
  const tmdbId = await resolveTmdbId(item)

  if (!tmdbId) return false

  const details =
    item.mediaType === 'movie'
      ? await getMovie(tmdbId)
      : await getTVShow(tmdbId)

  await db
    .insert(Watchlist)
    .values({
      mediaId: details.id,
      mediaType: details.media_type,
      details,
      userId,
    })
    .onConflictDoNothing()

  return true
}

function getPlanToWatch(token: string, type: 'movies' | 'shows') {
  return simklFetch<SimklAllItemsResponse | null>(
    `/sync/all-items/${type}/plantowatch`,
    { token, searchParams: { extended: 'ids_only' } }
  )
}

/**
 * Copies the Simkl "plan to watch" list into the Wovie watchlist. Titles
 * already saved locally are left out so consecutive imports keep making
 * progress on big libraries.
 */
export async function importWatchlist(
  userId: string
): Promise<SimklImportResult | null> {
  const token = await getAccessToken(userId)

  if (!token) return null

  // Pulled one after the other, Simkl asks clients not to run parallel
  // full-library requests.
  const movies = await getPlanToWatch(token, 'movies')
  const shows = await getPlanToWatch(token, 'shows')

  const saved = await db
    .select({
      mediaId: Watchlist.mediaId,
      mediaType: Watchlist.mediaType,
    })
    .from(Watchlist)
    .where(eq(Watchlist.userId, userId))

  const savedKeys = new Set(
    saved.map(({ mediaId, mediaType }) => `${mediaType}:${mediaId}`)
  )

  const items = [
    ...toPlanToWatchItems(movies?.movies, 'movie'),
    ...toPlanToWatchItems(shows?.shows, 'tv'),
  ].filter(
    item =>
      (item.tmdbId ?? item.imdbId) != null &&
      !savedKeys.has(`${item.mediaType}:${item.tmdbId}`)
  )

  const pending = items.slice(0, IMPORT_LIMIT)

  let imported = 0
  let skipped = 0

  for (let index = 0; index < pending.length; index += IMPORT_CONCURRENCY) {
    const batch = pending.slice(index, index + IMPORT_CONCURRENCY)

    const results = await Promise.all(
      batch.map(async item =>
        await importItem(userId, item).catch(error => {
          console.error('Unable to import Simkl item', error)
          return false
        })
      )
    )

    results.forEach(result => (result ? imported++ : skipped++))
  }

  await setLastImportedAt(userId)

  return { imported, skipped, hasMore: items.length > pending.length }
}
