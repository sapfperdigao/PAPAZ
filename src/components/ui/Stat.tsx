import { View, Text } from 'react-native';

// Big number + label for the Home stat strip (DESIGN_PLAN §4, §6.1).
export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <View className="items-center">
      <Text className="font-serif-semibold text-2xl text-ink dark:text-ink-dark">{value}</Text>
      <Text className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark">{label}</Text>
    </View>
  );
}
