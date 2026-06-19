import { cn, getSeasonOrEpisode } from '@/utils'
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
import { ChevronDown, Info } from 'lucide-react'
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

    const season = getSeasonOrEpisode(searchParams.get('season'))
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

  return (
    <div className='rounded-2xl border border-border-subtle bg-surface-overlay/60 p-4'>
      <p className='mb-3 text-sm font-medium text-zinc-300'>Sources</p>
      <div className='custom-scrollbars flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap'>
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
            <button className='flex shrink-0 items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-accent/30 hover:text-white'>
              More
              <ChevronDown className='size-4' />
            </button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={6}
            align='end'
            className='w-fit border-border-subtle bg-surface-raised p-2'
          >
            <div className='flex flex-col gap-1.5'>
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
      <div className='mt-3 flex items-start gap-2 rounded-lg bg-white/[0.03] p-3 text-zinc-500'>
        <Info className='mt-0.5 size-4 shrink-0' />
        <p className='text-xs leading-relaxed'>
          We recommend using an adblocker — some sources may include their own
          ads.
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

  const isActive = source.id === currentSourceId

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
        isActive
          ? 'border-accent/40 bg-accent/10 text-accent'
          : 'border-border-subtle bg-surface-raised text-zinc-400 hover:border-accent/20 hover:text-white'
      )}
    >
      <img
        height='16'
        width='16'
        alt=''
        src={getSourceIcon(source.id)}
        loading='lazy'
        className='size-4 object-cover'
      />
      {source.name}
    </button>
  )
}
