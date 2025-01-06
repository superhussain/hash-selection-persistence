import { createHash } from 'crypto';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const TTL_SECONDS = 7 * 24 * 60 * 60; // 1 week

export function generateHash(state: unknown): string {
  if (!state) throw new Error('Invalid state');
  const str = JSON.stringify(state);
  return createHash('sha256').update(str).digest('hex').slice(0, 8);
}

export async function storeHash(hash: string, state: unknown): Promise<void> {
  if (!hash || !state) throw new Error('Invalid hash or state');
  await redis.set(hash, state, { ex: TTL_SECONDS });
}

export async function getStoredState<T = unknown>(hash: string): Promise<T | null> {
  if (!hash) return null;
  const state = await redis.get<T>(hash);
  if (state) await redis.expire(hash, TTL_SECONDS); // reset TTL
  return state;
}