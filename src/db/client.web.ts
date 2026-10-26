import { drizzle } from 'drizzle-orm/sql-js';
import { DDL } from './ddl.web';
import * as schema from './schema';

type WebDb = ReturnType<typeof drizzle<typeof schema>>;
let _db: WebDb | null = null;

// sql-wasm-inline bundles the WASM as base64, so no external .wasm fetch needed.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _initPromise: Promise<void> = (async () => {
  const initSqlJs = require('sql.js/dist/sql-wasm-inline') as (
    cfg?: object,
  ) => Promise<{ Database: new () => import('sql.js').Database }>;
  const SQL = await initSqlJs();
  const sqlite = new SQL.Database();
  sqlite.run(DDL);
  _db = drizzle(sqlite, { schema });
})().catch((e) => {
  console.error('[client.web] initDb failed:', e);
  throw e;
});

export async function initDb(): Promise<void> {
  return _initPromise;
}

export function getDb(): WebDb {
  if (!_db) throw new Error('DB not ready — await initDb() first');
  return _db;
}
