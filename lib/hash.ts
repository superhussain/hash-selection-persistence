import { createHash } from 'crypto';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const TTL_SECONDS = 7 * 24 * 60 * 60; // 1 week

export function generateHash(items: number[]): string {
  if (!items || !Array.isArray(items)) {
    throw new Error('Invalid items array');
  }

  const sortedItems = [...items].sort((a, b) => a - b);
  const str = sortedItems.join(',');
  return createHash('sha256').update(str).digest('hex').slice(0, 8);
}

export async function storeHash(hash: string, items: number[]): Promise<void> {
  if (!hash || !items || !Array.isArray(items)) {
    throw new Error('Invalid hash or items');
  }
  await redis.set(hash, items, { ex: TTL_SECONDS });
}

export async function getStoredItems(hash: string): Promise<number[] | null> {
  if (!hash) return null;
  const items = await redis.get<number[]>(hash);
  if (items) await redis.expire(hash, TTL_SECONDS); // reset TTL
  return items;
}