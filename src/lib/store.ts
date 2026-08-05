"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Household, Member, WeeklyPlan, PlanMeal, PantryItem, Order, ShoppingItem, Platform,
} from "./types";
import { RECIPES, filterRecipes, getIngredientById } from "./recipes";
import { resolveAdapter } from "./mcp/adapter";
import { startOfWeek, format } from "date-fns";

interface AppState {
  household: Household | null;
  weeklyPlan: WeeklyPlan | null;
  pantry: PantryItem[];
  orders: Order[];
  shoppingList: ShoppingItem[];
  onboardingStep: number;
  usedRecipeHistory: string[];

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

  // Shopping actions
  buildShoppingList: () => void;
  toggleShoppingItem: (ingredientId: string) => void;
  /** Searches each shopping-list item on `platform` (live if connected, mock
   *  otherwise) and fills in price/packSize/available/platformRef. Returns
   *  whether it hit the live platform (vs. the demo fallback). */
  refreshAvailability: (platform: Platform) => Promise<boolean>;
  placeOrder: (platform: Platform, addressId?: string) => Promise<Order>;

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

  for (let day = 0; day < 7; day++) {
    for (const mealType of MEAL_TYPES) {
      const primaryGoal = household.members[0]?.healthGoal ?? "maintenance";
      const withGoal = filterRecipes({ dietType: household.dietType, mealType, goalTags: [primaryGoal] });
      const all = withGoal.length > 0 ? withGoal : filterRecipes({ dietType: household.dietType, mealType });

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

      setHousehold: (h) => set({ household: h }),
      updateHousehold: (patch) =>
        set((s) => ({ household: s.household ? { ...s.household, ...patch } : null })),
      addMember: (m) =>
        set((s) => ({
          household: s.household
            ? { ...s.household, members: [...s.household.members, m] }
            : null,
        })),
      updateMember: (id, patch) =>
        set((s) => ({
          household: s.household
            ? {
                ...s.household,
                members: s.household.members.map((m) =>
                  m.id === id ? { ...m, ...patch } : m
                ),
              }
            : null,
        })),
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
        });
      },
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      generateWeeklyPlan: () => {
        const { household, usedRecipeHistory } = get();
        if (!household) return;
        const plan = generatePlan(household, usedRecipeHistory);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({ weeklyPlan: plan, usedRecipeHistory: [...usedRecipeHistory, ...newIds] });
      },

      swapMeal: (day, mealType, recipeId) =>
        set((s) => ({
          weeklyPlan: s.weeklyPlan
            ? {
                ...s.weeklyPlan,
                meals: s.weeklyPlan.meals.map((m) =>
                  m.day === day && m.mealType === mealType
                    ? { ...m, recipeId, isOrderIn: false }
                    : m
                ),
              }
            : null,
        })),

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
                    ? { ...m, isOrderIn: !m.isOrderIn, recipeId: null }
                    : m
                ),
              }
            : null,
        })),

      buildShoppingList: () => {
        const { weeklyPlan, pantry } = get();
        if (!weeklyPlan) return;

        const ingredientMap = new Map<string, ShoppingItem>();

        for (const meal of weeklyPlan.meals) {
          if (!meal.recipeId || meal.isOrderIn) continue;
          const recipe = RECIPES.find((r) => r.id === meal.recipeId);
          if (!recipe) continue;

          for (const ing of recipe.ingredients) {
            const needed = ing.quantity * meal.servingsMultiplier / recipe.servings;
            if (ingredientMap.has(ing.id)) {
              const existing = ingredientMap.get(ing.id)!;
              existing.qtyNeeded += needed;
            } else {
              const inStock = pantry.find((p) => p.name.toLowerCase() === ing.name.toLowerCase())?.quantity ?? 0;
              ingredientMap.set(ing.id, {
                ingredientId: ing.id,
                name: ing.name,
                category: ing.category,
                qtyNeeded: needed,
                qtyInStock: inStock,
                qtyToBuy: Math.max(0, needed - inStock),
                unit: ing.unit,
                available: true,
                checked: false,
              });
            }
          }
        }

        const list = Array.from(ingredientMap.values()).filter((i) => i.qtyToBuy > 0);
        set({ shoppingList: list });
      },

      toggleShoppingItem: (ingredientId) =>
        set((s) => ({
          shoppingList: s.shoppingList.map((i) =>
            i.ingredientId === ingredientId ? { ...i, checked: !i.checked } : i
          ),
        })),

      refreshAvailability: async (platform) => {
        const { shoppingList } = get();
        if (shoppingList.length === 0) return false;
        const { adapter, live } = await resolveAdapter(platform);

        const updated = await Promise.all(
          shoppingList.map(async (item) => {
            const ingredient = getIngredientById(item.ingredientId);
            const query = ingredient?.searchTerms[platform] ?? item.name;
            try {
              const results = await adapter.searchProducts(query);
              const best = results.find((r) => r.available) ?? results[0];
              if (!best) return { ...item, platform, available: false };
              return {
                ...item,
                platform,
                price: best.price,
                packSize: best.packSize,
                available: best.available,
                platformRef: best.platformRef,
              };
            } catch {
              return item; // keep prior state for this item rather than failing the whole refresh
            }
          })
        );
        set({ shoppingList: updated });
        return live;
      },

      placeOrder: async (platform, addressId) => {
        const { shoppingList, weeklyPlan } = get();
        const unchecked = shoppingList.filter((i) => !i.checked && i.qtyToBuy > 0);
        const { adapter, live } = await resolveAdapter(platform);

        if (live) {
          if (!addressId) throw new Error("A delivery address is required to place a live order.");
          // NOTE: quantities are rounded to whole units here — there's no
          // pack-size-aware buying yet (e.g. "need 600g" -> "2x 500g pack"),
          // a known simplification called out in the PRD (FR-4.2).
          const lines = unchecked
            .filter((i) => i.platformRef)
            .map((i) => ({
              quantity: Math.max(1, Math.ceil(i.qtyToBuy)),
              platformRef: i.platformRef!,
              name: i.name,
              price: i.price,
              packSize: i.packSize,
            }));
          if (lines.length === 0) {
            throw new Error("No items have live pricing yet — refresh availability before ordering.");
          }
          await adapter.updateCart(lines);
          const result = await adapter.checkout(addressId);
          const order: Order = {
            id: result.id,
            platform,
            planId: weeklyPlan?.id ?? "",
            items: unchecked.map((i) => ({ name: i.name, quantity: i.qtyToBuy, unit: i.unit, price: i.price ?? 0 })),
            status: "placed",
            placedAt: result.placedAt,
            totalAmount: result.totalAmount ?? unchecked.reduce((s, i) => s + (i.price ?? 0) * i.qtyToBuy, 0),
          };
          set((s) => ({ orders: [order, ...s.orders] }));
          return order;
        }

        // Demo fallback — no connected account for this platform.
        const items = unchecked.map((i) => ({ name: i.name, quantity: i.qtyToBuy, unit: i.unit, price: i.price ?? 50 }));
        const order: Order = {
          id: `DEMO-${Date.now()}`,
          platform,
          planId: weeklyPlan?.id ?? "",
          items,
          status: "placed",
          placedAt: new Date().toISOString(),
          totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
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
        if (!meal?.recipeId) return;
        const recipe = RECIPES.find((r) => r.id === meal.recipeId);
        if (!recipe) return;

        const updatedPantry = [...pantry];
        for (const ing of recipe.ingredients) {
          const used = ing.quantity * meal.servingsMultiplier / recipe.servings;
          const idx = updatedPantry.findIndex(
            (p) => p.name.toLowerCase() === ing.name.toLowerCase()
          );
          if (idx >= 0) {
            updatedPantry[idx] = {
              ...updatedPantry[idx],
              quantity: Math.max(0, updatedPantry[idx].quantity - used),
              updatedAt: new Date().toISOString(),
            };
          }
        }
        set({ pantry: updatedPantry });
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
