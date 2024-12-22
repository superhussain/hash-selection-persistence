// Client-side storage implementation
const STORAGE_KEY = 'item-selections';

export function storeSelectionHash(hash: string, items: number[]): void {
  try {
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    storage[hash] = items;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error storing selection:', error);
  }
}

export function getStoredSelection(hash: string): number[] | null {
  try {
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return storage[hash] || null;
  } catch (error) {
    console.error('Error retrieving selection:', error);
    return null;
  }
}