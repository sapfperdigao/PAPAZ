import { ScreenContainer } from '@/components/ui';
import { View, Text } from 'react-native';

// Home / Discover — landing tab (DESIGN_PLAN §6.1). Placeholder in Phase 3;
// the two-band Discover surface (hero, featured carousel, quick filters, stat
// strip, want-to-try, recent visits, map entry) is built in Phase 4.
export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 justify-center">
        <Text className="font-serif-bold text-4xl text-ink dark:text-ink-dark">Mesa</Text>
        <Text className="mt-1 font-sans text-base text-muted dark:text-muted-dark">
          Your Lisbon dining guide
        </Text>
      </View>
    </ScreenContainer>
  );
}
