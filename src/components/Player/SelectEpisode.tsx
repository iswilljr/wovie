import { useEffect } from 'react'
import { PlayIcon } from 'lucide-react'
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
    <div className='custom-scrollbars overflow-y-auto'>
      {episodes.map(episodeDetails => (
        <button
          key={episodeDetails.id}
          aria-current={episodeDetails.episode_number === episode}
          onClick={() => handleEpisodeClick(episodeDetails.episode_number)}
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
  )
}
