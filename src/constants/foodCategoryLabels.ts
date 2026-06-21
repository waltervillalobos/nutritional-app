import { FoodCategory } from '../domain/entities/FoodCategory';

/**
 * Spanish display labels for the food categories. Kept in the presentation layer
 * (not the domain enum) per the bilingual rule: code identifiers stay English,
 * user-facing strings are Spanish.
 */
export const foodCategoryLabels: Record<FoodCategory, string> = {
  [FoodCategory.GRAIN]: 'Harina',
  [FoodCategory.FRUIT]: 'Fruta',
  [FoodCategory.VEGETABLE]: 'Vegetal',
  [FoodCategory.DAIRY]: 'Lácteo',
  [FoodCategory.PROTEIN]: 'Proteína',
  [FoodCategory.FAT]: 'Grasa',
};
