import '../global.css';
import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/client';
import { getDb } from '@/db/client';
import { seedIfEmpty } from '@/db/seed';

function EditButton({ id }: { id?: string }) {
  const router = useRouter();
  if (!id) return null;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/restaurant/edit/[id]', params: { id } })}
      className="px-2"
    >
      <Text className="text-2xl text-amber-600">⋯</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  // Seed the built-in sample on first launch, then refresh any list queries.
  useEffect(() => {
    seedIfEmpty(getDb())
      .then((n) => {
        if (n > 0) queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      })
      .catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
