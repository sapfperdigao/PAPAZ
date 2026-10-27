import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConsensusBadge } from '../ui/ConsensusBadge';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { SkeletonList } from '../ui/Skeleton';
import { Stat } from '../ui/Stat';
import { SectionHeader } from '../ui/SectionHeader';
import { tokens } from '@/theme/tokens';

// Structural snapshots guard markup/style drift across the shared kit
// (DESIGN_PLAN §8.3), and the behavioral assertions cover a11y + interaction.
describe('ui primitive kit', () => {
  it('Chip reflects active state for a11y and fires onPress', () => {
    const onPress = jest.fn();
    const { getByText, getByRole, rerender, toJSON } = render(
      <Chip label="Consensus" active onPress={onPress} />,
    );
    expect(getByText('Consensus')).toBeTruthy();
    const pressable = getByRole('button');
    expect(pressable.props.accessibilityState).toEqual({ selected: true });
    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(toJSON()).toMatchSnapshot('chip-active');

    rerender(<Chip label="Consensus" active={false} onPress={onPress} />);
    expect(getByRole('button').props.accessibilityState).toEqual({ selected: false });
    expect(render(<Chip label="Name" active={false} onPress={onPress} />).toJSON()).toMatchSnapshot(
      'chip-inactive',
    );
  });

  it('Button exposes role/label and fires onPress across variants', () => {
    for (const variant of ['primary', 'secondary', 'ghost'] as const) {
      const onPress = jest.fn();
      const { getByRole, toJSON } = render(
        <Button label={`Save ${variant}`} variant={variant} onPress={onPress} />,
      );
      const btn = getByRole('button');
      expect(btn.props.accessibilityLabel).toBe(`Save ${variant}`);
      fireEvent.press(btn);
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(toJSON()).toMatchSnapshot(`button-${variant}`);
    }
  });

  it('Button does not fire when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Save" onPress={onPress} disabled />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('Badge renders a filled category color and an outline variant', () => {
    const { getByTestId, toJSON } = render(
      <Badge label="Tasca" color={tokens.category.tasca} testID="b" />,
    );
    const node = getByTestId('b');
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;
    expect(style.backgroundColor).toBe(tokens.category.tasca);
    expect(toJSON()).toMatchSnapshot('badge-filled');
    expect(render(<Badge label="New" />).toJSON()).toMatchSnapshot('badge-outline');
  });

  it('ConsensusBadge formats the score and labels itself', () => {
    const { getByTestId, getByText, toJSON } = render(<ConsensusBadge score={8.46} />);
    expect(getByText('8.5')).toBeTruthy();
    expect(getByTestId('consensus-badge').props.accessibilityLabel).toBe(
      'Consensus score 8.5 out of 10',
    );
    expect(toJSON()).toMatchSnapshot('consensus-badge');
  });

  it('EmptyState renders CTA and fires onAction', () => {
    const onAction = jest.fn();
    const { getByText, toJSON } = render(
      <EmptyState title="No bookmarks" body="Save places" actionLabel="Browse" onAction={onAction} />,
    );
    expect(getByText('No bookmarks')).toBeTruthy();
    fireEvent.press(getByText('Browse'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(toJSON()).toMatchSnapshot('empty-state');
  });

  it('ErrorState fires retry', () => {
    const onRetry = jest.fn();
    const { getByText, toJSON } = render(<ErrorState onRetry={onRetry} />);
    fireEvent.press(getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(toJSON()).toMatchSnapshot('error-state');
  });

  it('SkeletonList renders the requested number of rows', () => {
    const { getByTestId, toJSON } = render(<SkeletonList count={3} />);
    expect(getByTestId('skeleton-list')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot('skeleton-list');
  });

  it('Stat and SectionHeader render', () => {
    expect(render(<Stat value={12} label="Visited" />).toJSON()).toMatchSnapshot('stat');
    const onAction = jest.fn();
    const { getByText } = render(
      <SectionHeader title="Want to try" actionLabel="See all" onAction={onAction} />,
    );
    fireEvent.press(getByText('See all'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
