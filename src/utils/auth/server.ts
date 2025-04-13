import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { linkWatching } from '../watching'
import { ASTRO_DB_APP_TOKEN, ASTRO_DB_REMOTE_URL } from 'astro:env/server'

const dialect = new LibsqlDialect({
  url: ASTRO_DB_REMOTE_URL,
  authToken: ASTRO_DB_APP_TOKEN,
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
