import { $playerState } from '@/store/player'
import { getSource } from '@/utils/sources'
import { getEpisodeUrl } from '@/utils/url'
import { useStore } from '@nanostores/react'
import { navigate } from 'astro:transitions/client'
import { SkipBack, SkipForward } from 'lucide-react'

interface NextPrevButtonsProps {
  season: number
  mediaId: number
  mediaTitle: string
  firstEpisode: number
  lastEpisode: number
  totalSeasons: number
  initialEpisode: number
}

export function NextPrevButtons({
  season,
  mediaId,
  mediaTitle,
  firstEpisode,
  lastEpisode,
  totalSeasons,
  initialEpisode,
}: NextPrevButtonsProps) {
  const playerState = useStore($playerState)
  const episode = playerState.episode ?? initialEpisode

  const isFirstEpisode = episode <= firstEpisode
  const isLastEpisode = episode >= lastEpisode
  const isLastSeason = season >= totalSeasons

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

  const handleNextSeason = () => {
    const searchParams = new URL(window.location.href).searchParams
    const source = getSource(searchParams.get('source'))
    const newSeason = season + 1
    void navigate(getEpisodeUrl(mediaId, mediaTitle, newSeason, 1, source.id))
  }

  const btnClass =
    'group flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-overlay px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-accent/30 hover:text-white active:scale-[0.98]'

  return (
    <div className='flex items-center justify-end gap-2'>
      {!isFirstEpisode && (
        <button
          onClick={() => handleEpisodeClick(episode - 1)}
          className={btnClass}
        >
          <SkipBack className='size-4 transition-transform group-hover:-translate-x-0.5' />
          Previous
        </button>
      )}
      {!isLastEpisode && (
        <button
          onClick={() => handleEpisodeClick(episode + 1)}
          className={btnClass}
        >
          Next
          <SkipForward className='size-4 transition-transform group-hover:translate-x-0.5' />
        </button>
      )}
      {isLastEpisode && !isLastSeason && (
        <button onClick={handleNextSeason} className={btnClass}>
          Next Season
          <SkipForward className='size-4 transition-transform group-hover:translate-x-0.5' />
        </button>
      )}
    </div>
  )
}
