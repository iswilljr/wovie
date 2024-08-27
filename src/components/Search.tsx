import { useStore } from '@nanostores/preact'
import { searchResults } from '@/store/search'
import { actions } from 'astro:actions'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { useDebouncedState } from '@/hooks/use-debounced-state'
import { snakeCase, getImagePath } from '@/utils'
import type { MultiSearchResult } from 'tmdb-ts'

function useSearchResults({ id = '' }) {
  const searchResultsMap = useStore(searchResults)

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

    const results = await actions.search({ query })
    searchResults.setKey(query, results)
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
    handleSearch,
    handleInput,
  }
}

function SearchPost(props: MultiSearchResult) {
  const isMovie = props.media_type === 'movie'
  const title = isMovie ? props.title : props.name

  if (props.media_type === 'person') return null

  return (
    <a
      key={props.id}
      href={`/play/${props.media_type}/${props.id}/${snakeCase(title)}`}
      className='flex aspect-[4/1] w-full flex-shrink-0 gap-1 overflow-hidden rounded-md hover:bg-white/10'
    >
      <div className='aspect-[3/4] h-full flex-shrink-0 overflow-hidden rounded-md bg-zinc-700/90'>
        {props.poster_path && (
          <img
            src={getImagePath(props.poster_path, 'w300')}
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
          <span>
            {new Date(
              isMovie ? props.release_date : props.first_air_date
            ).getFullYear()}
          </span>
        </p>
      </div>
    </a>
  )
}

export function Search({ children }: preact.ComponentProps<'div'>) {
  const { handleInput, results } = useSearchResults({
    id: '#search-query',
  })

  return (
    <div className='group relative hidden flex-col items-center gap-3 sm:flex md:gap-4'>
      <div className='flex h-8 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'>
        {children}
        <input
          autofocus
          type='search'
          id='search-query'
          onInput={handleInput}
          placeholder='Search Anything...'
          className='w-56 bg-transparent text-xs font-normal leading-8 tracking-wide text-white/90 outline-none'
        />
      </div>
      {results.length > 0 && (
        <div className='custom-scrollbars absolute left-0 top-full hidden max-h-72 w-full flex-col gap-2 overflow-y-auto rounded-lg bg-black/90 p-2 group-focus-within:flex'>
          {results.map(result => (
            <SearchPost key={result.id} {...result} />
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchMobile({ children }: preact.ComponentProps<'div'>) {
  const [open, setOpen] = useState(false)
  const { query, handleInput, results } = useSearchResults({
    id: '#mobile-query',
  })

  const handleClick = useCallback(() => setOpen(o => !o), [])

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
          {results.length > 0 && (
            <div className='custom-scrollbars flex max-h-full w-full flex-col gap-2 overflow-y-auto'>
              {results.map(result => (
                <SearchPost key={result.id} {...result} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
