import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { DDL } from './ddl';
import * as schema from './schema';

// App database (on-device). Lazily opened singleton. Foreign keys are enabled
// and the canonical DDL (ddl.ts) is applied idempotently on first open.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = openDatabaseSync('mesa.db');
    sqlite.execSync('PRAGMA foreign_keys = ON;');
    sqlite.execSync(DDL);
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}
