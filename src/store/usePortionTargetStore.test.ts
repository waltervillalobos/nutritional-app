import { FoodCategory } from '../domain/entities/FoodCategory';
import { createPortionTarget, type PortionTarget } from '../domain/entities/PortionTarget';
import type { DailyPortions } from '../domain/rules/calculateDailyCalories';
import type { PortionTargetRepository } from '../data/repositories/portionTargetRepository';
import {
  createPortionTargetStore,
  selectDailyCalories,
} from './usePortionTargetStore';

/** In-memory repository — proves the store works without expo-sqlite (DIP). */
class FakePortionTargetRepository implements PortionTargetRepository {
  saved: DailyPortions | null = null;

  constructor(private readonly initial: PortionTarget[] = []) {}

  async findAll(): Promise<PortionTarget[]> {
    return this.initial;
  }

  async saveAll(targets: DailyPortions): Promise<void> {
    this.saved = targets;
  }
}

describe('usePortionTargetStore', () => {
  it('rehydrates targets from the repository on load', async () => {
    const repo = new FakePortionTargetRepository([
      createPortionTarget(FoodCategory.GRAIN, 6),
      createPortionTarget(FoodCategory.PROTEIN, 5),
    ]);
    const store = createPortionTargetStore(repo);

    await store.getState().load();

    expect(store.getState().status).toBe('ready');
    expect(store.getState().targets).toEqual({
      [FoodCategory.GRAIN]: 6,
      [FoodCategory.PROTEIN]: 5,
    });
  });

  it('derives daily calories reactively as portions change', () => {
    const store = createPortionTargetStore(new FakePortionTargetRepository());

    store.getState().setPortion(FoodCategory.GRAIN, 2); // 2 × 80
    expect(selectDailyCalories(store.getState())).toBe(160);

    store.getState().setPortion(FoodCategory.PROTEIN, 5); // + 5 × 55
    expect(selectDailyCalories(store.getState())).toBe(435);
  });

  it('clamps negative input to zero', () => {
    const store = createPortionTargetStore(new FakePortionTargetRepository());

    store.getState().setPortion(FoodCategory.FAT, -3);

    expect(store.getState().targets[FoodCategory.FAT]).toBe(0);
  });

  it('persists the current targets through the repository on save', async () => {
    const repo = new FakePortionTargetRepository();
    const store = createPortionTargetStore(repo);

    store.getState().setPortion(FoodCategory.DAIRY, 2);
    await store.getState().save();

    expect(store.getState().status).toBe('ready');
    expect(repo.saved).toEqual({ [FoodCategory.DAIRY]: 2 });
  });
});
