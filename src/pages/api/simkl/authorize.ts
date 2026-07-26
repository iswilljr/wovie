import { getSimklUserId } from '@/utils/simkl/account'
import {
  getAuthorizeUrl,
  getReturnUrl,
  isSimklEnabled,
  sanitizeReturnTo,
  SIMKL_RETURN_COOKIE,
  SIMKL_STATE_COOKIE,
} from '@/utils/simkl/client'
import type { APIRoute } from 'astro'

const COOKIE_MAX_AGE_IN_SECONDS = 60 * 10

export const GET: APIRoute = async ({ cookies, redirect, request, url }) => {
  const returnTo = sanitizeReturnTo(url.searchParams.get('returnTo'))

  if (!isSimklEnabled) {
    return redirect(getReturnUrl(returnTo, 'disabled'))
  }

  const userId = await getSimklUserId(request.headers)

  if (!userId) {
    return redirect(getReturnUrl(returnTo, 'unauthorized'))
  }

  const state = crypto.randomUUID()

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    path: '/',
    maxAge: COOKIE_MAX_AGE_IN_SECONDS,
  } as const

  cookies.set(SIMKL_STATE_COOKIE, state, cookieOptions)
  cookies.set(SIMKL_RETURN_COOKIE, returnTo, cookieOptions)

  return redirect(getAuthorizeUrl(state))
}
