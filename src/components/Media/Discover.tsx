import { DiscoverCard } from '@/components/Media/DiscoverCard'
import { swrDefaultOptions } from '@/utils'
import { actions } from 'astro:actions'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useSWR from 'swr'
import { DiscoverCardSkeleton } from './DiscoverCardSkeleton'

export function Discover() {
  const { data: nowPlaying } = useSWR(
    'trending',
    () => actions.trending(),
    swrDefaultOptions
  )

  return (
    <div
      id='discover'
      className='relative z-0 flex h-[30rem] min-h-[30rem] w-full items-center sm:h-svh'
    >
      <button className='swiper-button swiper-left absolute left-0 z-20 flex size-12 items-center justify-center text-white'>
        <ChevronLeft />
      </button>
      <button
        id='swiper-right'
        className='swiper-button swiper-right absolute right-0 z-20 flex size-12 items-center justify-center text-white'
      >
        <ChevronRight />
      </button>
      <div className='swiper flex h-[30rem] min-h-[30rem] w-full overflow-auto scrollbar-hide sm:h-svh'>
        {nowPlaying?.data?.nowPlaying.map(movie => (
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
          />
        ))}

        {(nowPlaying?.data?.nowPlaying == null ||
          nowPlaying.data.nowPlaying.length === 0) && <DiscoverCardSkeleton />}
      </div>
    </div>
  )
}
