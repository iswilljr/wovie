import { useEffect } from 'react'
import { Play } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { $playerState } from '@/store/player'
import { getSeasonOrEpisode } from '@/utils'
import { getEpisodeUrl } from '@/utils/url'
import { getSource, getTvUrl } from '@/utils/sources'
import type { Episode } from 'tmdb-ts'

interface SelectEpisodeProps {
  season: number
  mediaId: number
  mediaTitle: string
  episodes: Episode[]
  initialEpisode: number
}

export function SelectEpisode({
  season,
  mediaId,
  episodes,
  mediaTitle,
  initialEpisode,
}: SelectEpisodeProps) {
  const playerState = useStore($playerState)
  const episode = playerState.episode ?? initialEpisode

  const handleEpisodeClick = (episode: number) => {
    $playerState.set({ ...$playerState.get(), episode })
    const searchParams = new URL(window.location.href).searchParams
    const source = getSource(searchParams.get('source'))
    window.history.replaceState(
      {},
      '',
      new URL(
        getEpisodeUrl(mediaId, mediaTitle, season, episode, source.id),
        window.location.href
      ).toString()
    )
  }

  useEffect(() => {
    const playerVideo = document.querySelector('#player-video')
    const currentEpisodeNumber = $playerState.get().episode
    const episodeIndex = episodes.findIndex(
      episodeDetails => episodeDetails.episode_number === currentEpisodeNumber
    )

    const episodeDetails = episodes[episodeIndex]

    if (!playerVideo || !episodeDetails) return

    const container = playerVideo.parentElement
    const olsSrc = playerVideo.getAttribute('src')
    const searchParams = new URL(window.location.href).searchParams

    const source = getSource(searchParams.get('source'))
    const season = getSeasonOrEpisode(searchParams.get('season'))
    const episode = episodeDetails.episode_number

    const newSrc = getTvUrl(source.id, mediaId, season, episode)

    if (olsSrc === newSrc || !container) return

    playerVideo.remove()
    playerVideo.setAttribute('src', newSrc)
    container?.append(playerVideo)
  }, [episodes, mediaId, episode])

  return (
    <div className='custom-scrollbars max-h-80 overflow-y-auto lg:max-h-[calc(100svh-16rem)]'>
      {episodes.map(episodeDetails => {
        const isActive = episodeDetails.episode_number === episode
        return (
          <button
            key={episodeDetails.id}
            aria-current={isActive}
            onClick={() => handleEpisodeClick(episodeDetails.episode_number)}
            className={`group flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.04] ${
              isActive
                ? 'border-l-2 border-accent bg-accent/5 text-accent'
                : 'border-l-2 border-transparent text-zinc-400'
            }`}
          >
            <p className='flex min-w-0 gap-2'>
              <span className='shrink-0 font-medium tabular-nums'>
                {episodeDetails.episode_number}.
              </span>
              <span className='line-clamp-1'>{episodeDetails.name}</span>
            </p>
            {isActive && (
              <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground'>
                <Play className='size-2.5 fill-current' />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
