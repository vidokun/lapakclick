export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

export function rateLimit(identifier: string, options: RateLimitOptions): { success: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record) {
    store.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return { success: true };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + options.windowMs;
    return { success: true };
  }

  if (record.count >= options.limit) {
    return {
      success: false,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return { success: true };
}

// Clean up expired records every minute to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, 60000);
