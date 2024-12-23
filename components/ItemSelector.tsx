"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import Spinner from "./Spinner";

export default function ItemSelector() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate array of 1000 items
  const items = Array.from({ length: 1000 }, (_, i) => i + 1);

  const currentHash = useMemo(() => searchParams.get("hash"), [searchParams]);

  useEffect(() => {
    if (currentHash) loadSelectionFromHash(currentHash);
    else setLoading(false);
  }, [currentHash]);

  async function loadSelectionFromHash(hash: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/hash?hash=${hash}`);
      const data = await response.json();
      if (data.items) setSelectedItems(data.items);
    } catch (error) {
      console.error("Error loading selection:", error);
    } finally {
      setTimeout(() => setLoading(false), 100);
    }
  }

  async function handleSelectionChange(item: number, checked: boolean) {
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter((i) => i !== item);

    setSelectedItems(newSelection);

    try {
      const response = await fetch("/api/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newSelection }),
      });
      const { hash } = (await response.json()) as { hash: string };
      const url = new URL(window.location.href);
      url.searchParams.set("hash", hash);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error("Error saving selection:", error);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Items</h2>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Selected {selectedItems.length} of {items.length} items
        </p>
        {currentHash && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            hash: {currentHash}
            <Spinner className={`w-4 h-4 transition-opacity pointer-events-none ${!loading ? `opacity-0` : ''}`} />
          </div>
        )}
      </div>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid grid-cols-4 gap-4">
          {loading && selectedItems.length === 0 ? (
            <div className="col-span-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : (
            items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={(checked) =>
                    handleSelectionChange(item, checked as boolean)
                  }
                />
                <label
                  htmlFor={`item-${item}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Item {item}
                </label>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
