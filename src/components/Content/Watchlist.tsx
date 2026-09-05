import useSWR from 'swr'
import { Bookmark } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Watchlist() {
  const { data: watchlist, isLoading } = useSWR(
    'watchlist',
    () => actions.watchlist(),
    swrDefaultOptions
  )

  if (!isLoading && (!watchlist?.data || watchlist.data.length === 0))
    return null

  return (
    <MediaList
      isWatchlist
      id='watchlist'
      isLoading={isLoading}
      results={watchlist?.data ?? []}
      title='My Watchlist'
      enableEditModeOnMobile={true}
      icon={<Bookmark className='size-4' strokeWidth={2} />}
    />
  )
}
