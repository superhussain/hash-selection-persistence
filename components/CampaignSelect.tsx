import useHashUrlState from "@/hooks/useHashUrlState";

export default function ItemSelector() {
  const { state, setState } = useHashUrlState<string[]>("campaigns");

  // Generate array of 100 items
  const items = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  return (
    <select
      className="block w-full my-4 h-[200px] p-2 border rounded-md"
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
  );
}
