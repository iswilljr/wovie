import { useCallback } from 'react'
import { actions } from 'astro:actions'
import { Button } from '../ui/button'
import { Trash2Icon } from 'lucide-react'

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
      className='pointer-events-auto rounded-lg border border-border-subtle bg-surface-overlay/90 text-zinc-300 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-400'
    >
      <Trash2Icon size={16} />
      <span className='sr-only'>Delete {mediaTitle} from watching</span>
    </Button>
  )
}
