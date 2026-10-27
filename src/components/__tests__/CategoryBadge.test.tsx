import { render } from '@testing-library/react-native';
import { CategoryBadge } from '../CategoryBadge';
import { tokens } from '@/theme/tokens';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  return Array.isArray(s) ? Object.assign({}, ...s) : (s as Record<string, unknown>);
}

describe('CategoryBadge', () => {
  it('renders the tasca label with its category background token', () => {
    const { getByText, getByTestId } = render(<CategoryBadge category="tasca" />);
    expect(getByText('Tasca')).toBeTruthy();
    // Assert against the token, not a literal hex, so palette retunes don't
    // cascade into test edits (DESIGN_PLAN §8.3).
    expect(flatStyle(getByTestId('category-badge')).backgroundColor).toBe(
      tokens.category.tasca,
    );
  });

  it('renders the cervejaria label', () => {
    const { getByText } = render(<CategoryBadge category="cervejaria" />);
    expect(getByText('Cervejaria')).toBeTruthy();
  });
});
