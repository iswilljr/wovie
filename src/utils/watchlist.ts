import { db, desc, and, eq, Watchlist } from 'astro:db'
import { auth } from './auth/server'
import type { MovieWithMediaType, TVWithMediaType } from 'tmdb-ts'
import { getMovie, getTVShow } from './tmdb'

type MovieOrTV = MovieWithMediaType | TVWithMediaType

type WatchlistData = MovieOrTV & {
  watchlist: {
    id: number
    createdAt: Date
  }
}

export async function getWatchlist({
  headers,
}: {
  headers: Headers
}): Promise<WatchlistData[]> {
  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    return []
  }

  const data = await db
    .select()
    .from(Watchlist)
    .where(eq(Watchlist.userId, session.user.id))
    .orderBy(desc(Watchlist.createdAt))

  const watchlistData = data.map(({ details, ...watchlist }) => ({
    ...(details as any),
    watchlist,
  }))

  return watchlistData
}

export async function addToWatchlist({
  headers,
  id,
  mediaType,
}: {
  headers: Headers
  id: number
  mediaType: 'movie' | 'tv'
}) {
  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    throw new Error('Not authenticated')
  }

  const media = mediaType === 'movie' ? await getMovie(id) : await getTVShow(id)

  await db
    .insert(Watchlist)
    .values({
      mediaId: media.id,
      mediaType: media.media_type,
      details: media,
      userId: session.user.id,
    })
    .onConflictDoNothing()
}

export async function deleteFromWatchlist({
  headers,
  id,
}: {
  headers: Headers
  id: string | number
}) {
  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    throw new Error('Not authenticated')
  }

  await db
    .delete(Watchlist)
    .where(
      and(eq(Watchlist.userId, session.user.id), eq(Watchlist.mediaId, +id))
    )
}

export async function checkWatchlist({
  headers,
  mediaId,
}: {
  headers: Headers
  mediaId: number
}) {
  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    return false
  }

  const data = await db
    .select()
    .from(Watchlist)
    .where(
      and(eq(Watchlist.userId, session.user.id), eq(Watchlist.mediaId, mediaId))
    )

  return data.length > 0
}
