import { DiscoverCard } from '@/components/Media/DiscoverCard'
import { swrDefaultOptions } from '@/utils'
import { actions } from 'astro:actions'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useSWR from 'swr'
import { DiscoverCardSkeleton } from './DiscoverCardSkeleton'

export function Discover() {
  const { data: nowPlaying, isLoading } = useSWR(
    'nowPlaying',
    () => actions.nowPlaying(),
    swrDefaultOptions
  )

  return (
    <div
      id='discover'
      className='group/row relative z-0 -mt-[var(--navbar-height)] h-[calc(70svh+var(--navbar-height))] min-h-[calc(28rem+var(--navbar-height))] w-full overflow-hidden sm:h-[calc(85svh+var(--navbar-height))]'
    >
      <div className='pointer-events-none absolute inset-0 bg-hero-vignette' />
      <div className='discover-bleed-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] min-h-[16rem] sm:h-[60%] sm:min-h-[20rem]' />
      <button
        aria-label='Previous'
        className='swiper-button swiper-left absolute left-2 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay/80 text-white backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-surface-overlay sm:left-4'
      >
        <ChevronLeft className='size-5' />
      </button>
      <button
        aria-label='Next'
        className='swiper-button swiper-right absolute right-2 top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay/80 text-white backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-surface-overlay sm:right-4'
      >
        <ChevronRight className='size-5' />
      </button>
      <div className='swiper flex h-full min-h-full w-full overflow-x-auto scrollbar-hide'>
        {nowPlaying?.data?.map((movie, i) => (
          <DiscoverCard
            key={movie.id}
            media='movie'
            id={movie.id}
            rating={movie.vote_average}
            image={movie.backdrop_path}
            language={movie.original_language}
            releaseDate={movie.release_date}
            title={movie.title}
            overview={movie.overview}
            quality={movie.quality}
            index={i}
          />
        ))}

        {isLoading && <DiscoverCardSkeleton />}
      </div>
    </div>
  )
}
