"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function Root() {
  const router = useRouter();
  const household = useAppStore((s) => s.household);

  useEffect(() => {
    if (household?.onboardingComplete) {
      router.replace("/calendar");
    } else {
      router.replace("/onboarding");
    }
  }, [household, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-50">
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl font-bold text-brand-600">🥗</div>
        <p className="text-muted-foreground text-sm">Loading FreshPlate…</p>
      </div>
    </div>
  );
}
