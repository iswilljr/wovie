import { hash } from 'ohash'
import { Redis } from '@upstash/redis'
import { z } from 'astro/zod'

const DEFAULT_CACHE_TTL_SECONDS = 1 * 60 * 60 * 6 // 6 hours

const RedisConfigSchema = z.object({
  REDIS_URL: z.string().optional().default(''),
  REDIS_TOKEN: z.string().optional().default(''),
  CACHE_ENABLED: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform(val => val === 'true'),
  CACHE_TTL_SECONDS: z
    .string()
    .optional()
    .default('')
    .transform(val => Number(val) || DEFAULT_CACHE_TTL_SECONDS)
    .describe('Cache TTL in seconds'),
})

const redisConfig = RedisConfigSchema.parse({
  REDIS_URL: import.meta.env.REDIS_URL,
  REDIS_TOKEN: import.meta.env.REDIS_TOKEN,
  CACHE_ENABLED: import.meta.env.CACHE_ENABLED,
  CACHE_TTL_SECONDS: import.meta.env.CACHE_TTL_SECONDS,
})

let client: Redis | null = null

if (redisConfig.CACHE_ENABLED) {
  client = new Redis({
    url: redisConfig.REDIS_URL,
    token: redisConfig.REDIS_TOKEN,
  })
}

export function cache<T, Args extends any[]>(
  name: string,
  fn: (...args: Args) => Promise<T>
) {
  if (!client) return fn

  return async (...args: Args): Promise<T> => {
    const argsHash = hash(args)
    const key = `${name}:${argsHash}`
    const cached = await client.get<T>(key)
    if (cached) {
      return cached
    }
    const result = await fn(...args)
    await client.set(key, JSON.stringify(result), {
      ex: redisConfig.CACHE_TTL_SECONDS,
    })
    return result
  }
}
