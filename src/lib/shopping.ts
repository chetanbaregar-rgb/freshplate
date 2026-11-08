import { format, parseISO } from "date-fns";
import type { Ingredient, PantryItem, Recipe, ShoppingItem, WeeklyPlan } from "./types";

/** Lower-case, trimmed, single-spaced. Used so "Onion " and "onion" are the same item. */
export function normaliseName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Brings a quantity to a base unit so amounts can be added and compared: kg -> g, l -> ml.
 * Units we cannot convert (medium, piece, leaves...) are kept as typed, lower-cased.
 */
export function toBaseUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const u = unit.toLowerCase().trim();
  if (u === "kg") return { quantity: quantity * 1000, unit: "g" };
  if (u === "l" || u === "litre" || u === "liter") return { quantity: quantity * 1000, unit: "ml" };
  return { quantity, unit: u };
}

/** Amount of an ingredient needed for `servingsMultiplier` people, in the ingredient's own unit. */
export function scaledQuantity(ing: Ingredient, recipe: Recipe, servingsMultiplier: number): number {
  return (ing.quantity * servingsMultiplier) / recipe.servings;
}

/**
 * Builds what to buy for a plan. One line per (name, unit): the same item used in several
 * meals is added up, and pantry stock is subtracted once from that total. Pantry stock in a
 * unit we cannot compare with (e.g. grams of onion vs "medium" onions) is not counted, so
 * we buy rather than under-buy.
 */
export function computeShoppingList(
  plan: WeeklyPlan,
  pantry: PantryItem[],
  getRecipe: (id: string) => Recipe | undefined,
): ShoppingItem[] {
  const lines = new Map<string, ShoppingItem>();
  const names = new Map<string, string>();

  for (const meal of plan.meals) {
    if (!meal.recipeId || meal.isOrderIn) continue;
    const recipe = getRecipe(meal.recipeId);
    if (!recipe) continue;

    for (const ing of recipe.ingredients) {
      const { quantity, unit } = toBaseUnit(scaledQuantity(ing, recipe, meal.servingsMultiplier), ing.unit);
      const name = normaliseName(ing.name);
      const key = `${name}|${unit}`;
      const line = lines.get(key);
      if (line) {
        line.qtyNeeded += quantity;
      } else {
        lines.set(key, {
          ingredientId: ing.id,
          name: ing.name,
          category: ing.category,
          qtyNeeded: quantity,
          qtyInStock: 0,
          qtyToBuy: 0,
          unit,
          available: true,
          checked: false,
        });
        names.set(key, name);
      }
    }
  }

  for (const [key, line] of lines) {
    line.qtyInStock = pantryStock(pantry, names.get(key)!, line.unit);
    line.qtyToBuy = Math.max(0, line.qtyNeeded - line.qtyInStock);
  }

  return Array.from(lines.values()).filter((i) => i.qtyToBuy > 0);
}

/** Total of a pantry item (by name) that is held in the given base unit. */
function pantryStock(pantry: PantryItem[], normalisedName: string, baseUnit: string): number {
  let total = 0;
  for (const p of pantry) {
    if (normaliseName(p.name) !== normalisedName) continue;
    const base = toBaseUnit(p.quantity, p.unit);
    if (base.unit === baseUnit) total += base.quantity;
  }
  return total;
}

/**
 * Pantry after cooking one meal. Only items in a comparable unit are reduced, and never
 * below zero. Returns a new array; the input is not changed.
 */
export function deductFromPantry(
  pantry: PantryItem[],
  recipe: Recipe,
  servingsMultiplier: number,
  now: string = new Date().toISOString(),
): PantryItem[] {
  const next = pantry.map((p) => ({ ...p }));

  for (const ing of recipe.ingredients) {
    const need = toBaseUnit(scaledQuantity(ing, recipe, servingsMultiplier), ing.unit);
    let remaining = need.quantity;
    const name = normaliseName(ing.name);

    for (const p of next) {
      if (remaining <= 0) break;
      if (normaliseName(p.name) !== name) continue;
      const stock = toBaseUnit(p.quantity, p.unit);
      if (stock.unit !== need.unit || stock.quantity <= 0) continue;

      const taken = Math.min(stock.quantity, remaining);
      // Convert back to the unit the pantry item is stored in.
      const factor = stock.quantity / p.quantity;
      p.quantity = Math.max(0, (stock.quantity - taken) / factor);
      p.updatedAt = now;
      remaining -= taken;
    }
  }

  return next;
}

const CATEGORY_ORDER: Ingredient["category"][] = [
  "vegetable", "fruit", "dairy", "grain", "protein", "spice", "oil", "other",
];

const CATEGORY_NAMES: Record<Ingredient["category"], string> = {
  vegetable: "Vegetables",
  fruit: "Fruits",
  dairy: "Dairy",
  grain: "Grains & staples",
  protein: "Protein",
  spice: "Spices & herbs",
  oil: "Oils & ghee",
  other: "Other",
};

/** Whole units to buy: a recipe needing 2.3 onions means 3. */
export function quantityToBuy(item: Pick<ShoppingItem, "qtyToBuy" | "unit">): string {
  return `${Math.ceil(item.qtyToBuy)} ${item.unit}`;
}

/**
 * Plain-text list to paste into a notes app, a message, or a store's search. Skips items the
 * user ticked as already having. Returns "" when there is nothing to buy.
 */
export function formatShoppingList(items: ShoppingItem[], weekStart: string): string {
  const toBuy = items.filter((i) => !i.checked && i.qtyToBuy > 0);
  if (toBuy.length === 0) return "";

  const lines = [`FreshPlate shopping list - week of ${format(parseISO(weekStart), "d MMM yyyy")}`];
  for (const category of CATEGORY_ORDER) {
    const group = toBuy.filter((i) => i.category === category);
    if (group.length === 0) continue;
    lines.push("", CATEGORY_NAMES[category]);
    for (const item of group) lines.push(`- ${item.name}: ${quantityToBuy(item)}`);
  }
  return lines.join("\n");
}
