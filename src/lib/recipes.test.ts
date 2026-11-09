import { describe, expect, it } from "vitest";
import { useAppStore } from "./store";
import { getRecipeById, RECIPES } from "./recipes";
import { UNION_TERRITORY_RECIPES } from "./recipes/unionTerritories";
import { findConflicts } from "./allergens";
import { INDIAN_STATES } from "./utils";
import { household, member } from "@/test/fixtures";

const CATEGORIES = ["vegetable", "fruit", "dairy", "grain", "protein", "spice", "oil", "other"];
const MEALS = ["breakfast", "lunch", "snack", "dinner"];
const MEAT_AND_FISH = ["fish", "prawn", "shrimp", "squid", "tuna", "crab", "chicken", "mutton", "lamb", "pork", "beef", "egg"];

describe("the recipe library", () => {
  it("gives every recipe its own id", () => {
    const ids = RECIPES.map((r) => r.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("is well formed: meals, servings, nutrition, ingredients and steps are all present", () => {
    for (const r of RECIPES) {
      const where = `${r.id} (${r.name})`;
      expect(r.mealType.length, where).toBeGreaterThan(0);
      expect(r.mealType.every((m) => MEALS.includes(m)), where).toBe(true);
      expect(["veg", "egg", "nonveg"], where).toContain(r.dietType);
      expect(r.servings, where).toBeGreaterThan(0);
      expect(r.nutrition.calories, where).toBeGreaterThan(0);
      expect(r.steps.length, where).toBeGreaterThan(0);
      expect(r.ingredients.length, where).toBeGreaterThan(0);
      expect(r.cuisineRegion.length, where).toBeGreaterThan(0);
      const ids = r.ingredients.map((i) => i.id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i), `${where} has repeated ingredient ids`).toEqual([]);
      for (const i of r.ingredients) {
        expect(i.quantity, `${where}: ${i.name}`).toBeGreaterThan(0);
        expect(i.unit.length, `${where}: ${i.name}`).toBeGreaterThan(0);
        expect(CATEGORIES, `${where}: ${i.name}`).toContain(i.category);
        expect(i.searchTerms.zepto.length && i.searchTerms.instamart.length, `${where}: ${i.name}`).toBeTruthy();
      }
    }
  });

  it("keeps vegetarian dishes free of meat, fish and eggs in what they require", () => {
    // Only required ingredients count: a few existing dishes list an optional egg or fermented fish,
    // which is a separate question (it still lands on a vegetarian's shopping list).
    const wrong = RECIPES.filter((r) => r.dietType === "veg").flatMap((r) => {
      const required = { ...r, description: "", steps: [], ingredients: r.ingredients.filter((i) => !i.optional) };
      return findConflicts(required, MEAT_AND_FISH).map((hit) => `${r.name}: ${hit}`);
    });
    expect(wrong).toEqual([]);
  });

  it("uses a region name for every state and union territory that the picker offers", () => {
    expect(INDIAN_STATES).toHaveLength(36); // 28 states and 8 union territories
    expect(new Set(INDIAN_STATES).size).toBe(36);
    for (const ut of ["Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep"]) {
      expect(INDIAN_STATES).toContain(ut);
    }
  });

  it("has at least four recipes for every state and union territory", () => {
    for (const region of INDIAN_STATES) {
      const n = RECIPES.filter((r) => r.cuisineRegion.includes(region)).length;
      expect(n, `${region} has ${n}`).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("the union territory drafts", () => {
  it("are all marked as needing review, since they are not from a verified source", () => {
    expect(UNION_TERRITORY_RECIPES.length).toBeGreaterThan(0);
    for (const r of UNION_TERRITORY_RECIPES) expect(r.tags, r.name).toContain("needs-review");
  });
  it("are part of the library", () => {
    const ids = new Set(RECIPES.map((r) => r.id));
    for (const r of UNION_TERRITORY_RECIPES) expect(ids.has(r.id), r.name).toBe(true);
  });
});

describe("planning for the new union territories", () => {
  it("serves a household in each one its own region's dishes", async () => {
    for (const region of ["Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep"]) {
      let own = 0;
      for (let i = 0; i < 10; i++) {
        useAppStore.setState({ household: household([member("1")], { state: region, dietType: "nonveg" }), usedRecipeHistory: [] });
        await useAppStore.getState().generateWeeklyPlan();
        own += useAppStore.getState().weeklyPlan!.meals.filter((m) => m.recipeId && getRecipeById(m.recipeId)!.cuisineRegion.includes(region)).length;
      }
      expect(own, region).toBeGreaterThan(0);
    }
  });
});
