import { FoodCategory, caloriesPerPortion } from '../entities/FoodCategory';

/** Daily portion quota per food category (the user's PortionTargets). */
export type DailyPortions = Partial<Record<FoodCategory, number>>;

/**
 * Domain Rule 2 — calories are always derived, never stored.
 *
 * Computes total daily calories as Σ (dailyPortions × kcal/portion) across all
 * six categories. Missing categories count as zero portions.
 */
export function calculateDailyCalories(portions: DailyPortions): number {
  return (Object.values(FoodCategory) as FoodCategory[]).reduce(
    (total, category) => total + (portions[category] ?? 0) * caloriesPerPortion[category],
    0,
  );
}
