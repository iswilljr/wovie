import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { LibsqlDialect } from '@libsql/kysely-libsql'

const dialect = new LibsqlDialect({
  url: import.meta.env.TURSO_DATABASE_URL ?? '',
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? '',
})

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: {
    dialect,
    type: 'sqlite',
  },
  plugins: [
    anonymous({
      async onLinkAccount(_data) {
        // TODO: Implement linking
      },
    }),
  ],
})

export const getSession = async (ctx: { headers: Headers }) => {
  const session = await auth.api.getSession(ctx)
  if (!session) {
    return await auth.api.signInAnonymous(ctx)
  }
  return session
}
