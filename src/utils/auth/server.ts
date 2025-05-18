import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { Account, db, Session, User, Verification } from 'astro:db'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { linkWatching } from '../watching'
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_TRUSTED_ORIGINS,
  BETTER_AUTH_URL,
} from 'astro:env/server'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: User,
      session: Session,
      account: Account,
      verification: Verification,
    },
  }),
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
