import { words } from 'tiny-case'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import type {
  BackdropSize,
  LogoSize,
  PosterSize,
  ProfileSize,
  StillSize,
  MediaSize,
} from 'tmdb-ts'

type Size<T extends Record<string, string>> = T[keyof T]

export type ImageSize =
  | Size<typeof MediaSize>
  | Size<typeof LogoSize>
  | Size<typeof StillSize>
  | Size<typeof PosterSize>
  | Size<typeof ProfileSize>
  | Size<typeof BackdropSize>

export const swrDefaultOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  dedupingInterval: 0,
  focusThrottleInterval: 0,
  errorRetryInterval: 0,
  errorRetryCount: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  refreshWhenOnline: false,
  refreshWhenVisible: false,
  revalidateIfStale: false,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function snakeCase(str = '') {
  return words(str).join('_')
}

export function getImagePath(imagePath: string, size: ImageSize) {
  return `https://image.tmdb.org/t/p/${size}${imagePath}`
}

export function getSeasonOrEpisode(s: unknown, d = 1) {
  const n = Number(s)
  return Number.isNaN(n) ? d : n !== 0 ? n : d
}

export function formatDate(date: string) {
  if (!date) return 'N/A'

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
