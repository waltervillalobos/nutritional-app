import { getDatabase } from './client';
import { SCHEMA_SQL } from './schema';

/**
 * Schema version embedded in the database via `PRAGMA user_version`.
 * Bumping this in the future drives incremental migrations.
 */
const SCHEMA_VERSION = 1;

/**
 * First-launch bootstrap: creates all tables and seeds the fixed reference data
 * exactly once. Idempotent across restarts via the `user_version` guard, so it is
 * safe to call on every app start.
 *
 * The reference/recipe seed import from bundled JSON (US-08/US-11) is a separate,
 * later step and deliberately not run here — US-01 only needs the schema and the
 * `food_category` constants created by `SCHEMA_SQL`.
 */
export async function bootstrapDatabase(): Promise<void> {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) {
    return;
  }

  await db.execAsync(SCHEMA_SQL);
  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}
