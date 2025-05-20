import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import {
  ASTRO_DB_APP_TOKEN,
  ASTRO_DB_REMOTE_URL,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_TRUSTED_ORIGINS,
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
  plugins: [anonymous({})],
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: BETTER_AUTH_TRUSTED_ORIGINS.split(','),
  baseURL: BETTER_AUTH_URL,
})
