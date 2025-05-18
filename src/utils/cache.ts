import { hash } from 'ohash'
import { Redis } from '@upstash/redis'
import {
  CACHE_ENABLED,
  CACHE_TTL_SECONDS,
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
} from 'astro:env/server'

const DEFAULT_CACHE_TTL_SECONDS = 1 * 60 * 60 * 6 // 6 hours

const redisConfig = {
  REDIS_URL: KV_REST_API_URL,
  REDIS_TOKEN: KV_REST_API_TOKEN,
  CACHE_ENABLED,
  CACHE_TTL_SECONDS: CACHE_TTL_SECONDS ?? DEFAULT_CACHE_TTL_SECONDS,
}

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
