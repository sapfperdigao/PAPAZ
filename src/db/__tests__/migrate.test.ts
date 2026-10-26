import { runMigrations, type MigrationDriver } from '../migrate';

function fakeDriver(initial = 0) {
  let version = initial;
  const execed: string[] = [];
  const driver: MigrationDriver = {
    getVersion: () => version,
    setVersion: (v) => {
      version = v;
    },
    exec: (sql) => execed.push(sql),
  };
  return { driver, execed, version: () => version };
}

describe('runMigrations', () => {
  it('applies every migration on a fresh db and sets the version', () => {
    const { driver, execed, version } = fakeDriver(0);
    const applied = runMigrations(driver, ['A', 'B', 'C']);
    expect(applied).toBe(3);
    expect(execed).toEqual(['A', 'B', 'C']);
    expect(version()).toBe(3);
  });

  it('is a no-op when the db is already at the latest version', () => {
    const { driver, execed, version } = fakeDriver(3);
    const applied = runMigrations(driver, ['A', 'B', 'C']);
    expect(applied).toBe(0);
    expect(execed).toEqual([]);
    expect(version()).toBe(3);
  });

  it('applies only the pending migrations from a partial version', () => {
    const { driver, execed, version } = fakeDriver(1);
    const applied = runMigrations(driver, ['A', 'B', 'C']);
    expect(applied).toBe(2);
    expect(execed).toEqual(['B', 'C']);
    expect(version()).toBe(3);
  });
});
