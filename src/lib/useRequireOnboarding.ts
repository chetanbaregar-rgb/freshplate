"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "./store";

/**
 * True once the persisted store has loaded, and only from an effect (so after the first client
 * render). The first render after a full page load is rendered from the server snapshot, where
 * `household` is null, so reading it before this is true makes a signed-in user look signed out.
 */
export function useStoreReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useAppStore.persist.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}

/**
 * Sends the user to onboarding when they have not finished it. Waits for the stored household
 * to load first, otherwise a full page load of any guarded route bounces to onboarding.
 * Returns whether the stored state is ready, for pages that want to show a loader until then.
 */
export function useRequireOnboarding(): boolean {
  const router = useRouter();
  const ready = useStoreReady();
  const complete = useAppStore((s) => s.household?.onboardingComplete === true);

  useEffect(() => {
    if (ready && !complete) router.replace("/onboarding");
  }, [ready, complete, router]);

  return ready;
}
