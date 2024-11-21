import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { linkWatching } from '../watching'

const dialect = new LibsqlDialect({
  url: import.meta.env.ASTRO_DB_REMOTE_URL ?? '',
  authToken: import.meta.env.ASTRO_DB_APP_TOKEN ?? '',
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
      async onLinkAccount({ anonymousUser, newUser }) {
        await linkWatching({ anonymousUser, newUser })
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
