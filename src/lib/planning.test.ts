import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "./store";
import { filterRecipes, getRecipeById, RECIPES } from "./recipes";
import { blockedIngredients, freshKeys, ingredientKey } from "./localShopping";
import { household, member } from "@/test/fixtures";

const resolveAdapter = vi.hoisted(() => vi.fn());
vi.mock("./mcp/adapter", () => ({ resolveAdapter }));

const initial = useAppStore.getState();
const reset = () =>
  useAppStore.setState({ ...initial, household: null, weeklyPlan: null, pantry: [], shoppingList: [], planNotice: null, usedRecipeHistory: [], unavailable: [] }, true);

/** A fixed random sequence, so the statistical checks give the same answer every run. */
function seed(n: number) {
  let a = n >>> 0;
  vi.spyOn(Math, "random").mockImplementation(() => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}

async function planFor(unavailable: string[] = [], hh = household([member("1")], { dietType: "veg", shopsAt: "local" })) {
  useAppStore.setState({ household: hh, unavailable, usedRecipeHistory: [] });
  await useAppStore.getState().generateWeeklyPlan();
  return useAppStore.getState().weeklyPlan!;
}

const recipesOf = (plan: { meals: { recipeId: string | null }[] }) =>
  plan.meals.flatMap((m) => (m.recipeId ? [getRecipeById(m.recipeId)!] : []));

beforeEach(() => {
  reset();
  resolveAdapter.mockReset();
  resolveAdapter.mockResolvedValue({ adapter: { searchProducts: vi.fn().mockResolvedValue([]) }, live: true });
});
afterEach(() => vi.restoreAllMocks());

describe("where the household shops", () => {
  it("never asks a delivery platform about local shoppers, even with an account connected", async () => {
    await planFor([], household([member("1")], { shopsAt: "local", connectedPlatforms: ["instamart"] }));
    expect(resolveAdapter).not.toHaveBeenCalled();
  });
  it("still checks the platform for delivery and mixed households", async () => {
    await planFor([], household([member("1")], { shopsAt: "delivery", connectedPlatforms: ["instamart"] }));
    expect(resolveAdapter).toHaveBeenCalledTimes(1);
    resolveAdapter.mockClear();
    await planFor([], household([member("1")], { shopsAt: "both", connectedPlatforms: ["instamart"] }));
    expect(resolveAdapter).toHaveBeenCalledTimes(1);
  });
  it("keeps checking for households from before the setting existed", async () => {
    await planFor([], household([member("1")], { connectedPlatforms: ["instamart"] }));
    expect(resolveAdapter).toHaveBeenCalledTimes(1);
  });
});

describe("ingredients the household cannot get", () => {
  // A fairly common ingredient: enough recipes use it for the test to matter, enough do not to leave choices.
  const counts = new Map<string, number>();
  for (const r of RECIPES.filter((r) => r.dietType === "veg")) {
    for (const k of new Set(r.ingredients.filter((i) => !i.optional).map((i) => ingredientKey(i.name)))) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const vegCount = RECIPES.filter((r) => r.dietType === "veg").length;
  const hard = Array.from(counts.entries())
    .filter(([, n]) => n > vegCount * 0.1 && n < vegCount * 0.35)
    .sort((a, b) => b[1] - a[1])[0][0];

  it("leaves recipes that need them out of every generated plan", async () => {
    let usedWithoutMarking = 0;
    for (let s = 1; s <= 25; s++) {
      seed(s);
      usedWithoutMarking += recipesOf(await planFor()).filter((r) => blockedIngredients(r, [hard]).length > 0).length;
      vi.restoreAllMocks();
    }
    expect(usedWithoutMarking, `expected plans to use "${hard}" before it was marked`).toBeGreaterThan(0);

    for (let s = 1; s <= 25; s++) {
      seed(s);
      const used = recipesOf(await planFor([hard])).filter((r) => blockedIngredients(r, [hard]).length > 0);
      vi.restoreAllMocks();
      expect(used.map((r) => r.id), `seed ${s}`).toEqual([]);
    }
  });

  it("still fills a slot when nothing else fits, and says so", async () => {
    const allBreakfastIngredients = RECIPES.filter((r) => r.mealType.includes("breakfast") && r.dietType === "veg")
      .flatMap((r) => r.ingredients.filter((i) => !i.optional).map((i) => ingredientKey(i.name)));
    const plan = await planFor(allBreakfastIngredients);
    const breakfasts = plan.meals.filter((m) => m.mealType === "breakfast");
    expect(breakfasts.every((m) => m.recipeId !== null)).toBe(true);
    expect(useAppStore.getState().planNotice).toMatch(/which you marked as hard to find/);
  });

  it("says nothing when the plan avoided everything marked", async () => {
    await planFor([hard]);
    expect(useAppStore.getState().planNotice).toBeNull();
  });

  it("remembers and forgets ingredients, tidying the name first", () => {
    const { markUnavailable, markAvailable } = useAppStore.getState();
    markUnavailable("  Broccoli ");
    markUnavailable("broccoli");
    markUnavailable("Kale");
    markUnavailable("   ");
    expect(useAppStore.getState().unavailable).toEqual(["broccoli", "kale"]);
    markAvailable("BROCCOLI");
    expect(useAppStore.getState().unavailable).toEqual(["kale"]);
  });

  it("keeps them across a reload", () => {
    useAppStore.getState().markUnavailable("Kale");
    expect(JSON.parse(localStorage.getItem("freshplate-store")!).state.unavailable).toEqual(["kale"]);
  });
});

describe("planning around fewer ingredients", () => {
  const hh = household([member("1")], { dietType: "veg", shopsAt: "local" });
  const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);

  /** Same rules as the planner (diet, one use per recipe), but each slot picked at random. */
  function randomPlan(): string[] {
    const used = new Set<string>();
    const ids: string[] = [];
    for (let day = 0; day < 7; day++) {
      for (const mealType of ["breakfast", "lunch", "snack", "dinner"] as const) {
        const pool = filterRecipes({ dietType: "veg", mealType }).filter((r) => !used.has(r.id));
        const r = pool[Math.floor(Math.random() * pool.length)];
        used.add(r.id);
        ids.push(r.id);
      }
    }
    return ids;
  }

  const distinctFresh = (ids: string[]) => new Set(ids.flatMap((id) => freshKeys(getRecipeById(id)!))).size;

  it("needs fewer different fresh ingredients than picking meals at random", async () => {
    let planned = 0;
    let random = 0;
    for (const s of SEEDS) {
      seed(s);
      planned += distinctFresh((await planFor([], hh)).meals.flatMap((m) => (m.recipeId ? [m.recipeId] : [])));
      vi.restoreAllMocks();
      seed(s);
      random += distinctFresh(randomPlan());
      vi.restoreAllMocks();
    }
    const [p, r] = [planned / SEEDS.length, random / SEEDS.length];
    expect(p, `planned ${p.toFixed(1)} vs random ${r.toFixed(1)} distinct fresh ingredients`).toBeLessThan(r * 0.95);
  });
});
