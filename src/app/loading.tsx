import { ChefHat } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <span className="absolute inset-0 rounded-2xl border-4 border-brand-100 border-t-brand-500 animate-spin" />
        <ChefHat className="w-5 h-5 text-brand-500" />
      </div>
      <p className="text-xs font-medium text-muted-foreground animate-pulse">Loading…</p>
    </div>
  );
}
