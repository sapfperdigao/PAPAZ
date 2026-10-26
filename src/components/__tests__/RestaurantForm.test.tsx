import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantForm } from '../RestaurantForm';

describe('RestaurantForm', () => {
  it('does not submit until name, category and price are all set', () => {
    const onSubmit = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <RestaurantForm mode="add" onSubmit={onSubmit} />,
    );

    fireEvent.press(getByText('Save'));
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.changeText(getByPlaceholderText('Name'), 'Nova Tasca');
    fireEvent.press(getByText('Save'));
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.press(getByText('Tasca'));
    fireEvent.press(getByText('€€'));
    fireEvent.press(getByText('Save'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Nova Tasca', category: 'tasca', price_range: '€€' }),
    );
  });

  it('includes optional TheFork/TripAdvisor URLs when filled', () => {
    const onSubmit = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <RestaurantForm mode="add" onSubmit={onSubmit} />,
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'X');
    fireEvent.press(getByText('Tasca'));
    fireEvent.press(getByText('€'));
    fireEvent.changeText(getByPlaceholderText('TheFork URL'), 'https://thefork/x');
    fireEvent.press(getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ thefork_url: 'https://thefork/x' }),
    );
  });

  it('prefills from initial values in edit mode', () => {
    const onSubmit = jest.fn();
    const { getByDisplayValue } = render(
      <RestaurantForm
        mode="edit"
        initial={{ name: 'Existing', category: 'tasca', price_range: '€€€' }}
        onSubmit={onSubmit}
      />,
    );
    expect(getByDisplayValue('Existing')).toBeTruthy();
  });
});
