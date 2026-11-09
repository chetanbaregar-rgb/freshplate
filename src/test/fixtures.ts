// Fake data for tests only. Names and amounts are invented, not real recipes.
import type { Household, Ingredient, Member, PantryItem, PlanMeal, Recipe, WeeklyPlan } from "@/lib/types";

export function ing(
  id: string, name: string, quantity: number, unit: string,
  searchTerm: string = name.toLowerCase(),
): Ingredient {
  return { id, name, quantity, unit, category: "other", searchTerms: { zepto: searchTerm, instamart: searchTerm } };
}

export function recipe(id: string, name: string, ingredients: Ingredient[], extra: Partial<Recipe> = {}): Recipe {
  return {
    id, name, description: "", cuisineRegion: [], dietType: "veg", goalTags: ["maintenance"],
    mealType: ["lunch"], prepTime: 5, cookTime: 5, servings: 2, difficulty: "easy",
    nutrition: { calories: 100, proteinG: 1, carbsG: 1, fatG: 1 },
    ingredients, steps: [], tags: [], ...extra,
  };
}

export function pantryItem(name: string, quantity: number, unit: string): PantryItem {
  return { id: `p-${name}-${unit}`, name, quantity, unit, category: "other", updatedAt: "2000-01-01T00:00:00.000Z" };
}

export function meal(day: number, recipeId: string | null, extra: Partial<PlanMeal> = {}): PlanMeal {
  return { day, mealType: "lunch", recipeId, isOrderIn: false, locked: false, servingsMultiplier: 2, ...extra };
}

export function plan(meals: PlanMeal[]): WeeklyPlan {
  return { id: "plan-test", weekStart: "2000-01-03", meals, status: "draft" };
}

export function member(id: string, extra: Partial<Member> = {}): Member {
  return {
    id, name: `Test ${id}`, age: 30, gender: "female", healthGoal: "maintenance",
    activityLevel: "moderate", allergies: [], dislikes: [], ...extra,
  };
}

export function household(members: Member[], extra: Partial<Household> = {}): Household {
  return {
    id: "hh-test", name: "Test household", state: "Karnataka", dietType: "nonveg", members,
    deliveryAddress: "Test address", connectedPlatforms: [], onboardingComplete: true, ...extra,
  };
}
