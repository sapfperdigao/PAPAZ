import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

// Failed-read state: icon + message + retry (DESIGN_PLAN §4). `onRetry` wires to
// React Query's refetch.
export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  testID = 'error-state',
}: {
  message?: string;
  onRetry?: () => void;
  testID?: string;
}) {
  return (
    <View testID={testID} className="items-center px-6 py-10">
      <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
      <Text className="mt-3 text-center font-sans text-sm text-muted dark:text-muted-dark">
        {message}
      </Text>
      {onRetry ? (
        <View className="mt-4">
          <Button label="Retry" onPress={onRetry} variant="ghost" size="sm" />
        </View>
      ) : null}
    </View>
  );
}
