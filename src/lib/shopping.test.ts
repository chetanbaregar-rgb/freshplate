import { describe, expect, it } from "vitest";
import { computeShoppingList, deductFromPantry, formatShoppingList, toBaseUnit } from "./shopping";
import { RECIPES } from "./recipes";
import { ing, meal, pantryItem, plan, recipe } from "@/test/fixtures";
import type { Recipe, ShoppingItem } from "./types";

const lookup = (recipes: Recipe[]) => (id: string) => recipes.find((r) => r.id === id);

describe("computeShoppingList", () => {
  it("adds up the same item used in several meals, even under different ingredient ids", () => {
    const a = recipe("a", "A", [ing("onion", "Onion", 2, "medium")]);
    const b = recipe("b", "B", [ing("onion2", "Onion", 4, "medium")]);
    const list = computeShoppingList(plan([meal(0, "a"), meal(1, "b")]), [], lookup([a, b]));
    expect(list).toHaveLength(1);
    // servings 2, multiplier 2 -> 2 + 4 = 6
    expect(list[0].qtyNeeded).toBe(6);
    expect(list[0].qtyToBuy).toBe(6);
  });

  it("buys for every use when the same recipe appears twice (same ingredient id)", () => {
    const a = recipe("a", "A", [ing("rice", "Rice", 200, "g")]);
    const list = computeShoppingList(plan([meal(0, "a"), meal(1, "a"), meal(2, "a")]), [], lookup([a]));
    expect(list).toHaveLength(1);
    expect(list[0].qtyToBuy).toBe(600);
  });

  it("subtracts pantry stock once from the total, not once per recipe", () => {
    const a = recipe("a", "A", [ing("t1", "Tomato", 2, "medium")]);
    const b = recipe("b", "B", [ing("t2", "Tomato", 2, "medium")]);
    const list = computeShoppingList(
      plan([meal(0, "a"), meal(1, "b")]),
      [pantryItem("Tomato", 3, "medium")],
      lookup([a, b]),
    );
    expect(list).toHaveLength(1);
    expect(list[0].qtyNeeded).toBe(4);
    expect(list[0].qtyInStock).toBe(3);
    expect(list[0].qtyToBuy).toBe(1);
  });

  it("leaves an item off the list when the pantry covers it", () => {
    const a = recipe("a", "A", [ing("r", "Rice", 100, "g"), ing("o", "Oil", 10, "ml")]);
    const list = computeShoppingList(plan([meal(0, "a")]), [pantryItem("rice", 500, "g")], lookup([a]));
    expect(list.map((i) => i.name)).toEqual(["Oil"]);
  });

  it("converts kg and litres before comparing with the pantry", () => {
    const a = recipe("a", "A", [ing("r", "Rice", 1500, "g")], { servings: 2 });
    const list = computeShoppingList(plan([meal(0, "a", { servingsMultiplier: 2 })]), [pantryItem("Rice", 1, "kg")], lookup([a]));
    expect(list[0].qtyToBuy).toBe(500);
    expect(list[0].unit).toBe("g");
    expect(toBaseUnit(2, "l")).toEqual({ quantity: 2000, unit: "ml" });
  });

  it("does not count pantry stock held in a unit it cannot compare", () => {
    const a = recipe("a", "A", [ing("o", "Onion", 2, "medium")]);
    const list = computeShoppingList(plan([meal(0, "a")]), [pantryItem("Onion", 500, "g")], lookup([a]));
    expect(list[0].qtyInStock).toBe(0);
    expect(list[0].qtyToBuy).toBe(2);
  });

  it("scales amounts by the number of people", () => {
    const a = recipe("a", "A", [ing("r", "Rice", 100, "g")], { servings: 2 });
    const list = computeShoppingList(plan([meal(0, "a", { servingsMultiplier: 6 })]), [], lookup([a]));
    expect(list[0].qtyToBuy).toBe(300);
  });

  it("ignores empty slots and order-in meals", () => {
    const a = recipe("a", "A", [ing("r", "Rice", 100, "g")]);
    const list = computeShoppingList(
      plan([meal(0, null), meal(1, "a", { isOrderIn: true })]),
      [],
      lookup([a]),
    );
    expect(list).toEqual([]);
  });
});

describe("deductFromPantry", () => {
  const r = recipe("a", "A", [ing("r", "Rice", 200, "g")], { servings: 2 });

  it("reduces matching stock by the scaled amount and leaves the input untouched", () => {
    const pantry = [pantryItem("Rice", 1000, "g")];
    const next = deductFromPantry(pantry, r, 2, "NOW");
    expect(next[0].quantity).toBe(800);
    expect(next[0].updatedAt).toBe("NOW");
    expect(pantry[0].quantity).toBe(1000);
  });

  it("never goes below zero", () => {
    expect(deductFromPantry([pantryItem("Rice", 50, "g")], r, 2)[0].quantity).toBe(0);
  });

  it("works across units: a pantry held in kg is reduced in kg", () => {
    expect(deductFromPantry([pantryItem("Rice", 1, "kg")], r, 2)[0].quantity).toBeCloseTo(0.8);
  });

  it("does not touch stock held in a unit it cannot compare", () => {
    const next = deductFromPantry([pantryItem("Rice", 3, "cups")], r, 2);
    expect(next[0].quantity).toBe(3);
  });

  it("takes from a second pantry entry when the first is not enough", () => {
    const next = deductFromPantry([pantryItem("Rice", 100, "g"), pantryItem("rice", 500, "g")], r, 2);
    expect(next.map((p) => p.quantity)).toEqual([0, 400]);
  });
});

describe("real recipe data", () => {
  it("has unique recipe ids", () => {
    const ids = RECIPES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every ingredient id one name and unit, so shopping-list lines stay distinct", () => {
    const seen = new Map<string, string>();
    for (const r of RECIPES) {
      for (const i of r.ingredients) {
        const sig = `${i.name.toLowerCase().trim()}|${i.unit.toLowerCase().trim()}`;
        const prev = seen.get(i.id);
        if (prev !== undefined) expect(sig, `ingredient id "${i.id}" reused for a different item`).toBe(prev);
        seen.set(i.id, sig);
      }
    }
  });

  it("builds one line per item for a whole week of real meals", () => {
    const meals = RECIPES.slice(0, 21).map((r, i) => meal(i % 7, r.id));
    const list = computeShoppingList(plan(meals), [], lookup(RECIPES));
    const keys = list.map((i) => `${i.name.toLowerCase()}|${i.unit}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(list.map((i) => i.ingredientId)).size).toBe(list.length);
  });
});

describe("formatShoppingList", () => {
  const item = (name: string, category: ShoppingItem["category"], qtyToBuy: number, unit: string, extra: Partial<ShoppingItem> = {}): ShoppingItem => ({
    ingredientId: name, name, category, qtyNeeded: qtyToBuy, qtyInStock: 0, qtyToBuy, unit, checked: false, ...extra,
  });

  it("groups by category in a fixed order and rounds quantities up to whole units", () => {
    const text = formatShoppingList(
      [item("Rice", "grain", 450, "g"), item("Onion", "vegetable", 2.3, "medium"), item("Tomato", "vegetable", 14, "medium")],
      "2026-11-02",
    );
    expect(text).toBe(
      [
        "FreshPlate shopping list - week of 2 Nov 2026",
        "",
        "Vegetables",
        "- Onion: 3 medium",
        "- Tomato: 14 medium",
        "",
        "Grains & staples",
        "- Rice: 450 g",
      ].join("\n"),
    );
  });

  it("leaves out items the user ticked as already having", () => {
    const text = formatShoppingList([item("Rice", "grain", 450, "g", { checked: true }), item("Oil", "oil", 20, "ml")], "2026-11-02");
    expect(text).toContain("Oil");
    expect(text).not.toContain("Rice");
  });

  it("returns an empty string when there is nothing to buy", () => {
    expect(formatShoppingList([], "2026-11-02")).toBe("");
    expect(formatShoppingList([item("Rice", "grain", 450, "g", { checked: true })], "2026-11-02")).toBe("");
  });

  it("never mentions prices, stores or delivery", () => {
    const text = formatShoppingList([item("Rice", "grain", 450, "g", { price: 120, platform: "zepto" })], "2026-11-02");
    expect(text).not.toMatch(/₹|zepto|instamart|deliver/i);
  });
});
