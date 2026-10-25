import type { Member, NutritionTarget, HealthGoal } from "./types";

const ACTIVITY_MULTIPLIER = {
  sedentary: 1.2,
  moderate: 1.55,
  active: 1.725,
};

const GOAL_CALORIE_ADJUSTMENT: Record<HealthGoal, number> = {
  weight_loss: -0.18,
  weight_gain: 0.12,
  muscle: 0.08,
  recovery: 0,
  diabetic: -0.05,
  heart: 0,
  maintenance: 0,
};

const GOAL_PROTEIN_MULTIPLIER: Record<HealthGoal, number> = {
  weight_loss: 1.8,
  weight_gain: 1.6,
  muscle: 2.0,
  recovery: 1.8,
  diabetic: 1.4,
  heart: 1.2,
  maintenance: 1.2,
};

// Population-average fallbacks for members created before weight/height were
// collected, or who skip the (optional) fields — Mifflin-St Jeor still needs
// *some* value, so this is a best-effort estimate, not a real measurement.
const DEFAULT_WEIGHT_KG: Record<Member["gender"], number> = { male: 70, female: 60, other: 65 };
const DEFAULT_HEIGHT_CM: Record<Member["gender"], number> = { male: 170, female: 160, other: 165 };
const GENDER_BMR_CONSTANT: Record<Member["gender"], number> = { male: 5, female: -161, other: -78 };

function memberWeightKg(member: Member): number {
  return member.weightKg ?? DEFAULT_WEIGHT_KG[member.gender];
}

function bmr(member: Member): number {
  const weightKg = memberWeightKg(member);
  const heightCm = member.heightCm ?? DEFAULT_HEIGHT_CM[member.gender];
  return 10 * weightKg + 6.25 * heightCm - 5 * member.age + GENDER_BMR_CONSTANT[member.gender];
}

export function computeTarget(member: Member): NutritionTarget {
  const baseBmr = bmr(member);
  const tdee = baseBmr * ACTIVITY_MULTIPLIER[member.activityLevel];
  const adjustment = GOAL_CALORIE_ADJUSTMENT[member.healthGoal];
  const calories = Math.round(tdee * (1 + adjustment));

  const weightKg = memberWeightKg(member);
  const proteinG = Math.round(weightKg * GOAL_PROTEIN_MULTIPLIER[member.healthGoal]);
  const fatG = Math.round((calories * 0.28) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);

  return { memberId: member.id, calories, proteinG, carbsG, fatG };
}

export function goalLabel(goal: HealthGoal): string {
  const labels: Record<HealthGoal, string> = {
    weight_loss: "Weight Loss",
    weight_gain: "Weight Gain",
    muscle: "Muscle Building",
    recovery: "Recovery",
    diabetic: "Diabetic-Friendly",
    heart: "Heart-Healthy",
    maintenance: "Maintenance",
  };
  return labels[goal];
}

export function goalColor(goal: HealthGoal): string {
  const colors: Record<HealthGoal, string> = {
    weight_loss: "bg-blue-100 text-blue-700",
    weight_gain: "bg-green-100 text-green-700",
    muscle: "bg-orange-100 text-orange-700",
    recovery: "bg-purple-100 text-purple-700",
    diabetic: "bg-teal-100 text-teal-700",
    heart: "bg-red-100 text-red-700",
    maintenance: "bg-gray-100 text-gray-700",
  };
  return colors[goal];
}
