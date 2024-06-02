import { snakeCase } from '@/utils'
import { getMovie, getTVShow } from '@/utils/tmdb'
import type { APIContext } from 'astro'

export async function GET(ctx: APIContext) {
  const { media, mediaId } = ctx.params
  const mediaIdShoe = +(mediaId ?? 0)

  if (media !== 'tv' && media !== 'movie') {
    return await ctx.rewrite('/')
  }

  const tvShow =
    media === 'tv'
      ? await getTVShow(mediaIdShoe).catch(() => null)
      : await getMovie(mediaIdShoe).catch(() => null)

  if (tvShow) {
    return ctx.redirect(
      `/play/tv/${tvShow.id}/${snakeCase(tvShow.backdrop_path)}`
    )
  }

  return await ctx.rewrite('/')
}
