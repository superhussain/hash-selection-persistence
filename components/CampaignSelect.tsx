import { useMemo } from "react";

import useHashUrlState from "@/hooks/useHashUrlState";

export default function ItemSelector() {
  const { state, setState } = useHashUrlState("campaigns");

  const selectedItems = useMemo(
    () => (state?.campaigns as string[]) || [],
    [state]
  );
  const setSelectedItems = (campaigns: string[]) => setState({ campaigns });

  // Generate array of 100 items
  const items = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  function toggleCampaignSelect(campaignId: string) {
    const newSelection = selectedItems.includes(campaignId)
      ? selectedItems.filter((id) => id !== campaignId)
      : [...selectedItems, campaignId];
    setSelectedItems(newSelection);
  }

  return (
    <select
      className="block w-full my-4 h-[200px] p-2 border rounded-md"
      value={selectedItems}
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
