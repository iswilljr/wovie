import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { linkWatching } from '../watching'
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_TRUSTED_ORIGINS,
  BETTER_AUTH_URL,
} from 'astro:env/server'
import { db } from 'astro:db'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: db,
  plugins: [
    anonymous({
      async onLinkAccount({ anonymousUser, newUser }) {
        await linkWatching({ anonymousUser, newUser })
      },
    }),
  ],
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: BETTER_AUTH_TRUSTED_ORIGINS.split(','),
  baseURL: BETTER_AUTH_URL,
})
