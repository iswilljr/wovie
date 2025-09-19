import { cn, formatDate, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'
import { Progress } from '@/components/ui/progress'
import { DeleteWatchingButton } from './DeleteWatchingButton'
import { useStore } from '@nanostores/react'
import { $editModeState } from '@/store/editMode'

export interface MediaCardProps {
  media: 'tv' | 'movie'
  id: number | string
  image: string
  language: string
  rating: number
  releaseDate: string
  title: string
  quality?: string | undefined

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
}: MediaCardProps) {
  const isWatching = watching != null

  const mediaTitle =
    media === 'tv' && isWatching
      ? `${title} - S${watching.season}E${watching.episode}`
      : title

  const percentageWatched = isWatching
    ? Math.round((watching.watchedTime / watching.runtime) * 100)
    : 0

  const editModeState = useStore($editModeState)

  return (
    <div
      data-watching-id={isWatching ? id : undefined}
      className='swiper-item group relative flex aspect-[2/1] h-fit w-full flex-shrink-0 flex-col gap-2 overflow-hidden rounded-2xl xs:w-8/12 sm:w-80'
    >
      <a
        className=''
        href={getTvOrMovieUrl(
          media,
          id,
          title,
          watching?.season,
          watching?.episode,
          watching?.sourceId
        )}
      >
        <div className='z-0'>
          {image && (
            <img
              width='780'
              height='440'
              loading='lazy'
              alt={title}
              src={getImagePath(image, 'w780')}
              className='h-full w-full object-cover object-center duration-150 group-hover:scale-[1.03] group-focus:scale-[1.03]'
            />
          )}
        </div>
        <div className='gradient-opacity absolute inset-0 flex h-full w-full flex-col justify-end gap-1 rounded-2xl p-3 ring-inset ring-primary-500 duration-150 group-hover:ring-2 group-focus:ring-2 md:gap-2'>
          <p className='line-clamp-2 text-sm font-bold uppercase !leading-none tracking-wide text-white sm:text-base'>
            {mediaTitle}
          </p>
          <div className='flex flex-wrap gap-1 text-xs font-normal !leading-tight tracking-wider text-primary-400'>
            <p>Rating: {rating.toFixed(1)}</p>
            <span>•</span>
            <p>{formatDate(releaseDate)}</p>
            <span>•</span>
            <p className='uppercase'>{language}</p>
            <span>•</span>
            <p>{quality ?? 'HD'}</p>
          </div>
        </div>
        {percentageWatched > 0 && (
          <div className='absolute bottom-0 left-0 w-full duration-300 group-hover:opacity-20'>
            <Progress className='h-1' value={percentageWatched} />
          </div>
        )}
      </a>
      {isWatching && (
        <div
          className={cn(
            'absolute right-2 top-2 opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100',
            editModeState.isEditMode && 'opacity-100'
          )}
        >
          <DeleteWatchingButton id={id} mediaTitle={mediaTitle} />
        </div>
      )}
    </div>
  )
}
