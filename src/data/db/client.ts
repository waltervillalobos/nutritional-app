import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

/**
 * Single SQLite connection for the whole app lifetime. expo-sqlite is opened
 * lazily on first access and reused thereafter — all repositories share it.
 */
const DATABASE_NAME = 'nutrition.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (databasePromise === null) {
    databasePromise = openDatabaseAsync(DATABASE_NAME);
  }
  return databasePromise;
}
