export function DiscoverCardSkeleton() {
  return (
    <div className='swiper-item relative flex h-full min-h-full w-full flex-shrink-0 items-end bg-surface-raised'>
      <div className='hero-gradient absolute inset-0' />
      <div className='cinematic-gradient absolute inset-x-0 bottom-0 h-[55%] min-h-[12rem] sm:h-[60%] sm:min-h-[16rem]' />
      <div className='relative z-20 w-full space-y-4 px-5 pb-36 sm:px-10 sm:pb-44 lg:pl-12'>
        <div className='h-3 w-24 animate-pulse rounded bg-white/10' />
        <div className='h-12 w-3/4 max-w-md animate-pulse rounded-lg bg-white/10 sm:h-16' />
        <div className='flex gap-2'>
          <div className='h-4 w-16 animate-pulse rounded bg-white/10' />
          <div className='h-4 w-20 animate-pulse rounded bg-white/10' />
        </div>
        <div className='space-y-2'>
          <div className='h-3 w-full max-w-lg animate-pulse rounded bg-white/10' />
          <div className='h-3 w-2/3 max-w-md animate-pulse rounded bg-white/10' />
        </div>
        <div className='flex gap-3'>
          <div className='h-11 w-32 animate-pulse rounded-xl bg-white/10' />
          <div className='h-11 w-28 animate-pulse rounded-xl bg-white/10' />
        </div>
      </div>
    </div>
  )
}
