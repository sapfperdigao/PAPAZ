import { makeTestDb } from '../testDb';
import * as repo from '../repo';
import { groupWinesByType } from '../repo';

describe('wines', () => {
  it('adds a wine with its type and lists it', () => {
    const { db } = makeTestDb();
    const rid = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    repo.addWine(db, rid, { name: 'Quinta Red', wine_type: 'red', region: 'Douro' });

    const list = repo.getWines(db, rid);
    expect(list).toHaveLength(1);
    expect(list[0].wine_type).toBe('red');
    expect(list[0].region).toBe('Douro');
  });

  it('groups wines by type', () => {
    const { db } = makeTestDb();
    const rid = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    repo.addWine(db, rid, { name: 'A', wine_type: 'red' });
    repo.addWine(db, rid, { name: 'B', wine_type: 'white' });
    repo.addWine(db, rid, { name: 'C', wine_type: 'red' });

    const grouped = groupWinesByType(repo.getWines(db, rid));
    expect(grouped.red).toHaveLength(2);
    expect(grouped.white).toHaveLength(1);
  });
});
