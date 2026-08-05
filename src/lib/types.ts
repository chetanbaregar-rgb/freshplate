export type DietType = "veg" | "egg" | "nonveg";
export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "moderate" | "active";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type Platform = "zepto" | "instamart";
export type OrderStatus = "placed" | "on_the_way" | "delivered" | "cancelled";

export type HealthGoal =
  | "weight_loss"
  | "weight_gain"
  | "muscle"
  | "recovery"
  | "diabetic"
  | "heart"
  | "maintenance";

export interface Member {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  dietOverride?: DietType;
  healthGoal: HealthGoal;
  activityLevel: ActivityLevel;
  allergies: string[];
  dislikes: string[];
}

export interface Household {
  id: string;
  name: string;
  state: string;
  stateOfOrigin?: string;
  dietType: DietType;
  members: Member[];
  deliveryAddress: string;
  connectedPlatforms: Platform[];
  onboardingComplete: boolean;
}

export interface NutritionTarget {
  memberId: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: "vegetable" | "fruit" | "dairy" | "grain" | "protein" | "spice" | "oil" | "other";
  searchTerms: { zepto: string; instamart: string };
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisineRegion: string[];
  dietType: DietType;
  goalTags: HealthGoal[];
  mealType: MealType[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  nutrition: { calories: number; proteinG: number; carbsG: number; fatG: number };
  ingredients: Ingredient[];
  steps: string[];
  image?: string;
  tags: string[];
}

export interface PlanMeal {
  day: number; // 0=Mon … 6=Sun
  mealType: MealType;
  recipeId: string | null;
  isOrderIn: boolean;
  locked: boolean;
  servingsMultiplier: number;
}

export interface WeeklyPlan {
  id: string;
  weekStart: string; // ISO date string
  meals: PlanMeal[];
  status: "draft" | "confirmed";
}

export interface ShoppingItem {
  ingredientId: string;
  name: string;
  category: Ingredient["category"];
  qtyNeeded: number;
  qtyInStock: number;
  qtyToBuy: number;
  unit: string;
  platform?: Platform;
  price?: number;
  packSize?: string;
  available?: boolean;
  checked: boolean;
  /** Opaque platform-specific identifiers (Zepto: productVariantId/storeProductId,
   *  Instamart: spinId/skuId) needed to add this exact item to cart — populated
   *  by refreshAvailability() once a live platform search has matched it. */
  platformRef?: Record<string, unknown>;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Ingredient["category"];
  expiryDate?: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  platform: Platform;
  planId: string;
  items: { name: string; quantity: number; unit: string; price: number }[];
  status: OrderStatus;
  placedAt: string;
  deliveredAt?: string;
  totalAmount: number;
}

export interface AvailabilityResult {
  ingredientId: string;
  name: string;
  platform: Platform;
  available: boolean;
  price?: number;
  packSize?: string;
  skuId?: string;
  fetchedAt: string;
}
