import useSWR from 'swr'
import { Clapperboard } from 'lucide-react'
import { MediaGrid } from '../Media/MediaGrid'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Movies() {
  const { data: trendingMovies, isLoading } = useSWR(
    'trendingMovies',
    () => actions.trendingMovies(),
    swrDefaultOptions
  )

  const results = (trendingMovies?.data as any) ?? []

  if (!isLoading && results.length === 0) return null

  return (
    <MediaGrid
      title='Popular Movies'
      media='movie'
      isLoading={isLoading}
      results={results}
      icon={<Clapperboard className='size-4' strokeWidth={2} />}
    />
  )
}
