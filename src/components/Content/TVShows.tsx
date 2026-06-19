import useSWR from 'swr'
import { Tv } from 'lucide-react'
import { MediaGrid } from '../Media/MediaGrid'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function TVShows() {
  const { data: trendingTvShows, isLoading } = useSWR(
    'trendingTv',
    () => actions.trendingTv(),
    swrDefaultOptions
  )

  const results = (trendingTvShows?.data as any) ?? []

  if (!isLoading && results.length === 0) return null

  return (
    <MediaGrid
      media='tv'
      title='Popular TV Shows'
      isLoading={isLoading}
      results={results}
      icon={<Tv className='size-4' strokeWidth={2} />}
    />
  )
}
