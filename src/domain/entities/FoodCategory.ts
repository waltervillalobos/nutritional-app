/**
 * Exchange-list food categories (Mexican intercambio system).
 *
 * Code identifiers are English; Spanish display names live in the UI layer.
 * `caloriesPerPortion` is the kcal value of one standard exchange/portion and is
 * the source of truth for Domain Rule 2 (calories are always derived, never stored).
 */
export enum FoodCategory {
  GRAIN = 'GRAIN',
  FRUIT = 'FRUIT',
  VEGETABLE = 'VEGETABLE',
  DAIRY = 'DAIRY',
  PROTEIN = 'PROTEIN',
  FAT = 'FAT',
}

/** kcal per single exchange/portion, per CLAUDE.md domain terminology table. */
export const caloriesPerPortion: Record<FoodCategory, number> = {
  [FoodCategory.GRAIN]: 80,
  [FoodCategory.FRUIT]: 60,
  [FoodCategory.VEGETABLE]: 25,
  [FoodCategory.DAIRY]: 90,
  [FoodCategory.PROTEIN]: 55,
  [FoodCategory.FAT]: 45,
};
