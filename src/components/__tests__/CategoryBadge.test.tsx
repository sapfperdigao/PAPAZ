import { render } from '@testing-library/react-native';
import { CategoryBadge } from '../CategoryBadge';
import { tokens } from '@/theme/tokens';

function flatStyle(node: { props: { style?: unknown } }) {
  const s = node.props.style;
  return Array.isArray(s) ? Object.assign({}, ...s) : (s as Record<string, unknown>);
}

describe('CategoryBadge', () => {
  it('renders the tasca label with the amber background token', () => {
    const { getByText, getByTestId } = render(<CategoryBadge category="tasca" />);
    expect(getByText('Tasca')).toBeTruthy();
    expect(tokens.category.tasca).toBe('#E8A838');
    expect(flatStyle(getByTestId('category-badge')).backgroundColor).toBe(
      tokens.category.tasca,
    );
  });

  it('renders the cervejaria label', () => {
    const { getByText } = render(<CategoryBadge category="cervejaria" />);
    expect(getByText('Cervejaria')).toBeTruthy();
  });
});
