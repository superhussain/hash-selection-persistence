import { createHash } from 'crypto';

// In-memory store for demo purposes
const hashStore: Map<string, number[]> = new Map();

export function generateHash(items: number[]): string {
  if (!items || !Array.isArray(items)) {
    throw new Error('Invalid items array');
  }
  
  const sortedItems = [...items].sort((a, b) => a - b);
  const str = sortedItems.join(',');
  return createHash('sha256').update(str).digest('hex').slice(0, 8);
}

export function storeHash(hash: string, items: number[]): void {
  if (!hash || !items || !Array.isArray(items)) {
    throw new Error('Invalid hash or items');
  }
  hashStore.set(hash, [...items]); // Store a copy of the array
}

export function getStoredItems(hash: string): number[] | null {
  if (!hash) {
    return null;
  }
  const items = hashStore.get(hash);
  return items ? [...items] : null; // Return a copy of the array
}