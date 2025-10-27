import useSWR from 'swr'
import { FlameIcon } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Trending() {
  const { data: trending } = useSWR(
    'trendingAll',
    () => actions.trendingAll(),
    swrDefaultOptions
  )

  return (
    <MediaList
      id='trending'
      results={(trending?.data as any) ?? []}
      title="What's Trending Today"
      icon={<FlameIcon width='18' height='18' fill='#000' stroke='#000' />}
    />
  )
}
