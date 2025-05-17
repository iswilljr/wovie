import { cn, getSeasonFromPathname, getSeasonOrEpisode } from '@/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  getSource,
  getSourceIcon,
  getUrlWithSource,
  getMovieUrl,
  getTvUrl,
  SOURCES,
  type Source,
} from '@/utils/sources'
import { ChevronDownIcon, InfoIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface SelectSourceProps {
  mediaId: number
  mediaType: 'tv' | 'movie'
  currentSourceId: string
}

export function SelectSource({
  currentSourceId,
  mediaId,
  mediaType,
}: SelectSourceProps) {
  const [open, setOpen] = useState(false)
  const [currentSource, setCurrentSource] = useState(getSource(currentSourceId))

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

  useEffect(() => {
    const playerVideo = document.querySelector('#player-video')

    if (!playerVideo) return

    const container = playerVideo.parentElement
    const olsSrc = playerVideo.getAttribute('src')
    const searchParams = new URL(window.location.href).searchParams

    const season = getSeasonFromPathname(window.location.pathname)
    const episode = getSeasonOrEpisode(searchParams.get('episode'))

    const newSrc =
      mediaType === 'tv'
        ? getTvUrl(currentSource.id, mediaId, season, episode)
        : getMovieUrl(currentSource.id, mediaId)

    if (olsSrc === newSrc || !container) return

    playerVideo.remove()
    playerVideo.setAttribute('src', newSrc)
    container?.append(playerVideo)
  }, [currentSource, mediaId, mediaType])

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const source = getSource(search.get('source'))
    const currentSource = getSource(currentSourceId)

    if (currentSource.id !== source.id) {
      setCurrentSource(source)
    }
  }, [currentSourceId])

  return (
    <div className='w-full rounded-2xl bg-white/10 p-2'>
      <div className='flex items-center !gap-2 p-1'>
        <span className='text-lg font-medium tracking-wide sm:text-xl'>
          Sources
        </span>
      </div>
      <div className='custom-scrollbars flex w-full flex-nowrap gap-2 overflow-x-scroll p-2 md:flex-wrap'>
        {firstSources.map(source => (
          <SourceItem
            key={source.id}
            source={source}
            onOpenChange={setOpen}
            currentSourceId={currentSource.id}
            setCurrentSource={setCurrentSource}
          />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
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
                  key={source.id}
                  source={source}
                  onOpenChange={setOpen}
                  currentSourceId={currentSource.id}
                  setCurrentSource={setCurrentSource}
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
  currentSourceId,
  onOpenChange,
  setCurrentSource,
}: {
  source: Source
  currentSourceId: string
  onOpenChange: (open: boolean) => void
  setCurrentSource: (source: Source) => void
}) {
  const handleClick = useCallback(() => {
    onOpenChange(false)
    setCurrentSource(source)
    window.history.replaceState(
      {},
      '',
      getUrlWithSource(window.location.href, source.id)
    )
  }, [onOpenChange, setCurrentSource, source])

  return (
    <button
      onClick={handleClick}
      className={cn([
        'relative flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-black/60 p-2 text-sm leading-tight tracking-wide text-white ring-primary-500 hover:ring-1',
        source.id === currentSourceId && 'bg-primary-700/20 ring-1',
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
    </button>
  )
}
