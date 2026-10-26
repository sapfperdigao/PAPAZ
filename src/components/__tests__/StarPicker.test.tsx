import { render, fireEvent } from '@testing-library/react-native';
import { StarPicker } from '../StarPicker';

describe('StarPicker', () => {
  it('sets a whole rating when the right half of a star is tapped', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<StarPicker value={0} onChange={onChange} />);
    fireEvent.press(getByTestId('star-4-full'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('sets a half rating when the left half of a star is tapped', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<StarPicker value={0} onChange={onChange} />);
    fireEvent.press(getByTestId('star-4-half'));
    expect(onChange).toHaveBeenCalledWith(3.5);
  });

  it('supports rating the first star as 0.5', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<StarPicker value={0} onChange={onChange} />);
    fireEvent.press(getByTestId('star-1-half'));
    expect(onChange).toHaveBeenCalledWith(0.5);
  });
});
