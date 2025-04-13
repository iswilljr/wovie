import { BLOCKED_COMPANY_LIST, BLOCKED_MOVIE_LIST } from 'astro:env/server'
import type { MovieDetails, TvShowDetails } from 'tmdb-ts'

const BLOCKED_MOVIES = new Set(BLOCKED_MOVIE_LIST.split(',').map(Number))
const BLOCKED_COMPANIES = new Set(BLOCKED_COMPANY_LIST.split(',').map(Number))

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
