import { useStore } from '@nanostores/preact'
import { searchResults } from '@/store/search'
import { actions } from 'astro:actions'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { useDebouncedState } from '@/hooks/use-debounced-state'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { snakeCase, getImagePath } from '@/utils'
import type { MultiSearchResult } from 'tmdb-ts'

function useSearchResults({ id = '' }) {
  const searchResultsMap = useStore(searchResults)
  const [isLoading, setIsLoading] = useState(false)

  const [query, setQuery] = useDebouncedState(() => {
    if (typeof document === 'undefined') return ''
    return document.querySelector<HTMLInputElement>(id)?.value ?? ''
  })

  const results = useMemo(() => {
    return searchResultsMap[query] ?? []
  }, [searchResultsMap, query])

  const handleInput = useCallback<
    preact.JSX.InputEventHandler<HTMLInputElement>
  >(e => setQuery(e.currentTarget.value), [])

  const handleSearch = useCallback(async (query: string) => {
    if (Object.hasOwn(searchResults.get(), query)) return

    setIsLoading(true)

    const results = await actions.search({ query }).catch(() => null)

    searchResults.setKey(query, results ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!query) {
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

interface SearchPostProps {
  result: MultiSearchResult
  onClick?: () => void
}

function Loader() {
  return (
    <div className='flex items-center justify-center gap-2 py-3 text-gray-500'>
      <div class='loading-wrapper'>
        <div class='spinner'>
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div class='loading-bar' style={`--i: ${i}`} />
            ))}
        </div>
      </div>
      <p>Loading...</p>
    </div>
  )
}

function SearchPost({ result, onClick }: SearchPostProps) {
  const isMovie = result.media_type === 'movie'
  const title = isMovie ? result.title : result.name

  if (result.media_type !== 'movie' && result.media_type !== 'tv') return null

  const _year = new Date(
    isMovie ? result.release_date : result.first_air_date
  ).getFullYear()

  const year = Number.isNaN(_year) ? 'N/A' : _year

  return (
    <a
      key={result.id}
      onClick={onClick}
      href={`/play/${result.media_type}/${result.id}/${snakeCase(title)}`}
      className='flex aspect-[4/1] w-full flex-shrink-0 gap-1 overflow-hidden rounded-md hover:bg-white/10'
    >
      <div className='aspect-[3/4] h-full flex-shrink-0 overflow-hidden rounded-md bg-zinc-700/90'>
        {result.poster_path && (
          <img
            src={getImagePath(result.poster_path, 'w300')}
            width='300'
            height='450'
            loading='lazy'
            className='h-full w-full scale-105 object-cover'
          />
        )}
      </div>
      <div className='flex h-full flex-grow flex-col gap-2 p-2'>
        <p className='line-clamp-1 text-sm font-normal !leading-tight text-white/90'>
          {title}
        </p>
        <p className='flex gap-[5px] text-[.7rem] font-light !leading-none text-[#00c1db] 2xl:text-xs'>
          <span className=''>{isMovie ? 'Movie' : 'TV'}</span>
          <span>•</span>
          <span>HD</span>
          <span>•</span>
          <span>{year}</span>
        </p>
      </div>
    </a>
  )
}

export function Search({ children }: preact.ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const { query, handleInput, results, isLoading } = useSearchResults({
    id: '#search-query',
  })
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  useOnClickOutside(ref, handleBlur)

  return (
    <div
      ref={ref}
      className='group relative hidden flex-col items-center gap-3 sm:flex md:gap-4'
    >
      <div className='flex h-8 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'>
        {children}
        <input
          type='search'
          id='search-query'
          onFocus={handleFocus}
          onInput={handleInput}
          placeholder='Search Anything...'
          className='w-56 bg-transparent text-xs font-normal leading-8 tracking-wide text-white/90 outline-none'
        />
      </div>
      {query.length > 0 && (
        <div
          className={`custom-scrollbars absolute left-0 top-full max-h-72 w-full flex-col gap-2 overflow-y-auto rounded-lg bg-black/90 p-2 ${isFocused ? 'flex' : 'hidden'}`}
        >
          {isLoading && <Loader />}
          {!isLoading && results.length === 0 && (
            <p class='py-3 text-center text-gray-500'>No results found!</p>
          )}
          {results.map(result => (
            <SearchPost key={result.id} result={result} onClick={handleBlur} />
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchMobile({ children }: preact.ComponentProps<'div'>) {
  const [open, setOpen] = useState(false)
  const { query, handleInput, results, isLoading } = useSearchResults({
    id: '#mobile-query',
  })

  const handleClick = useCallback(() => setOpen(o => !o), [])

  useEffect(() => {
    if (!open) return

    document.querySelector<HTMLInputElement>('#mobile-query')?.focus?.()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className='sm:hidden'>
      <button
        onClick={handleClick}
        className='flex size-8 items-center justify-center rounded-lg bg-white/20 sm:hidden'
      >
        {children}
      </button>
      {open && (
        <div class='fixed inset-0 h-svh w-full space-y-4 bg-black/80 p-4'>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='flex h-8 flex-1 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'>
              {children}
              <input
                autofocus
                type='text'
                id='mobile-query'
                defaultValue={query}
                onInput={handleInput}
                placeholder='Search Anything...'
                className='w-full bg-transparent text-xs font-normal leading-8 tracking-wide text-white/90 outline-none'
              />
            </div>
            <button
              className='flex size-8 items-center justify-center gap-2 rounded-lg bg-white/10 text-xs backdrop-blur sm:hidden sm:px-2'
              onClick={handleClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>
          <div className='custom-scrollbars flex h-full max-h-[calc(100%-3rem)] w-full flex-col gap-2 overflow-y-auto'>
            {results.map(result => (
              <SearchPost key={result.id} result={result} />
            ))}
            {isLoading && (
              <div class='flex h-full flex-col items-center justify-center'>
                <Loader />
              </div>
            )}
            {!isLoading && query.length > 0 && results.length === 0 && (
              <div className='flex h-full flex-col items-center justify-center'>
                <p class='py-3 text-center text-gray-500'>No results found!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
