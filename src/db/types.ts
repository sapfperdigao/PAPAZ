import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

// A drizzle SQLite database usable by repository/seed code regardless of
// driver — expo-sqlite (app) or better-sqlite3 (tests). Both expose the same
// synchronous query builder (.run()/.all()/.get()). Schema/run-result generics
// are left open so either driver's concrete instance is assignable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MesaDb = BaseSQLiteDatabase<'sync', any, any>;
