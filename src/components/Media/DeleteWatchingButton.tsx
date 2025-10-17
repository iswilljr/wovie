import { useCallback } from 'react'
import { actions } from 'astro:actions'
import { Button } from '../ui/button'
import { XIcon } from 'lucide-react'

export function DeleteWatchingButton({
  id,
  mediaTitle,
}: {
  id: string | number
  mediaTitle: string
}) {
  const handleClick = useCallback(async () => {
    const element = document.querySelector<HTMLElement>(
      `[data-watching-id="${id}"]`
    )
    const watching = document.querySelector<HTMLElement>('#watching')
    const swiper = watching?.querySelector<HTMLElement>('.swiper')
    if (element) {
      element.remove()
    }

    const totalSwiperChildren = swiper?.children.length
    if (totalSwiperChildren === 0) {
      watching?.remove()
    }

    await actions.deleteItemFromWatching({ id })
  }, [id])

  return (
    <Button
      size='icon'
      onClick={handleClick}
      className='pointer-events-auto flex items-center justify-center gap-2 rounded-lg bg-opacity-60 px-4 py-1 text-sm text-white dark:bg-primary-500/70'
    >
      <XIcon />
      <span className='sr-only'>Delete {mediaTitle} from watching</span>
    </Button>
  )
}
