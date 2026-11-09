import type { Ingredient, PantryItem, Recipe, ShoppingItem, WeeklyPlan } from "./types";
import { convertQuantity } from "./units";

/** Lower-case, trimmed, single-spaced. Used so "Onion " and "onion" are the same item. */
export function normaliseName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Amount of an ingredient needed for `servingsMultiplier` people, in the ingredient's own unit. */
export function scaledQuantity(ing: Ingredient, recipe: Recipe, servingsMultiplier: number): number {
  return (ing.quantity * servingsMultiplier) / recipe.servings;
}

/**
 * Builds what to buy for a plan. One line per item: the same item used in several meals is
 * added up (converting between comparable units such as kg and g), and pantry stock is
 * subtracted once from that total. The same name in incomparable units (grams and "medium")
 * stays as separate lines. Pantry stock in a unit we cannot compare with is not counted, so we
 * buy rather than under-buy.
 */
export function computeShoppingList(
  plan: WeeklyPlan,
  pantry: PantryItem[],
  getRecipe: (id: string) => Recipe | undefined,
): ShoppingItem[] {
  const byName = new Map<string, ShoppingItem[]>();

  for (const meal of plan.meals) {
    if (!meal.recipeId || meal.isOrderIn) continue;
    const recipe = getRecipe(meal.recipeId);
    if (!recipe) continue;

    for (const ing of recipe.ingredients) {
      const needed = scaledQuantity(ing, recipe, meal.servingsMultiplier);
      const name = normaliseName(ing.name);
      const lines = byName.get(name) ?? [];

      const line = lines.find((l) => convertQuantity(needed, ing.unit, l.unit) !== null);
      if (line) {
        line.qtyNeeded += convertQuantity(needed, ing.unit, line.unit)!;
        continue;
      }
      lines.push({
        ingredientId: ing.id,
        name: ing.name,
        category: ing.category,
        qtyNeeded: needed,
        qtyInStock: 0,
        qtyToBuy: 0,
        unit: ing.unit,
        available: true,
        checked: false,
      });
      byName.set(name, lines);
    }
  }

  const list: ShoppingItem[] = [];
  for (const [name, lines] of byName) {
    const stock = pantry.filter((p) => normaliseName(p.name) === name);
    for (const line of lines) {
      // Lines of one name are in incomparable units, so a pantry entry matches at most one.
      line.qtyInStock = stock.reduce((sum, p) => sum + (convertQuantity(p.quantity, p.unit, line.unit) ?? 0), 0);
      line.qtyToBuy = Math.max(0, line.qtyNeeded - line.qtyInStock);
      if (line.qtyToBuy > 0) list.push(line);
    }
  }
  return list;
}

/**
 * Pantry after cooking one meal. Stock is taken from every matching entry in turn, only from
 * entries in a comparable unit, and never below zero. Returns a new array; the input is not
 * changed.
 */
export function deductFromPantry(
  pantry: PantryItem[],
  recipe: Recipe,
  servingsMultiplier: number,
  now: string = new Date().toISOString(),
): PantryItem[] {
  let next = pantry.map((p) => ({ ...p }));

  for (const ing of recipe.ingredients) {
    let remaining = scaledQuantity(ing, recipe, servingsMultiplier);
    const name = normaliseName(ing.name);

    next = next.map((p) => {
      if (remaining <= 0 || normaliseName(p.name) !== name) return p;
      const neededInPantryUnit = convertQuantity(remaining, ing.unit, p.unit);
      if (neededInPantryUnit === null) return p; // incomparable unit: skip rather than guess
      const taken = Math.min(p.quantity, neededInPantryUnit);
      remaining -= convertQuantity(taken, p.unit, ing.unit) ?? 0;
      return { ...p, quantity: Math.max(0, p.quantity - taken), updatedAt: now };
    });
  }

  return next;
}
