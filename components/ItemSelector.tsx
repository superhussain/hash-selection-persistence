'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { generateHash } from '@/lib/hash';
import { storeSelectionHash, getStoredSelection } from '@/lib/client';

export default function ItemSelector() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate array of 1000 items
  const items = Array.from({ length: 1000 }, (_, i) => i + 1);

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (hash) {
      loadSelectionFromHash(hash);
    }
  }, [searchParams]);

  function loadSelectionFromHash(hash: string) {
    try {
      setLoading(true);
      const items = getStoredSelection(hash);
      if (items) {
        setSelectedItems(items);
      }
    } catch (error) {
      console.error('Error loading selection:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectionChange(item: number, checked: boolean) {
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter((i) => i !== item);
    
    setSelectedItems(newSelection);
    
    try {
      const hash = generateHash(newSelection);
      storeSelectionHash(hash, newSelection);
      
      const url = new URL(window.location.href);
      url.searchParams.set('hash', hash);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error('Error saving selection:', error);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Items</h2>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Selected {selectedItems.length} of {items.length} items
        </p>
      </div>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={(checked) => 
                  handleSelectionChange(item, checked as boolean)
                }
                disabled={loading}
              />
              <label
                htmlFor={`item-${item}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Item {item}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}