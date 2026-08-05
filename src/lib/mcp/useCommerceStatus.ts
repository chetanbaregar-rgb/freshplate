"use client";
import { useCallback, useEffect, useState } from "react";
import type { Platform } from "@/lib/types";

interface StatusEntry {
  connected: boolean;
  addressLabel: string | null;
  addressId: string | null;
}

interface CommerceStatus {
  zepto: StatusEntry;
  instamart: StatusEntry;
}

const DEFAULT_STATUS: CommerceStatus = {
  zepto: { connected: false, addressLabel: null, addressId: null },
  instamart: { connected: false, addressLabel: null, addressId: null },
};

/** Always re-derives from the server (httpOnly session cookie) — never cache
 *  connection state as a trusted value beyond this hook's own re-fetches. */
export function useCommerceStatus() {
  const [status, setStatus] = useState<CommerceStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setStatus({
        zepto: data.zepto ?? DEFAULT_STATUS.zepto,
        instamart: data.instamart ?? DEFAULT_STATUS.instamart,
      });
    } catch {
      setStatus(DEFAULT_STATUS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const disconnect = useCallback(
    async (platform: Platform) => {
      await fetch(`/api/auth/${platform}/disconnect`, { method: "POST" });
      await refresh();
    },
    [refresh]
  );

  return { status, loading, refresh, disconnect };
}
