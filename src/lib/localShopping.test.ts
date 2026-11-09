import { describe, expect, it } from "vitest";
import {
  blockedIngredients, categoryRank, formatShoppingList, freshKeys, ingredientKey, mealsUsingIngredient,
  reuseScore, shopsAt, usesDeliveryApps,
} from "./localShopping";
import type { Ingredient, ShoppingItem } from "./types";
import { household, ing, meal, member, plan, recipe } from "@/test/fixtures";

const veg = (id: string, name: string, extra: Partial<Ingredient> = {}): Ingredient => ({ ...ing(id, name, 100, "g"), category: "vegetable", ...extra });
const spice = (id: string, name: string): Ingredient => ({ ...ing(id, name, 5, "g"), category: "spice" });
const item = (name: string, category: ShoppingItem["category"], qty: number, unit: string, checked = false): ShoppingItem => ({
  ingredientId: name, name, category, qtyNeeded: qty, qtyInStock: 0, qtyToBuy: qty, unit, checked,
});

describe("shopping mode", () => {
  it("treats households from before the setting as 'both'", () => {
    expect(shopsAt(household([member("1")]))).toBe("both");
    expect(usesDeliveryApps(household([member("1")]))).toBe(true);
    expect(shopsAt(null)).toBe("both");
  });
  it("only skips delivery apps for local shoppers", () => {
    expect(usesDeliveryApps(household([member("1")], { shopsAt: "local" }))).toBe(false);
    expect(usesDeliveryApps(household([member("1")], { shopsAt: "delivery" }))).toBe(true);
    expect(usesDeliveryApps(household([member("1")], { shopsAt: "both" }))).toBe(true);
  });
});

describe("blockedIngredients", () => {
  const r = recipe("r", "Sabzi", [veg("a", "Broccoli"), veg("b", "Onion"), { ...veg("c", "Coriander"), optional: true }]);

  it("finds required ingredients the household cannot get, matching names the way the shopping list does", () => {
    expect(blockedIngredients(r, [ingredientKey("  BROCCOLI ")])).toEqual(["Broccoli"]);
    expect(blockedIngredients(r, ["spinach"])).toEqual([]);
    expect(blockedIngredients(r, [])).toEqual([]);
  });
  it("ignores optional ingredients, since a recipe works without them", () => {
    expect(blockedIngredients(r, ["coriander"])).toEqual([]);
  });
});

describe("reuse", () => {
  const r = recipe("r", "Sabzi", [veg("a", "Onion"), veg("b", "Tomato"), spice("c", "Cumin"), { ...ing("d", "Rice", 100, "g"), category: "grain" }]);

  it("counts only fresh ingredients, not spices or grains", () => {
    expect(freshKeys(r)).toEqual(["onion", "tomato"]);
  });
  it("scores the share of fresh ingredients already being bought", () => {
    expect(reuseScore(r, new Set())).toBe(0);
    expect(reuseScore(r, new Set(["onion"]))).toBe(0.5);
    expect(reuseScore(r, new Set(["onion", "tomato", "other"]))).toBe(1);
    expect(reuseScore(recipe("x", "Plain rice", [spice("c", "Cumin")]), new Set(["cumin"]))).toBe(0);
  });
});

describe("mealsUsingIngredient", () => {
  it("counts the planned meals that use an ingredient", () => {
    const a = recipe("a", "A", [veg("1", "Broccoli")]);
    const b = recipe("b", "B", [veg("2", "Onion")]);
    const p = plan([meal(0, "a"), meal(1, "b"), meal(2, "a"), meal(3, null)]);
    const get = (id: string) => [a, b].find((r) => r.id === id);
    expect(mealsUsingIngredient(p, "Broccoli", get)).toBe(2);
    expect(mealsUsingIngredient(p, "Okra", get)).toBe(0);
    expect(mealsUsingIngredient(null, "Broccoli", get)).toBe(0);
  });
});

describe("formatShoppingList", () => {
  it("lists what to buy, freshest first, skipping what is already bought", () => {
    const text = formatShoppingList([
      item("Rice", "grain", 1.2, "kg"),
      item("Onion", "vegetable", 500, "g"),
      item("Paneer", "dairy", 200, "g"),
      item("Salt", "spice", 1, "pack", true),
    ]);
    expect(text).toBe(
      ["Shopping list (FreshPlate)", "Vegetables\n- Onion: 500 g", "Dairy\n- Paneer: 200 g", "Grains and staples\n- Rice: 2 kg"].join("\n\n"),
    );
  });
  it("orders categories by how fast they spoil", () => {
    expect(["oil", "vegetable", "grain", "fruit", "mystery"].sort((a, b) => categoryRank(a) - categoryRank(b))).toEqual([
      "vegetable", "fruit", "grain", "oil", "mystery",
    ]);
  });
});
