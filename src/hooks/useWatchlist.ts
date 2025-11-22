import { actions } from 'astro:actions'
import useSWR from 'swr'
import { swrDefaultOptions } from '@/utils'
import type { MovieWithMediaType, TVWithMediaType } from 'tmdb-ts'
import { useMemo } from 'react'
import { toast } from 'sonner'

interface MediaItem {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  backdrop_path: string
  vote_average: number
  release_date: string
  first_air_date: string
  name: string
  original_language: string
}

type WatchlistData = (MovieWithMediaType | TVWithMediaType) & {
  watchlist: {
    id: number
    createdAt: Date
  }
}

export function useWatchlist(media: MediaItem) {
  const { data: watchlist, mutate } = useSWR(
    'watchlist',
    () => actions.watchlist(),
    swrDefaultOptions
  )

  const watchlistMap = useMemo(() => {
    const map = new Map<number, WatchlistData>()
    watchlist?.data?.forEach(item => {
      map.set(item.id, item)
    })
    return map
  }, [watchlist])

  const inWatchlist = watchlistMap.has(media.id)

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const inWatchlist = watchlistMap.has(media.id)
    const toastMessage = inWatchlist
      ? 'Removed from watchlist'
      : 'Added to watchlist'
    const toastId = toast.success(toastMessage)

    const newWatchlist = inWatchlist
      ? watchlist?.data?.filter(
          item => !(item.id === media.id && item.media_type === media.mediaType)
        )
      : [
          {
            ...media,
            id: media.id,
            media_type: media.mediaType,
            watchlist: { id: Date.now(), createdAt: new Date() },
          } as unknown as WatchlistData,
          ...(watchlist?.data ?? []),
        ]

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mutate({ data: newWatchlist ?? [] } as unknown as any, {
      optimisticData: { data: newWatchlist ?? [] } as unknown as any,
      rollbackOnError: true,
      revalidate: false,
    })

    if (!inWatchlist) {
      document.querySelector('#watchlist .swiper')?.scrollTo({
        behavior: 'smooth',
        top: 0,
        left: 0,
      })
    }

    try {
      if (inWatchlist) {
        const response = await actions.deleteFromWatchlist({ id: media.id })

        if (!response.data) {
          throw new Error('Failed to delete from watchlist')
        }
      } else {
        const response = await actions.addToWatchlist({
          id: media.id,
          mediaType: media.mediaType,
        })

        if (!response.data) {
          throw new Error('Failed to add to watchlist')
        }
      }
    } catch (error) {
      toast.error('Failed to update watchlist', { id: toastId })
      // SWR will rollback automatically
    } finally {
      await mutate()
    }
  }

  return {
    inWatchlist: !!inWatchlist,
    toggleWatchlist,
  }
}
