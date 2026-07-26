import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { actions } from 'astro:actions'
import { toast } from 'sonner'
import { LinkIcon, RefreshCwIcon, UnlinkIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSimklStatus } from '@/hooks/use-simkl'
import { cn } from '@/utils'

const itemClassName =
  'flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-60'

function connect() {
  const returnTo = `${window.location.pathname}${window.location.search}`

  window.location.href = `/api/simkl/authorize?returnTo=${encodeURIComponent(returnTo)}`
}

export function SimklMenu() {
  const { mutate } = useSWRConfig()
  const { data: status, mutate: mutateStatus } = useSimklStatus()
  const [isImporting, setIsImporting] = useState(false)

  const simkl = status?.data

  if (!simkl?.enabled) return null

  const disconnect = async () => {
    const response = await actions.disconnectSimkl()

    if (!response.data) {
      toast.error('Unable to disconnect your Simkl account')
      return
    }

    toast.success('Simkl account disconnected')
    await mutateStatus()
  }

  const importWatchlist = async () => {
    setIsImporting(true)
    const toastId = toast.loading('Importing your Simkl watchlist')

    try {
      const { data } = await actions.importSimklWatchlist()

      if (!data) {
        toast.error('Unable to import your Simkl watchlist', { id: toastId })
        return
      }

      const { imported, hasMore } = data
      const titles = `${imported} ${imported === 1 ? 'title' : 'titles'}`

      toast.success(
        imported === 0
          ? 'Your watchlist is already up to date'
          : hasMore
            ? `Imported ${titles}, import again to get the rest`
            : `Imported ${titles}`,
        { id: toastId }
      )

      await mutate('watchlist')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <Separator />
      <div className='p-1'>
        {simkl.connected ? (
          <>
            <p className='truncate px-2 py-1.5 text-xs text-zinc-500'>
              Simkl{simkl.userName ? ` · ${simkl.userName}` : ''}
            </p>
            <button
              className={itemClassName}
              onClick={importWatchlist}
              disabled={isImporting}
            >
              Import watchlist
              <RefreshCwIcon
                className={cn('size-4', isImporting && 'animate-spin')}
              />
            </button>
            <button className={itemClassName} onClick={disconnect}>
              Disconnect
              <UnlinkIcon className='size-4' />
            </button>
          </>
        ) : (
          <button className={itemClassName} onClick={connect}>
            Connect Simkl
            <LinkIcon className='size-4' />
          </button>
        )}
      </div>
    </>
  )
}
