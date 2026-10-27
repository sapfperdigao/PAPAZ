import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { ScreenContainer, Button } from '@/components/ui';

// Filter sheet (DESIGN_PLAN §6.2) — presented as a formSheet modal from My List.
// Shell in Phase 3; the category/price/visited/bookmarked filter controls move
// here from list.tsx in Phase 5.
export default function FiltersScreen() {
  const router = useRouter();
  return (
    <ScreenContainer edges={['top']}>
      <View className="flex-row items-center justify-between py-3">
        <Text className="font-serif-semibold text-xl text-ink dark:text-ink-dark">Filters</Text>
        <Button label="Done" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}
