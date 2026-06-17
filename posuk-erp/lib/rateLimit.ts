/**
 * Sliding-window in-memory rate limiter.
 * Suitable for single-process deployments; swap for Redis-backed (e.g. Upstash)
 * if running multiple replicas behind a load balancer.
 */

interface Window {
  timestamps: number[];
}

const store = new Map<string, Window>();

/** Remove all keys that have had no activity for longer than `windowMs`. */
function prune(now: number, windowMs: number, w: Window) {
  const cutoff = now - windowMs;
  w.timestamps = w.timestamps.filter((t) => t > cutoff);
}

/**
 * Returns true if the request should be blocked.
 *
 * @param key      Unique key per rate-limited dimension (e.g. "forgot-pw:1.2.3.4")
 * @param limit    Maximum allowed requests within `windowMs`
 * @param windowMs Rolling window in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let w = store.get(key);
  if (!w) {
    w = { timestamps: [] };
    store.set(key, w);
  }
  prune(now, windowMs, w);
  if (w.timestamps.length >= limit) return true;
  w.timestamps.push(now);
  return false;
}

/** Extract the best-effort client IP from a Next.js request. */
export function clientIp(req: Request): string {
  const fwd = (req.headers as Headers).get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (req.headers as Headers).get("x-real-ip") ?? "unknown";
}
