import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '@/theme/tokens';

// Five-star picker with 0.5 increments (spec §7.4). Each star has two tap
// zones: the left half sets x.5, the right half sets x.0.
export function StarPicker({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  return (
    <View className="flex-row" accessibilityLabel="Star rating">
      {[1, 2, 3, 4, 5].map((i) => {
        const name = value >= i ? 'star' : value >= i - 0.5 ? 'star-half' : 'star-outline';
        return (
          <View key={i} style={{ width: size, height: size }}>
            <Ionicons name={name} size={size} color={tokens.color.accent} />
            <Pressable
              testID={`star-${i}-half`}
              onPress={() => onChange(i - 0.5)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${i - 0.5} stars`}
              hitSlop={{ top: 10, bottom: 10, left: i === 1 ? 10 : 2, right: 2 }}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: size / 2 }}
            />
            <Pressable
              testID={`star-${i}-full`}
              onPress={() => onChange(i)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${i} stars`}
              hitSlop={{ top: 10, bottom: 10, left: 2, right: i === 5 ? 10 : 2 }}
              style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: size / 2 }}
            />
          </View>
        );
      })}
    </View>
  );
}
