"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Household, Member, WeeklyPlan, PlanMeal, PantryItem, Order, OrderStatus, ShoppingItem, Platform, Recipe, HealthGoal,
} from "./types";
import {
  filterRecipes, getRecipeById, getIngredientById, effectiveDietType, excludedIngredientTerms, householdGoals,
  getIngredientCategoryByName,
} from "./recipes";
import { avoidLabel, avoidListFor, findConflicts } from "./allergens";
import { computeShoppingList, deductFromPantry } from "./shopping";
import {
  blockedIngredients, freshKeys, ingredientKey, reuseScore, usesDeliveryApps,
} from "./localShopping";
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
  /** Ingredients the household told us they cannot get (see ingredientKey). Plans avoid them. */
  unavailable: string[];
  /** One-off message about meals the app removed or could not fill. Not persisted. */
  planNotice: string | null;

  // Ingredients the household cannot get
  markUnavailable: (name: string) => void;
  markAvailable: (name: string) => void;

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
  dismissPlanNotice: () => void;

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

/**
 * How many recently planned recipes count as "already seen" when picking the next plan: about
 * three weeks' worth. Without a limit, every recipe a household has ever been served is excluded
 * for good, so a region's few dishes are used up in the first weeks and never come back.
 */
const HISTORY_WINDOW = 84;
/** The household's own regional dishes may come back sooner: about two weeks, not three. */
const REGIONAL_HISTORY_WINDOW = 28;

/**
 * About this share of a household's meals should come from its own region, when the library has
 * enough dishes for it. A fixed boost cannot do this: the same weight gives a very different share
 * in a library of 160 recipes than in one of 3,600, so the boost is worked out from how many of the
 * candidates are regional. (A small region can fall short of this, because each dish is used at
 * most once a week.)
 */
const REGIONAL_SHARE_TARGET = 0.35;
/** Stops a region with a single candidate from drowning out everything else. */
const MAX_REGIONAL_BOOST = 40;

/** How much to multiply an own-region recipe's weight by so own-region picks come out near the target. */
function regionalBoost(recipes: Recipe[], regionPreference: string): number {
  const own = recipes.filter((r) => r.cuisineRegion.includes(regionPreference)).length;
  if (own === 0 || own === recipes.length) return 1;
  const needed = (REGIONAL_SHARE_TARGET / (1 - REGIONAL_SHARE_TARGET)) * ((recipes.length - own) / own);
  return Math.min(MAX_REGIONAL_BOOST, Math.max(1, needed));
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

interface PickContext {
  /** Fresh ingredients already being bought for meals picked so far this week. */
  boughtFresh: Set<string>;
}

function weightedPick(
  recipes: Recipe[],
  pantry: PantryItem[],
  platform: Platform | null,
  availabilityCache: Map<string, boolean>,
  regionPreference: string,
  goals: HealthGoal[],
  ctx: PickContext
): Recipe | undefined {
  if (recipes.length === 0) return undefined;
  const boost = regionalBoost(recipes, regionPreference);
  const weights = recipes.map((r) => {
    // Region is a preference weight, not a hard filter — hard-filtering by
    // state shrinks the pool to ~1 recipe/meal-type for most states, which
    // guarantees the same dish repeats every day of the week. Weighting
    // instead keeps the full diet-appropriate pool in play while still
    // favoring regional dishes when there's a real choice.
    const isOwn = r.cuisineRegion.includes(regionPreference);
    // Dishes from everywhere in India get half the regional boost.
    const regionBoost = isOwn ? boost : r.cuisineRegion.includes("Pan-India") ? 1 + (boost - 1) * 0.5 : 1;
    // Fraction of the household's distinct goals this recipe serves — so a
    // mixed-goal household (e.g. one member on weight_loss, another on
    // muscle) isn't planned entirely around whoever was added first.
    const goalScore = goals.length > 0 ? goals.filter((g) => r.goalTags.includes(g)).length / goals.length : 0;
    return regionBoost * (1
      + pantryScore(r, pantry) * 3
      + availabilityScore(r, platform, availabilityCache) * 2
      // Fewer different things to find: favour meals that reuse what is already on this week's list.
      // Weight 8 cuts the distinct fresh ingredients in a week by about 7%; the recipe library, not the
      // weight, limits how far this can go (20 only reaches about 10%).
      + reuseScore(r, ctx.boughtFresh) * 8
      + goalScore * 2);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < recipes.length; i++) {
    r -= weights[i];
    if (r <= 0) return recipes[i];
  }
  return recipes[recipes.length - 1];
}

async function generatePlan(
  household: Household,
  history: string[],
  pantry: PantryItem[],
  unavailable: string[] = [],
): Promise<WeeklyPlan> {
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const meals: PlanMeal[] = [];
  const usedThisWeek = new Set<string>();
  const boughtFresh = new Set<string>();
  const recentlyUsed = new Set(history.slice(-HISTORY_WINDOW));
  const recentlyUsedOwn = new Set(history.slice(-REGIONAL_HISTORY_WINDOW));

  // Prefer state of origin for authentic regional recipes (per onboarding
  // copy: "your origin to suggest authentic regional recipes"), falling back
  // to residence when origin wasn't given.
  const regionPreference = household.stateOfOrigin ?? household.state;
  // Delivery apps only matter to households that use them. Everyone else is planned from region,
  // goals, pantry and what they have told us they cannot get, without asking any platform.
  const platform = usesDeliveryApps(household) ? household.connectedPlatforms[0] ?? null : null;

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
      const fresh = all.filter(r => !usedThisWeek.has(r.id) && !(r.cuisineRegion.includes(regionPreference) ? recentlyUsedOwn : recentlyUsed).has(r.id));
      const newThisWeek = all.filter(r => !usedThisWeek.has(r.id));
      const pool = fresh.length > 0 ? fresh : newThisWeek.length > 0 ? newThisWeek : all;

      // Leave out recipes that need something the household cannot get, unless that would leave
      // nothing: a slot with a hard-to-find ingredient is better than an empty one, and the
      // notice below says so.
      const gettable = pool.filter((r) => blockedIngredients(r, unavailable).length === 0);
      const candidates = gettable.length > 0 ? gettable : pool;

      const recipe = weightedPick(candidates, pantry, platform, availabilityCache, regionPreference, goals, { boughtFresh });
      if (recipe) {
        usedThisWeek.add(recipe.id);
        freshKeys(recipe).forEach((k) => boughtFresh.add(k));
      }

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

/** Meals that still use an ingredient the household marked as hard to find, because nothing else fit. */
function unavailableNotice(plan: WeeklyPlan, unavailable: string[]): string | null {
  if (unavailable.length === 0) return null;
  const names = new Set<string>();
  let meals = 0;
  for (const m of plan.meals) {
    const recipe = m.recipeId ? getRecipeById(m.recipeId) : undefined;
    const hits = recipe ? blockedIngredients(recipe, unavailable) : [];
    if (hits.length === 0) continue;
    meals++;
    hits.forEach((h) => names.add(h));
  }
  if (meals === 0) return null;
  return `${meals} meal${meals === 1 ? "" : "s"} still use${meals === 1 ? "s" : ""} ${Array.from(names).join(", ")}, which you marked as hard to find, because nothing else fit. Use Swap to change ${meals === 1 ? "it" : "them"}.`;
}

function planNoticeFor(plan: WeeklyPlan, unavailable: string[]): string | null {
  const parts = [unfilledNotice(plan), unavailableNotice(plan, unavailable)].filter((p): p is string => p !== null);
  return parts.length > 0 ? parts.join(" ") : null;
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
      unavailable: [],
      planNotice: null,

      markUnavailable: (name) =>
        set((s) => {
          const key = ingredientKey(name);
          return key && !s.unavailable.includes(key) ? { unavailable: [...s.unavailable, key] } : {};
        }),
      markAvailable: (name) => {
        const key = ingredientKey(name);
        set((s) => ({ unavailable: s.unavailable.filter((k) => k !== key) }));
      },

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
      completeOnboarding: async () => {
        const { household, usedRecipeHistory, pantry, unavailable } = get();
        if (!household) return;
        const plan = await generatePlan(household, usedRecipeHistory, pantry, unavailable);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({
          household: { ...household, onboardingComplete: true },
          weeklyPlan: plan,
          usedRecipeHistory: [...usedRecipeHistory, ...newIds].slice(-HISTORY_WINDOW),
          planNotice: planNoticeFor(plan, unavailable),
        });
      },
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      generateWeeklyPlan: async () => {
        const { household, usedRecipeHistory, pantry, unavailable } = get();
        if (!household) return;
        const plan = await generatePlan(household, usedRecipeHistory, pantry, unavailable);
        const newIds = plan.meals.map(m => m.recipeId).filter((id): id is string => id !== null);
        set({
          weeklyPlan: plan,
          usedRecipeHistory: [...usedRecipeHistory, ...newIds].slice(-HISTORY_WINDOW),
          planNotice: planNoticeFor(plan, unavailable),
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
        unavailable: s.unavailable,
        onboardingStep: s.onboardingStep,
      }),
    }
  )
);
