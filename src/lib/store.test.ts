import { beforeEach, describe, expect, it } from "vitest";
import { dropFakeOrders, useAppStore } from "./store";
import { findConflicts, avoidListFor } from "./allergens";
import { getRecipeById, RECIPES } from "./recipes";
import { household, meal, member, pantryItem, plan } from "@/test/fixtures";

const initial = useAppStore.getState();
const reset = () => useAppStore.setState({ ...initial, household: null, weeklyPlan: null, pantry: [], shoppingList: [], planNotice: null, usedRecipeHistory: [] }, true);

// Real recipes used as known examples: Poha has peanuts, a dairy dish has paneer.
const withPeanuts = RECIPES.find((r) => r.ingredients.some((i) => /peanut/i.test(i.name)))!;
const withoutPeanuts = RECIPES.find((r) => findConflicts(r, ["peanut"]).length === 0)!;

beforeEach(reset);

describe("plan generation respects allergies", () => {
  it("never puts a conflicting recipe in a generated plan", () => {
    const hh = household([member("1", { allergies: ["peanut", "dairy"], dislikes: ["mushroom"] }), member("2", { allergies: ["egg"] })]);
    useAppStore.setState({ household: hh });
    const avoid = avoidListFor(hh.members);
    for (let i = 0; i < 25; i++) {
      useAppStore.getState().generateWeeklyPlan();
      for (const m of useAppStore.getState().weeklyPlan!.meals) {
        if (!m.recipeId) continue;
        expect(findConflicts(getRecipeById(m.recipeId)!, avoid), `${m.recipeId} conflicts`).toEqual([]);
      }
    }
  });

  it("leaves a slot empty and says so when nothing safe exists", () => {
    // Dislike every word in the breakfast recipe names, so no breakfast can be safe.
    const words = RECIPES.filter((r) => r.mealType.includes("breakfast"))
      .flatMap((r) => r.name.toLowerCase().split(/[^a-z]+/))
      .filter((w) => w.length > 3);
    useAppStore.setState({ household: household([member("1", { dislikes: words })]) });
    useAppStore.getState().generateWeeklyPlan();
    const s = useAppStore.getState();
    const breakfasts = s.weeklyPlan!.meals.filter((m) => m.mealType === "breakfast");
    expect(breakfasts).toHaveLength(7);
    expect(breakfasts.every((m) => m.recipeId === null)).toBe(true);
    expect(s.planNotice).toMatch(/could not be filled/);
  });
});

describe("changing members after a plan exists", () => {
  it("removes conflicting meals, locked ones too, and tells the user", () => {
    const hh = household([member("1")]);
    useAppStore.setState({
      household: hh,
      weeklyPlan: plan([meal(0, withPeanuts.id, { locked: true }), meal(1, withoutPeanuts.id)]),
      shoppingList: [{ ingredientId: "x", name: "x", category: "other", qtyNeeded: 1, qtyInStock: 0, qtyToBuy: 1, unit: "g", checked: false }],
    });
    useAppStore.getState().addMember(member("2", { allergies: ["peanut"] }));

    const s = useAppStore.getState();
    expect(s.weeklyPlan!.meals[0].recipeId).toBeNull();
    expect(s.weeklyPlan!.meals[0].locked).toBe(false);
    expect(s.weeklyPlan!.meals[1].recipeId).toBe(withoutPeanuts.id);
    expect(s.planNotice).toMatch(/1 meal removed/);
    expect(s.planNotice).toMatch(/Peanut/);
    expect(s.shoppingList).toEqual([]);
  });

  it("also applies when an existing member's allergies are edited", () => {
    useAppStore.setState({
      household: household([member("1")]),
      weeklyPlan: plan([meal(0, withPeanuts.id)]),
    });
    useAppStore.getState().updateMember("1", { allergies: ["peanut"] });
    expect(useAppStore.getState().weeklyPlan!.meals[0].recipeId).toBeNull();
  });

  it("leaves the plan alone when nothing conflicts", () => {
    const p = plan([meal(0, withoutPeanuts.id)]);
    useAppStore.setState({ household: household([member("1")]), weeklyPlan: p });
    useAppStore.getState().addMember(member("2", { allergies: ["peanut"] }));
    expect(useAppStore.getState().weeklyPlan).toBe(p);
    expect(useAppStore.getState().planNotice).toBeNull();
  });
});

describe("swapMeal", () => {
  it("refuses a recipe that conflicts with an allergy", () => {
    const p = plan([meal(0, withoutPeanuts.id)]);
    useAppStore.setState({ household: household([member("1", { allergies: ["peanut"] })]), weeklyPlan: p });
    useAppStore.getState().swapMeal(0, "lunch", withPeanuts.id);
    expect(useAppStore.getState().weeklyPlan!.meals[0].recipeId).toBe(withoutPeanuts.id);
  });

  it("accepts a safe recipe and clears the cooked flag", () => {
    useAppStore.setState({
      household: household([member("1", { allergies: ["peanut"] })]),
      weeklyPlan: plan([meal(0, RECIPES[0].id, { cooked: true })]),
    });
    useAppStore.getState().swapMeal(0, "lunch", withoutPeanuts.id);
    const m = useAppStore.getState().weeklyPlan!.meals[0];
    expect(m.recipeId).toBe(withoutPeanuts.id);
    expect(m.cooked).toBe(false);
  });
});

describe("markMealCooked", () => {
  const rice = RECIPES.find((r) => r.ingredients.some((i) => i.name === "Basmati rice" && i.unit === "g"))!;
  const riceQty = (m = 2) => {
    const i = rice.ingredients.find((x) => x.name === "Basmati rice")!;
    return (i.quantity * m) / rice.servings;
  };

  it("reduces the pantry once, however many times it is tapped", () => {
    useAppStore.setState({
      household: household([member("1")]),
      weeklyPlan: plan([meal(0, rice.id, { servingsMultiplier: 2 })]),
      pantry: [pantryItem("Basmati rice", 5000, "g")],
    });
    const { markMealCooked } = useAppStore.getState();
    markMealCooked(0, "lunch");
    markMealCooked(0, "lunch");
    markMealCooked(0, "lunch");
    const s = useAppStore.getState();
    expect(s.pantry[0].quantity).toBe(5000 - riceQty());
    expect(s.weeklyPlan!.meals[0].cooked).toBe(true);
  });

  it("allows cooking again after the meal is swapped for another", () => {
    useAppStore.setState({
      household: household([member("1")]),
      weeklyPlan: plan([meal(0, rice.id, { servingsMultiplier: 2 })]),
      pantry: [pantryItem("Basmati rice", 5000, "g")],
    });
    useAppStore.getState().markMealCooked(0, "lunch");
    useAppStore.getState().swapMeal(0, "lunch", rice.id);
    useAppStore.getState().markMealCooked(0, "lunch");
    expect(useAppStore.getState().pantry[0].quantity).toBe(5000 - 2 * riceQty());
  });
});

describe("no fake ordering", () => {
  it("has no placeOrder action or orders list", () => {
    const state = useAppStore.getState() as unknown as Record<string, unknown>;
    expect(state).not.toHaveProperty("placeOrder");
    expect(state).not.toHaveProperty("orders");
  });

  it("dropFakeOrders removes saved orders and keeps everything else", () => {
    const saved = { household: { id: "h" }, pantry: [1], orders: [{ id: "ORD-1", status: "placed" }] };
    expect(dropFakeOrders(saved)).toEqual({ household: { id: "h" }, pantry: [1] });
  });

  it("clears orders left in browser storage by the old version when the app loads", async () => {
    localStorage.setItem(
      "freshplate-store",
      JSON.stringify({
        version: 0,
        state: { household: null, pantry: [], usedRecipeHistory: [], orders: [{ id: "ORD-1", status: "placed", totalAmount: 650 }] },
      }),
    );
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).not.toHaveProperty("orders");
  });
});
