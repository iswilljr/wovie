import useSWR from 'swr'
import { Clock } from 'lucide-react'
import { MediaList } from '../Media/MediaList'
import { actions } from 'astro:actions'
import { swrDefaultOptions } from '@/utils'

export function Watching() {
  const { data: watching, isLoading } = useSWR(
    'watching',
    () => actions.watching(),
    swrDefaultOptions
  )

  if (!isLoading && (!watching?.data || watching.data.length === 0)) return null

  return (
    <MediaList
      id='watching'
      isLoading={isLoading}
      results={watching?.data ?? []}
      title='Continue Watching'
      enableEditModeOnMobile={true}
      icon={<Clock className='size-4' strokeWidth={2} />}
    />
  )
}
