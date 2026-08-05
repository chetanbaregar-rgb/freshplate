"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Household, Member, WeeklyPlan, PlanMeal, PantryItem, Order, ShoppingItem, Platform, Recipe,
} from "./types";
import { RECIPES, filterRecipes, getIngredientById } from "./recipes";
import { resolveAdapter } from "./mcp/adapter";
import { startOfWeek, format } from "date-fns";

/**
 * One-time, upfront availability check across every diet-appropriate recipe's
 * non-optional ingredients — done once per plan generation (not per slot)
 * since the same ingredients (onion, rice, tomato…) recur across dozens of
 * recipes. Only runs against a genuinely connected platform; `isConnected()`
 * — and therefore `live` — is false without real OAuth credentials, in which
 * case this returns an empty cache and availabilityScore() below falls back
 * to a neutral score (mock data always reports "available", so it carries no
 * real signal anyway).
 */
async function buildAvailabilityCache(candidates: Recipe[], platform: Platform): Promise<Map<string, boolean>> {
  const cache = new Map<string, boolean>();
  const { adapter, live } = await resolveAdapter(platform);
  if (!live) return cache;

  const uniqueTerms = new Set<string>();
  for (const recipe of candidates) {
    for (const ing of recipe.ingredients) {
      if (!ing.optional) uniqueTerms.add(ing.searchTerms[platform]);
    }
  }

  const results = await Promise.all(
    Array.from(uniqueTerms).map(async (term) => {
      try {
        const products = await adapter.searchProducts(term);
        return { term, available: products.some((p) => p.available) };
      } catch {
        return { term, available: true }; // fail open — a flaky lookup shouldn't sink a recipe
      }
    })
  );
  for (const r of results) cache.set(r.term, r.available);
  return cache;
}

/** Fraction of a recipe's non-optional ingredients confirmed available on
 *  `platform`. Neutral (0.5) when there's no cache signal to judge by — an
 *  unchecked recipe shouldn't be penalized relative to a checked one. */
function availabilityScore(recipe: Recipe, platform: Platform | null, cache: Map<string, boolean>): number {
  if (!platform || cache.size === 0) return 0.5;
  const required = recipe.ingredients.filter((i) => !i.optional);
  if (required.length === 0) return 0.5;
  const known = required.filter((i) => cache.has(i.searchTerms[platform]));
  if (known.length === 0) return 0.5;
  const availableCount = known.filter((i) => cache.get(i.searchTerms[platform])).length;
  return availableCount / known.length;
}

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
  completeOnboarding: () => Promise<void>;
  setOnboardingStep: (step: number) => void;

  // Plan actions
  generateWeeklyPlan: () => Promise<void>;
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

const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;

// Fraction of a recipe's ingredients already sitting in the pantry — used to
// bias plan generation toward using up stock on hand (PRD FR: "next week's
// plan generation accounts for remaining stock, reducing unnecessary purchases").
function pantryScore(recipe: Recipe, pantry: PantryItem[]): number {
  if (recipe.ingredients.length === 0 || pantry.length === 0) return 0;
  const matched = recipe.ingredients.filter((ing) =>
    pantry.some((p) => p.name.toLowerCase() === ing.name.toLowerCase() && p.quantity > 0)
  ).length;
  return matched / recipe.ingredients.length;
}

function weightedPick(
  recipes: Recipe[],
  pantry: PantryItem[],
  platform: Platform | null,
  availabilityCache: Map<string, boolean>
): Recipe | undefined {
  if (recipes.length === 0) return undefined;
  const weights = recipes.map(
    (r) => 1 + pantryScore(r, pantry) * 3 + availabilityScore(r, platform, availabilityCache) * 2
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < recipes.length; i++) {
    r -= weights[i];
    if (r <= 0) return recipes[i];
  }
  return recipes[recipes.length - 1];
}

async function generatePlan(household: Household, history: string[], pantry: PantryItem[]): Promise<WeeklyPlan> {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const meals: PlanMeal[] = [];
  const usedThisWeek = new Set<string>();

  // Prefer state of origin for authentic regional recipes (per onboarding
  // copy: "your origin to suggest authentic regional recipes"), falling back
  // to residence when origin wasn't given.
  const regionPreference = household.stateOfOrigin ?? household.state;
  const platform = household.connectedPlatforms[0] ?? null;

  const dietPool = filterRecipes({ dietType: household.dietType });
  const availabilityCache = platform
    ? await buildAvailabilityCache(dietPool, platform)
    : new Map<string, boolean>();

  for (let day = 0; day < 7; day++) {
    for (const mealType of MEAL_TYPES) {
      const primaryGoal = household.members[0]?.healthGoal ?? "maintenance";

      // Priority 1: matches household's region + goal
      // Priority 2: matches goal only (region pool was empty for this slot)
      // Fallback: diet + meal type only (existing behavior)
      const withRegion = filterRecipes({
        dietType: household.dietType, mealType, goalTags: [primaryGoal], state: regionPreference,
      });
      const withGoal = withRegion.length > 0
        ? withRegion
        : filterRecipes({ dietType: household.dietType, mealType, goalTags: [primaryGoal] });
      const all = withGoal.length > 0 ? withGoal : filterRecipes({ dietType: household.dietType, mealType });

      // Priority 1: not used this week AND not in any prior week
      // Priority 2: not used this week (may be in prior weeks)
      // Fallback: any (all slots for this meal type exhausted)
      const fresh = all.filter(r => !usedThisWeek.has(r.id) && !history.includes(r.id));
      const newThisWeek = all.filter(r => !usedThisWeek.has(r.id));
      const pool = fresh.length > 0 ? fresh : newThisWeek.length > 0 ? newThisWeek : all;

      const recipe = weightedPick(pool, pantry, platform, availabilityCache);
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
      completeOnboarding: async () => {
        const { household, usedRecipeHistory, pantry } = get();
        if (!household) return;
        const plan = await generatePlan(household, usedRecipeHistory, pantry);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({
          household: { ...household, onboardingComplete: true },
          weeklyPlan: plan,
          usedRecipeHistory: [...usedRecipeHistory, ...newIds],
        });
      },
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      generateWeeklyPlan: async () => {
        const { household, usedRecipeHistory, pantry } = get();
        if (!household) return;
        const plan = await generatePlan(household, usedRecipeHistory, pantry);
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
