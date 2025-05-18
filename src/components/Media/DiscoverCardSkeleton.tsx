export function DiscoverCardSkeleton() {
  return (
    <div className='swiper-item relative flex h-full w-full flex-shrink-0 items-end justify-start overflow-hidden p-4 py-20 pb-[--discover-space] sm:px-12'>
      {/* Background image skeleton */}
      <div className='absolute inset-0 z-0 h-[30rem] min-h-[30rem] w-full animate-pulse bg-gray-700 object-cover sm:h-svh' />

      <div id='opacity-layer' className='z-10'></div>

      <div className='z-20 flex w-5/6 flex-col gap-2 tracking-wide md:w-[45%] md:gap-4'>
        <div className='flex flex-col gap-1 md:gap-2'>
          {/* Title skeleton */}
          <div className='flex-shrink-0 py-1'>
            <div className='h-8 w-3/4 animate-pulse rounded-md bg-gray-600 sm:h-12' />
          </div>

          {/* Info row skeleton */}
          <div className='flex gap-3'>
            <div className='h-4 w-16 animate-pulse rounded-md bg-gray-600' />
            <div className='h-4 w-24 animate-pulse rounded-md bg-gray-600' />
            <div className='h-4 w-20 animate-pulse rounded-md bg-gray-600' />
          </div>
        </div>

        {/* Overview skeleton */}
        <div className='space-y-2'>
          <div className='h-4 w-full animate-pulse rounded-md bg-gray-600' />
          <div className='h-4 w-2/3 animate-pulse rounded-md bg-gray-600' />
        </div>

        {/* Buttons skeleton */}
        <div className='mt-2 flex gap-2'>
          <div className='h-9 w-[7rem] animate-pulse rounded-full bg-gray-600 sm:h-11 sm:w-[10rem] sm:rounded-lg' />
          <div className='h-9 w-[7rem] animate-pulse rounded-full bg-gray-600 sm:h-11 sm:w-[10rem] sm:rounded-lg' />
        </div>
      </div>
    </div>
  )
}
