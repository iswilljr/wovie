import { useRef } from 'react'
import { MediaPoster } from '@/components/Media/MediaPoster.tsx'
import { useSearchResults } from '@/hooks/use-search'
import { MediaPostsLoader } from '@/components/Loader.tsx'
import type { MultiSearchResult } from 'tmdb-ts'

export function ExplorePage({
  children,
  query: initialQuery,
  searchData,
  trending,
}: React.ComponentProps<'div'> & {
  query: string
  searchData: MultiSearchResult[] | null | undefined
  trending: MultiSearchResult[] | null | undefined
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { handleInput, results, isLoading } = useSearchResults({
    trending,
    initialQuery,
    initialResults: searchData,
    isExplorePage: true,
    id: '#search-query',
  })

  return (
    <div ref={ref} className='relative flex flex-col items-center gap-4'>
      <div
        className='flex h-12 w-full items-center gap-2 rounded-lg bg-white/20 px-4 text-lg backdrop-blur'
        style={{ viewTransitionName: 'search' }}
      >
        {children}
        <form className='w-full'>
          <input
            name='q'
            type='search'
            id='search-query'
            onChange={handleInput}
            defaultValue={initialQuery}
            placeholder='Search Anything...'
            className='w-full bg-transparent text-lg font-normal leading-8 tracking-wide text-white/90 outline-none'
          />
        </form>
      </div>
      <div className='w-full'>
        {isLoading && <MediaPostsLoader />}
        {!isLoading && results.length === 0 && (
          <p className='py-3 text-center text-gray-500'>No results found!</p>
        )}
        <div className='relative z-10 grid w-full grid-cols-[repeat(auto-fill,minmax(150px,1fr))] flex-wrap gap-4'>
          {results.map(result => (
            <MediaPoster
              media={result.media_type}
              id={result.id}
              rating={result.vote_average}
              image={result.poster_path}
              language={result.original_language}
              releaseDate={
                result.media_type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }
              title={result.media_type === 'movie' ? result.title : result.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
