import { getSeasonOrEpisode } from '@/utils'
import { getSource } from '@/utils/sources'
import { getEpisodeUrl } from '@/utils/url'
import { navigate } from 'astro:transitions/client'
import { useCallback } from 'react'
import type { Season } from 'tmdb-ts'

interface SelectSeasonProps {
  id: number
  title: string
  sourceId: string
  seasons: Season[]
  activeSeason: number
}

export function SelectSeason({
  id,
  title,
  seasons,
  activeSeason,
}: SelectSeasonProps) {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    e => {
      const searchParams = new URL(window.location.href).searchParams
      const source = getSource(searchParams.get('source'))
      const newSeason = getSeasonOrEpisode(e.currentTarget.value)

      if (newSeason === activeSeason) return

      void navigate(getEpisodeUrl(id, title, newSeason, 1, source.id))
    },
    [id, title, activeSeason]
  )

  return (
    <select
      id='select-season'
      name='select-season'
      onChange={handleChange}
      defaultValue={activeSeason}
      className='rounded-lg border border-border-subtle bg-surface-raised px-2 py-1 text-xs text-zinc-300 outline-none focus:border-accent/40'
    >
      {seasons.map(seasonDetails => (
        <option
          key={seasonDetails.season_number}
          value={seasonDetails.season_number}
        >
          {seasonDetails.name}
        </option>
      ))}
    </select>
  )
}
