import { cn } from '@/utils'
import { X } from 'lucide-react'
import type { Genre } from 'tmdb-ts'

interface GenreFilterProps {
  genres: Genre[]
  selectedGenres: number[]
  onGenreChange: (genreId: number | null) => void
  variant?: 'sidebar' | 'chips'
  className?: string
}

function GenreButton({
  genre,
  isSelected,
  onToggle,
  compact = false,
}: {
  genre: Genre
  isSelected: boolean
  onToggle: () => void
  compact?: boolean
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'shrink-0 rounded-full border text-left transition-all duration-200',
        compact
          ? 'px-3.5 py-1.5 text-xs font-medium'
          : 'w-full px-3 py-2 text-sm',
        isSelected
          ? 'border-accent/40 bg-accent/15 text-accent shadow-glow'
          : 'border-border-subtle bg-surface-overlay/40 text-zinc-400 hover:border-border hover:bg-white/5 hover:text-white'
      )}
    >
      {genre.name}
    </button>
  )
}

export function GenreFilter({
  genres,
  selectedGenres,
  onGenreChange,
  variant = 'sidebar',
  className,
}: GenreFilterProps) {
  const handleToggle = (genreId: number) => {
    onGenreChange(genreId)
  }

  if (variant === 'chips') {
    return (
      <div className={cn('relative', className)}>
        <div className='custom-scrollbars flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
          {selectedGenres.length > 0 && (
            <button
              type='button'
              onClick={() => onGenreChange(null)}
              className='flex shrink-0 items-center gap-1 rounded-full border border-border-subtle bg-surface-overlay/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white'
            >
              <X className='size-3' />
              Clear
            </button>
          )}
          {genres.map(genre => (
            <GenreButton
              key={genre.id}
              genre={genre}
              isSelected={selectedGenres.includes(genre.id)}
              onToggle={() => handleToggle(genre.id)}
              compact
            />
          ))}
        </div>
        <div className='pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent' />
      </div>
    )
  }

  return (
    <aside className={cn('flex flex-col', className)}>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-xs font-semibold uppercase tracking-widest text-zinc-500'>
          Genres
        </h2>
        {selectedGenres.length > 0 && (
          <button
            type='button'
            onClick={() => onGenreChange(null)}
            className='text-xs text-zinc-500 transition-colors hover:text-accent'
          >
            Clear all
          </button>
        )}
      </div>
      <div className='custom-scrollbars -mx-1 flex max-h-[calc(100svh-22rem)] flex-col gap-1 overflow-y-auto px-1'>
        {genres.map(genre => (
          <GenreButton
            key={genre.id}
            genre={genre}
            isSelected={selectedGenres.includes(genre.id)}
            onToggle={() => handleToggle(genre.id)}
          />
        ))}
      </div>
    </aside>
  )
}

export function ActiveGenreTags({
  genres,
  selectedGenres,
  onGenreChange,
}: Pick<GenreFilterProps, 'genres' | 'selectedGenres' | 'onGenreChange'>) {
  if (selectedGenres.length === 0) return null

  const selected = genres.filter(g => selectedGenres.includes(g.id))

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {selected.map(genre => (
        <button
          key={genre.id}
          type='button'
          onClick={() => onGenreChange(genre.id)}
          className='group flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/20'
        >
          {genre.name}
          <X className='size-3 opacity-60 transition-opacity group-hover:opacity-100' />
        </button>
      ))}
    </div>
  )
}
