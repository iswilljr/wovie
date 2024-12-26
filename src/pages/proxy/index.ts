import { getMovieUrl, getTvUrl } from '@/utils/sources'
import type { APIRoute } from 'astro'
import { z } from 'astro/zod'

const params = z.object({
  mediaId: z.string(),
  mediaType: z.enum(['movie', 'tv']),
  source: z.string(),
  season: z.number().optional(),
  episode: z.number().optional(),
})

export const GET: APIRoute = async ({ request }) => {
  try {
    const { mediaId, mediaType, source, season, episode } = params.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries())
    )

    const isTV = mediaType === 'tv'

    const iframeUrl = isTV
      ? getTvUrl(source, +mediaId, season!, episode!)
      : getMovieUrl(source, +mediaId)

    const response = await fetch(iframeUrl)

    const c = await response.text()
    return new Response(c, {
      headers: response.headers,
    })
  } catch (error) {
    console.error(error)
    return new Response('Unable to proxy content', { status: 500 })
  }
}
