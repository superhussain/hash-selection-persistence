import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import useRisonUrlState from "@/hooks/useRisonUrlState";

interface FormState {
  name: string;
  age: number;
  favorites: string[];
}

export default function RisonExample() {
  const [state, setState, loading] = useRisonUrlState<FormState>({
    name: "",
    age: 0,
    favorites: [],
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rison URL State Example</h2>
      <p className="text-sm text-muted-foreground mb-4">This example uses the <code className="text-blue-600 font-bold">useRisonUrlState</code> hook and writes to the URL fragment (client-side only)</p>
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={state?.name ?? ""}
                onChange={(e) => setState({ ...state!, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={state?.age ?? 0}
                onChange={(e) =>
                  setState({ ...state!, age: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="favorites">
                Favorite Things (comma-separated)
              </Label>
              <Input
                id="favorites"
                value={state?.favorites.join(", ") ?? ""}
                onChange={(e) =>
                  setState({
                    ...state!,
                    favorites: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
