import useSWR from 'swr'
import { BookmarkIcon } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Watchlist() {
  const { data: watchlist } = useSWR(
    'watchlist',
    () => actions.watchlist(),
    swrDefaultOptions
  )

  if (watchlist?.data != null && watchlist.data.length === 0) return null

  return (
    <MediaList
      isWatchlist
      id='watchlist'
      results={watchlist?.data ?? []}
      title='Watchlist'
      icon={<BookmarkIcon width='18' height='18' stroke='#000' />}
    />
  )
}
