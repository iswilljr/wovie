import { cn, formatDate, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'
import { Progress } from '@/components/ui/progress'
import { DeleteWatchingButton } from './DeleteWatchingButton'
import { useStore } from '@nanostores/react'
import { $editModeState } from '@/store/editMode'
import { BookmarkIcon, BookmarkCheckIcon, Play } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { Button } from '../ui/button'

export interface MediaCardProps {
  media: 'tv' | 'movie'
  id: number | string
  image: string
  language: string
  rating: number
  releaseDate: string
  title: string
  quality?: string | undefined

  isWatchlist?: boolean | undefined
  watching?: {
    runtime: number
    watchedTime: number
    episode: number
    season: number
    sourceId: string
    updatedAt: Date
  }
}

export function MediaCard({
  id,
  media,
  image,
  language,
  rating,
  releaseDate,
  title,
  quality,
  watching,
  isWatchlist,
}: MediaCardProps) {
  const isWatching = watching != null

  const mediaTitle =
    media === 'tv' && isWatching
      ? `${title} · S${watching.season}E${watching.episode}`
      : title

  const percentageWatched = isWatching
    ? Math.round((watching.watchedTime / watching.runtime) * 100)
    : 0

  const editModeState = useStore($editModeState)

  const { inWatchlist, toggleWatchlist } = useWatchlist({
    id: +id,
    mediaType: media,
    title,
    backdrop_path: image,
    vote_average: rating,
    release_date: releaseDate,
    original_language: language,
    name: title,
    first_air_date: releaseDate,
  })

  return (
    <div
      data-watching-id={isWatching ? id : undefined}
      className='swiper-item group relative w-[17rem] flex-shrink-0 xs:w-[18rem] sm:w-[19rem]'
    >
      <a
        href={getTvOrMovieUrl(
          media,
          id,
          title,
          watching?.season,
          watching?.episode,
          watching?.sourceId
        )}
        className='relative block overflow-hidden rounded-xl bg-surface-overlay shadow-card ring-1 ring-border-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:ring-accent/20'
      >
        <div className='relative aspect-[16/9] overflow-hidden'>
          {image && (
            <img
              width='780'
              height='439'
              loading='lazy'
              alt={title}
              src={getImagePath(image, 'w780')}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          )}
          <div className='absolute inset-0 bg-card-shine opacity-0 transition-opacity group-hover:opacity-100' />
          <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
            <span className='flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-glow'>
              <Play className='size-4 fill-current' />
            </span>
          </div>
          <div className='cinematic-gradient absolute inset-x-0 bottom-0 h-2/3' />
          <div className='absolute inset-x-0 bottom-0 space-y-0.5 p-3'>
            <p className='line-clamp-2 text-sm font-medium leading-snug text-white sm:text-base'>
              {mediaTitle}
            </p>
            <p className='text-[10px] text-zinc-400 sm:text-xs'>
              {formatDate(releaseDate)} · {language.toUpperCase()} ·{' '}
              {quality ?? 'HD'}
            </p>
          </div>
        </div>
        {percentageWatched > 0 && (
          <div className='absolute bottom-0 left-0 right-0'>
            <Progress
              className='h-0.5 rounded-none bg-white/10'
              value={percentageWatched}
            />
          </div>
        )}
      </a>

      {isWatching && (
        <div
          className={cn(
            'absolute right-1.5 top-1.5 transition-all duration-300',
            'opacity-0 md:group-hover:opacity-100',
            editModeState.isEditMode && 'opacity-100'
          )}
        >
          <DeleteWatchingButton id={id} mediaTitle={mediaTitle} />
        </div>
      )}
      {!isWatching && (
        <Button
          onClick={toggleWatchlist}
          size='icon'
          className={cn(
            'absolute right-1.5 top-1.5 z-10 rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground',
            'opacity-0 group-hover:opacity-100',
            inWatchlist && 'bg-accent text-accent-foreground opacity-100',
            isWatchlist && 'opacity-100'
          )}
          aria-label={
            inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
          }
        >
          {inWatchlist ? (
            <BookmarkCheckIcon width={14} height={14} />
          ) : (
            <BookmarkIcon width={14} height={14} />
          )}
        </Button>
      )}
    </div>
  )
}
