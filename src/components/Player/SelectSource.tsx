import { cn } from '@/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  getSource,
  getSourceIcon,
  getUrlWithSource,
  SOURCES,
  type Source,
} from '@/utils/sources'
import { ChevronDownIcon, InfoIcon } from 'lucide-react'

interface SelectSourceProps {
  currentURL: string
  currentSourceId: string
}

export default function SelectSource({
  currentSourceId,
  currentURL,
}: SelectSourceProps) {
  const currentSource = getSource(currentSourceId)

  const currentSourceIndex = SOURCES.findIndex(
    source => source.id === currentSource.id
  )

  const isCurrentSourceRest = currentSourceIndex >= 5
  const maxEndIndex = isCurrentSourceRest ? 4 : 5
  const firstSources = [
    ...SOURCES.slice(0, maxEndIndex),
    ...(isCurrentSourceRest ? [SOURCES[currentSourceIndex]!] : []),
  ]

  const restSources = SOURCES.slice(maxEndIndex).filter(
    source => !isCurrentSourceRest || source.id !== currentSource.id
  )

  return (
    <div className='w-full rounded-2xl bg-white/10 p-2'>
      <div className='flex items-center !gap-2 p-1'>
        <span className='text-lg font-medium tracking-wide sm:text-xl'>
          {' '}
          Sources{' '}
        </span>
      </div>
      <div className='custom-scrollbars flex w-full flex-nowrap gap-2 overflow-x-scroll p-2 md:flex-wrap'>
        {firstSources.map(source => (
          <SourceItem
            source={source}
            currentURL={currentURL}
            currentSourceId={currentSource.id}
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button className='relative flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-black/60 p-2 text-sm leading-tight tracking-wide text-white ring-primary-500 hover:ring-1'>
              <span className='text-sm'>More</span>
              <ChevronDownIcon className='size-4 object-cover' />
            </button>
          </PopoverTrigger>
          <PopoverContent sideOffset={6} align='end' className='w-fit p-0'>
            <div className='custom-scrollbars flex w-full flex-col flex-wrap gap-2 overflow-x-scroll p-2'>
              {restSources.map(source => (
                <SourceItem
                  source={source}
                  currentURL={currentURL}
                  currentSourceId={currentSource.id}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
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

function SourceItem({
  source,
  currentURL,
  currentSourceId,
  className,
}: {
  source: Source
  currentURL: string
  currentSourceId: string
  className?: string
}) {
  return (
    <a
      href={getUrlWithSource(currentURL, source.id)}
      className={cn([
        'relative flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-black/60 p-2 text-sm leading-tight tracking-wide text-white ring-primary-500 hover:ring-1',
        source.id === currentSourceId && 'bg-primary-700/20 ring-1',
        className,
      ])}
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
    </a>
  )
}
