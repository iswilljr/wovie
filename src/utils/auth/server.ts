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
    // @ts-expect-error bad types
    anonymous({
      async onLinkAccount({ anonymousUser, newUser }) {
        await linkWatching({ anonymousUser, newUser })
      },
    }),
  ],
})
