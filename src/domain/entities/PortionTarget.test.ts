import { FoodCategory } from './FoodCategory';
import { createPortionTarget, portionTargetId, toDailyPortions } from './PortionTarget';

describe('PortionTarget', () => {
  it('derives a deterministic slug id per category', () => {
    expect(portionTargetId(FoodCategory.GRAIN)).toBe('portion-target-grain');
    expect(portionTargetId(FoodCategory.PROTEIN)).toBe('portion-target-protein');
  });

  it('creates a target with the slug id and given portions', () => {
    const target = createPortionTarget(FoodCategory.FRUIT, 2.5);

    expect(target).toEqual({
      id: 'portion-target-fruit',
      category: FoodCategory.FRUIT,
      dailyPortions: 2.5,
    });
  });

  it('rejects negative or non-finite portions (mirrors the DB CHECK)', () => {
    expect(() => createPortionTarget(FoodCategory.FAT, -1)).toThrow(RangeError);
    expect(() => createPortionTarget(FoodCategory.FAT, NaN)).toThrow(RangeError);
  });

  it('maps targets to a DailyPortions record', () => {
    const targets = [
      createPortionTarget(FoodCategory.GRAIN, 6),
      createPortionTarget(FoodCategory.PROTEIN, 5),
    ];

    expect(toDailyPortions(targets)).toEqual({
      [FoodCategory.GRAIN]: 6,
      [FoodCategory.PROTEIN]: 5,
    });
  });
});
