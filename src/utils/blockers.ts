import type { MovieDetails, TvShowDetails } from 'tmdb-ts'

const BLOCKED_MOVIES = new Set(
  ((import.meta.env.BLOCKED_MOVIE_LIST as string) ?? '').split(',').map(Number)
)

const BLOCKED_COMPANIES = new Set(
  ((import.meta.env.BLOCKED_COMPANY_LIST as string) ?? '')
    .split(',')
    .map(Number)
)

export function getSafeId(mediaID: number) {
  if (BLOCKED_MOVIES.has(mediaID)) {
    console.error('BLOCKED_CONTENT')
    throw new Error('BLOCKED_CONTENT')
  }

  return mediaID
}

export function getSafeContent<T extends MovieDetails | TvShowDetails>(
  data: T
): T {
  const shouldBlockNyCompany = data.production_companies.some(company =>
    BLOCKED_COMPANIES.has(company.id)
  )

  const shouldBlockById = BLOCKED_MOVIES.has(data.id)

  if (shouldBlockById || shouldBlockNyCompany) {
    console.error('BLOCKED_CONTENT')
    throw new Error('BLOCKED_CONTENT')
  }

  return data
}
