import { cn } from '@/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('loading-wrapper', className)}>
      <div className='spinner'>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className='loading-bar'
              style={{ '--i': `${i}` } as any}
            />
          ))}
      </div>
    </div>
  )
}

export function Loader() {
  return (
    <div className='flex items-center justify-center gap-2 py-6 text-zinc-500'>
      <Spinner />
      <p className='text-sm'>Loading...</p>
    </div>
  )
}

export function MediaPostsLoader() {
  const loaders = [...new Array(12).keys()]

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] sm:gap-4'>
      {loaders.map((_, i) => (
        <div
          key={i}
          className='aspect-[2/3] animate-pulse rounded-xl bg-surface-overlay ring-1 ring-border-subtle'
        />
      ))}
    </div>
  )
}

export function MediaCardLoader() {
  const loaders = [...new Array(8).keys()]

  return (
    <>
      {loaders.map((_, i) => (
        <div
          key={i}
          className='w-[17rem] flex-shrink-0 animate-pulse rounded-xl bg-surface-overlay ring-1 ring-border-subtle xs:w-[18rem] sm:w-[19rem]'
        >
          <div className='aspect-[16/9]' />
        </div>
      ))}
    </>
  )
}
