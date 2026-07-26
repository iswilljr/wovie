import {
  BETTER_AUTH_URL,
  SIMKL_CLIENT_ID,
  SIMKL_CLIENT_SECRET,
} from 'astro:env/server'

const SIMKL_API_URL = 'https://api.simkl.com'
const SIMKL_WEB_URL = 'https://simkl.com'

const APP_NAME = 'wovie'
const APP_VERSION = '0.1.0'
const USER_AGENT = `${APP_NAME}/${APP_VERSION} (https://wovix.app)`

const REQUEST_TIMEOUT_MS = 8000

export const SIMKL_STATE_COOKIE = 'simkl-oauth-state'
export const SIMKL_RETURN_COOKIE = 'simkl-oauth-return'

export const isSimklEnabled = Boolean(SIMKL_CLIENT_ID && SIMKL_CLIENT_SECRET)

export interface SimklIds {
  simkl?: number
  slug?: string
  imdb?: string
  tmdb?: string | number
  tvdb?: string | number
  mal?: string | number
  anidb?: string | number
}

export interface SimklMediaItem {
  title?: string
  year?: number
  ids: SimklIds
  seasons?: Array<{ number: number; episodes: Array<{ number: number }> }>
}

export interface SimklTokenResponse {
  access_token: string
  token_type?: string
  scope?: string
}

export interface SimklUserSettings {
  user?: {
    name?: string
    avatar?: string
  }
  account?: {
    id?: number
    type?: string
  }
}

export interface SimklListItem {
  status?: string
  last_watched_at?: string | null
  added_to_watchlist_at?: string | null
  movie?: { title?: string; year?: number; ids?: SimklIds }
  show?: { title?: string; year?: number; ids?: SimklIds }
}

export interface SimklAllItemsResponse {
  movies?: SimklListItem[]
  shows?: SimklListItem[]
  anime?: SimklListItem[]
}

export interface SimklWatchedItem {
  result: boolean | 'not_found'
  simkl?: number
  list?: string | null
  last_watched_at?: string | null
}

export class SimklError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'SimklError'
    this.status = status
  }
}

function buildUrl(path: string, searchParams?: Record<string, string>) {
  const url = new URL(path, SIMKL_API_URL)

  url.searchParams.set('client_id', SIMKL_CLIENT_ID)
  url.searchParams.set('app-name', APP_NAME)
  url.searchParams.set('app-version', APP_VERSION)

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url
}

interface SimklFetchOptions {
  token?: string
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  searchParams?: Record<string, string>
}

export async function simklFetch<T>(
  path: string,
  { token, method = 'GET', body, searchParams }: SimklFetchOptions = {}
): Promise<T> {
  if (!isSimklEnabled) {
    throw new SimklError('Simkl integration is not configured', 501)
  }

  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path, searchParams), {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : null,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new SimklError(
      `Simkl request to ${path} failed with ${response.status}`,
      response.status
    )
  }

  const text = await response.text()

  // Simkl answers some writes with an empty body
  return (text ? JSON.parse(text) : null) as T
}

export function getRedirectUri() {
  return new URL('/api/simkl/callback', BETTER_AUTH_URL).toString()
}

export function getAuthorizeUrl(state: string) {
  const url = new URL('/oauth/authorize', SIMKL_WEB_URL)

  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', SIMKL_CLIENT_ID)
  url.searchParams.set('redirect_uri', getRedirectUri())
  url.searchParams.set('state', state)
  url.searchParams.set('app-name', APP_NAME)
  url.searchParams.set('app-version', APP_VERSION)

  return url.toString()
}

export async function exchangeCode(code: string) {
  const response = await fetch(new URL('/oauth/token', SIMKL_API_URL), {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: SIMKL_CLIENT_ID,
      client_secret: SIMKL_CLIENT_SECRET,
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
      code,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new SimklError(
      `Unable to exchange Simkl code: ${response.status}`,
      response.status
    )
  }

  const token = (await response.json()) as SimklTokenResponse

  if (!token.access_token) {
    throw new SimklError('Simkl did not return an access token', 500)
  }

  return token
}

/**
 * Only same-origin paths are allowed back, an absolute URL here would turn the
 * callback into an open redirect.
 */
export function sanitizeReturnTo(returnTo: string | null | undefined) {
  if (!returnTo?.startsWith('/') || returnTo.startsWith('//')) {
    return '/'
  }

  return returnTo
}

export function getReturnUrl(returnTo: string, status: string) {
  const url = new URL(sanitizeReturnTo(returnTo), BETTER_AUTH_URL)

  url.searchParams.set('simkl', status)

  return `${url.pathname}${url.search}${url.hash}`
}

export function getUserSettings(token: string) {
  // `/users/settings` is a POST without a body for historical reasons
  return simklFetch<SimklUserSettings>('/users/settings', {
    token,
    method: 'POST',
  })
}
