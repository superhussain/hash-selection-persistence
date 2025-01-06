import useHashUrlState from "@/hooks/useHashUrlState";

export default function ItemSelector() {
  const { state = [], setState } = useHashUrlState<string[]>("campaigns", []);

  function toggleCampaignSelect(campaignId: string) {
    setState(
      state.includes(campaignId)
        ? state.filter((id) => id !== campaignId)
        : [...state, campaignId]
    );
  }

  // Generate array of 100 items
  const items = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  return (
    <select
      className="block w-full my-4 h-[200px] p-2 border rounded-md"
      value={state}
      multiple
    >
      {items.map((item) => (
        <option
          key={item}
          value={item}
          onClick={() => toggleCampaignSelect(item)}
        >
          Campaign {item}
        </option>
      ))}
    </select>
  );
}
