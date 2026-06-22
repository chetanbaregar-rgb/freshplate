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

function bmr(member: Member): number {
  const base =
    member.gender === "male"
      ? 10 * 70 + 6.25 * 170 - 5 * member.age + 5
      : 10 * 60 + 6.25 * 160 - 5 * member.age - 161;
  return base;
}

export function computeTarget(member: Member): NutritionTarget {
  const baseBmr = bmr(member);
  const tdee = baseBmr * ACTIVITY_MULTIPLIER[member.activityLevel];
  const adjustment = GOAL_CALORIE_ADJUSTMENT[member.healthGoal];
  const calories = Math.round(tdee * (1 + adjustment));

  const weightKg = member.gender === "male" ? 70 : 60;
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
