import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { runMigrations } from './migrate';
import { MIGRATIONS } from './migrations';
import * as schema from './schema';

// App database (on-device). Lazily opened singleton. Foreign keys are enabled
// and pending migrations are applied (idempotently) on first open.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = openDatabaseSync('mesa.db');
    sqlite.execSync('PRAGMA foreign_keys = ON;');
    runMigrations(
      {
        getVersion: () =>
          sqlite.getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0,
        setVersion: (v) => sqlite.execSync(`PRAGMA user_version = ${v}`),
        exec: (sql) => sqlite.execSync(sql),
      },
      MIGRATIONS,
    );
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

// Uniform cross-platform contract with client.web.ts: callers `await initDb()`
// once, then `getDb()` is safe. Native opens synchronously, so this just forces
// the open + migrations during the boot gate rather than on first query.
export async function initDb(): Promise<void> {
  getDb();
}
