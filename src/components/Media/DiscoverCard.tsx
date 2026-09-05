import { CalendarDays, Info, Play, Star } from 'lucide-react'
import { formatDate, slugifyTitle, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'

interface Props {
  media: 'tv' | 'movie'
  id: number | string
  image: string
  language: string
  rating: number
  releaseDate: string
  overview: string
  title: string
  quality?: string | undefined
  index?: number
}

export function DiscoverCard(props: Props) {
  const {
    id,
    media,
    image,
    language,
    overview,
    rating,
    releaseDate,
    title,
    quality,
    index = 0,
  } = props

  const slug = slugifyTitle(title)

  return (
    <div className='swiper-item relative flex h-full min-h-full w-full flex-shrink-0 items-end'>
      <img
        height='1280'
        width='720'
        alt=''
        src={getImagePath(image, 'w1280')}
        loading={index === 0 ? 'eager' : 'lazy'}
        className='absolute inset-0 h-full min-h-full w-full object-cover object-top'
      />
      <div className='hero-gradient absolute inset-0' />
      <div className='cinematic-gradient absolute inset-x-0 bottom-0 h-[55%] min-h-[12rem] sm:h-[60%] sm:min-h-[16rem]' />

      <div
        className='relative z-20 flex w-full flex-col gap-4 px-5 pb-36 pt-20 sm:px-10 sm:pb-40 lg:max-w-2xl lg:pl-12'
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className='animate-fade-up space-y-3'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
            Now Playing
          </p>
          <h2 className='line-clamp-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
            {title}
          </h2>
          <div className='flex flex-wrap items-center gap-3 text-sm text-zinc-300'>
            <span className='flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5'>
              <Star className='size-3.5 fill-accent text-accent' />
              {rating.toFixed(1)}
            </span>
            <span className='flex items-center gap-1.5'>
              <CalendarDays className='size-3.5 text-zinc-500' />
              {formatDate(releaseDate)}
            </span>
            <span className='uppercase text-zinc-500'>{language}</span>
            <span className='rounded border border-accent/30 px-1.5 py-0.5 text-xs font-medium text-accent'>
              {quality ?? 'HD'}
            </span>
          </div>
        </div>

        <p className='animate-fade-up line-clamp-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base'>
          {overview}
        </p>

        <div className='animate-fade-up flex gap-3'>
          <a
            className='flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition-all hover:bg-accent-bright active:scale-[0.98] sm:px-7 sm:py-3 sm:text-base'
            href={getTvOrMovieUrl(media, id, slug)}
          >
            <Play className='size-4 fill-current' />
            Watch Now
          </a>
          <a
            className='flex items-center gap-2 rounded-xl border border-border bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:px-7 sm:py-3 sm:text-base'
            href={`${getTvOrMovieUrl(media, id, slug)}#info`}
          >
            <Info className='size-4' />
            Details
          </a>
        </div>
      </div>
    </div>
  )
}
