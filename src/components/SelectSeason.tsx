import { getSeasonOrEpisode } from '@/utils'
import { getSeasonUrl } from '@/utils/url'
import { navigate } from 'astro:transitions/client'
import { useCallback } from 'react'
import type { Season } from 'tmdb-ts'

interface SelectSeasonProps {
  id: number
  title: string
  seasons: Season[]
  sourceId: string
  activeSeason: number
}

export function SelectSeason({
  id,
  title,
  seasons,
  sourceId,
  activeSeason,
}: SelectSeasonProps) {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    e => {
      const newSeason = getSeasonOrEpisode(e.currentTarget.value)

      if (newSeason === activeSeason) return

      void navigate(getSeasonUrl(id, title, newSeason, sourceId))
    },
    [id, title, activeSeason]
  )

  return (
    <select
      id='select-season'
      name='select-season'
      onChange={handleChange}
      className='flex items-center rounded-md border border-white/70 bg-black/50 px-2 py-1 text-sm text-white'
    >
      {seasons.map(seasonDetails => (
        <option
          value={seasonDetails.season_number}
          selected={seasonDetails.season_number === activeSeason}
          className='text-sm'
        >
          {seasonDetails.name}
        </option>
      ))}
    </select>
  )
}
