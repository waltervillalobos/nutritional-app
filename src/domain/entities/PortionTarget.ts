import { FoodCategory } from './FoodCategory';
import type { DailyPortions } from '../rules/calculateDailyCalories';

/**
 * PortionTarget — the user's nutritionist-defined quota for a single FoodCategory.
 *
 * Exactly one PortionTarget exists per category (six in total). It is the only
 * user-editable nutrition data in MVP1. Calories are never part of this entity:
 * they are always derived via `calculateDailyCalories` (Domain Rule 2).
 */
export interface PortionTarget {
  readonly id: string;
  readonly category: FoodCategory;
  readonly dailyPortions: number;
}

/** The six categories in their canonical display/iteration order. */
export const FOOD_CATEGORIES: readonly FoodCategory[] = [
  FoodCategory.GRAIN,
  FoodCategory.FRUIT,
  FoodCategory.VEGETABLE,
  FoodCategory.DAIRY,
  FoodCategory.PROTEIN,
  FoodCategory.FAT,
];

/**
 * Deterministic primary key for a category's target, e.g. `portion-target-grain`.
 * Stable across app versions, matching the seed-data slug convention.
 */
export function portionTargetId(category: FoodCategory): string {
  return `portion-target-${category.toLowerCase()}`;
}

/**
 * Builds a PortionTarget, enforcing the same non-negative invariant as the
 * `daily_portions >= 0` CHECK in the database schema.
 */
export function createPortionTarget(category: FoodCategory, dailyPortions: number): PortionTarget {
  if (!Number.isFinite(dailyPortions) || dailyPortions < 0) {
    throw new RangeError(`dailyPortions must be a finite number >= 0, received: ${dailyPortions}`);
  }
  return { id: portionTargetId(category), category, dailyPortions };
}

/**
 * Reduces a set of PortionTargets to the `DailyPortions` map consumed by the
 * calorie-derivation rule. Categories without a target default to zero.
 */
export function toDailyPortions(targets: readonly PortionTarget[]): DailyPortions {
  return targets.reduce<DailyPortions>((portions, target) => {
    portions[target.category] = target.dailyPortions;
    return portions;
  }, {});
}
