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
    name: string
    first_air_date: string
  }
}

export function WatchlistButton({ media }: WatchlistButtonProps) {
  const { inWatchlist, toggleWatchlist } = useWatchlist(media)

  return (
    <button
      onClick={toggleWatchlist}
      className={cn(
        'flex items-center justify-center rounded-xl border border-border-subtle bg-surface-overlay p-2.5 text-zinc-300 transition-all hover:border-accent/30 hover:bg-accent hover:text-accent-foreground',
        inWatchlist && 'border-accent/40 bg-accent text-accent-foreground'
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
