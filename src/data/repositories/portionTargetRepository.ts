import { getDatabase } from '../db/client';
import { FoodCategory } from '../../domain/entities/FoodCategory';
import {
  FOOD_CATEGORIES,
  portionTargetId,
  type PortionTarget,
} from '../../domain/entities/PortionTarget';
import type { DailyPortions } from '../../domain/rules/calculateDailyCalories';

/**
 * Persistence boundary for PortionTargets. The store depends on this interface,
 * not on expo-sqlite, so the SQLite implementation is swappable and the store
 * stays unit-testable (Dependency Inversion).
 */
export interface PortionTargetRepository {
  findAll(): Promise<PortionTarget[]>;
  saveAll(targets: DailyPortions): Promise<void>;
}

interface PortionTargetRow {
  category_code: FoodCategory;
  daily_portions: number;
}

/**
 * SQLite-backed repository. The only place portion_target SQL lives; it never
 * writes calories (Domain Rule 2) and never touches seed tables (Domain Rule 4).
 */
export const sqlitePortionTargetRepository: PortionTargetRepository = {
  async findAll(): Promise<PortionTarget[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<PortionTargetRow>(
      'SELECT category_code, daily_portions FROM portion_target',
    );
    return rows.map((row) => ({
      id: portionTargetId(row.category_code),
      category: row.category_code,
      dailyPortions: row.daily_portions,
    }));
  },

  async saveAll(targets: DailyPortions): Promise<void> {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      for (const category of FOOD_CATEGORIES) {
        const dailyPortions = targets[category] ?? 0;
        await db.runAsync(
          `INSERT INTO portion_target (id, category_code, daily_portions, updated_at)
           VALUES (?, ?, ?, datetime('now'))
           ON CONFLICT(category_code) DO UPDATE SET
             daily_portions = excluded.daily_portions,
             updated_at = excluded.updated_at`,
          [portionTargetId(category), category, dailyPortions],
        );
      }
    });
  },
};
