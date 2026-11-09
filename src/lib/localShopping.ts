import type { Household, Recipe, ShoppingItem, ShopsAt, WeeklyPlan } from "./types";
import { normaliseName } from "./shopping";

/** Households from before this setting existed shop however they did then: delivery if connected. */
export function shopsAt(household: Household | null): ShopsAt {
  return household?.shopsAt ?? "both";
}

/** Whether delivery apps are part of how this household shops, so their availability and pricing matter. */
export function usesDeliveryApps(household: Household | null): boolean {
  return shopsAt(household) !== "local";
}

export const SHOPS_AT_OPTIONS: { value: ShopsAt; title: string; hint: string }[] = [
  { value: "local", title: "Local shop or market", hint: "A kirana, sabzi mandi or weekly market. You get a list to share or print." },
  { value: "delivery", title: "Delivery app", hint: "Zepto or Swiggy Instamart, with live availability once connected." },
  { value: "both", title: "Both", hint: "A bit of each." },
];

/** The key used to remember an ingredient the household cannot get. Matches how the shopping list groups items. */
export function ingredientKey(name: string): string {
  return normaliseName(name);
}

/** Names of a recipe's required ingredients that the household has marked as hard to find. */
export function blockedIngredients(recipe: Recipe, unavailable: string[]): string[] {
  if (unavailable.length === 0) return [];
  const blocked = new Set(unavailable);
  return recipe.ingredients.filter((i) => !i.optional && blocked.has(ingredientKey(i.name))).map((i) => i.name);
}

/** Ingredients that make a shopping trip longer. Spices, oils and grains are kept in stock anyway. */
const FRESH_CATEGORIES = new Set(["vegetable", "fruit", "dairy", "protein"]);

function requiredIngredients(recipe: Recipe) {
  return recipe.ingredients.filter((i) => !i.optional);
}

/** Keys of the fresh ingredients a recipe needs. */
export function freshKeys(recipe: Recipe): string[] {
  return requiredIngredients(recipe)
    .filter((i) => FRESH_CATEGORIES.has(i.category))
    .map((i) => ingredientKey(i.name));
}

/**
 * Share of a recipe's fresh ingredients that are already being bought for other meals this week.
 * The more it reuses, the fewer different things the household has to find.
 */
export function reuseScore(recipe: Recipe, alreadyBought: Set<string>): number {
  const keys = freshKeys(recipe);
  if (keys.length === 0) return 0;
  return keys.filter((k) => alreadyBought.has(k)).length / keys.length;
}

/** Meals in the plan that use the given ingredient. */
export function mealsUsingIngredient(
  plan: WeeklyPlan | null,
  name: string,
  getRecipe: (id: string) => Recipe | undefined,
): number {
  if (!plan) return 0;
  const key = ingredientKey(name);
  return plan.meals.filter((m) => {
    const recipe = m.recipeId ? getRecipe(m.recipeId) : undefined;
    return recipe ? blockedIngredients(recipe, [key]).length > 0 : false;
  }).length;
}

/** Shopping lists read best in the order things spoil: fresh produce first, store-cupboard items last. */
export const CATEGORY_ORDER = ["vegetable", "fruit", "dairy", "protein", "grain", "spice", "oil", "other"];

export const CATEGORY_TITLES: Record<string, string> = {
  vegetable: "Vegetables",
  fruit: "Fruits",
  dairy: "Dairy",
  protein: "Protein",
  grain: "Grains and staples",
  spice: "Spices and herbs",
  oil: "Oils and ghee",
  other: "Other",
};

export function categoryRank(category: string): number {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

/** Plain text for the shopping list, ready to paste into WhatsApp or print. Items already bought are left out. */
export function formatShoppingList(items: ShoppingItem[]): string {
  const open = items.filter((i) => !i.checked);
  const byCategory = new Map<string, ShoppingItem[]>();
  for (const item of open) {
    byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
  }
  const sections = Array.from(byCategory.entries())
    .sort(([a], [b]) => categoryRank(a) - categoryRank(b))
    .map(([category, list]) => {
      const lines = list.map((i) => `- ${i.name}: ${Math.ceil(i.qtyToBuy)} ${i.unit}`);
      return `${CATEGORY_TITLES[category] ?? category}\n${lines.join("\n")}`;
    });
  return ["Shopping list (FreshPlate)", ...sections].join("\n\n");
}
