import { Card } from "@/components/ui/card";

import useHashUrlState from "@/hooks/useHashUrlState";

export default function ItemSelector() {
  const { state, setState } = useHashUrlState<string[]>("campaigns");

  // Generate array of 100 items
  const items = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Campaign Select Example</h2>
      <p className="text-sm text-muted-foreground mb-4">This example uses the <code className="text-blue-600 font-bold">useHashUrlState</code> hook with a specified query param: <code className="text-blue-600 font-bold">campaigns</code></p>
      <div className="space-y-4">
        <select
          className="block w-full h-[200px] p-2 border rounded-md"
          value={state}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(({ value }) => value);
            setState(selected);
          }}
          multiple
        >
          {items.map((item) => (
            <option key={item} value={item}>
              Campaign {item}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
}
