import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import rison from "rison";

import { constructUrl } from "@/lib/utils";

export default function useRisonUrlState<T>(initialState?: T) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<T | undefined>(initialState);
  const [loading, setLoading] = useState(true);
  const encoded = useRef<string>();

  // Read initial state from URL hash on mount
  useEffect(() => {
    try {
      const hash = location.hash.slice(1);
      if (hash) {
        encoded.current = hash;
        const decoded = rison.decode(decodeURIComponent(hash)) as T;
        setState(decoded);
      }
    } catch (error) {
      console.error('Failed to parse hash:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update URL hash when state changes
  const updateState = useCallback((newState: T) => {
    setState(newState);
    try {
      encoded.current = rison.encode(newState);
      router.replace(constructUrl({ hash: encoded.current }));
    } catch (error) {
      console.error('Failed to encode state:', error);
    }
  }, [router]);

  return [state, updateState, loading] as const;
}