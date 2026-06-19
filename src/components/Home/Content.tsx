import { Trending } from '@/components/Content/Trending'
import { Movies } from '@/components/Content/Movies'
import { TVShows } from '@/components/Content/TVShows'
import { Watching } from '@/components/Content/Watching'
import { Watchlist } from '@/components/Content/Watchlist'
import { Discover } from '../Media/Discover'

export function Content() {
  return (
    <div className='relative'>
      <Discover />
      <div className='relative z-10 -mt-24 sm:-mt-32'>
        <Trending />
        <div className='space-y-10 bg-surface pb-8 sm:space-y-14'>
          <Watching />
          <Watchlist />
          <Movies />
          <TVShows />
        </div>
      </div>
    </div>
  )
}
