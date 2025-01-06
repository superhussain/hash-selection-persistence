import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * A hook to manage UI state in the URL represented by a hashed query parameter
 * @param param The query parameter name to use for the hash
 *
 * @example
 * const { state: filter, setState: setFilter } = useHashUrlState('filter');
 * // ...
 * setFilter({ campaignIds: [1, 2, 3], types: ['display', 'native'], statuses: ['live'] });
 * // this will update the `filter` URL query parameter with a hash that represents the state
 */
export default function useHashUrlState(param = 'hash') {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<Record<string, unknown>>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const hash = useMemo(() => searchParams.get(param), [param, searchParams]);

  const loadHashState = useCallback(async (hash: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hash?hash=${hash}`);
      const data = (await response.json()) as Record<string, unknown>;
      if (data) setState(data);
    } catch (error) {
      console.error("Error loading hash:", error);
    } finally {
      setTimeout(() => setLoading(false), 100);
    }
  }, []);

  const handleStateChange = useCallback(async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const res = (await response.json()) as { hash: string };
      const url = new URL(window.location.href);
      url.searchParams.set(param, res.hash);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error("Error saving hash:", error);
    } finally {
      setTimeout(() => setSaving(false), 100);
    }
  }, [param, router, state]);

  useEffect(() => {
    if (hash && !saving) loadHashState(hash);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  useEffect(() => {
    if (state && !loading) handleStateChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { state, setState, loading, saving, hash: hash };
}
