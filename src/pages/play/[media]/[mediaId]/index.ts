import { snakeCase } from '@/utils'
import { getMovie, getTVShow } from '@/utils/tmdb'
import type { APIContext } from 'astro'

export async function GET(ctx: APIContext) {
  const { media, mediaId } = ctx.params
  const mediaIdShoe = +(mediaId ?? 0)

  if (media !== 'tv' && media !== 'movie') {
    return await ctx.rewrite('/')
  }

  const result =
    media === 'tv'
      ? await getTVShow(mediaIdShoe).catch(() => null)
      : await getMovie(mediaIdShoe).catch(() => null)

  if (result) {
    return ctx.redirect(
      `/play/tv/${result.id}/${snakeCase(result.media_type === 'tv' ? result.name : result.title)}`
    )
  }

  return await ctx.rewrite('/')
}
