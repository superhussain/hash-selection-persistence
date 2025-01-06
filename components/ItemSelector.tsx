import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import Spinner from "./Spinner";
import useHashUrlState from "@/hooks/useHashUrlState";

export default function ItemSelector() {
  const { state, setState, hash, loading, saving } = useHashUrlState<{
    items: number[];
  }>();

  const isLoading = useMemo(() => {
    if (hash && !state) return true; // initial loading state from hash
    return loading || saving;
  }, [hash, loading, saving, state]);

  const selectedItems = useMemo(() => state?.items || [], [state]);

  function handleSelectionChange(item: number, checked: boolean) {
    const newSelection = checked
    ? [...selectedItems, item]
    : selectedItems.filter((i) => i !== item);
    setState({ items: newSelection });
  }

  // Generate array of 1000 items
  const items = Array.from({ length: 1000 }, (_, i) => i + 1);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Items</h2>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Selected {selectedItems.length} of {items.length} items
        </p>
        {hash && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            hash: {hash}
            <Spinner
              className={`w-4 h-4 transition-opacity pointer-events-none ${
                !isLoading ? `opacity-0` : ""
              }`}
            />
          </div>
        )}
      </div>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid grid-cols-4 gap-4">
          {isLoading && selectedItems.length === 0 ? (
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
