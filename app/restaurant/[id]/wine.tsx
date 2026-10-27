import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useWines } from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { addWine, deleteWine, groupWinesByType } from '@/db/repo';
import { queryClient } from '@/query/client';
import { Button, Chip, EmptyState } from '@/components/ui';
import { tokens } from '@/theme/tokens';
import type { WineType } from '@/domain';

const TYPES: WineType[] = ['red', 'white', 'green', 'rosé', 'sparkling', 'natural', 'fortified'];

export default function WineTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: wines = [] } = useWines(id);
  const [name, setName] = useState('');
  const [type, setType] = useState<WineType>('red');
  const [region, setRegion] = useState('');

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['wines', id] });
  const grouped = groupWinesByType(wines);

  const add = () => {
    if (!name.trim()) return;
    addWine(getDb(), id, {
      name: name.trim(),
      wine_type: type,
      region: region.trim() || undefined,
    });
    setName('');
    setRegion('');
    refresh();
  };

  return (
    <ScrollView className="flex-1 bg-base px-4 py-3 dark:bg-base-dark">
      {Object.keys(grouped).length === 0 ? (
        <EmptyState icon="wine-outline" title="No wines yet" body="Log bottles you had below." />
      ) : (
        Object.entries(grouped).map(([groupType, list]) => (
          <View key={groupType} className="mb-4">
            <Text className="mb-1 font-sans-semibold text-xs uppercase tracking-wide text-muted dark:text-muted-dark">
              {groupType}
            </Text>
            {list.map((w) => (
              <View
                key={w.id}
                className="mb-2 flex-row items-center justify-between rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark"
              >
                <View className="flex-1">
                  <Text className="font-serif-semibold text-ink dark:text-ink-dark">{w.name}</Text>
                  {w.region || w.producer ? (
                    <Text className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark">
                      {[w.producer, w.region].filter(Boolean).join(' · ')}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => {
                    deleteWine(getDb(), w.id);
                    refresh();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${w.name}`}
                  hitSlop={8}
                >
                  <Text className="font-sans-semibold text-sm text-danger dark:text-danger-dark">
                    Delete
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))
      )}

      <View className="mt-2 rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark">
        <Text className="mb-2 font-sans-semibold text-xs text-muted dark:text-muted-dark">
          Add a wine
        </Text>
        <TextInput
          placeholder="Wine name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={tokens.color.textSecondary.light}
          className="rounded-button bg-black/5 px-3 py-2 font-sans text-ink dark:bg-white/10 dark:text-ink-dark"
        />
        <View className="mt-2 flex-row flex-wrap gap-2">
          {TYPES.map((t) => (
            <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
          ))}
        </View>
        <TextInput
          placeholder="Region (optional)"
          value={region}
          onChangeText={setRegion}
          placeholderTextColor={tokens.color.textSecondary.light}
          className="mt-2 rounded-button bg-black/5 px-3 py-2 font-sans text-ink dark:bg-white/10 dark:text-ink-dark"
        />
        <View className="mt-2">
          <Button label="Add wine" onPress={add} />
        </View>
      </View>
    </ScrollView>
  );
}
