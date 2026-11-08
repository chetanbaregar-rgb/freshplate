"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Household, Member, WeeklyPlan, PlanMeal, PantryItem, Order, ShoppingItem,
} from "./types";
import { filterRecipes, getRecipeById } from "./recipes";
import { avoidLabel, avoidListFor, findConflicts } from "./allergens";
import { computeShoppingList, deductFromPantry } from "./shopping";
import { startOfWeek, format } from "date-fns";

interface AppState {
  household: Household | null;
  weeklyPlan: WeeklyPlan | null;
  pantry: PantryItem[];
  orders: Order[];
  shoppingList: ShoppingItem[];
  onboardingStep: number;
  usedRecipeHistory: string[];
  /** One-off message about meals the app removed or could not fill. Not persisted. */
  planNotice: string | null;

  // Household actions
  setHousehold: (h: Household) => void;
  updateHousehold: (patch: Partial<Household>) => void;
  addMember: (m: Member) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  removeMember: (id: string) => void;
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;

  // Plan actions
  generateWeeklyPlan: () => void;
  swapMeal: (day: number, mealType: string, recipeId: string) => void;
  lockMeal: (day: number, mealType: string) => void;
  toggleOrderIn: (day: number, mealType: string) => void;
  dismissPlanNotice: () => void;

  // Shopping actions
  buildShoppingList: () => void;
  toggleShoppingItem: (ingredientId: string) => void;
  placeOrder: (platform: "zepto" | "instamart") => void;

  // Pantry actions
  addPantryItem: (item: Omit<PantryItem, "id" | "updatedAt">) => void;
  updatePantryItem: (id: string, patch: Partial<PantryItem>) => void;
  removePantryItem: (id: string) => void;
  markMealCooked: (day: number, mealType: string) => void;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

function generatePlan(household: Household, history: string[]): WeeklyPlan {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const meals: PlanMeal[] = [];
  const usedThisWeek = new Set<string>();
  const avoid = avoidListFor(household.members);

  for (let day = 0; day < 7; day++) {
    for (const mealType of MEAL_TYPES) {
      const primaryGoal = household.members[0]?.healthGoal ?? "maintenance";
      const withGoal = filterRecipes({ dietType: household.dietType, mealType, goalTags: [primaryGoal], avoid });
      const all = withGoal.length > 0 ? withGoal : filterRecipes({ dietType: household.dietType, mealType, avoid });

      // Priority 1: not used this week AND not in any prior week
      // Priority 2: not used this week (may be in prior weeks)
      // Fallback: any (all slots for this meal type exhausted)
      const fresh = all.filter(r => !usedThisWeek.has(r.id) && !history.includes(r.id));
      const newThisWeek = all.filter(r => !usedThisWeek.has(r.id));
      const pool = fresh.length > 0 ? fresh : newThisWeek.length > 0 ? newThisWeek : all;

      const recipe = pool[Math.floor(Math.random() * pool.length)];
      if (recipe) usedThisWeek.add(recipe.id);

      meals.push({
        day, mealType,
        recipeId: recipe?.id ?? null,
        isOrderIn: false, locked: false,
        servingsMultiplier: household.members.length,
      });
    }
  }

  return { id: `plan-${Date.now()}`, weekStart, meals, status: "draft" };
}

function unfilledNotice(plan: WeeklyPlan): string | null {
  const empty = plan.meals.filter((m) => !m.recipeId && !m.isOrderIn).length;
  if (empty === 0) return null;
  return `${empty} meal${empty === 1 ? "" : "s"} could not be filled: no recipe fits everyone's diet, allergies and dislikes. Check the allergy list in Profile.`;
}

/**
 * Clears any planned meal that conflicts with the household's allergies or dislikes, locked
 * or not. Used whenever the members change, so an allergy added later never leaves an
 * unsafe meal in the plan.
 */
function dropConflictingMeals(
  plan: WeeklyPlan | null,
  household: Household | null,
): { plan: WeeklyPlan | null; removed: number; terms: string[] } {
  if (!plan || !household) return { plan, removed: 0, terms: [] };
  const avoid = avoidListFor(household.members);
  if (avoid.length === 0) return { plan, removed: 0, terms: [] };

  let removed = 0;
  const terms = new Set<string>();
  const meals = plan.meals.map((m) => {
    const recipe = m.recipeId ? getRecipeById(m.recipeId) : undefined;
    const hits = recipe ? findConflicts(recipe, avoid) : [];
    if (hits.length === 0) return m;
    removed++;
    hits.forEach((h) => terms.add(avoidLabel(h)));
    return { ...m, recipeId: null, locked: false, cooked: false };
  });
  return { plan: removed > 0 ? { ...plan, meals } : plan, removed, terms: Array.from(terms) };
}

/** State patch after the household changed: drop conflicting meals and say so. */
function afterHouseholdChange(s: AppState, household: Household | null): Partial<AppState> {
  const { plan, removed, terms } = dropConflictingMeals(s.weeklyPlan, household);
  if (removed === 0) return { household };
  return {
    household,
    weeklyPlan: plan,
    shoppingList: [],
    planNotice: `${removed} meal${removed === 1 ? "" : "s"} removed from your plan because ${removed === 1 ? "it contains" : "they contain"} ${terms.join(", ")}. Use Swap or Regenerate to fill the gap${removed === 1 ? "" : "s"}.`,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      household: null,
      weeklyPlan: null,
      pantry: [],
      orders: [],
      shoppingList: [],
      onboardingStep: 0,
      usedRecipeHistory: [],
      planNotice: null,

      setHousehold: (h) => set({ household: h }),
      updateHousehold: (patch) =>
        set((s) => afterHouseholdChange(s, s.household ? { ...s.household, ...patch } : null)),
      addMember: (m) =>
        set((s) =>
          afterHouseholdChange(
            s,
            s.household ? { ...s.household, members: [...s.household.members, m] } : null,
          ),
        ),
      updateMember: (id, patch) =>
        set((s) =>
          afterHouseholdChange(
            s,
            s.household
              ? {
                  ...s.household,
                  members: s.household.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
                }
              : null,
          ),
        ),
      removeMember: (id) =>
        set((s) => ({
          household: s.household
            ? {
                ...s.household,
                members: s.household.members.filter((m) => m.id !== id),
              }
            : null,
        })),
      completeOnboarding: () => {
        const { household, usedRecipeHistory } = get();
        if (!household) return;
        const plan = generatePlan(household, usedRecipeHistory);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({
          household: { ...household, onboardingComplete: true },
          weeklyPlan: plan,
          usedRecipeHistory: [...usedRecipeHistory, ...newIds],
          planNotice: unfilledNotice(plan),
        });
      },
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      generateWeeklyPlan: () => {
        const { household, usedRecipeHistory } = get();
        if (!household) return;
        const plan = generatePlan(household, usedRecipeHistory);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({
          weeklyPlan: plan,
          usedRecipeHistory: [...usedRecipeHistory, ...newIds],
          planNotice: unfilledNotice(plan),
        });
      },
      dismissPlanNotice: () => set({ planNotice: null }),

      swapMeal: (day, mealType, recipeId) =>
        set((s) => {
          // Refuse a recipe that conflicts with an allergy, whatever the UI offered.
          const recipe = getRecipeById(recipeId);
          const avoid = avoidListFor(s.household?.members ?? []);
          if (!recipe || findConflicts(recipe, avoid).length > 0) return {};
          return {
            weeklyPlan: s.weeklyPlan
              ? {
                  ...s.weeklyPlan,
                  meals: s.weeklyPlan.meals.map((m) =>
                    m.day === day && m.mealType === mealType
                      ? { ...m, recipeId, isOrderIn: false, cooked: false }
                      : m
                  ),
                }
              : null,
          };
        }),

      lockMeal: (day, mealType) =>
        set((s) => ({
          weeklyPlan: s.weeklyPlan
            ? {
                ...s.weeklyPlan,
                meals: s.weeklyPlan.meals.map((m) =>
                  m.day === day && m.mealType === mealType
                    ? { ...m, locked: !m.locked }
                    : m
                ),
              }
            : null,
        })),

      toggleOrderIn: (day, mealType) =>
        set((s) => ({
          weeklyPlan: s.weeklyPlan
            ? {
                ...s.weeklyPlan,
                meals: s.weeklyPlan.meals.map((m) =>
                  m.day === day && m.mealType === mealType
                    ? { ...m, isOrderIn: !m.isOrderIn, recipeId: null, cooked: false }
                    : m
                ),
              }
            : null,
        })),

      buildShoppingList: () => {
        const { weeklyPlan, pantry } = get();
        if (!weeklyPlan) return;
        set({ shoppingList: computeShoppingList(weeklyPlan, pantry, getRecipeById) });
      },

      toggleShoppingItem: (ingredientId) =>
        set((s) => ({
          shoppingList: s.shoppingList.map((i) =>
            i.ingredientId === ingredientId ? { ...i, checked: !i.checked } : i
          ),
        })),

      placeOrder: (platform) => {
        const { shoppingList } = get();
        const items = shoppingList
          .filter((i) => !i.checked)
          .map((i) => ({ name: i.name, quantity: i.qtyToBuy, unit: i.unit, price: i.price ?? 50 }));

        const order: Order = {
          id: `ORD-${Date.now()}`,
          platform,
          planId: get().weeklyPlan?.id ?? "",
          items,
          status: "placed",
          placedAt: new Date().toISOString(),
          totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
      },

      addPantryItem: (item) =>
        set((s) => ({
          pantry: [
            ...s.pantry,
            { ...item, id: `pantry-${Date.now()}`, updatedAt: new Date().toISOString() },
          ],
        })),
      updatePantryItem: (id, patch) =>
        set((s) => ({
          pantry: s.pantry.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
          ),
        })),
      removePantryItem: (id) =>
        set((s) => ({ pantry: s.pantry.filter((p) => p.id !== id) })),

      markMealCooked: (day, mealType) => {
        const { weeklyPlan, pantry } = get();
        const meal = weeklyPlan?.meals.find(
          (m) => m.day === day && m.mealType === mealType
        );
        // A meal is cooked once: tapping again must not reduce the pantry a second time.
        if (!weeklyPlan || !meal?.recipeId || meal.cooked) return;
        const recipe = getRecipeById(meal.recipeId);
        if (!recipe) return;

        set({
          pantry: deductFromPantry(pantry, recipe, meal.servingsMultiplier),
          weeklyPlan: {
            ...weeklyPlan,
            meals: weeklyPlan.meals.map((m) =>
              m.day === day && m.mealType === mealType ? { ...m, cooked: true } : m
            ),
          },
        });
      },
    }),
    {
      name: "freshplate-store",
      partialize: (s) => ({
        household: s.household,
        weeklyPlan: s.weeklyPlan,
        pantry: s.pantry,
        orders: s.orders,
        usedRecipeHistory: s.usedRecipeHistory,
      }),
    }
  )
);
