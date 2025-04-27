import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useSearchResults } from '@/hooks/use-search'
import { slugifyTitle, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'
import { Loader } from './Loader'
import type { MultiSearchResult } from 'tmdb-ts'

const LIMIT = 3

interface SearchPostProps {
  result: MultiSearchResult
  onClick?: () => void
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
      href={getTvOrMovieUrl(result.media_type, result.id, slugifyTitle(title))}
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
        <p className='line-clamp-1 text-sm font-semibold !leading-tight text-white/90'>
          {title}
        </p>
        <p className='flex gap-[5px] text-[.7rem] font-medium !leading-none text-primary-400 2xl:text-xs'>
          <span className=''>{isMovie ? 'Movie' : 'TV'}</span>
          <span>•</span>
          <span>{year}</span>
        </p>
      </div>
    </a>
  )
}

export function Search({ children }: React.ComponentProps<'div'>) {
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
      <div
        style={{ viewTransitionName: 'search' }}
        className='flex h-8 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'
      >
        {children}
        <input
          type='search'
          id='search-query'
          onFocus={handleFocus}
          onChange={handleInput}
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
            <p className='py-3 text-center text-gray-500'>No results found!</p>
          )}
          {results.slice(0, LIMIT).map(result => (
            <SearchPost key={result.id} result={result} onClick={handleBlur} />
          ))}
          {results.length > LIMIT && (
            <div className='flex h-full flex-col items-center justify-end'>
              <a
                href={`/explore?q=${query}`}
                onClick={handleBlur}
                className='w-full rounded-lg px-4 py-1 text-center text-sm text-white'
              >
                View {results.length - LIMIT} more results
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function SearchMobile({ children }: React.ComponentProps<'div'>) {
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
        aria-label='Search'
        className='flex size-8 items-center justify-center rounded-lg bg-white/20 sm:hidden'
      >
        {children}
      </button>
      {open && (
        <div className='fixed inset-0 h-svh w-full space-y-4 bg-black/80 p-4'>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='flex h-8 flex-1 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'>
              {children}
              <input
                autoFocus
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
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>
          <div className='custom-scrollbars flex h-full max-h-[calc(100%-3rem)] w-full flex-col gap-2 overflow-y-auto'>
            {results.map(result => (
              <SearchPost
                key={result.id}
                result={result}
                onClick={handleClick}
              />
            ))}
            {isLoading && (
              <div className='flex h-full flex-col items-center justify-center'>
                <Loader />
              </div>
            )}
            {!isLoading && query.length > 0 && results.length === 0 && (
              <div className='flex h-full flex-col items-center justify-center'>
                <p className='py-3 text-center text-gray-500'>
                  No results found!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
