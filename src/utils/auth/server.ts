import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { linkWatching } from '../watching'
import {
  ASTRO_DB_APP_TOKEN,
  ASTRO_DB_REMOTE_URL,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
} from 'astro:env/server'

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
    anonymous({
      async onLinkAccount({ anonymousUser, newUser }) {
        await linkWatching({ anonymousUser, newUser })
      },
    }),
  ],
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: ['https://wovix.app'],
  baseURL: BETTER_AUTH_URL,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60 * 7,
    },
  },
  experimental: {
    joins: true,
  },
})
