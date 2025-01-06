import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function useHashUrlState() {
  const [state, setState] = useState<Record<string, unknown>>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentHash = useMemo(() => searchParams.get("hash"), [searchParams]);

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
      const { hash } = (await response.json()) as { hash: string };
      const url = new URL(window.location.href);
      url.searchParams.set("hash", hash);
      router.replace(url.pathname + url.search);
    } catch (error) {
      console.error("Error saving hash:", error);
    } finally {
      setTimeout(() => setSaving(false), 100);
    }
  }, [router, state]);

  useEffect(() => {
    if (currentHash && !saving) loadHashState(currentHash);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHash]);

  useEffect(() => {
    if (state && !loading) handleStateChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { state, setState, loading, saving, hash: currentHash };
}
