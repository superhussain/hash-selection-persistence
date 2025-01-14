import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { constructUrl } from "@/lib/utils";

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
export default function useHashUrlState<T = unknown>(param = 'hash', initial?: T) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<T>(initial as T);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const hash = useMemo(() => searchParams.get(param), [param, searchParams]);

  const loadHashState = useCallback(async (hashParam: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hash?hash=${hashParam}`);
      const data = (await response.json()) as T;
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

      // handle empty state
      const isEmptyObject = state && typeof state === 'object' && Object.keys(state).length === 0;
      const isEmptyArray = Array.isArray(state) && state.length === 0;
      if (!state || isEmptyObject || isEmptyArray) {
        router.replace(constructUrl({ query: { [param]: '' } }));
        return;
      }

      const response = await fetch("/api/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const res = (await response.json()) as { hash: string };
      router.replace(constructUrl({ query: { [param]: res.hash } }));
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
