// Minimal versioned-migration runner keyed on SQLite's PRAGMA user_version.
// The DDL-on-open approach (CREATE TABLE IF NOT EXISTS) can't evolve a schema
// that already exists on an installed device, so schema changes after the
// first release go here as new entries: append an ALTER/CREATE script to the
// MIGRATIONS array in client.ts; its index + 1 is its version. Each pending
// migration runs in order and bumps user_version.

export interface MigrationDriver {
  getVersion(): number;
  setVersion(version: number): void;
  exec(sql: string): void;
}

// Applies migrations whose version is greater than the db's current
// user_version. Returns the count applied.
export function runMigrations(driver: MigrationDriver, migrations: string[]): number {
  const from = driver.getVersion();
  let applied = 0;
  for (let v = from; v < migrations.length; v++) {
    driver.exec(migrations[v]);
    driver.setVersion(v + 1);
    applied++;
  }
  return applied;
}
