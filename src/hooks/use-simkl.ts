import { useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { actions } from 'astro:actions'
import { toast } from 'sonner'
import { swrDefaultOptions } from '@/utils'

export const SIMKL_STATUS_KEY = 'simkl-status'

const redirectMessages: Record<string, () => void> = {
  connected: () => toast.success('Simkl account connected'),
  error: () => toast.error('Unable to connect your Simkl account'),
  unauthorized: () => toast.error('Log in to connect a Simkl account'),
  disabled: () => toast.error('Simkl is not configured on this instance'),
}

export function useSimklStatus() {
  return useSWR(SIMKL_STATUS_KEY, () => actions.simklStatus(), {
    ...swrDefaultOptions,
    revalidateIfStale: true,
  })
}

/**
 * The Simkl consent screen sends the user back with a `simkl` search param,
 * the result is shown once and then removed from the url.
 */
export function useSimklRedirect() {
  const { mutate } = useSWRConfig()

  useEffect(() => {
    const url = new URL(window.location.href)
    const status = url.searchParams.get('simkl')

    if (!status) return

    redirectMessages[status]?.()

    if (status === 'connected') {
      void mutate(SIMKL_STATUS_KEY)
    }

    url.searchParams.delete('simkl')
    window.history.replaceState({}, '', url)
  }, [mutate])
}
