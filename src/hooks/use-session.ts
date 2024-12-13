import { useEffect } from 'react'
import { client } from '@/utils/auth/react'
import { useStore } from '@nanostores/react'
import { $userSession, type UserSession } from '@/store/session'

async function updateSession() {
  $userSession.set({ session: null, user: null, status: 'loading' })

  const session = await client.getSession({})

  let { data } = session

  if (!data) {
    const anonymousSession = await client.signIn.anonymous({})
    data = anonymousSession.data
  }

  const newUserSession = {
    user: data?.user,
    session: data?.session,
    status: data != null ? 'authenticated' : 'unauthenticated',
  } as unknown as UserSession

  $userSession.set(newUserSession)
}

export function useSession({ isBot = false } = {}) {
  const userSession = useStore($userSession)

  useEffect(() => {
    if (isBot) {
      $userSession.set({ session: null, user: null, status: 'unauthenticated' })
      return
    }

    if ($userSession.get().status !== 'initial') {
      return
    }

    updateSession().catch(console.error)
  }, [])

  const isLoading = ['initial', 'loading'].includes(userSession.status)
  const isAuthenticated =
    userSession.status === 'authenticated' && !userSession.user.isAnonymous

  return {
    ...userSession,
    isLoading,
    isAuthenticated,
  }
}
