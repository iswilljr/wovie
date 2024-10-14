import { actions } from 'astro:actions'
import { useStore } from '@nanostores/preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { searchResults } from '@/store/search'
import { useDebouncedState } from './use-debounced-state'
import type {
  MovieWithMediaType,
  MultiSearchResult,
  TVWithMediaType,
} from 'tmdb-ts'

export function useSearchResults({
  id = '',
  initialQuery = '',
  isExplorePage = false,
}) {
  const searchResultsMap = useStore(searchResults)
  const [isLoading, setIsLoading] = useState(isExplorePage)
  const [trending, setTrending] = useState<MultiSearchResult[] | null>(null)

  const [query, setQuery] = useDebouncedState(
    () => {
      if (isExplorePage) return initialQuery
      if (typeof document === 'undefined') return ''
      return document.querySelector<HTMLInputElement>(id)?.value ?? ''
    },
    {
      callback: useCallback((q: string) => {
        if (!isExplorePage) return
        const path = q ? `/explore?q=${q}` : '/explore'
        window.history.replaceState({}, '', path)
      }, []),
    }
  )

  const results = useMemo(() => {
    let results = searchResultsMap[query] ?? []

    if (isExplorePage && !query) {
      results = trending ?? []
    }

    const filteredResults = results.filter(
      result => result.media_type === 'movie' || result.media_type === 'tv'
    )

    return filteredResults as unknown as Array<
      MovieWithMediaType | TVWithMediaType
    >
  }, [trending, searchResultsMap, query, isExplorePage])

  const handleInput = useCallback<
    preact.JSX.InputEventHandler<HTMLInputElement>
  >(e => {
    setQuery(e.currentTarget.value)
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (Object.hasOwn(searchResults.get(), query)) return

    setIsLoading(true)

    const results = await actions.search({ query }).catch(() => null)

    searchResults.setKey(query, results ?? [])
    setIsLoading(false)
  }, [])

  const handleExplorePage = useCallback(async () => {
    setIsLoading(true)
    const results = await actions.recommended({}).catch(() => null)
    setTrending(results)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!query) {
      return
    }

    handleSearch(query).catch(() => null)
  }, [query, handleSearch])

  useEffect(() => {
    if (!isExplorePage) return
    handleExplorePage().catch(() => {})
  }, [isExplorePage])

  return {
    query,
    results,
    isLoading,
    handleSearch,
    handleInput,
  }
}
