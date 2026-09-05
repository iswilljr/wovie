import { useEffect, useMemo, useState } from 'react'
import { MediaPoster } from '@/components/Media/MediaPoster'
import { useSearchResults } from '@/hooks/use-search'
import { MediaPostsLoader } from '@/components/Loader'
import type { Genre, MultiSearchResult } from 'tmdb-ts'
import { ActiveGenreTags, GenreFilter } from './GenreFilter'
import { actions } from 'astro:actions'
import { cn } from '@/utils'
import { Clapperboard, Film, Search, Sparkles, Tv, X } from 'lucide-react'

type MediaTab = 'all' | 'movie' | 'tv'

const MEDIA_TABS: Array<{ id: MediaTab; label: string; icon: typeof Film }> = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'movie', label: 'Movies', icon: Film },
  { id: 'tv', label: 'TV Shows', icon: Tv },
]

function isMediaResult(
  result: MultiSearchResult
): result is Extract<MultiSearchResult, { media_type: 'movie' | 'tv' }> {
  return result.media_type === 'movie' || result.media_type === 'tv'
}

function filterByMediaType(
  items: MultiSearchResult[],
  mediaType: MediaTab
): Array<Extract<MultiSearchResult, { media_type: 'movie' | 'tv' }>> {
  return items.filter(isMediaResult).filter(item => {
    if (mediaType === 'all') return true
    return item.media_type === mediaType
  })
}

function ExploreEmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-20 text-center'>
      <div className='mb-5 flex size-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface-overlay/60'>
        <Clapperboard className='size-7 text-zinc-600' strokeWidth={1.5} />
      </div>
      <h3 className='text-lg font-semibold text-white'>Nothing found</h3>
      <p className='mt-2 max-w-sm text-sm leading-relaxed text-zinc-500'>
        {hasQuery
          ? 'Try a different title, or browse trending picks below.'
          : 'Pick a genre or search for something new to watch.'}
      </p>
    </div>
  )
}

export function ExplorePage({
  query: initialQuery,
  searchData,
  trending,
  genres,
}: {
  query: string
  searchData: MultiSearchResult[] | null | undefined
  trending: MultiSearchResult[] | null | undefined
  genres: Genre[]
}) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [mediaTab, setMediaTab] = useState<MediaTab>('all')
  const [isDiscovering, setIsDiscovering] = useState(false)

  const { query, handleInput, results, setResults, isLoading } =
    useSearchResults({
      trending,
      initialQuery,
      initialResults: searchData,
      isExplorePage: true,
      id: '#explore-search',
    })

  const isSearching = query.length > 0
  const hasGenreFilter = selectedGenres.length > 0

  const handleGenreChange = (genreId: number | null) => {
    if (genreId === null) {
      setSelectedGenres([])
      return
    }

    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    )
  }

  useEffect(() => {
    if (isSearching) return

    if (hasGenreFilter) {
      setIsDiscovering(true)
      const genreIds = selectedGenres.join(',')

      const fetchDiscover = async () => {
        if (mediaTab === 'all') {
          const [moviesRes, tvRes] = await Promise.all([
            actions.discoverByGenre({ mediaType: 'movie', genres: genreIds }),
            actions.discoverByGenre({ mediaType: 'tv', genres: genreIds }),
          ])

          const movies = (moviesRes.data ?? []).map(item => ({
            ...item,
            media_type: 'movie' as const,
          }))
          const tv = (tvRes.data ?? []).map(item => ({
            ...item,
            media_type: 'tv' as const,
          }))

          setResults([...movies, ...tv] as MultiSearchResult[])
        } else {
          const res = await actions.discoverByGenre({
            mediaType: mediaTab,
            genres: genreIds,
          })
          const data = (res.data ?? []).map(item => ({
            ...item,
            media_type: mediaTab,
          }))
          setResults(data as MultiSearchResult[])
        }
        setIsDiscovering(false)
      }

      void fetchDiscover()
    } else {
      setResults(trending ?? [])
    }
  }, [
    selectedGenres,
    mediaTab,
    setResults,
    trending,
    isSearching,
    hasGenreFilter,
  ])

  const displayResults = useMemo(
    () => filterByMediaType(results, mediaTab),
    [results, mediaTab]
  )

  const resultsLabel = useMemo(() => {
    if (isSearching) return `Results for “${query}”`
    if (hasGenreFilter) {
      const names = genres
        .filter(g => selectedGenres.includes(g.id))
        .map(g => g.name)
        .join(', ')
      return names
    }
    if (mediaTab === 'movie') return 'Trending movies'
    if (mediaTab === 'tv') return 'Trending TV shows'
    return 'Trending now'
  }, [isSearching, query, hasGenreFilter, genres, selectedGenres, mediaTab])

  const showLoader = isLoading || isDiscovering
  const showEmpty = !showLoader && displayResults.length === 0

  const clearSearch = () => {
    handleInput({
      currentTarget: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>)
    const input = document.querySelector<HTMLInputElement>('#explore-search')
    if (input) input.value = ''
  }

  return (
    <div className='relative mx-auto max-w-[90rem]'>
      <section className='animate-fade-up mb-8 sm:mb-10'>
        <p className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
          Browse the catalog
        </p>
        <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>
          Explore
        </h1>

        <div
          className='group/search relative mt-6 sm:mt-8'
          style={{ viewTransitionName: 'search' }}
        >
          <div className='pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/20 via-accent/5 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-focus-within/search:opacity-100' />
          <form
            className='relative flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-raised/80 px-4 py-3 backdrop-blur-md transition-colors focus-within:border-accent/40 sm:px-5 sm:py-4'
            onSubmit={e => e.preventDefault()}
          >
            <Search
              className='size-5 shrink-0 text-zinc-500 transition-colors group-focus-within/search:text-accent'
              strokeWidth={2}
            />
            <input
              name='q'
              type='search'
              id='explore-search'
              onChange={handleInput}
              defaultValue={initialQuery}
              placeholder='Search movies, TV shows, and more...'
              className='w-full bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600 sm:text-lg'
              autoComplete='off'
            />
            {query.length > 0 && (
              <button
                type='button'
                onClick={clearSearch}
                aria-label='Clear search'
                className='flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white'
              >
                <X className='size-4' />
              </button>
            )}
          </form>
        </div>

        <div className='mt-5 flex flex-col gap-4 sm:mt-6'>
          <div className='flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-overlay/40 p-1 sm:inline-flex sm:w-auto'>
            {MEDIA_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type='button'
                onClick={() => setMediaTab(id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none',
                  mediaTab === id
                    ? 'bg-accent text-accent-foreground shadow-glow'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className='size-4' />
                {label}
              </button>
            ))}
          </div>

          <ActiveGenreTags
            genres={genres}
            selectedGenres={selectedGenres}
            onGenreChange={handleGenreChange}
          />
        </div>
      </section>

      <div className='lg:grid lg:grid-cols-[13rem_1fr] lg:gap-10 xl:grid-cols-[15rem_1fr]'>
        <GenreFilter
          variant='sidebar'
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreChange={handleGenreChange}
          className='hidden lg:flex'
        />

        <div className='min-w-0'>
          <GenreFilter
            variant='chips'
            genres={genres}
            selectedGenres={selectedGenres}
            onGenreChange={handleGenreChange}
            className='mb-5 lg:hidden'
          />

          <div className='mb-5 flex items-end justify-between gap-4 border-b border-border-subtle pb-4'>
            <div>
              <h2 className='text-lg font-semibold tracking-tight text-white sm:text-xl'>
                {resultsLabel}
              </h2>
              {!showLoader && displayResults.length > 0 && (
                <p className='mt-0.5 text-sm text-zinc-500'>
                  {displayResults.length}{' '}
                  {displayResults.length === 1 ? 'title' : 'titles'}
                </p>
              )}
            </div>
          </div>

          {showLoader && <MediaPostsLoader />}

          {showEmpty && <ExploreEmptyState hasQuery={isSearching} />}

          {!showLoader && displayResults.length > 0 && (
            <div className='grid grid-cols-2 gap-3 xs:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]'>
              {displayResults.map(result => (
                <MediaPoster
                  key={`${result.media_type}-${result.id}`}
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
                  title={
                    result.media_type === 'movie' ? result.title : result.name
                  }
                  backdropPath={result.backdrop_path}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
