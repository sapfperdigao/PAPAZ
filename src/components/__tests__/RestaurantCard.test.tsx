import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from '../RestaurantCard';
import type { RestaurantListItem } from '@/db/repo';

function makeItem(over: Partial<RestaurantListItem> = {}): RestaurantListItem {
  return {
    id: 'r1',
    name: 'Tasca Test',
    address: null,
    zone: 'Campo de Ourique',
    category: 'tasca',
    price_range: '€€',
    latitude: null,
    longitude: null,
    website: null,
    phone: null,
    google_place_id: null,
    thefork_url: null,
    tripadvisor_url: null,
    bookmarked: 0,
    visited: 0,
    created_at: '2026-01-01T00:00:00.000Z',
    editorial_json: null,
    personalRating: null,
    consensus: null,
    consensusBand: null,
    distanceKm: null,
    ...over,
  };
}

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  return Array.isArray(s) ? Object.assign({}, ...s) : (s as Record<string, unknown>);
}

describe('RestaurantCard', () => {
  it('shows name, zone, and category + price badges', () => {
    const { getByText } = render(<RestaurantCard item={makeItem()} />);
    expect(getByText('Tasca Test')).toBeTruthy();
    expect(getByText('Campo de Ourique')).toBeTruthy();
    expect(getByText('Tasca')).toBeTruthy();
    expect(getByText('€€')).toBeTruthy();
  });

  it('greys the stars when the restaurant is unvisited', () => {
    const { getByTestId } = render(
      <RestaurantCard item={makeItem({ visited: 0, personalRating: 4 })} />,
    );
    expect(flatStyle(getByTestId('card-stars')).opacity).toBe(0.4);
  });

  it('shows full-opacity stars when visited', () => {
    const { getByTestId } = render(
      <RestaurantCard item={makeItem({ visited: 1, personalRating: 4 })} />,
    );
    expect(flatStyle(getByTestId('card-stars')).opacity).toBe(1);
  });

  it('keeps the score visible and truncates a very long name', () => {
    const longName = 'A'.repeat(80);
    const { getByText, getByTestId } = render(
      <RestaurantCard item={makeItem({ name: longName, consensus: 8.6 })} />,
    );
    expect(getByTestId('consensus-badge')).toBeTruthy();
    expect(getByText(longName).props.numberOfLines).toBeGreaterThanOrEqual(1);
  });

  it('fires onToggleBookmark when the bookmark control is pressed', () => {
    const onToggleBookmark = jest.fn();
    const { getByTestId } = render(
      <RestaurantCard item={makeItem({ bookmarked: 0 })} onToggleBookmark={onToggleBookmark} />,
    );
    fireEvent.press(getByTestId('bookmark-toggle'));
    expect(onToggleBookmark).toHaveBeenCalledTimes(1);
  });
});
