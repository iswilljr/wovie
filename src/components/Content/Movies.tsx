import useSWR from 'swr'
import { ClapperboardIcon } from 'lucide-react'
import { MediaGrid } from '../Media/MediaGrid'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Movies() {
  const { data: trendingMovies } = useSWR(
    'trendingMovies',
    () => actions.trendingMovies(),
    swrDefaultOptions
  )

  return (
    <MediaGrid
      title='Movies'
      media='movie'
      results={(trendingMovies?.data as any) ?? []}
      icon={<ClapperboardIcon width='18' height='18' stroke='#000' />}
    />
  )
}
