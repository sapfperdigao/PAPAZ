import { newId } from '../id';

describe('newId', () => {
  it('returns a v4-shaped UUID', () => {
    expect(newId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('returns a different id each call', () => {
    expect(newId()).not.toBe(newId());
  });
});
