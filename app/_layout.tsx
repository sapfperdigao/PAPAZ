import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/client';
import { getDb } from '@/db/client';
import { seedIfEmpty } from '@/db/seed';

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
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
