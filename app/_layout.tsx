import '../global.css';
import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/client';
import { getDb, initDb } from '@/db/client';
import { syncSeedData } from '@/db/seed';
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
  // unstyled text (DESIGN_PLAN §2.2). If a font file fails to load, render anyway
  // on the error rather than hang forever on a blank gate.
  const [fontsLoaded, fontError] = useFonts(FONT_MAP);
  const { setColorScheme } = useColorScheme();

  // DB-ready gate (DESIGN_PLAN §2.2/§3.2): web's sql.js client opens
  // asynchronously (getDb throws before initDb resolves), so await initDb()
  // before any query and gate the first render on it. Native initDb is instant.
  const [dbReady, setDbReady] = useState(false);

  // darkMode:'class' renders light until setColorScheme runs (DESIGN_PLAN §3.2).
  // Default to 'system' (follow the OS); light is the authored hero theme.
  useEffect(() => {
    setColorScheme('system');
  }, [setColorScheme]);

  useEffect(() => {
    let active = true;
    initDb()
      .then(() => {
        if (!active) return;
        setDbReady(true);
        syncSeedData(getDb())
          .then((res) => {
            if (res.seeded + res.inserted + res.refreshed > 0)
              // Invalidate all read queries (restaurants + Home's catalog /
              // recent-visits) so every surface reflects the fresh seed data.
              queryClient.invalidateQueries();
          })
          .catch(() => {});
      })
      .catch(() => {
        // DB failed to open (e.g. web WASM load error) — still render so the UI
        // can show its error states rather than hanging on a blank gate.
        if (active) setDbReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if ((!fontsLoaded && !fontError) || !dbReady) return null;

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
          <Stack.Screen
            name="filters"
            options={{ headerShown: false, presentation: 'formSheet' }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
