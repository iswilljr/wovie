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
  isLoading?: boolean
}

export function MediaGrid({
  media,
  results,
  title,
  class: className,
  icon,
  isLoading,
}: MediaGridProps) {
  return (
    <section className={cn(['px-4 sm:px-8 lg:px-10', className])}>
      <div className='mb-4 flex items-center gap-3'>
        {icon && (
          <div className='flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent'>
            {icon}
          </div>
        )}
        <h2 className='text-lg font-semibold tracking-tight text-white sm:text-xl'>
          {title}
        </h2>
      </div>
      {isLoading && results.length === 0 ? (
        <MediaPostsLoader />
      ) : results.length > 0 ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] sm:gap-4'>
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
              backdropPath={movie.backdrop_path}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
