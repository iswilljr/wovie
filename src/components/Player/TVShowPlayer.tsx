import { useEffect } from 'react'
import { $playerState } from '@/store/player'
import { getTvUrl } from '@/utils/sources'
import { slugifyTitle } from '@/utils'
import { SelectSeason } from './SelectSeason'
import { SelectSource } from './SelectSource'
import { SelectEpisode } from './SelectEpisode'
import { NextPrevButtons } from './NextPrevButtons'
import type { getSeasonDetails, getTVShow } from '@/utils/tmdb'

interface Props {
  season: number
  episode: number
  currentSourceId: string
  result: Awaited<ReturnType<typeof getTVShow>>
  seasonDetails: Awaited<ReturnType<typeof getSeasonDetails>>
}

export function TVShowPlayer({
  result,
  season,
  episode,
  seasonDetails,
  currentSourceId,
}: Props) {
  const { id, seasons, name } = result

  const episodeDetails = seasonDetails.episodes.find(
    details => details.episode_number === episode
  )

  if (!episodeDetails) {
    episode = seasonDetails.episodes[0]?.episode_number ?? 1
  }

  const firstEpisode = seasonDetails.episodes[0]?.episode_number ?? 1
  const lastEpisode =
    seasonDetails.episodes[seasonDetails.episodes.length - 1]?.episode_number ??
    1

  const tvSeasons = seasons.filter(season => season.season_number !== 0)

  const iframeUrl = getTvUrl(currentSourceId, id, season, episode)

  useEffect(() => {
    $playerState.set({ ...$playerState.get(), episode })
  }, [episode])

  return (
    <div className='flex w-full flex-col gap-4 lg:flex-row lg:gap-6'>
      <div className='order-2 flex w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay/60 backdrop-blur-sm lg:order-1 lg:w-80 lg:flex-shrink-0'>
        <div className='flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3'>
          <p className='text-sm font-medium text-zinc-300'>Episodes</p>
          <SelectSeason
            id={id}
            seasons={tvSeasons}
            activeSeason={season}
            title={slugifyTitle(name)}
            sourceId={currentSourceId}
          />
        </div>
        <SelectEpisode
          mediaTitle={name}
          episodes={seasonDetails.episodes}
          season={season}
          initialEpisode={episode}
          mediaId={id}
        />
      </div>

      <div className='order-1 min-w-0 flex-1 space-y-4 lg:order-2'>
        <div className='overflow-hidden rounded-2xl border border-border-subtle bg-black shadow-card'>
          <iframe
            id='player-video'
            title={`${name} - S${season}E${episode}`}
            className='aspect-video w-full bg-black'
            allowFullScreen
            src={iframeUrl}
          />
        </div>
        <NextPrevButtons
          mediaId={id}
          season={season}
          mediaTitle={name}
          initialEpisode={episode}
          firstEpisode={firstEpisode}
          lastEpisode={lastEpisode}
          totalSeasons={tvSeasons.length}
        />
        <SelectSource
          mediaId={id}
          mediaType='tv'
          currentSourceId={currentSourceId}
        />
      </div>
    </div>
  )
}
