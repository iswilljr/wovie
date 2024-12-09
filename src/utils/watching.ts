import { db, desc, and, eq, Watching } from 'astro:db'
import { auth } from './auth/server'
import type { MovieWithMediaType, TVWithMediaType } from 'tmdb-ts'
import type { Session, User } from 'better-auth'

type MovieOrTV = MovieWithMediaType | TVWithMediaType

type WatchingData = MovieOrTV & {
  watching: {
    runtime: number
    watchedTime: number
    episode: number
    season: number
    sourceId: string
    updatedAt: Date
  }
}

export async function getWatching({
  headers,
}: {
  headers: Headers
}): Promise<WatchingData[]> {
  const session = await auth.api.getSession({
    headers,
  })

  if (!session) {
    return []
  }

  const data = await db
    .select()
    .from(Watching)
    .where(eq(Watching.userId, session.user.id))
    .orderBy(desc(Watching.updatedAt))

  const watchingData = data
    .map(({ details, ...watching }) => ({
      ...(details as any),
      watching,
    }))
    .sort(
      (a, b) =>
        new Date(b.watching.updatedAt as string).getTime() -
        new Date(a.watching.updatedAt as string).getTime()
    )

  return watchingData
}

interface SessionData {
  session: Session
  user: User
}

export async function linkWatching({
  anonymousUser,
  newUser,
}: {
  anonymousUser: SessionData
  newUser: SessionData
}) {
  const watching = await db
    .select()
    .from(Watching)
    .where(eq(Watching.userId, anonymousUser.user.id))

  if (watching.length === 0) {
    return
  }

  const insertPromises = watching.map(async ({ id, ...media }) => {
    await db
      .insert(Watching)
      .values({ ...media, userId: newUser.user.id })
      .onConflictDoUpdate({
        set: {
          episode: media.episode,
          season: media.season,
          sourceId: media.sourceId,
          runtime: media.runtime,
          watchedTime: media.watchedTime,
        },
        target: [Watching.userId, Watching.mediaId, Watching.mediaType],
      })
  })

  const deletePromises = watching.map(async media => {
    await db.delete(Watching).where(eq(Watching.id, media.id))
  })

  await Promise.allSettled([...insertPromises, ...deletePromises])
}

export async function deleteItemFromWatching({
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
    .delete(Watching)
    .where(and(eq(Watching.userId, session.user.id), eq(Watching.mediaId, +id)))

  console.log('Deleted watching')
}
