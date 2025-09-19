import { useCallback } from 'react'
import { ChevronLeft, ChevronRight, Edit, PenOff } from 'lucide-react'
import { MediaCard } from './MediaCard'
import type {
  MovieWithMediaType,
  PersonWithMediaType,
  TVWithMediaType,
} from 'tmdb-ts'
import { MediaCardLoader } from '../Loader'
import { $editModeState } from '@/store/editMode'
import { useStore } from '@nanostores/react'

export interface MediaListProps {
  id: string
  title: string
  icon?: React.ReactNode
  enableEditModeOnMobile?: boolean
  results: Array<
    (TVWithMediaType | MovieWithMediaType | PersonWithMediaType) & {
      watching?: any
      quality?: string
    }
  >
}

export function MediaList({
  id,
  results,
  title,
  icon,
  enableEditModeOnMobile,
}: MediaListProps) {
  const editModeState = useStore($editModeState)

  const handleDelete = useCallback(() => {
    $editModeState.set({ isEditMode: !$editModeState.get().isEditMode })
  }, [])

  return (
    <div id={id} className='flex w-full flex-col gap-6 p-4 sm:px-12'>
      <div className='flex w-full items-center justify-between'>
        <div className='z-10 flex w-full items-center gap-2 py-1 text-lg font-medium tracking-wide text-white md:text-2xl'>
          <div className='flex size-6 items-center justify-center rounded bg-primary-500'>
            {icon}
          </div>
          <p>{title}</p>
        </div>
        {enableEditModeOnMobile && (
          <button
            aria-label='Enable Edit Mode'
            className='flex size-12 items-center justify-center text-gray-400 transition-all duration-300 ease-in-out rounded-lg active:scale-75 md:hidden'
            onClick={handleDelete}
          >
            <div className='relative size-6 flex items-center justify-center'>
              <span
                aria-hidden='true'
                className={`absolute size-6 inset-0 flex items-center justify-center transition-all duration-300 ease-out ${editModeState.isEditMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}
              >
                <PenOff />
              </span>
              <span
                aria-hidden='true'
                className={`absolute size-6 inset-0 flex items-center justify-center transition-all duration-300 ease-out ${editModeState.isEditMode ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
              >
                <Edit />
              </span>
            </div>
          </button>
        )}
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
                key={movie.id}
                media={movie.media_type}
                id={movie.id}
                quality={movie.quality}
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
