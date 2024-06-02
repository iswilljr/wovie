import { actions } from 'astro:actions'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useDebouncedState } from '@/hooks/use-debounced-state'
import { snakeCase, getImagePath } from '@/utils'
import type { MultiSearchResult } from 'tmdb-ts'

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
      <div className='aspect-[3/4] h-full flex-shrink-0 overflow-hidden rounded-md bg-white/10'>
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
  const [query, setQuery] = useDebouncedState('')
  const [results, setResults] = useState<MultiSearchResult[]>([])

  const handleSearch = useCallback(async (query: string) => {
    const results = await actions.search({ query })
    setResults(results)
  }, [])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    handleSearch(query).catch(() => null)
  }, [query, handleSearch])

  return (
    <div className='group relative hidden flex-col items-center gap-3 sm:flex md:gap-4'>
      <div className='flex h-8 items-center gap-2 rounded-lg bg-white/20 px-2 backdrop-blur'>
        <span className='flex h-8 w-auto items-center justify-center'>
          {children}
        </span>
        <input
          type='search'
          name='search'
          autoComplete='off'
          placeholder='Search Anything...'
          onInput={e => setQuery(e.currentTarget.value)}
          className='w-56 bg-transparent text-xs font-normal leading-8 tracking-wide text-white/90 outline-none'
        />
      </div>
      {results.length > 0 && (
        <div className='absolute left-0 top-full hidden max-h-72 w-full flex-col gap-[.4rem] !overflow-y-auto rounded-lg bg-black/90 p-2 scrollbar-hide group-focus-within:flex'>
          {results.map(result => (
            <SearchPost key={result.id} {...result} />
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchMobile({ children }: preact.ComponentProps<'div'>) {
  return (
    <div className='flex h-8 items-center gap-2 rounded-lg bg-white/20 backdrop-blur sm:hidden sm:px-2'>
      <span className='flex size-8 items-center justify-center sm:w-auto'>
        {children}
      </span>
    </div>
  )
}
