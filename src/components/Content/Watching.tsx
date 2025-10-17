import useSWR from 'swr'
import { PopcornIcon } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Watching() {
  const { data: watching } = useSWR(
    'watching',
    () => actions.watching(),
    swrDefaultOptions
  )

  if (watching?.data != null && watching.data.length === 0) return null

  return (
    <MediaList
      id='watching'
      results={watching?.data ?? []}
      title='Continue Watching'
      enableEditModeOnMobile={true}
      icon={<PopcornIcon width='18' height='18' stroke='#000' />}
    />
  )
}
