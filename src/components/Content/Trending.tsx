import useSWR from 'swr'
import { Flame } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Trending() {
  const { data: trending, isLoading } = useSWR(
    'trendingAll',
    () => actions.trendingAll(),
    swrDefaultOptions
  )

  const results = (trending?.data as any) ?? []

  if (!isLoading && results.length === 0) return null

  return (
    <div className='trending-bleed-overlap pb-2'>
      <MediaList
        id='trending'
        isLoading={isLoading}
        results={results}
        title='Trending Now'
        icon={<Flame className='size-4' strokeWidth={2} />}
      />
    </div>
  )
}
