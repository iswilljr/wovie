import { snakeCase, getImagePath } from '@/utils'

interface Props {
  media: 'tv' | 'movie'
  id: number | string
  image: string | undefined
  language: string
  rating: number
  releaseDate: string
  title: string
}

function Star(props: preact.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  )
}

function Play(props: preact.JSX.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polygon points='6 3 20 12 6 21 6 3' />
    </svg>
  )
}

export function MediaPoster(props: Props) {
  const { id, media, image, language, rating, releaseDate, title } = props

  return (
    <a
      class='group relative flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-lg bg-[#35383f] outline-none'
      href={`/play/${media}/${id}/${snakeCase(title)}`}
    >
      {image && (
        <img
          width='300'
          height='150'
          alt={title}
          loading='lazy'
          src={getImagePath(image, 'w300')}
          class='h-full w-full object-cover object-center duration-150 group-hover:scale-[1.04] group-focus:scale-[1.04]'
        />
      )}
      <div class='absolute right-0 top-0 flex items-center justify-center gap-1 rounded-bl-md bg-black/70 px-[5px] py-1'>
        <Star width='13' height='13' fill='#ffd700' stroke='#ffd700' />
        <span class='text-xs font-light text-white'>{rating.toFixed(1)}</span>
      </div>
      <div
        role='button'
        aria-label='Play Now'
        class='absolute z-20 flex items-center justify-center rounded-full bg-primary-500 p-[.6rem] opacity-0 duration-150 hover:brightness-90 group-hover:opacity-100 group-focus:opacity-100'
      >
        <Play width='16' height='16' fill='#000000d5' stroke='#000000d5' />
      </div>
      <div class='absolute inset-0 z-10 flex flex-col justify-end gap-1 rounded-lg bg-gradient-to-t from-[#000000d0] p-3 outline-none ring-inset ring-primary-500 duration-150 group-hover:opacity-100 group-hover:ring-2 group-focus:opacity-100 group-focus:ring-2 group-[:not(:has(>img))]:opacity-100 sm:opacity-0'>
        <div class='flex items-center justify-center gap-1 text-xs text-[#d8d8d8]'>
          <p>{new Date(releaseDate).getFullYear()}</p>
          <span>•</span>
          <p class='uppercase'>{language}</p>
          <span>•</span>
          <p>HD</p>
        </div>
        <p class='line-clamp-2 text-center text-sm font-medium leading-tight text-white'>
          {title}
        </p>
      </div>
    </a>
  )
}
