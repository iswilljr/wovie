import { getSeasonOrEpisode } from '@/utils'
import { navigate } from 'astro:transitions/client'
import { useCallback } from 'preact/hooks'
import type { Season } from 'tmdb-ts'

interface SelectSeasonProps {
  id: number
  title: string
  seasons: Season[]
  activeSeason: number
}

export function SelectSeason({
  id,
  title,
  seasons,
  activeSeason,
}: SelectSeasonProps) {
  const handleChange = useCallback<
    preact.JSX.GenericEventHandler<HTMLSelectElement>
  >(
    e => {
      const newSeason = getSeasonOrEpisode(e.currentTarget.value)

      if (newSeason === activeSeason) return

      void navigate(`/play/tv/${id}/${title}?season=${newSeason}`)
    },
    [id, title, activeSeason]
  )

  return (
    <select
      id='select-season'
      name='select-season'
      onChange={handleChange}
      class='flex items-center rounded-md border border-white/70 bg-black/50 px-2 py-1 text-sm text-white'
    >
      {seasons.map(seasonDetails => (
        <option
          value={seasonDetails.season_number}
          selected={seasonDetails.season_number === activeSeason}
          class='text-sm'
        >
          {seasonDetails.name}
        </option>
      ))}
    </select>
  )
}
