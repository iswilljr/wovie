import { cn } from '@/utils'
import { MediaPoster } from './MediaPoster'
import type { Movie, Recommendation, TV } from 'tmdb-ts'
import { MediaPostsLoader } from '../Loader'

export interface MediaGridProps {
  media: 'tv' | 'movie'
  title: string
  results: Array<(Movie | TV | Recommendation) & { quality?: string }>
  class?: string
  icon?: React.ReactNode
}

export function MediaGrid({
  media,
  results,
  title,
  class: className,
  icon,
}: MediaGridProps) {
  const showIcon = icon != null

  return (
    <div className={cn(['flex w-full flex-col gap-6 p-4 sm:px-12', className])}>
      <div className='z-10 flex w-full items-center gap-2 py-1'>
        {showIcon && (
          <div className='flex size-6 items-center justify-center rounded bg-primary-500'>
            {icon}
          </div>
        )}
        <h2 className='text-lg font-medium tracking-wide text-white md:text-2xl'>
          {title}
        </h2>
      </div>
      {results.length > 0 ? (
        <div className='relative z-10 grid w-full grid-cols-[repeat(auto-fill,minmax(150px,1fr))] flex-wrap gap-4'>
          {results.map(movie => (
            <MediaPoster
              key={movie.id}
              media={media}
              id={movie.id}
              quality={movie.quality}
              rating={movie.vote_average}
              image={movie.poster_path}
              language={movie.original_language}
              releaseDate={
                'release_date' in movie
                  ? movie.release_date
                  : movie.first_air_date
              }
              title={'title' in movie ? movie.title : movie.name}
            />
          ))}
        </div>
      ) : (
        <MediaPostsLoader />
      )}
    </div>
  )
}
