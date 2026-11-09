import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "./store";
import { getRecipeById, RECIPES } from "./recipes";
import { household, member } from "@/test/fixtures";

vi.mock("./mcp/adapter", () => ({ resolveAdapter: vi.fn() }));

const initial = useAppStore.getState();
const originalRegions = RECIPES.map((r) => r.cuisineRegion);

/** A fixed random sequence, so the statistics give the same answer every run. */
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

beforeEach(() => useAppStore.setState({ ...initial, household: null, weeklyPlan: null, usedRecipeHistory: [], unavailable: [] }, true));
afterEach(() => {
  vi.restoreAllMocks();
  RECIPES.forEach((r, i) => { r.cuisineRegion = originalRegions[i]; });
});

/** Plans `weeks` consecutive weeks for `households` households in `region`; returns own-region meals and totals. */
async function simulate(region: string, weeks: number, households: number, seedBase: number) {
  let own = 0, total = 0, repeats = 0, compared = 0, longestHistory = 0;
  for (let h = 0; h < households; h++) {
    seed(seedBase + h);
    useAppStore.setState({ household: household([member("1")], { state: region, dietType: "nonveg", shopsAt: "local" }), usedRecipeHistory: [] });
    let previous = new Set<string>();
    for (let w = 0; w < weeks; w++) {
      await useAppStore.getState().generateWeeklyPlan();
      const current = new Set<string>();
      for (const m of useAppStore.getState().weeklyPlan!.meals) {
        if (!m.recipeId) continue;
        total++;
        current.add(m.recipeId);
        if (getRecipeById(m.recipeId)!.cuisineRegion.includes(region)) own++;
      }
      if (w > 0) for (const id of current) { compared++; if (previous.has(id)) repeats++; }
      previous = current;
      longestHistory = Math.max(longestHistory, useAppStore.getState().usedRecipeHistory.length);
    }
    vi.restoreAllMocks();
  }
  return { own, total, repeats, compared, longestHistory };
}

describe("regional planning", () => {
  it("gives a household in a region with many dishes about a quarter or more of its meals from there", async () => {
    // Stand in for a library with a large regional collection: 30 of the dishes become "TestLand".
    RECIPES.filter((_, i) => i % Math.floor(RECIPES.length / 30) === 0).slice(0, 30).forEach((r) => { r.cuisineRegion = ["TestLand"]; });
    const { own, total } = await simulate("TestLand", 4, 15, 100);
    const share = own / total;
    expect(share, `own-region share ${(share * 100).toFixed(0)}%`).toBeGreaterThan(0.22);
    expect(share).toBeLessThan(0.6);
  });

  it("serves the real library's few regional dishes more often than before", async () => {
    // With one fixed weight, a Kerala household averaged about 1.5 of its own dishes a week.
    const { own } = await simulate("Kerala", 8, 15, 200);
    const perWeek = own / (8 * 15);
    expect(perWeek, `Kerala dishes per week ${perWeek.toFixed(1)}`).toBeGreaterThan(2.5);
  });

  it("does not repeat last week's meals, and keeps the history bounded", async () => {
    const { repeats, compared, longestHistory } = await simulate("Kerala", 8, 10, 300);
    expect(repeats / compared).toBeLessThan(0.02);
    expect(longestHistory).toBeLessThanOrEqual(84);
  });
});
