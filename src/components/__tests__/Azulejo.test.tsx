import { render } from '@testing-library/react-native';
import { TileThumb, TileHero } from '../Azulejo';

describe('Azulejo tile components', () => {
  it('TileThumb renders for a restaurant', () => {
    const { toJSON } = render(<TileThumb id="abc" category="tasca" size={48} />);
    expect(toJSON()).toBeTruthy();
  });

  it('TileHero renders for a restaurant', () => {
    const { toJSON } = render(<TileHero id="abc" category="cervejaria" />);
    expect(toJSON()).toBeTruthy();
  });
});
