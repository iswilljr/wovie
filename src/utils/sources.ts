interface Source {
  id: string
  name: string
  movieUrl: string
  tvUrl: string
}

export const SOURCES: Source[] = [
  {
    id: 'vidsrc.pro',
    name: 'VidSrc.pro',
    movieUrl: 'https://vidsrc.pro/embed/movie/{id}',
    tvUrl: 'https://vidsrc.pro/embed/tv/{id}/{season}/{episode}',
  },
  {
    id: 'superembed',
    name: 'Super Embed',
    movieUrl: 'https://multiembed.mov/?tmdb=1&video_id={id}',
    tvUrl:
      'https://multiembed.mov/?tmdb=1&video_id={id}&s={season}&e={episode}',
  },
  {
    id: 'vidsrc.dev',
    name: 'Vid Binge',
    movieUrl: 'https://vidsrc.dev/embed/movie/{id}',
    tvUrl: 'https://vidsrc.dev/embed/tv/{id}/{season}/{episode}',
  },
  {
    id: 'vidsrc.to',
    name: 'VidSrc.to',
    movieUrl: 'https://vidsrc.to/embed/movie/{id}',
    tvUrl: 'https://vidsrc.to/embed/tv/{id}/{season}/{episode}',
  },
  {
    id: 'vidsrc.cc',
    name: 'VidSrc.cc',
    movieUrl: 'https://vidsrc.cc/v2/embed/movie/{id}',
    tvUrl: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}',
  },
  {
    id: 'moviesapi.club',
    name: 'Movies Api club',
    movieUrl: 'https://moviesapi.club/movie/{id}',
    tvUrl: 'https://moviesapi.club/tv/{id}-{season}-{episode}',
  },
]

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DEFAULT_SOURCE = SOURCES[0]!

export function getSource(sourceId?: string | null) {
  if (!sourceId) return DEFAULT_SOURCE
  return SOURCES.find(source => source.id === sourceId) ?? DEFAULT_SOURCE
}

export function getUrlWithSource(baseUrl: URL | string, sourceId: string) {
  const url = new URL(baseUrl)
  url.searchParams.set('source', sourceId)
  return url.toString()
}

export function getSourceIcon(sourceId: string) {
  return `/icons/${sourceId}.png`
}

export function getTvUrl(
  sourceId: string,
  id: number,
  season: number,
  episode: number
) {
  const source = getSource(sourceId)
  return source.tvUrl
    .replace('{id}', id.toString())
    .replace('{season}', season.toString())
    .replace('{episode}', episode.toString())
}

export function getMovieUrl(sourceId: string, id: number) {
  const source = getSource(sourceId)
  return source.movieUrl.replace('{id}', id.toString())
}
