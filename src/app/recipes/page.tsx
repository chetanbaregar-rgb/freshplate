"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { RECIPES } from "@/lib/recipes";
import { MEAL_LABELS, DIET_LABELS, cn } from "@/lib/utils";
import AppShell from "@/components/layout/AppShell";
import { Search, Clock, Flame, X, ChefHat, BookOpen } from "lucide-react";
import type { DietType, MealType, Recipe } from "@/lib/types";

const DIET_FILTERS: ("all" | DietType)[] = ["all", "veg", "egg", "nonveg"];
const MEAL_FILTERS: ("all" | MealType)[] = ["all", "breakfast", "lunch", "snack", "dinner"];

const DIET_EMOJI: Record<DietType, string> = { veg: "🥦", egg: "🥚", nonveg: "🍗" };

export default function RecipesPage() {
  const router = useRouter();
  const { household } = useAppStore();
  const [query, setQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | DietType>("all");
  const [mealFilter, setMealFilter] = useState<"all" | MealType>("all");
  const [selected, setSelected] = useState<Recipe | null>(null);

  // Deep-linking here without completing onboarding leaves household null
  // (or incomplete) — bounce to onboarding instead of rendering blank, same
  // guard every other tab uses.
  useEffect(() => {
    if (!household?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [household, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (dietFilter !== "all" && r.dietType !== dietFilter) return false;
      if (mealFilter !== "all" && !r.mealType.includes(mealFilter)) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisineRegion.some((c) => c.toLowerCase().includes(q))) {
        return false;
      }
      return true;
    });
  }, [query, dietFilter, mealFilter]);

  if (!household?.onboardingComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="absolute inset-0 rounded-2xl border-4 border-brand-100 border-t-brand-500 animate-spin" />
          <ChefHat className="w-5 h-5 text-brand-500" />
        </div>
        <p className="text-xs font-medium text-muted-foreground animate-pulse">Redirecting…</p>
      </div>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-[rgb(235,227,215)] px-4 pt-4 pb-3 lg:px-8 space-y-3">
        <div>
          <h1 className="text-lg font-bold">Recipe Library</h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {RECIPES.length} recipes across India
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or region (e.g. Kerala)"
            aria-label="Search recipes"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
          {DIET_FILTERS.map((d) => (
            <button
              key={d}
              onClick={() => setDietFilter(d)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                dietFilter === d
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              {d === "all" ? "All diets" : `${DIET_EMOJI[d]} ${DIET_LABELS[d]}`}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
          {MEAL_FILTERS.map((m) => (
            <button
              key={m}
              onClick={() => setMealFilter(m)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                mealFilter === m
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              {m === "all" ? "All meals" : MEAL_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-4 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <BookOpen className="w-12 h-12 text-gray-200" />
            <p className="text-sm text-muted-foreground">No recipes match these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="text-left bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-semibold text-sm leading-tight">{r.name}</p>
                  <span className="text-base flex-shrink-0" aria-hidden="true">{DIET_EMOJI[r.dietType]}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 truncate">{r.cuisineRegion.join(" · ")}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {r.mealType.map((mt) => (
                    <span key={mt} className="text-[10px] font-medium bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                      {MEAL_LABELS[mt]}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.prepTime + r.cookTime}m</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {r.nutrition.calories} kcal</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full lg:max-w-lg rounded-t-3xl lg:rounded-3xl p-6 max-h-[85vh] flex flex-col z-10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold pr-4">{selected.name}</h3>
              <button onClick={() => setSelected(null)} aria-label="Close" className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{selected.cuisineRegion.join(" · ")}</p>
            <div className="space-y-4 overflow-y-auto">
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Calories", value: `${selected.nutrition.calories}` },
                  { label: "Protein", value: `${selected.nutrition.proteinG}g` },
                  { label: "Carbs", value: `${selected.nutrition.carbsG}g` },
                  { label: "Fat", value: `${selected.nutrition.fatG}g` },
                ].map((n) => (
                  <div key={n.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-muted-foreground">{n.label}</p>
                    <p className="text-sm font-bold">{n.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ingredients</p>
                <div className="grid grid-cols-2 gap-1">
                  {selected.ingredients.map((ing) => (
                    <p key={ing.id} className="text-xs text-gray-600">• {ing.name} ({ing.quantity}{ing.unit})</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Steps</p>
                <ol className="space-y-1">
                  {selected.steps.map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="font-bold text-brand-500 flex-shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
