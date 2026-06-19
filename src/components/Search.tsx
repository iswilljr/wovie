import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useSearchResults } from '@/hooks/use-search'
import { slugifyTitle, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'
import { Loader } from './Loader'
import type { MultiSearchResult } from 'tmdb-ts'

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
      className='flex gap-3 rounded-xl p-2 transition-colors hover:bg-white/5'
    >
      <div className='aspect-[2/3] h-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-overlay ring-1 ring-border-subtle'>
        {result.poster_path && (
          <img
            src={getImagePath(result.poster_path, 'w154')}
            width='154'
            height='231'
            loading='lazy'
            className='h-full w-full object-cover'
          />
        )}
      </div>
      <div className='flex min-w-0 flex-col justify-center gap-1'>
        <p className='line-clamp-1 text-sm font-medium text-zinc-200'>
          {title}
        </p>
        <p className='text-xs text-zinc-500'>
          {isMovie ? 'Movie' : 'TV'} · {year}
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
    <div ref={ref} className='relative hidden sm:block'>
      <div
        style={{ viewTransitionName: 'search' }}
        className='flex h-9 w-64 items-center gap-2 rounded-xl border border-border-subtle bg-surface-overlay/60 px-3 backdrop-blur-sm transition-colors focus-within:border-accent/30 focus-within:bg-surface-overlay'
      >
        {children}
        <input
          type='search'
          id='search-query'
          onFocus={handleFocus}
          onChange={handleInput}
          placeholder='Search titles...'
          className='w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500'
        />
      </div>
      {query.length > 0 && (
        <div
          className={`custom-scrollbars absolute left-0 top-[calc(100%+8px)] max-h-80 w-full flex-col gap-1 overflow-y-auto rounded-xl border border-border-subtle bg-surface-raised p-2 shadow-card ${isFocused ? 'flex' : 'hidden'}`}
        >
          {isLoading && <Loader />}
          {!isLoading && results.length === 0 && (
            <p className='py-4 text-center text-sm text-zinc-500'>
              No results found
            </p>
          )}
          {results.map(result => (
            <SearchPost key={result.id} result={result} onClick={handleBlur} />
          ))}
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
        className='flex size-9 items-center justify-center rounded-xl border border-border-subtle bg-surface-overlay/60'
      >
        {children}
      </button>
      {open && (
        <div className='fixed inset-0 z-[100] flex flex-col bg-surface/95 p-4 backdrop-blur-xl'>
          <div className='flex items-center gap-2'>
            <div className='flex h-11 flex-1 items-center gap-2 rounded-xl border border-border-subtle bg-surface-overlay px-3'>
              {children}
              <input
                autoFocus
                type='text'
                id='mobile-query'
                defaultValue={query}
                onInput={handleInput}
                placeholder='Search titles...'
                className='w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500'
              />
            </div>
            <button
              className='flex size-11 items-center justify-center rounded-xl border border-border-subtle text-zinc-400'
              onClick={handleClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
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
          <div className='custom-scrollbars mt-4 flex flex-1 flex-col gap-1 overflow-y-auto'>
            {results.map(result => (
              <SearchPost
                key={result.id}
                result={result}
                onClick={handleClick}
              />
            ))}
            {isLoading && (
              <div className='flex flex-1 items-center justify-center'>
                <Loader />
              </div>
            )}
            {!isLoading && query.length > 0 && results.length === 0 && (
              <div className='flex flex-1 items-center justify-center'>
                <p className='text-sm text-zinc-500'>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
