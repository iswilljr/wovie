import { getSimklUserId, saveSimklAccount } from '@/utils/simkl/account'
import {
  exchangeCode,
  getReturnUrl,
  getUserSettings,
  isSimklEnabled,
  SIMKL_RETURN_COOKIE,
  SIMKL_STATE_COOKIE,
} from '@/utils/simkl/client'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ cookies, redirect, request, url }) => {
  const returnTo = cookies.get(SIMKL_RETURN_COOKIE)?.value ?? '/'
  const state = cookies.get(SIMKL_STATE_COOKIE)?.value

  cookies.delete(SIMKL_STATE_COOKIE, { path: '/' })
  cookies.delete(SIMKL_RETURN_COOKIE, { path: '/' })

  if (!isSimklEnabled) {
    return redirect(getReturnUrl(returnTo, 'disabled'))
  }

  const code = url.searchParams.get('code')

  if (!code || !state || state !== url.searchParams.get('state')) {
    return redirect(getReturnUrl(returnTo, 'error'))
  }

  const userId = await getSimklUserId(request.headers)

  if (!userId) {
    return redirect(getReturnUrl(returnTo, 'unauthorized'))
  }

  try {
    const token = await exchangeCode(code)
    const settings = await getUserSettings(token.access_token).catch(() => null)

    await saveSimklAccount({
      userId,
      accessToken: token.access_token,
      tokenType: token.token_type ?? null,
      scope: token.scope ?? null,
      simklUserId: settings?.account?.id?.toString() ?? null,
      userName: settings?.user?.name ?? null,
      avatarUrl: settings?.user?.avatar ?? null,
    })

    return redirect(getReturnUrl(returnTo, 'connected'))
  } catch (error) {
    console.error('Unable to connect Simkl account', error)
    return redirect(getReturnUrl(returnTo, 'error'))
  }
}
