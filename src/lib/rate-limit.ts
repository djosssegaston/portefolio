type Bucket = { hits: number[] }

const buckets = new Map<string, Bucket>()

/**
 * Best-effort in-process rate limiter. Good enough to stop scripted abuse on a
 * single node; put a shared store (Redis) in front for multi-instance setups.
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key) ?? { hits: [] }
  const recent = bucket.hits.filter((t) => now - t < windowMs)

  if (recent.length >= max) {
    bucket.hits = recent
    buckets.set(key, bucket)
    return true
  }

  recent.push(now)
  bucket.hits = recent
  buckets.set(key, bucket)

  if (buckets.size > 5000) {
    buckets.forEach((b, k) => {
      if (!b.hits.some((t) => now - t < windowMs)) buckets.delete(k)
    })
  }
  return false
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}
