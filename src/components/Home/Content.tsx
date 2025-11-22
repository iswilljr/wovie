import { Trending } from '@/components/Content/Trending'
import { Movies } from '@/components/Content/Movies'
import { TVShows } from '@/components/Content/TVShows'
import { Watching } from '@/components/Content/Watching'
import { Watchlist } from '@/components/Content/Watchlist'
import { Discover } from '../Media/Discover'

export function Content() {
  return (
    <>
      <Discover />
      <div className='-my-[--discover-space] sm:pb-8'>
        <Trending />
        <Watching />
        <Watchlist />
        <Movies />
        <TVShows />
      </div>
    </>
  )
}
