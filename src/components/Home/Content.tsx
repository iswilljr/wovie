import { Trending } from '@/components/Content/Trending'
import { Movies } from '@/components/Content/Movies'
import { TVShows } from '@/components/Content/TVShows'
import { Watching } from '@/components/Content/Watching'

export function Content() {
  return (
    <div className='-my-[--discover-space] sm:pb-8'>
      <Trending />
      <Watching />
      <Movies />
      <TVShows />
    </div>
  )
}
