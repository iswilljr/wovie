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
  isWatchlist?: boolean
  isLoading?: boolean
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
  isWatchlist,
  isLoading,
}: MediaListProps) {
  const editModeState = useStore($editModeState)

  const handleDelete = useCallback(() => {
    $editModeState.set({ isEditMode: !$editModeState.get().isEditMode })
  }, [])

  return (
    <section id={id} className='group/row px-4 sm:px-8 lg:px-10'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {icon && (
            <div className='flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent'>
              {icon}
            </div>
          )}
          <h2 className='text-lg font-semibold tracking-tight text-white sm:text-xl'>
            {title}
          </h2>
        </div>
        {enableEditModeOnMobile && (
          <button
            aria-label='Enable Edit Mode'
            className='flex size-10 items-center justify-center rounded-lg text-zinc-500 transition-all active:scale-90 md:hidden'
            onClick={handleDelete}
          >
            <div className='relative flex size-5 items-center justify-center'>
              <span
                aria-hidden='true'
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${editModeState.isEditMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`}
              >
                <PenOff className='size-5' />
              </span>
              <span
                aria-hidden='true'
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${editModeState.isEditMode ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
              >
                <Edit className='size-5' />
              </span>
            </div>
          </button>
        )}
      </div>

      <div className='relative'>
        <button
          aria-label='Scroll left'
          className='swiper-button swiper-left absolute -left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay/90 text-white backdrop-blur-sm hover:border-accent/30 sm:-left-5'
        >
          <ChevronLeft className='size-5' />
        </button>
        <button
          aria-label='Scroll right'
          className='swiper-button swiper-right absolute -right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-surface-overlay/90 text-white backdrop-blur-sm hover:border-accent/30 sm:-right-5'
        >
          <ChevronRight className='size-5' />
        </button>
        <div className='swiper -mt-3 flex gap-3 overflow-x-auto pb-1 pt-3 scrollbar-hide sm:gap-4'>
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
                isWatchlist={isWatchlist}
              />
            ) : null
          )}
          {isLoading && results.length === 0 && <MediaCardLoader />}
        </div>
      </div>
    </section>
  )
}
