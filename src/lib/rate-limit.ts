const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_ATTEMPTS = 5;

type Bucket = {
  count: number;
  expiresAt: number;
};

type RateLimitOptions = {
  windowMs?: number;
  maxAttempts?: number;
};

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.expiresAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(key: string, options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const now = Date.now();
  cleanup(now);

  const current = buckets.get(key);

  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (current.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: current.expiresAt - now };
  }

  current.count += 1;
  buckets.set(key, current);

  return { allowed: true, retryAfterMs: 0 };
}
