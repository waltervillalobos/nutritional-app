import { FoodCategory } from '../entities/FoodCategory';
import { calculateDailyCalories } from './calculateDailyCalories';

describe('calculateDailyCalories (Domain Rule 2)', () => {
  it('sums portions × kcal/portion across all six categories', () => {
    const portions = {
      [FoodCategory.GRAIN]: 6, // 6 × 80 = 480
      [FoodCategory.FRUIT]: 3, // 3 × 60 = 180
      [FoodCategory.VEGETABLE]: 4, // 4 × 25 = 100
      [FoodCategory.DAIRY]: 2, // 2 × 90 = 180
      [FoodCategory.PROTEIN]: 5, // 5 × 55 = 275
      [FoodCategory.FAT]: 3, // 3 × 45 = 135
    };

    expect(calculateDailyCalories(portions)).toBe(1350);
  });

  it('treats missing categories as zero portions', () => {
    expect(calculateDailyCalories({ [FoodCategory.GRAIN]: 2 })).toBe(160);
  });

  it('returns 0 for an empty plan', () => {
    expect(calculateDailyCalories({})).toBe(0);
  });
});
