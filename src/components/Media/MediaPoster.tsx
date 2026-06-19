import { slugifyTitle, getImagePath, cn, formatDate } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'
import { BookmarkIcon, BookmarkCheckIcon, Play, Star } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'

interface Props {
  media: 'tv' | 'movie'
  id: number | string
  image: string | undefined
  language: string
  rating: number
  releaseDate: string
  title: string
  backdropPath: string | undefined
  quality?: string | undefined
}

export function MediaPoster(props: Props) {
  const {
    id,
    media,
    image,
    language,
    rating,
    releaseDate,
    title,
    quality,
    backdropPath,
  } = props

  const { inWatchlist, toggleWatchlist } = useWatchlist({
    id: +id,
    mediaType: media,
    title,
    backdrop_path: backdropPath ?? image ?? '',
    vote_average: rating,
    release_date: releaseDate,
    original_language: language,
    name: title,
    first_air_date: releaseDate,
  })

  return (
    <div className='group relative'>
      <button
        onClick={toggleWatchlist}
        className={cn(
          'absolute left-0 top-0 z-10 rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground',
          'opacity-0 group-hover:opacity-100',
          inWatchlist && 'bg-accent text-accent-foreground opacity-100'
        )}
      >
        {inWatchlist ? (
          <BookmarkCheckIcon width={14} height={14} />
        ) : (
          <BookmarkIcon width={14} height={14} />
        )}
      </button>
      <a
        className='relative flex flex-col overflow-hidden rounded-xl bg-surface-overlay ring-1 ring-border-subtle transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card hover:ring-accent/20'
        href={getTvOrMovieUrl(media, id, slugifyTitle(title))}
      >
        <div className='relative aspect-[2/3] overflow-hidden'>
          {image && (
            <img
              width='300'
              height='450'
              alt={title}
              loading='lazy'
              src={getImagePath(image, 'w342')}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          )}
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
            <span className='flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground'>
              <Play className='size-3.5 fill-current' />
            </span>
          </div>
          <div className='absolute right-0 top-0 flex items-center gap-0.5 rounded-bl-md bg-black/70 px-1 py-0.5'>
            <Star className='size-3 fill-yellow-400 text-yellow-400' />
            <span className='text-xs font-medium text-white'>
              {rating.toFixed(1)}
            </span>
          </div>
          <div className='cinematic-gradient absolute inset-x-0 bottom-0 h-2/3' />
          <div className='absolute inset-x-0 bottom-0 space-y-0.5 p-2.5'>
            <p className='line-clamp-2 text-center text-xs font-medium leading-snug text-white sm:text-sm'>
              {title}
            </p>
            <p className='text-center text-[10px] text-zinc-400 sm:text-xs'>
              {formatDate(releaseDate)} · {language.toUpperCase()} ·{' '}
              {quality ?? 'HD'}
            </p>
          </div>
        </div>
      </a>
    </div>
  )
}
