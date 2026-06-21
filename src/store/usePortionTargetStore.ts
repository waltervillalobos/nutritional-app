import { create } from 'zustand';
import { FoodCategory } from '../domain/entities/FoodCategory';
import { toDailyPortions } from '../domain/entities/PortionTarget';
import {
  calculateDailyCalories,
  type DailyPortions,
} from '../domain/rules/calculateDailyCalories';
import {
  sqlitePortionTargetRepository,
  type PortionTargetRepository,
} from '../data/repositories/portionTargetRepository';

type Status = 'idle' | 'loading' | 'ready' | 'saving';

interface PortionTargetState {
  /** Editable portions per category. Categories default to zero. */
  targets: DailyPortions;
  status: Status;
  load: () => Promise<void>;
  setPortion: (category: FoodCategory, dailyPortions: number) => void;
  save: () => Promise<void>;
}

/**
 * Derived selector — total daily calories are never stored (Domain Rule 2);
 * they are recomputed from the current targets on every read.
 */
export function selectDailyCalories(state: PortionTargetState): number {
  return calculateDailyCalories(state.targets);
}

/**
 * Factory so the store can be created with a fake repository in tests.
 * The app uses the default SQLite-backed repository.
 */
export function createPortionTargetStore(
  repository: PortionTargetRepository = sqlitePortionTargetRepository,
) {
  return create<PortionTargetState>((set, get) => ({
    targets: {},
    status: 'idle',

    async load() {
      set({ status: 'loading' });
      const stored = await repository.findAll();
      set({ targets: toDailyPortions(stored), status: 'ready' });
    },

    setPortion(category, dailyPortions) {
      const sanitized = Number.isFinite(dailyPortions)
        ? Math.max(0, dailyPortions)
        : 0;
      set((state) => ({ targets: { ...state.targets, [category]: sanitized } }));
    },

    async save() {
      set({ status: 'saving' });
      await repository.saveAll(get().targets);
      set({ status: 'ready' });
    },
  }));
}

export const usePortionTargetStore = createPortionTargetStore();
