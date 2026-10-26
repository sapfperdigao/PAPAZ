import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { runMigrations } from './migrate';
import { MIGRATIONS } from './migrations';
import * as schema from './schema';

// Node test database: in-memory SQLite via better-sqlite3, migrated through the
// SAME ordered MIGRATIONS the app runs (so tests exercise the real migration
// path, including v2's editorial_json). Returns the drizzle instance plus the
// raw handle for pragma checks.
export function makeTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  runMigrations(
    {
      getVersion: () => sqlite.pragma('user_version', { simple: true }) as number,
      setVersion: (v) => sqlite.pragma(`user_version = ${v}`),
      exec: (sql) => sqlite.exec(sql),
    },
    MIGRATIONS,
  );
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

export type TestDb = ReturnType<typeof makeTestDb>['db'];
