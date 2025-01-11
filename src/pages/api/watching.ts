import { auth } from '@/utils/auth/server'
import { getSource } from '@/utils/sources'
import { getMovie, getSeasonDetails, getTVShow } from '@/utils/tmdb'
import type { APIRoute } from 'astro'
import { db, Watching, NOW, and, eq } from 'astro:db'
import { z } from 'astro:schema'

type WatchingData = typeof Watching.$inferSelect
type InputData = z.infer<typeof InputDataSchema>

const WATCHING_TIME_IN_MINUTES = 5

const InputDataSchema = z.object({
  episode: z.number(),
  mediaId: z.number(),
  mediaType: z.enum(['movie', 'tv']),
  season: z.number(),
  sourceId: z.string().nullish(),
})

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const input = InputDataSchema.parse(await request.json())

    const watching = await getWatchingMovieOrShow(input, session.user.id)
    const { details, runtime, watchedTime } = await getWatchingDetails(
      input,
      watching
    )

    const source = getSource(input.sourceId)

    if (watching != null) {
      await db
        .update(Watching)
        .set({
          runtime,
          details,
          watchedTime,
          updatedAt: NOW,
          season: input.season,
          episode: input.episode,
          sourceId: source.id,
        })
        .where(eq(Watching.id, watching.id))

      return new Response('Updated watching data')
    }

    await db.insert(Watching).values({
      ...input,
      runtime,
      details,
      watchedTime,
      sourceId: source.id,
      userId: session.user.id,
    })

    return new Response('Added to watching list')
  } catch (error) {
    console.error(error)
    return new Response('Unable to add watching data', { status: 500 })
  }
}
async function getWatchingMovieOrShow(input: InputData, userId: string) {
  const query = await db
    .select()
    .from(Watching)
    .where(
      and(
        eq(Watching.userId, userId),
        eq(Watching.mediaId, input.mediaId),
        eq(Watching.mediaType, input.mediaType)
      )
    )
    .limit(1)

  return query.at(0) ?? null
}

async function getWatchingDetails(
  input: InputData,
  watching: WatchingData | null
) {
  const isNewEpisode = input.episode !== watching?.episode
  const isNewSeason = input.season !== watching?.season
  const isNew = isNewEpisode || isNewSeason
  const isMovie = input.mediaType === 'movie'

  let details = watching?.details
  let runtime = watching?.runtime ?? 0
  let watchedTime = isNew
    ? WATCHING_TIME_IN_MINUTES
    : watching.watchedTime + WATCHING_TIME_IN_MINUTES

  if (isMovie && isNew) {
    details = await getMovie(input.mediaId)
    runtime = (details as any).runtime
  }

  if (!isMovie && isNew) {
    const [tvShow, seasonDetails] = await Promise.all([
      getTVShow(input.mediaId),
      getSeasonDetails(input.mediaId, input.season),
    ])

    const episodeDetails = seasonDetails.episodes.find(
      episode => episode.episode_number === input.episode
    )

    details = tvShow

    runtime = episodeDetails?.runtime ?? 0
  }

  if (watchedTime > runtime) watchedTime = runtime

  return { details, runtime, watchedTime }
}
