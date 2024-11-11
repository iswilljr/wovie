import { actions } from 'astro:actions'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { searchResults } from '@/store/search'
import { useDebouncedState } from './use-debounced-state'
import type {
  MovieWithMediaType,
  MultiSearchResult,
  TVWithMediaType,
} from 'tmdb-ts'

type ResultsData = MultiSearchResult[] | null

export function useSearchResults({
  id = '',
  initialQuery = '',
  isExplorePage = false,
  trending = null as ResultsData,
  initialResults = null as ResultsData,
}) {
  const searchResultsMap = useStore(searchResults)
  const [isLoading, setIsLoading] = useState(false)

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
    let _results = searchResultsMap[query] ?? []

    if (initialQuery === query && initialResults) {
      _results = initialResults
    }

    if (isExplorePage && !query) {
      _results = trending ?? []
    }

    const filteredResults = _results.filter(
      result => result.media_type === 'movie' || result.media_type === 'tv'
    )

    return filteredResults as unknown as Array<
      MovieWithMediaType | TVWithMediaType
    >
  }, [trending, searchResultsMap, query, isExplorePage])

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      setQuery(e.currentTarget.value)
    },
    []
  )

  const handleSearch = useCallback(async (query: string) => {
    if (Object.hasOwn(searchResults.get(), query)) return

    setIsLoading(true)

    const results = await actions.search({ query }).catch(() => null)

    searchResults.setKey(query, results?.data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (initialQuery === query || !query) {
      return
    }

    handleSearch(query).catch(() => null)
  }, [query, handleSearch])

  return {
    query,
    results,
    isLoading,
    handleSearch,
    handleInput,
  }
}
