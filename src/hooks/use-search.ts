import { actions } from 'astro:actions'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'
import { searchResults as searchResultsStore } from '@/store/search'
import { useDebouncedState } from './use-debounced-state'
import type { MultiSearchResult } from 'tmdb-ts'

type ResultsData = MultiSearchResult[] | null

export function useSearchResults({
  id = '',
  initialQuery = '',
  isExplorePage = false,
  trending = null as ResultsData,
  initialResults = null as ResultsData,
}) {
  useStore(searchResultsStore)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<MultiSearchResult[]>(
    initialResults ?? trending ?? []
  )

  const [query, setQuery] = useDebouncedState(
    () => {
      if (isExplorePage) return initialQuery
      if (typeof document === 'undefined') return ''
      return document.querySelector<HTMLInputElement>(id)?.value ?? ''
    },
    {
      callback: useCallback(
        (q: string) => {
          if (!isExplorePage) return
          const path = q ? `/explore?q=${q}` : '/explore'
          window.history.replaceState({}, '', path)
        },
        [isExplorePage]
      ),
    }
  )

  const handleInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      setQuery(e.currentTarget.value)
    },
    [setQuery]
  )

  const handleSearch = useCallback(
    async (query: string) => {
      if (Object.hasOwn(searchResultsStore.get(), query)) {
        setResults(searchResultsStore.get()[query] ?? [])
        return
      }

      setIsLoading(true)

      const searchAction = await actions.search({ query }).catch(() => null)
      const results = (searchAction?.data ?? []) as MultiSearchResult[]
      searchResultsStore.setKey(query, results)
      setResults(results)
      setIsLoading(false)
    },
    [setResults]
  )

  useEffect(() => {
    if (initialQuery === query || !query) {
      return
    }

    handleSearch(query).catch(() => null)
  }, [query, handleSearch, initialQuery])

  return {
    query,
    results,
    isLoading,
    setResults,
    handleSearch,
    handleInput,
  }
}
