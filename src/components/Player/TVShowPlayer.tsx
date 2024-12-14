import { snakeCase } from '@/utils'
import { SelectSeason } from './SelectSeason'
import { getEpisodeUrl } from '@/utils/url'
import { PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react'
import { getSource, getTvUrl } from '@/utils/sources'
import { useEffect, useRef, useState } from 'react'
import { SelectSource } from './SelectSource'
import type { Season, SeasonDetails } from 'tmdb-ts'
import { navigate } from 'astro:transitions/client'

export function TVShowPlayer({
  id,
  name,
  initialSeason,
  initialEpisode,
  seasons,
  initialSourceId,
  seasonDetails,
}: {
  id: number
  name: string
  initialUrl: string
  initialSeason: number
  initialEpisode: number
  seasons: Season[]
  initialSourceId: string
  seasonDetails: SeasonDetails
}) {
  const isFirstMount = useRef(true)
  const [episode, setEpisode] = useState(initialEpisode)
  const [sourceId, setSourceId] = useState(initialSourceId)

  const currentSource = getSource(sourceId)
  const iframeUrl = getTvUrl(currentSource.id, id, initialSeason, episode)

  const isFirstEpisode = episode <= 1
  const isLastEpisode = episode >= seasonDetails.episodes.length
  const isLastSeason = initialSeason >= seasons.length
  const canGoToNextSeason = isLastEpisode && !isLastSeason

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    window.history.replaceState(
      {},
      '',
      getEpisodeUrl(id, name, initialSeason, episode, sourceId)
    )
  }, [id, name, initialSeason, episode, sourceId])

  return (
    <div className='mt-4 flex w-full flex-col-reverse gap-2 shadow-2xl lg:flex-row'>
      <div className='flex h-[25rem] flex-col overflow-auto rounded-2xl bg-white/10 lg:aspect-video lg:h-[unset] lg:w-80'>
        <div className='flex h-14 w-full items-center justify-between gap-2 overflow-hidden bg-white/5 px-3 py-4'>
          <p>Episodes</p>
          <SelectSeason
            id={id}
            seasons={seasons}
            activeSeason={initialSeason}
            title={snakeCase(name)}
            sourceId={sourceId}
          />
        </div>
        <div className='custom-scrollbars overflow-y-auto'>
          {seasonDetails.episodes.map(episodeDetails => (
            <button
              aria-current={episodeDetails.episode_number === episode}
              onClick={() => setEpisode(episodeDetails.episode_number)}
              className='group relative line-clamp-1 flex h-12 w-full flex-shrink-0 items-center justify-between gap-1 p-4 text-sm even:bg-white/5 hover:bg-white/10 hover:text-white aria-[current=true]:!bg-white/20 aria-[current=true]:!text-primary-400'
            >
              <p className='flex gap-2 tracking-wide'>
                <span className='font-medium'>
                  {episodeDetails.episode_number}.
                </span>
                <span className='line-clamp-1 text-start font-normal'>
                  {episodeDetails.name}
                </span>
              </p>
              <span className='hidden shrink-0 items-center justify-center rounded-full bg-primary-400 p-1 group-aria-[current=true]:flex'>
                <PlayIcon width='10' height='10' fill='black' stroke='black' />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className='flex flex-grow flex-col gap-2'>
        <div className='rounded-2xl bg-white/10'>
          <iframe
            title={`${name} - S${initialSeason}E${episode}`}
            className='aspect-video w-full rounded-2xl bg-transparent'
            allowFullScreen
            src={iframeUrl}
          ></iframe>
        </div>
        <div className='flex w-full items-center justify-end gap-2 rounded-2xl bg-white/10 p-2'>
          {!isFirstEpisode && (
            <button
              onClick={() => setEpisode(episode - 1)}
              className='flex items-center justify-center gap-1 rounded-2xl bg-black/50 px-4 py-2 text-lg text-white'
            >
              <SkipBackIcon className='size-5 text-white' />
              Prev
            </button>
          )}
          {(!isLastEpisode || !isLastSeason) && (
            <button
              onClick={async () => {
                const newEpisode = canGoToNextSeason ? 1 : episode + 1

                if (canGoToNextSeason) {
                  const newUrl = getEpisodeUrl(
                    id,
                    name,
                    initialSeason + 1,
                    1,
                    currentSource.id
                  )
                  await navigate(newUrl)
                  return
                }

                setEpisode(newEpisode)
              }}
              className='flex items-center justify-center gap-1 rounded-2xl bg-black/50 px-4 py-2 text-lg text-white'
            >
              {canGoToNextSeason ? 'Next Season' : 'Next'}
              <SkipForwardIcon className='size-5 text-white' />
            </button>
          )}
        </div>
        <SelectSource source={sourceId} setSource={setSourceId} />
      </div>
    </div>
  )
}
