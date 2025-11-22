import { useWatchlist } from '@/hooks/useWatchlist'
import { cn } from '@/utils'
import { BookmarkCheckIcon, BookmarkIcon } from 'lucide-react'

interface WatchlistButtonProps {
  media: {
    id: number
    mediaType: 'movie' | 'tv'
    title: string
    poster_path: string
    backdrop_path: string
    vote_average: number
    release_date: string
    original_language: string
  }
}

export function WatchlistButton({ media }: WatchlistButtonProps) {
  const { inWatchlist, toggleWatchlist } = useWatchlist(media)

  return (
    <button
      onClick={toggleWatchlist}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/10 p-2 text-white transition-all duration-300 hover:bg-primary-500',
        inWatchlist && 'bg-primary-500 text-white'
      )}
      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {inWatchlist ? (
        <BookmarkCheckIcon width={20} height={20} />
      ) : (
        <BookmarkIcon width={20} height={20} />
      )}
    </button>
  )
}
