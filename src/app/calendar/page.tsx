"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { getRecipeById, filterRecipes, effectiveDietType, excludedIngredientTerms, householdGoals } from "@/lib/recipes";
import { DAYS, DAYS_FULL, MEAL_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import AppShell from "@/components/layout/AppShell";
import { RefreshCw, Lock, Unlock, ShoppingCart, ChevronRight, Clock, Flame, X, Check, ChefHat, Zap } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { useCommerceStatus } from "@/lib/mcp/useCommerceStatus";

const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;

export default function CalendarPage() {
  const router = useRouter();
  const { weeklyPlan, household, generateWeeklyPlan, swapMeal, lockMeal, toggleOrderIn, buildShoppingList, markMealCooked } = useAppStore();
  const [selectedDay, setSelectedDay] = useState(0);
  const [swapTarget, setSwapTarget] = useState<{ day: number; mealType: string } | null>(null);
  const [detailMeal, setDetailMeal] = useState<{ day: number; mealType: string } | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const { status: commerceStatus, loading: commerceStatusLoading } = useCommerceStatus();
  const noPlatformConnected = !commerceStatusLoading && !commerceStatus.zepto.connected && !commerceStatus.instamart.connected;

  const weekStart = weeklyPlan?.weekStart ? new Date(weeklyPlan.weekStart) : startOfWeek(new Date(), { weekStartsOn: 1 });

  // Deep-linking here without completing onboarding leaves household null
  // (or incomplete) — bounce to onboarding instead of showing an indefinite loader.
  useEffect(() => {
    if (!household?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [household, router]);

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

  if (!weeklyPlan) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen text-muted-foreground">
          Loading plan…
        </div>
      </AppShell>
    );
  }

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await generateWeeklyPlan();
      toast.success("New weekly plan generated!");
    } finally {
      setRegenerating(false);
    }
  };

  const handleBuildList = () => {
    buildShoppingList();
    toast.success("Shopping list built! Head to Shop tab.");
  };

  const handleSwap = (recipeId: string) => {
    if (!swapTarget) return;
    swapMeal(swapTarget.day, swapTarget.mealType, recipeId);
    setSwapTarget(null);
    toast.success("Meal swapped!");
  };

  const swapCandidates = swapTarget
    ? filterRecipes({
        dietType: effectiveDietType(household),
        mealType: swapTarget.mealType,
        goalTags: householdGoals(household),
        excludeIngredientTerms: excludedIngredientTerms(household),
        excludeIds: [
          weeklyPlan.meals.find(
            (m) => m.day === swapTarget.day && m.mealType === swapTarget.mealType
          )?.recipeId ?? "",
        ],
      })
    : [];

  const detailPlanMeal = detailMeal
    ? weeklyPlan.meals.find((m) => m.day === detailMeal.day && m.mealType === detailMeal.mealType)
    : null;
  const detailRecipe = detailPlanMeal?.recipeId ? getRecipeById(detailPlanMeal.recipeId) : null;

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-[rgb(235,227,215)] px-4 pt-4 pb-3 lg:px-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-lg font-bold">This Week&apos;s Plan</h1>
            <p className="text-xs text-muted-foreground">
              {format(weekStart, "d MMM")} – {format(addDays(weekStart, 6), "d MMM yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-2 disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} /> {regenerating ? "Regenerating…" : "Regenerate"}
            </button>
            <button
              onClick={handleBuildList}
              className="flex items-center gap-1.5 text-xs font-medium bg-brand-500 text-white rounded-xl px-3 py-2 hover:bg-brand-600"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Build List
            </button>
          </div>
        </div>

        {/* Day strip */}
        <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
          {DAYS.map((d, i) => {
            const date = addDays(weekStart, i);
            const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[52px] transition-all",
                  selectedDay === i
                    ? "bg-brand-500 text-white"
                    : isToday
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <span className="text-[10px] font-medium">{d}</span>
                <span className={cn("text-base font-bold", selectedDay === i ? "text-white" : "text-gray-800")}>{format(date, "d")}</span>
              </button>
            );
          })}
        </div>

        {noPlatformConnected && (
          <Link
            href="/profile"
            className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1">Connect Zepto or Instamart to make this plan availability-aware, not just diet-aware.</span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          </Link>
        )}
      </div>

      {/* Desktop: 7-column grid; Mobile: single day */}
      <div className="hidden lg:grid grid-cols-7 gap-0 flex-1 overflow-auto">
        {DAYS.map((d, day) => (
          <div key={day} className="border-r last:border-r-0 border-[rgb(235,227,215)] min-h-full">
            <div className={cn("px-3 py-2 border-b border-[rgb(235,227,215)] text-center", selectedDay === day && "bg-brand-50")}>
              <p className="text-xs font-semibold text-muted-foreground">{d}</p>
              <p className="text-sm font-bold">{format(addDays(weekStart, day), "d")}</p>
            </div>
            <div className="p-2 space-y-2">
              {MEAL_TYPES.map((mt) => {
                const meal = weeklyPlan.meals.find((m) => m.day === day && m.mealType === mt);
                const recipe = meal?.recipeId ? getRecipeById(meal.recipeId) : null;
                return (
                  <MealCard
                    key={mt}
                    mealType={mt}
                    recipe={recipe ?? null}
                    meal={meal}
                    compact
                    onDetail={() => setDetailMeal({ day, mealType: mt })}
                    onSwap={() => setSwapTarget({ day, mealType: mt })}
                    onLock={() => lockMeal(day, mt)}
                    onCooked={() => { markMealCooked(day, mt); toast.success("Meal marked as cooked!"); }}
                    onOrderIn={() => toggleOrderIn(day, mt)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: selected day */}
      <div className="lg:hidden flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-base font-semibold">{DAYS_FULL[selectedDay]}</h2>
        {MEAL_TYPES.map((mt) => {
          const meal = weeklyPlan.meals.find((m) => m.day === selectedDay && m.mealType === mt);
          const recipe = meal?.recipeId ? getRecipeById(meal.recipeId) : null;
          return (
            <MealCard
              key={mt}
              mealType={mt}
              recipe={recipe ?? null}
              meal={meal}
              onDetail={() => setDetailMeal({ day: selectedDay, mealType: mt })}
              onSwap={() => setSwapTarget({ day: selectedDay, mealType: mt })}
              onLock={() => lockMeal(selectedDay, mt)}
              onCooked={() => { markMealCooked(selectedDay, mt); toast.success("Meal marked as cooked! Pantry updated."); }}
              onOrderIn={() => toggleOrderIn(selectedDay, mt)}
            />
          );
        })}
      </div>

      {/* Swap sheet */}
      {swapTarget && (
        <BottomSheet title={`Swap ${MEAL_LABELS[swapTarget.mealType]}`} onClose={() => setSwapTarget(null)}>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {swapCandidates.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSwap(r.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.prepTime + r.cookTime} min · {r.nutrition.calories} kcal</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            ))}
            {swapCandidates.length === 0 && (
              <p className="text-sm text-center text-muted-foreground py-4">No alternatives found for current filters.</p>
            )}
          </div>
        </BottomSheet>
      )}

      {/* Detail sheet */}
      {detailMeal && detailRecipe && (
        <BottomSheet title={detailRecipe.name} onClose={() => setDetailMeal(null)}>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            <p className="text-sm text-muted-foreground">{detailRecipe.description}</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Calories", value: `${detailRecipe.nutrition.calories}` },
                { label: "Protein", value: `${detailRecipe.nutrition.proteinG}g` },
                { label: "Carbs", value: `${detailRecipe.nutrition.carbsG}g` },
                { label: "Fat", value: `${detailRecipe.nutrition.fatG}g` },
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
                {detailRecipe.ingredients.map((ing) => (
                  <p key={ing.id} className="text-xs text-gray-600">• {ing.name} ({ing.quantity}{ing.unit})</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Steps</p>
              <ol className="space-y-1">
                {detailRecipe.steps.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="font-bold text-brand-500 flex-shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </BottomSheet>
      )}
    </AppShell>
  );
}

function MealCard({
  mealType, recipe, meal, compact, onDetail, onSwap, onLock, onCooked, onOrderIn,
}: {
  mealType: string;
  recipe: ReturnType<typeof getRecipeById> | null;
  meal: ReturnType<typeof useAppStore.getState>["weeklyPlan"] extends null ? never : NonNullable<ReturnType<typeof useAppStore.getState>["weeklyPlan"]>["meals"][number] | undefined;
  compact?: boolean;
  onDetail: () => void;
  onSwap: () => void;
  onLock: () => void;
  onCooked: () => void;
  onOrderIn: () => void;
}) {
  const mealColors: Record<string, string> = {
    breakfast: "bg-amber-50 border-amber-100",
    lunch: "bg-sage-50 border-sage-100",
    snack: "bg-purple-50 border-purple-100",
    dinner: "bg-blue-50 border-blue-100",
  };

  if (meal?.isOrderIn) {
    return (
      <div className={cn("border rounded-xl p-3", mealColors[mealType])}>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{MEAL_LABELS[mealType]}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">🛵 Order In</p>
            <p className="text-xs text-blue-500">via Swiggy</p>
          </div>
          <button onClick={onOrderIn} aria-label={`Cancel order-in for ${MEAL_LABELS[mealType]}`} className="text-xs text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-xl p-3", mealColors[mealType])}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{MEAL_LABELS[mealType]}</p>
          {recipe ? (
            <>
              <p className={cn("font-semibold text-gray-800 leading-tight", compact ? "text-xs" : "text-sm")}>{recipe.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" /> {recipe.prepTime + recipe.cookTime}m
                </span>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Flame className="w-3 h-3" /> {recipe.nutrition.calories} kcal
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">No recipe</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {meal?.locked && <Lock className="w-3 h-3 text-gray-400" />}
        </div>
      </div>

      {/* Explicit View Recipe CTA — visible on all card sizes */}
      {recipe && (
        <button
          onClick={onDetail}
          className={cn(
            "w-full mt-2 flex items-center justify-between bg-white/80 hover:bg-white rounded-lg text-xs font-medium text-brand-600 hover:text-brand-700 transition-all border border-brand-100 hover:border-brand-300 group",
            compact ? "px-2 py-1" : "px-2.5 py-1.5"
          )}
        >
          <span>{compact ? "View recipe" : "View Recipe & Steps"}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {!compact && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-black/5">
          <ActionBtn onClick={(e) => { e.stopPropagation(); onSwap(); }}>Swap</ActionBtn>
          <ActionBtn onClick={(e) => { e.stopPropagation(); onLock(); }}>
            {meal?.locked ? <><Unlock className="w-3 h-3" /> Unlock</> : <><Lock className="w-3 h-3" /> Lock</>}
          </ActionBtn>
          <ActionBtn onClick={(e) => { e.stopPropagation(); onCooked(); }}>
            <Check className="w-3 h-3" /> Cooked
          </ActionBtn>
          {mealType === "dinner" && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onOrderIn(); }}>🛵 Order In</ActionBtn>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-brand-600 bg-white/70 border border-black/5 rounded-lg px-2 py-1"
    >
      {children}
    </button>
  );
}

function BottomSheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full lg:max-w-lg rounded-t-3xl lg:rounded-3xl p-6 max-h-[85vh] flex flex-col z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
