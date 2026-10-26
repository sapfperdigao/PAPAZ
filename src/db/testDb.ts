import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { DDL } from './ddl';
import * as schema from './schema';

// Node test database: in-memory SQLite via better-sqlite3, same DDL as the
// app. Returns the drizzle instance plus the raw handle for pragma checks.
export function makeTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(DDL);
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

export type TestDb = ReturnType<typeof makeTestDb>['db'];
