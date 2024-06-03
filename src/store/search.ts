import { map } from 'nanostores'
import type { MultiSearchResult } from 'tmdb-ts'

export const searchResults = map<Record<string, MultiSearchResult[]>>({})
