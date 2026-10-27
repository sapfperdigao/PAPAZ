import '../global.css';
import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/client';
import { getDb } from '@/db/client';
import { seedIfEmpty } from '@/db/seed';
import { FONT_MAP } from '@/theme/fonts';

function EditButton({ id }: { id?: string }) {
  const router = useRouter();
  if (!id) return null;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/restaurant/edit/[id]', params: { id } })}
      className="px-2"
      accessibilityRole="button"
      accessibilityLabel="Edit restaurant"
    >
      <Text className="text-2xl text-accent dark:text-accent-dark">⋯</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  // Editorial type pairing — preload before first render so there is no flash of
  // unstyled text (DESIGN_PLAN §2.2). getDb() is synchronous, so the DB needs no
  // separate ready-gate; seeding runs in the background and invalidates queries.
  const [fontsLoaded] = useFonts(FONT_MAP);
  const { setColorScheme } = useColorScheme();

  // darkMode:'class' renders light until setColorScheme runs (DESIGN_PLAN §3.2).
  // Default to 'system' (follow the OS); light is the authored hero theme.
  useEffect(() => {
    setColorScheme('system');
  }, [setColorScheme]);

  useEffect(() => {
    seedIfEmpty(getDb())
      .then((n) => {
        if (n > 0) queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      })
      .catch(() => {});
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView className="flex-1 bg-base dark:bg-base-dark">
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="restaurant/[id]"
            options={({ route }) => ({
              headerShown: true,
              title: 'Restaurant',
              headerBackTitle: 'Back',
              headerRight: () => (
                <EditButton id={(route.params as { id?: string } | undefined)?.id} />
              ),
            })}
          />
          <Stack.Screen
            name="restaurant/edit/[id]"
            options={{ headerShown: true, title: 'Edit', presentation: 'modal' }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
