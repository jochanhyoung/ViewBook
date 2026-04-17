// src/lib/rate-limit.ts
// 서버 사이드 rate limit (in-memory, single process)
// 프로덕션에서는 Redis 등으로 교체

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

const store = new Map<string, { count: number; resetAt: number }>();

let lastPrune = Date.now();
function pruneExpired() {
  const now = Date.now();
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [k, v] of store) {
    if (now > v.resetAt) store.delete(k);
  }
}

export async function rateLimit(key: string, opts: RateLimitOptions): Promise<boolean> {
  pruneExpired();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  if (entry.count >= opts.max) {
    return false;
  }

  entry.count++;
  return true;
}

// 일일 호출 카운터
const dailyStore = new Map<string, { count: number; date: string }>();

export async function dailyLimit(key: string, max: number): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const entry = dailyStore.get(key);

  if (!entry || entry.date !== today) {
    dailyStore.set(key, { count: 1, date: today });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
