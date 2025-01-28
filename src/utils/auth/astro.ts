import { createAuthClient } from 'better-auth/client'
import { anonymousClient } from 'better-auth/client/plugins'

export const client = createAuthClient({
  // @ts-expect-error bad types
  plugins: [anonymousClient()],
})
