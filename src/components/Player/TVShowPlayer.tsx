import { useEffect } from 'react'
import { $playerState } from '@/store/player'
import { getTvUrl } from '@/utils/sources'
import { getSeasonOrEpisode, slugifyTitle } from '@/utils'
import { SelectSeason } from './SelectSeason'
import { SelectSource } from './SelectSource'
import { SelectEpisode } from './SelectEpisode'
import { NextPrevButtons } from './NextPrevButtons'
import type { getSeasonDetails, getTVShow } from '@/utils/tmdb'

export interface Props {
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
    const search = new URLSearchParams(window.location.search)
    const episode = getSeasonOrEpisode(search.get('episode'))
    $playerState.set({ ...$playerState.get(), episode })
  }, [episode])

  return (
    <div className='mt-4 flex w-full flex-col-reverse gap-2 shadow-2xl lg:flex-row'>
      <div className='flex h-[25rem] flex-col overflow-auto rounded-2xl bg-white/10 lg:aspect-video lg:h-[unset] lg:w-80'>
        <div className='flex h-14 w-full items-center justify-between gap-2 overflow-hidden bg-white/5 px-3 py-4'>
          <p>Episodes</p>
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
      <div className='flex flex-grow flex-col gap-2'>
        <div className='rounded-2xl bg-white/10'>
          <iframe
            id='player-video'
            title={`${name} - S${season}E${episode}`}
            className='aspect-video w-full rounded-2xl bg-transparent'
            allowFullScreen
            src={iframeUrl}
          ></iframe>
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
