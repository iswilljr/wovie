import { cn } from '@/utils'
import { getSource, getSourceIcon, SOURCES } from '@/utils/sources'
import { InfoIcon } from 'lucide-react'

interface Props {
  source: string
  setSource: (source: string) => void
}

export function SelectSource({ source, setSource }: Props) {
  const currentSource = getSource(source)

  return (
    <div className='w-full rounded-2xl bg-white/10 p-2'>
      <div className='flex items-center !gap-2 p-1'>
        <span className='text-lg font-medium tracking-wide sm:text-xl'>
          {' '}
          Sources{' '}
        </span>
      </div>
      <div className='custom-scrollbars flex w-full gap-x-2 overflow-x-scroll p-2'>
        {SOURCES.map(source => (
          <button
            className={cn(
              'relative flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-black/60 p-2 text-sm leading-tight tracking-wide text-white ring-primary-500 hover:ring-1',
              source.id === currentSource.id ? 'bg-primary-700/20 ring-1' : ''
            )}
            onClick={() => setSource(source.id)}
          >
            <span>
              <img
                height='100'
                width='100'
                alt={`${source.name} source`}
                src={getSourceIcon(source.id)}
                loading='lazy'
                className='size-4 object-cover'
              />
            </span>
            <span className='text-sm'>{source.name}</span>
          </button>
        ))}
      </div>
      <div className='mt-2 flex w-fit items-center gap-2 rounded-lg bg-white/20 p-2 text-gray-300 md:mt-0'>
        <InfoIcon className='size-5 shrink-0' />
        <p className='text-sm'>
          We recommend using an adblocker, some of the sources may include their
          own ads.
        </p>
      </div>
    </div>
  )
}
