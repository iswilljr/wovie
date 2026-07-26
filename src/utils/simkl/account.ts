import { db, eq, NOW, SimklAccount } from 'astro:db'
import { auth } from '../auth/server'

export type SimklAccountData = typeof SimklAccount.$inferSelect

interface SaveSimklAccountInput {
  userId: string
  accessToken: string
  tokenType: string | null
  scope: string | null
  simklUserId: string | null
  userName: string | null
  avatarUrl: string | null
}

export async function getSimklAccount(userId: string) {
  const data = await db
    .select()
    .from(SimklAccount)
    .where(eq(SimklAccount.userId, userId))
    .limit(1)

  return data.at(0) ?? null
}

export async function saveSimklAccount({
  userId,
  accessToken,
  tokenType,
  scope,
  simklUserId,
  userName,
  avatarUrl,
}: SaveSimklAccountInput) {
  await db
    .insert(SimklAccount)
    .values({
      id: crypto.randomUUID(),
      userId,
      accessToken,
      tokenType,
      scope,
      simklUserId,
      userName,
      avatarUrl,
    })
    .onConflictDoUpdate({
      target: SimklAccount.userId,
      set: {
        accessToken,
        tokenType,
        scope,
        simklUserId,
        userName,
        avatarUrl,
        updatedAt: NOW,
      },
    })
}

export async function deleteSimklAccount(userId: string) {
  await db.delete(SimklAccount).where(eq(SimklAccount.userId, userId))
}

export async function setLastImportedAt(userId: string) {
  await db
    .update(SimklAccount)
    .set({ lastImportedAt: NOW, updatedAt: NOW })
    .where(eq(SimklAccount.userId, userId))
}

/**
 * Simkl is only offered to users with a real account, anonymous sessions
 * cannot reach the menu that starts the connection flow.
 */
export async function getSimklUserId(headers: Headers) {
  const session = await auth.api.getSession({ headers })

  if (!session || (session.user as { isAnonymous?: boolean }).isAnonymous) {
    return null
  }

  return session.user.id
}
