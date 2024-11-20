import type { Session, User } from 'better-auth'
import { atom } from 'nanostores'

export interface UserSessionAuthenticated {
  user: User & { isAnonymous: boolean }
  session: Session
  status: 'authenticated'
}

export interface UserSessionUnauthenticated {
  user: null
  session: null
  status: 'unauthenticated' | 'loading' | 'initial'
}

export type UserSession = UserSessionAuthenticated | UserSessionUnauthenticated

export const $userSession = atom<UserSession>({
  user: null,
  session: null,
  status: 'initial',
})
