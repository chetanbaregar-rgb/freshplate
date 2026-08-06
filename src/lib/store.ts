"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Household, Member, WeeklyPlan, PlanMeal, PantryItem, Order, OrderStatus, ShoppingItem, Platform, Recipe, HealthGoal, Ingredient,
} from "./types";
import {
  RECIPES, filterRecipes, getIngredientById, effectiveDietType, excludedIngredientTerms, householdGoals,
  getIngredientCategoryByName,
} from "./recipes";
import { resolveAdapter } from "./mcp/adapter";
import { convertQuantity } from "./units";
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
  /** Polls trackOrder() for every non-terminal order and, on a transition to
   *  "delivered", adds that order's items back into the pantry. Safe to call
   *  repeatedly/concurrently — it only ever moves an order forward. */
  checkDeliveries: () => Promise<void>;
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
  availabilityCache: Map<string, boolean>,
  regionPreference: string,
  goals: HealthGoal[]
): Recipe | undefined {
  if (recipes.length === 0) return undefined;
  const weights = recipes.map((r) => {
    // Region is a preference weight, not a hard filter — hard-filtering by
    // state shrinks the pool to ~1 recipe/meal-type for most states, which
    // guarantees the same dish repeats every day of the week. Weighting
    // instead keeps the full diet-appropriate pool in play while still
    // favoring regional dishes when there's a real choice.
    const regionScore = r.cuisineRegion.includes(regionPreference) ? 1 : r.cuisineRegion.includes("Pan-India") ? 0.5 : 0;
    // Fraction of the household's distinct goals this recipe serves — so a
    // mixed-goal household (e.g. one member on weight_loss, another on
    // muscle) isn't planned entirely around whoever was added first.
    const goalScore = goals.length > 0 ? goals.filter((g) => r.goalTags.includes(g)).length / goals.length : 0;
    return 1
      + pantryScore(r, pantry) * 3
      + availabilityScore(r, platform, availabilityCache) * 2
      + regionScore * 2
      + goalScore * 2;
  });
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

  // Most-restrictive diet across the household default + any member
  // override, and a hard exclusion list from every member's allergies and
  // dislikes — both are safety/correctness requirements, not preferences,
  // so they're applied as filterRecipes hard filters rather than weights.
  const dietType = effectiveDietType(household);
  const excludeTerms = excludedIngredientTerms(household);
  const goals = householdGoals(household);

  const dietPool = filterRecipes({ dietType, excludeIngredientTerms: excludeTerms });
  const availabilityCache = platform
    ? await buildAvailabilityCache(dietPool, platform)
    : new Map<string, boolean>();

  for (let day = 0; day < 7; day++) {
    for (const mealType of MEAL_TYPES) {
      const all = filterRecipes({ dietType, mealType, excludeIngredientTerms: excludeTerms });

      // Priority 1: not used this week AND not in any prior week
      // Priority 2: not used this week (may be in prior weeks)
      // Fallback: any (all slots for this meal type exhausted)
      const fresh = all.filter(r => !usedThisWeek.has(r.id) && !history.includes(r.id));
      const newThisWeek = all.filter(r => !usedThisWeek.has(r.id));
      const pool = fresh.length > 0 ? fresh : newThisWeek.length > 0 ? newThisWeek : all;

      const recipe = weightedPick(pool, pantry, platform, availabilityCache, regionPreference, goals);
      if (recipe) usedThisWeek.add(recipe.id);

      meals.push({
        day, mealType,
        // No recipe matches this household's diet/allergy constraints for
        // this meal slot — left null rather than silently ignoring a safety
        // constraint (e.g. an allergy) to force a match. The calendar/swap
        // UI already handles a null recipeId.
        recipeId: recipe?.id ?? null,
        isOrderIn: false, locked: false,
        servingsMultiplier: Math.max(1, household.members.length),
      });
    }
  }

  return { id: `plan-${Date.now()}`, weekStart, meals, status: "draft" };
}

/** Sums quantity across every pantry entry matching `ing`'s name (not just
 *  the first, which previously left duplicate pantry rows invisible to stock
 *  math), converting each into `ing`'s unit. A pantry entry in an
 *  incompatible unit (e.g. logged in "kg" for an ingredient measured in
 *  "medium") is skipped rather than guessed at — better to over-buy than to
 *  silently assume stock that may not cover the need. */
function stockFor(ing: Ingredient, pantry: PantryItem[]): number {
  const key = ing.name.trim().toLowerCase();
  return pantry
    .filter((p) => p.name.trim().toLowerCase() === key)
    .reduce((sum, p) => sum + (convertQuantity(p.quantity, p.unit, ing.unit) ?? 0), 0);
}

function newShoppingItem(ing: Ingredient, needed: number, pantry: PantryItem[]): ShoppingItem {
  return {
    ingredientId: ing.id,
    name: ing.name,
    category: ing.category,
    qtyNeeded: needed,
    qtyInStock: stockFor(ing, pantry),
    qtyToBuy: 0, // recomputed once all recipes for the week have been aggregated
    unit: ing.unit,
    available: true,
    checked: false,
  };
}

/** Normalizes a raw platform tracking status string into our OrderStatus
 *  enum. Zepto/Instamart's MCP tools return free-text platform status
 *  strings (not guaranteed to match our enum), so this maps common
 *  substrings and otherwise keeps the prior known status rather than
 *  guessing — an unrecognized string shouldn't silently regress an order
 *  from "on_the_way" back to "placed". */
function normalizeOrderStatus(raw: string, fallback: OrderStatus): OrderStatus {
  const s = raw.toLowerCase();
  if (s.includes("deliver")) return "delivered";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("way") || s.includes("transit") || s.includes("dispatch") || s.includes("out for")) return "on_the_way";
  if (s.includes("placed") || s.includes("confirm") || s.includes("accept")) return "placed";
  return fallback;
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

        // Keyed by canonical ingredient *name*, not recipe-authored ingredient
        // id — the recipe library gives the same real ingredient a distinct id
        // per recipe (onion, onion2, …onion15), so keying by id was listing
        // "Onion" as up to 15 separate rows and netting pantry stock off each
        // one independently instead of once against the combined weekly need.
        const ingredientMap = new Map<string, ShoppingItem>();

        for (const meal of weeklyPlan.meals) {
          if (!meal.recipeId || meal.isOrderIn) continue;
          const recipe = RECIPES.find((r) => r.id === meal.recipeId);
          if (!recipe) continue;

          for (const ing of recipe.ingredients) {
            const needed = ing.quantity * meal.servingsMultiplier / recipe.servings;
            const key = ing.name.trim().toLowerCase();
            const existing = ingredientMap.get(key);

            if (existing) {
              if (existing.unit.toLowerCase() === ing.unit.toLowerCase()) {
                existing.qtyNeeded += needed;
                continue;
              }
              const converted = convertQuantity(needed, ing.unit, existing.unit);
              if (converted !== null) {
                existing.qtyNeeded += converted;
                continue;
              }
              // Same ingredient name, incompatible units across recipes (rare) —
              // keep a distinct line rather than silently corrupt the total.
              const altKey = `${key}__${ing.unit.toLowerCase()}`;
              const altExisting = ingredientMap.get(altKey);
              if (altExisting) {
                altExisting.qtyNeeded += needed;
              } else {
                ingredientMap.set(altKey, newShoppingItem(ing, needed, pantry));
              }
              continue;
            }
            ingredientMap.set(key, newShoppingItem(ing, needed, pantry));
          }
        }

        const list = Array.from(ingredientMap.values())
          .map((i) => ({ ...i, qtyToBuy: Math.max(0, i.qtyNeeded - i.qtyInStock) }))
          .filter((i) => i.qtyToBuy > 0);
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
          // Deterministic from this exact checkout's contents (plan + platform
          // + item/qty signature) rather than a fresh random value per call —
          // so a double-click, a slow-network retry, or a post-timeout resend
          // that calls placeOrder() again for the *same* pending cart reuses
          // the same key and the API route can recognize and dedupe it,
          // instead of placing two real, binding orders.
          const idempotencyKey = [
            weeklyPlan?.id ?? "no-plan",
            platform,
            unchecked.map((i) => `${i.ingredientId}:${i.qtyToBuy}`).sort().join(","),
          ].join("|");
          await adapter.updateCart(lines);
          const result = await adapter.checkout(addressId, undefined, idempotencyKey);
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

        // Demo fallback — no connected account for this platform. Routes
        // through the same MockCommerceAdapter.checkout() used everywhere
        // else in demo mode (one source of demo pricing, latency, and order
        // ids) instead of re-deriving an order shape here. Each line gets a
        // synthetic platformRef distinct per ingredient so the mock cart's
        // Map (keyed by JSON.stringify(platformRef)) doesn't collapse
        // multiple items that haven't been through refreshAvailability yet.
        const demoLines = unchecked.map((i) => ({
          quantity: Math.max(1, Math.ceil(i.qtyToBuy)),
          platformRef: i.platformRef ?? { demoKey: i.ingredientId },
          name: i.name,
          price: i.price,
          packSize: i.packSize,
        }));
        await adapter.updateCart(demoLines);
        const demoResult = await adapter.checkout("demo-address");
        const order: Order = {
          id: demoResult.id,
          platform,
          planId: weeklyPlan?.id ?? "",
          items: unchecked.map((i) => ({ name: i.name, quantity: i.qtyToBuy, unit: i.unit, price: i.price ?? 50 })),
          status: "placed",
          placedAt: demoResult.placedAt,
          totalAmount: demoResult.totalAmount ?? unchecked.reduce((s, i) => s + (i.price ?? 50) * i.qtyToBuy, 0),
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

        let updatedPantry = [...pantry];
        for (const ing of recipe.ingredients) {
          let remainingInIngUnit = ing.quantity * meal.servingsMultiplier / recipe.servings;
          const key = ing.name.trim().toLowerCase();
          // Deplete across every matching pantry entry (not just the first —
          // a second "Onion" row used to be invisible to this math), in
          // array order, until the recipe's need is covered or stock runs out.
          updatedPantry = updatedPantry.map((p) => {
            if (remainingInIngUnit <= 0 || p.name.trim().toLowerCase() !== key) return p;
            const neededInPantryUnit = convertQuantity(remainingInIngUnit, ing.unit, p.unit);
            if (neededInPantryUnit === null) return p; // incompatible units — skip rather than corrupt
            const deductedInPantryUnit = Math.min(p.quantity, neededInPantryUnit);
            remainingInIngUnit -= convertQuantity(deductedInPantryUnit, p.unit, ing.unit) ?? 0;
            return {
              ...p,
              quantity: Math.max(0, p.quantity - deductedInPantryUnit),
              updatedAt: new Date().toISOString(),
            };
          });
        }
        set({ pantry: updatedPantry });
      },

      checkDeliveries: async () => {
        const { orders, pantry } = get();
        const pending = orders.filter((o) => o.status === "placed" || o.status === "on_the_way");
        if (pending.length === 0) return;

        const updatedOrders = [...orders];
        let updatedPantry = [...pantry];

        for (const order of pending) {
          try {
            const { adapter } = await resolveAdapter(order.platform);
            const tracking = await adapter.trackOrder(order.id);
            const idx = updatedOrders.findIndex((o) => o.id === order.id);
            if (idx < 0) continue;

            const nextStatus = normalizeOrderStatus(tracking.status, updatedOrders[idx].status);
            if (nextStatus === "delivered" && updatedOrders[idx].status !== "delivered") {
              updatedOrders[idx] = { ...updatedOrders[idx], status: "delivered", deliveredAt: new Date().toISOString() };

              // Closes the plan -> shop -> cook -> restock loop: a delivered
              // order's items land back in the pantry automatically, instead
              // of requiring the household to log them in by hand.
              for (const item of order.items) {
                const itemKey = item.name.trim().toLowerCase();
                const existingIdx = updatedPantry.findIndex((p) => p.name.trim().toLowerCase() === itemKey);
                if (existingIdx >= 0) {
                  const converted = convertQuantity(item.quantity, item.unit, updatedPantry[existingIdx].unit);
                  if (converted !== null) {
                    updatedPantry[existingIdx] = {
                      ...updatedPantry[existingIdx],
                      quantity: updatedPantry[existingIdx].quantity + converted,
                      updatedAt: new Date().toISOString(),
                    };
                    continue;
                  }
                }
                updatedPantry = [
                  ...updatedPantry,
                  {
                    id: `pantry-${Date.now()}-${itemKey.replace(/\s+/g, "-")}`,
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    category: getIngredientCategoryByName(item.name),
                    updatedAt: new Date().toISOString(),
                  },
                ];
              }
            } else if (nextStatus !== updatedOrders[idx].status) {
              updatedOrders[idx] = { ...updatedOrders[idx], status: nextStatus };
            }
          } catch {
            // Best-effort — a tracking failure for one order shouldn't block
            // status refresh for the household's other orders.
          }
        }

        set({ orders: updatedOrders, pantry: updatedPantry });
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
        onboardingStep: s.onboardingStep,
      }),
    }
  )
);
