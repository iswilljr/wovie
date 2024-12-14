import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaCard } from './MediaCard'
import type {
  MovieWithMediaType,
  PersonWithMediaType,
  TVWithMediaType,
} from 'tmdb-ts'
import { MediaCardLoader } from '../Loader'

export interface MediaListProps {
  id: string
  title: string
  icon?: React.ReactNode
  results: Array<
    (TVWithMediaType | MovieWithMediaType | PersonWithMediaType) & {
      watching?: any
    }
  >
}

export function MediaList({ id, results, title, icon }: MediaListProps) {
  return (
    <div id={id} className='flex w-full flex-col gap-6 p-4 sm:px-12'>
      <div className='z-10 flex w-full items-center gap-2 py-1 text-lg font-medium tracking-wide text-white md:text-2xl'>
        <div className='flex size-6 items-center justify-center rounded bg-primary-500'>
          {icon}
        </div>
        <p>{title}</p>
      </div>
      <div className='relative flex items-center'>
        <button className='swiper-button swiper-left absolute -left-12 z-20 flex size-12 items-center justify-center text-white'>
          <ChevronLeft />
        </button>
        <button
          id='swiper-right'
          className='swiper-button swiper-right absolute -right-12 z-20 flex size-12 items-center justify-center text-white'
        >
          <ChevronRight />
        </button>
        <div className='swiper relative z-10 flex w-full gap-4 overflow-auto rounded-2xl scrollbar-hide'>
          {results.map(movie =>
            movie.media_type !== 'person' ? (
              <MediaCard
                media={movie.media_type}
                id={movie.id}
                rating={movie.vote_average}
                image={movie.backdrop_path}
                language={movie.original_language}
                releaseDate={
                  movie.media_type === 'movie'
                    ? movie.release_date
                    : movie.first_air_date
                }
                title={movie.media_type === 'movie' ? movie.title : movie.name}
                watching={movie.watching}
              />
            ) : null
          )}
          {results.length === 0 && <MediaCardLoader />}
        </div>
      </div>
    </div>
  )
}
