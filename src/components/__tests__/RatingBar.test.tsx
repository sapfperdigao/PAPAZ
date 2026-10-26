import { render } from '@testing-library/react-native';
import { RatingBar } from '../RatingBar';

describe('RatingBar', () => {
  it('renders only the personal segment when it is the only score', () => {
    const { getByText, queryByText } = render(<RatingBar scores={{ personal: 8 }} />);
    expect(getByText('Personal')).toBeTruthy();
    expect(queryByText('Google')).toBeNull();
  });

  it('renders an empty state when there are no scores (no NaN, no crash)', () => {
    const { getByTestId } = render(<RatingBar scores={{}} />);
    expect(getByTestId('rating-empty')).toBeTruthy();
  });

  it('renders every provided source', () => {
    const { getByText } = render(
      <RatingBar scores={{ google: 9.4, thefork: 8, personal: 7 }} />,
    );
    expect(getByText('Google')).toBeTruthy();
    expect(getByText('TheFork')).toBeTruthy();
    expect(getByText('Personal')).toBeTruthy();
  });
});
