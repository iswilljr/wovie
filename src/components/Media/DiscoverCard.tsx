import { CalendarDays, Info, Play, Star } from 'lucide-react'
import { formatDate, slugifyTitle, getImagePath } from '@/utils'
import { getTvOrMovieUrl } from '@/utils/url'

export interface Props {
  media: 'tv' | 'movie'
  id: number | string
  image: string
  language: string
  rating: number
  releaseDate: string
  overview: string
  title: string
  quality?: string | undefined
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
  } = props

  const slug = slugifyTitle(title)

  return (
    <div className='swiper-item relative flex h-full w-full flex-shrink-0 items-end justify-start overflow-hidden p-4 py-20 pb-[--discover-space] sm:px-12'>
      <img
        height='1280'
        width='720'
        alt={title}
        src={getImagePath(image, 'w1280')}
        loading='eager'
        className='absolute inset-0 z-0 h-[30rem] min-h-[30rem] w-full object-cover sm:h-svh'
      />
      <div id='opacity-layer' className='z-10'></div>
      <div className='z-20 flex w-5/6 flex-col gap-2 tracking-wide md:w-[45%] md:gap-4'>
        <div className='flex flex-col gap-1 md:gap-2'>
          <h2 className='line-clamp-2 flex-shrink-0 py-1 text-2xl font-semibold leading-tight text-white sm:text-4xl'>
            {title}
          </h2>
          <div className='flex gap-3 text-xs tracking-wider text-white/90'>
            <p className='flex items-center gap-1 rounded-md'>
              <Star width='15' height='15' fill='#fff' />
              <span>{rating.toFixed(1)}</span>
            </p>
            <p className='flex gap-1'>
              <CalendarDays width='15' height='15' />
              <span>{formatDate(releaseDate)}</span>
            </p>
            <p className='flex items-center gap-1'>
              <span className='uppercase'>{language}</span>
              <span>•</span>
              <p>{quality ?? 'HD'}</p>
            </p>
          </div>
        </div>
        <p className='text-md line-clamp-2 leading-tight text-slate-200'>
          {overview}
        </p>
        <div className='mt-2 flex gap-2'>
          <a
            className='flex w-[7rem] flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full bg-primary-500 p-2 text-sm font-semibold text-black hover:brightness-[.8] sm:w-[10rem] sm:rounded-lg sm:py-[.65rem] sm:text-base'
            href={getTvOrMovieUrl(media, id, slug)}
          >
            <Play width='18' height='18' fill='#000' />
            Play <span className='hidden sm:block'>Now</span>
          </a>
          <a
            className='flex w-[7rem] items-center justify-center gap-1 overflow-hidden rounded-full bg-[#e6e5eb33] p-2 text-sm font-medium tracking-wide text-[whitesmoke] hover:bg-white/10 sm:w-[10rem] sm:rounded-lg sm:py-[.65rem] sm:text-base'
            href={`${getTvOrMovieUrl(media, id, slug)}#info`}
          >
            <Info width='18' height='18' />
            <span className='hidden sm:block'>More</span> Info
          </a>
        </div>
      </div>
    </div>
  )
}
