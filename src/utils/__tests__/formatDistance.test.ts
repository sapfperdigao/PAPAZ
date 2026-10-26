import { formatDistance } from '../formatDistance';

describe('formatDistance', () => {
  it('shows metres under 1 km (0.65 -> "650 m")', () => {
    expect(formatDistance(0.65)).toBe('650 m');
  });

  it('shows one decimal km at or above 1 km (1.2 -> "1.2 km")', () => {
    expect(formatDistance(1.2)).toBe('1.2 km');
  });

  it('rounds metres (0.3 -> "300 m")', () => {
    expect(formatDistance(0.3)).toBe('300 m');
  });
});
