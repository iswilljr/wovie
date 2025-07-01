import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FilterIcon, XIcon } from 'lucide-react'
import type { Genre } from 'tmdb-ts'
import { Button } from '../ui/button'

interface GenreFilterProps {
  genres: Genre[]
  selectedGenres: number[]
  onGenreChange: (genreId: number | null) => void
}

export function GenreFilter({
  genres,
  selectedGenres,
  onGenreChange,
}: GenreFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='gap-2'>
          <FilterIcon size={16} />
          <span>Genres</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[480px]'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Genres</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onGenreChange(null)}
            className='text-xs'
          >
            <XIcon className='mr-1 h-4 w-4' />
            Clear All
          </Button>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          {genres.map(genre => (
            <label
              key={genre.id}
              htmlFor={`genre-${genre.id}`}
              className='flex cursor-pointer items-center gap-2 rounded-md p-1 transition-colors hover:bg-zinc-800'
            >
              <input
                type='checkbox'
                id={`genre-${genre.id}`}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => onGenreChange(genre.id)}
                className='h-4 w-4 rounded border-gray-300 bg-transparent text-primary-600 focus:ring-primary-500'
              />
              <span className='text-sm font-medium text-white'>
                {genre.name}
              </span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}