export function Loader() {
  return (
    <div className='flex items-center justify-center gap-2 py-3 text-gray-500'>
      <div className='loading-wrapper'>
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
      <p>Loading...</p>
    </div>
  )
}

export function MediaPostsLoader() {
  const loaders = [...new Array(32).keys()]

  return (
    <div className='relative z-10 grid w-full grid-cols-[repeat(auto-fill,minmax(150px,1fr))] flex-wrap gap-4'>
      {loaders.map((_, i) => (
        <div
          key={i}
          className='group relative flex aspect-[2/3] animate-pulse flex-col items-center justify-center overflow-hidden rounded-lg bg-white/20 outline-none'
          style={{}}
        ></div>
      ))}
    </div>
  )
}
