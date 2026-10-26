import { makeTestDb } from '../testDb';
import * as repo from '../repo';

describe('dishes', () => {
  it('adds a dish with its source and must-try flag, and lists it', () => {
    const { db } = makeTestDb();
    const rid = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    repo.addDish(db, rid, { name: 'Gambas', source: 'personal', must_try: true });

    const list = repo.getDishes(db, rid);
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Gambas');
    expect(list[0].source).toBe('personal');
    expect(list[0].must_try).toBe(1);
  });

  it('deletes a dish', () => {
    const { db } = makeTestDb();
    const rid = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    const did = repo.addDish(db, rid, { name: 'Prego' });
    repo.deleteDish(db, did);
    expect(repo.getDishes(db, rid)).toHaveLength(0);
  });
});
