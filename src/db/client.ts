import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { DDL } from './ddl';
import { runMigrations } from './migrate';
import * as schema from './schema';

// Ordered migrations. Index + 1 = version. v1 is the baseline DDL; append
// ALTER/CREATE scripts for future schema changes — never edit a shipped entry.
const MIGRATIONS = [DDL];

// App database (on-device). Lazily opened singleton. Foreign keys are enabled
// and pending migrations are applied (idempotently) on first open.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const initDb = () => Promise.resolve();

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
